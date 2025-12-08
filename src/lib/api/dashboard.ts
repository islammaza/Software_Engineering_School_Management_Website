import { supabase } from "../supabaseClient";

// Types for returned shapes
export type DashboardStats = {
  totalStudents: number;
  activeGroups: number;
  averageNote: number | null;
  distinguishedCount: number; // final_note >= 80
};

export type TopMemorizer = {
  student_id: string;
  full_name: string;
  group_id: string;
  group_name?: string | null;
  final_note: number;
};

export type GroupAverage = {
  group_id: string;
  group_name: string;
  average: number;
};

export type ModuleAverage = {
  module_id: string;
  module_name: string;
  group_id: string;
  average: number;
};

export type GradeBin = {
  label: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
};

/**
 * Utility to get groups IDs for a specific school (or all schools when schoolId undefined)
 */
async function getGroupIdsForSchool(schoolId?: string) {
  if (!schoolId) {
    const { data, error } = await supabase.from("groups").select("id");
    if (error) throw error;
    return data?.map((g: { id: string }) => g.id) ?? [];
  }

  const { data, error } = await supabase
    .from("groups")
    .select("id")
    .eq("school_id", schoolId);
  if (error) throw error;
  return data?.map((g: { id: string }) => g.id) ?? [];
}

/**
 * Fetch aggregated dashboard stats for the given school (or across all schools if schoolId is omitted)
 */
export async function getDashboardStats(schoolId?: string) {
  try {
    const groupIds = await getGroupIdsForSchool(schoolId);
    if (groupIds.length === 0) {
      return { data: { totalStudents: 0, activeGroups: 0, averageNote: null, distinguishedCount: 0 }, error: null };
    }

    // Count active groups
    const activeGroups = groupIds.length;

    // Get students in those groups
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, full_name, group_id")
      .in("group_id", groupIds);
    if (studentsError) throw studentsError;

    const totalStudents = students?.length ?? 0;

    // Get student reports for students in this school
    const studentIds = students?.map((s: { id: string }) => s.id) ?? [];
    const { data: reports, error: reportsError } = await supabase
      .from("student_reports")
      .select("id, student_id, final_note")
      .in("student_id", studentIds);
    if (reportsError) throw reportsError;

    // Compute average, distinguished count
    const validNotes = (reports ?? [])
      .map((r: { final_note: number | null }) => (r.final_note !== null ? Number(r.final_note) : null))
      .filter((n: number | null) => n !== null) as number[];

    const averageNote = validNotes.length > 0 ? validNotes.reduce((a, b) => a + b, 0) / validNotes.length : null;
    const distinguishedCount = validNotes.filter((n) => n >= 80).length;

    return {
      data: {
        totalStudents,
        activeGroups,
        averageNote: averageNote !== null ? Number(Number(averageNote).toFixed(2)) : null,
        distinguishedCount,
      },
      error: null,
    } as { data: DashboardStats | null; error: Error | null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Returns top memorizers (final_note >= 90) with optional limit
 */
export async function getTopMemorizers(schoolId?: string, limit = 4) {
  try {
    const groupIds = await getGroupIdsForSchool(schoolId);
    if (groupIds.length === 0) return { data: [], error: null };

    // get students in the groups
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, full_name, group_id")
      .in("group_id", groupIds);
    if (studentsError) throw studentsError;

    const studentMap = new Map((students ?? []).map((s: any) => [s.id, s]));
    const studentIds = Array.from(studentMap.keys());

    const { data: reports, error: reportsError } = await supabase
      .from("student_reports")
      .select("student_id, final_note")
      .in("student_id", studentIds)
      .gte("final_note", 90)
      .order("final_note", { ascending: false });
    if (reportsError) throw reportsError;

    // Attach student names and group ids
    const result: TopMemorizer[] = (reports ?? [])
      .map((r: { student_id: string; final_note: number }) => ({
        student_id: r.student_id,
        final_note: Number(r.final_note),
        full_name: studentMap.get(r.student_id)?.full_name ?? "",
        group_id: studentMap.get(r.student_id)?.group_id,
      }))
      .slice(0, limit);

    // Fetch group names for those group ids
    const groupIdsNeeded = Array.from(new Set(result.map((r) => r.group_id))).filter(Boolean);
    if (groupIdsNeeded.length > 0) {
      const { data: groups } = await supabase.from("groups").select("id, name").in("id", groupIdsNeeded);
      const groupMap = new Map((groups ?? []).map((g: { id: string; name: string }) => [g.id, g]));
      result.forEach((r) => (r.group_name = groupMap.get(r.group_id)?.name ?? ""));
    }

    return { data: result as TopMemorizer[], error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Returns students needing attention (final_note < 50)
 */
export async function getNeedsAttention(schoolId?: string, limit = 10) {
  try {
    const groupIds = await getGroupIdsForSchool(schoolId);
    if (groupIds.length === 0) return { data: [], error: null };

    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, full_name, group_id")
      .in("group_id", groupIds);
    if (studentsError) throw studentsError;

    const studentMap = new Map((students ?? []).map((s: { id: string; full_name: string; group_id: string }) => [s.id, s]));
    const studentIds = Array.from(studentMap.keys());

    const { data: reports, error: reportsError } = await supabase
      .from("student_reports")
      .select("student_id, final_note")
      .in("student_id", studentIds)
      .lt("final_note", 50)
      .order("final_note", { ascending: true });
    if (reportsError) throw reportsError;

    const result: TopMemorizer[] = (reports ?? [])
      .map((r: { student_id: string; final_note: number }) => ({
        student_id: r.student_id,
        final_note: Number(r.final_note),
        full_name: studentMap.get(r.student_id)?.full_name ?? "",
        group_id: studentMap.get(r.student_id)?.group_id,
      }))
      .slice(0, limit);

    const groupIdsNeeded = Array.from(new Set(result.map((r) => r.group_id))).filter(Boolean);
    if (groupIdsNeeded.length > 0) {
      const { data: groups } = await supabase.from("groups").select("id, name").in("id", groupIdsNeeded);
      const groupMap = new Map((groups ?? []).map((g: { id: string; name: string }) => [g.id, g]));
      result.forEach((r) => (r.group_name = groupMap.get(r.group_id)?.name ?? ""));
    }

    return { data: result as TopMemorizer[], error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Returns list of distinguished students (final_note >= 80)
 */
export async function getDistinguishedStudents(schoolId?: string, limit = 50) {
  try {
    const groupIds = await getGroupIdsForSchool(schoolId);
    if (groupIds.length === 0) return { data: [], error: null };

    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, full_name, group_id")
      .in("group_id", groupIds);
    if (studentsError) throw studentsError;

    const studentMap = new Map((students ?? []).map((s: any) => [s.id, s]));
    const studentIds = Array.from(studentMap.keys());

    const { data: reports, error: reportsError } = await supabase
      .from("student_reports")
      .select("student_id, final_note")
      .in("student_id", studentIds)
      .gte("final_note", 80)
      .order("final_note", { ascending: false });
    if (reportsError) throw reportsError;

    const result: TopMemorizer[] = (reports ?? [])
      .map((r: any) => ({
        student_id: r.student_id,
        final_note: Number(r.final_note),
        full_name: studentMap.get(r.student_id)?.full_name ?? "",
        group_id: studentMap.get(r.student_id)?.group_id,
      }))
      .slice(0, limit);

    const groupIdsNeeded = Array.from(new Set(result.map((r) => r.group_id))).filter(Boolean);
    if (groupIdsNeeded.length > 0) {
      const { data: groups } = await supabase.from("groups").select("id, name").in("id", groupIdsNeeded);
      const groupMap = new Map((groups ?? []).map((g: any) => [g.id, g]));
      result.forEach((r) => (r.group_name = groupMap.get(r.group_id)?.name ?? ""));
    }

    return { data: result as TopMemorizer[], error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Average final note per group using student_reports.final_note
 */
export async function getGroupAverages(schoolId?: string) {
  try {
    const groupIds = await getGroupIdsForSchool(schoolId);
    if (groupIds.length === 0) return { data: [] as GroupAverage[], error: null };

    const [{ data: groups, error: groupsError }, { data: students, error: studentsError }] = await Promise.all([
      supabase.from("groups").select("id, name").in("id", groupIds),
      supabase.from("students").select("id, group_id").in("group_id", groupIds),
    ]);
    if (groupsError) throw groupsError;
    if (studentsError) throw studentsError;

    const studentIds = (students ?? []).map((s: any) => s.id);
    if (studentIds.length === 0) return { data: [] as GroupAverage[], error: null };

    const { data: reports, error: reportsError } = await supabase
      .from("student_reports")
      .select("student_id, final_note")
      .in("student_id", studentIds);
    if (reportsError) throw reportsError;

    const groupMap = new Map((groups ?? []).map((g: any) => [g.id, g.name]));
    const studentToGroup = new Map((students ?? []).map((s: any) => [s.id, s.group_id]));

    const aggregates = new Map<string, { sum: number; count: number }>();
    (reports ?? []).forEach((r: any) => {
      if (r.final_note === null || r.final_note === undefined) return;
      const gid = studentToGroup.get(r.student_id);
      if (!gid) return;
      const entry = aggregates.get(gid) || { sum: 0, count: 0 };
      aggregates.set(gid, { sum: entry.sum + Number(r.final_note), count: entry.count + 1 });
    });

    const result: GroupAverage[] = Array.from(aggregates.entries())
      .map(([gid, { sum, count }]) => ({
        group_id: gid,
        group_name: groupMap.get(gid) || "مجموعة",
        average: Number((sum / count).toFixed(2)),
      }))
      .sort((a, b) => b.average - a.average);

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Average assessment score per module (using assessments.score)
 */
export async function getModuleAverages(schoolId?: string) {
  try {
    const groupIds = await getGroupIdsForSchool(schoolId);
    if (groupIds.length === 0) return { data: [] as ModuleAverage[], error: null };

    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .select("id, name, group_id")
      .in("group_id", groupIds);
    if (modulesError) throw modulesError;

    const moduleIds = (modules ?? []).map((m: any) => m.id);
    if (moduleIds.length === 0) return { data: [] as ModuleAverage[], error: null };

    const { data: assessments, error: assessmentsError } = await supabase
      .from("assessments")
      .select("module_id, score")
      .in("module_id", moduleIds);
    if (assessmentsError) throw assessmentsError;

    const aggregates = new Map<string, { sum: number; count: number }>();
    (assessments ?? []).forEach((a: any) => {
      if (a.score === null || a.score === undefined) return;
      const entry = aggregates.get(a.module_id) || { sum: 0, count: 0 };
      aggregates.set(a.module_id, { sum: entry.sum + Number(a.score), count: entry.count + 1 });
    });

    const result: ModuleAverage[] = (modules ?? [])
      .filter((m: any) => aggregates.has(m.id))
      .map((m: any) => {
        const agg = aggregates.get(m.id)!;
        return {
          module_id: m.id,
          module_name: m.name,
          group_id: m.group_id,
          average: Number((agg.sum / agg.count).toFixed(2)),
        };
      })
      .sort((a, b) => b.average - a.average);

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Distribution of final notes into bins for quick histogram
 */
export async function getGradeDistribution(schoolId?: string) {
  try {
    const groupIds = await getGroupIdsForSchool(schoolId);
    if (groupIds.length === 0) return { data: [] as GradeBin[], error: null };

    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, group_id")
      .in("group_id", groupIds);
    if (studentsError) throw studentsError;

    const studentIds = (students ?? []).map((s: any) => s.id);
    if (studentIds.length === 0) return { data: [] as GradeBin[], error: null };

    const { data: reports, error: reportsError } = await supabase
      .from("student_reports")
      .select("student_id, final_note")
      .in("student_id", studentIds);
    if (reportsError) throw reportsError;

    const bins: GradeBin[] = [
      { label: "90-100", min: 90, max: 100, count: 0, percentage: 0 },
      { label: "80-89", min: 80, max: 89.999, count: 0, percentage: 0 },
      { label: "70-79", min: 70, max: 79.999, count: 0, percentage: 0 },
      { label: "60-69", min: 60, max: 69.999, count: 0, percentage: 0 },
      { label: "50-59", min: 50, max: 59.999, count: 0, percentage: 0 },
      { label: "<50", min: 0, max: 49.999, count: 0, percentage: 0 },
    ];

    const notes = (reports ?? []).map((r: any) => (r.final_note !== null ? Number(r.final_note) : null)).filter((n) => n !== null) as number[];
    const total = notes.length || 1;

    notes.forEach((n) => {
      const bin = bins.find((b) => n >= b.min && n <= b.max);
      if (bin) bin.count += 1;
    });

    bins.forEach((b) => {
      b.percentage = Number(((b.count / total) * 100).toFixed(1));
    });

    return { data: bins, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Combined helper to fetch all dashboard data in one request
 */
export async function getFullDashboard(schoolId?: string) {
  try {
    const [statsRes, topRes, needsRes, groupsRes, modulesRes, distributionRes] = await Promise.all([
      getDashboardStats(schoolId),
      getTopMemorizers(schoolId, 4),
      getNeedsAttention(schoolId, 10),
      getGroupAverages(schoolId),
      getModuleAverages(schoolId),
      getGradeDistribution(schoolId),
    ]);

    if (statsRes.error) throw statsRes.error;
    if (topRes.error) throw topRes.error;
    if (needsRes.error) throw needsRes.error;
    if (groupsRes.error) throw groupsRes.error;
    if (modulesRes.error) throw modulesRes.error;
    if (distributionRes.error) throw distributionRes.error;

    const moduleData = modulesRes.data ?? [];
    const topModules = moduleData.slice(0, 3);
    const bottomModules = [...moduleData].reverse().slice(0, 3);

    return {
      data: {
        stats: statsRes.data,
        topMemorizers: topRes.data,
        needsAttention: needsRes.data,
        groupAverages: groupsRes.data,
        moduleAverages: moduleData,
        topModules,
        bottomModules,
        gradeDistribution: distributionRes.data,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export default {
  getDashboardStats,
  getTopMemorizers,
  getNeedsAttention,
  getGroupAverages,
  getModuleAverages,
  getGradeDistribution,
  getFullDashboard,
};
