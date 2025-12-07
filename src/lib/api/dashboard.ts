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

/**
 * Utility to get groups IDs for a specific school (or all schools when schoolId undefined)
 */
async function getGroupIdsForSchool(schoolId?: string) {
  if (!schoolId) {
    const { data, error } = await supabase.from("groups").select("id");
    if (error) throw error;
    return data?.map((g: any) => g.id) ?? [];
  }

  const { data, error } = await supabase
    .from("groups")
    .select("id")
    .eq("school_id", schoolId);
  if (error) throw error;
  return data?.map((g: any) => g.id) ?? [];
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
    const studentIds = students?.map((s: any) => s.id) ?? [];
    const { data: reports, error: reportsError } = await supabase
      .from("student_reports")
      .select("id, student_id, final_note")
      .in("student_id", studentIds);
    if (reportsError) throw reportsError;

    // Compute average, distinguished count
    const validNotes = (reports ?? [])
      .map((r: any) => (r.final_note !== null ? Number(r.final_note) : null))
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
    } as { data: DashboardStats | null; error: any };
  } catch (error) {
    return { data: null, error };
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
      .map((r: any) => ({
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
      const groupMap = new Map((groups ?? []).map((g: any) => [g.id, g]));
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

    const studentMap = new Map((students ?? []).map((s: any) => [s.id, s]));
    const studentIds = Array.from(studentMap.keys());

    const { data: reports, error: reportsError } = await supabase
      .from("student_reports")
      .select("student_id, final_note")
      .in("student_id", studentIds)
      .lt("final_note", 50)
      .order("final_note", { ascending: true });
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
 * Combined helper to fetch all dashboard data in one request
 */
export async function getFullDashboard(schoolId?: string) {
  try {
    const [statsRes, topRes, needsRes] = await Promise.all([
      getDashboardStats(schoolId),
      getTopMemorizers(schoolId, 4),
      getNeedsAttention(schoolId, 10),
    ]);

    if (statsRes.error) throw statsRes.error;
    if (topRes.error) throw topRes.error;
    if (needsRes.error) throw needsRes.error;

    return {
      data: {
        stats: statsRes.data,
        topMemorizers: topRes.data,
        needsAttention: needsRes.data,
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
  getFullDashboard,
};
