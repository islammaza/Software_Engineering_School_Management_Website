import { supabase } from "../supabaseClient";

// Types reflecting Supabase tables
export interface School {
	id: string;
	name: string;
	admin_user_id: string | null;
	admin_name: string | null;
	admin_email: string | null;
	phone: string | null;
	password_hashed?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface Group {
	id: string;
	school_id: string;
	name: string;
	teacher_name: string | null;
	timing: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface Module {
	id: string;
	group_id: string;
	name: string;
	description: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface Student {
	id: string;
	group_id: string;
	full_name: string;
	contact_info: string | null;
	date_of_birth: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface Assessment {
	id: string;
	student_id: string;
	module_id: string;
	score: number | null;
	remark: string | null;
	assessment_date: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface StudentReport {
	id: string;
	student_id: string;
	generated_at: string | null;
	final_note: number | null;
	final_observation: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export type StudentSummary = {
	student: Student;
	group: Group | null;
	modules: Module[];
	assessments: Assessment[];
	report: StudentReport;
};

// Utility: handle Supabase errors in a consistent way
function ensure<T>(data: T | null, error: any): T {
	if (error) throw error;
	if (!data) throw new Error("Not found");
	return data;
}

// CRUD: Student Report
export async function getStudentReportByStudentId(studentId: string): Promise<StudentReport | null> {
	const { data, error } = await supabase
		.from("student_reports")
		.select("*")
		.eq("student_id", studentId)
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data ?? null;
}

export async function getStudentReportById(reportId: string): Promise<StudentReport | null> {
	const { data, error } = await supabase
		.from("student_reports")
		.select("*")
		.eq("id", reportId)
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data ?? null;
}

export async function getOrCreateStudentReport(studentId: string): Promise<StudentReport> {
	const existing = await getStudentReportByStudentId(studentId);
	if (existing) return existing;

	const initial = {
		student_id: studentId,
		generated_at: new Date().toISOString(),
		final_note: null,
		final_observation: null,
	};

	const { data, error } = await supabase
		.from("student_reports")
		.insert(initial)
		.select("*")
		.single();
	return ensure(data, error);
}

export async function updateStudentReport(reportId: string, patch: Partial<Pick<StudentReport, "generated_at" | "final_note" | "final_observation">>): Promise<StudentReport> {
	const { data, error } = await supabase
		.from("student_reports")
		.update(patch)
		.eq("id", reportId)
		.select("*")
		.single();
	return ensure(data, error);
}

export async function deleteStudentReport(reportId: string): Promise<void> {
	const { error } = await supabase
		.from("student_reports")
		.delete()
		.eq("id", reportId);
	if (error) throw error;
}

// CRUD: Assessments (one per module per student)
export async function listAssessmentsByStudent(studentId: string): Promise<Assessment[]> {
	const { data, error } = await supabase
		.from("assessments")
		.select("*")
		.eq("student_id", studentId)
		.order("assessment_date", { ascending: false });
	return ensure(data, error);
}

export async function upsertAssessment(params: {
	student_id: string;
	module_id: string;
	score?: number | null;
	remark?: string | null;
	assessment_date?: string | null;
}): Promise<Assessment> {
	const payload = {
		student_id: params.student_id,
		module_id: params.module_id,
		score: params.score ?? null,
		remark: params.remark ?? null,
		assessment_date: params.assessment_date ?? new Date().toISOString(),
	};

	// Use upsert honoring unique (student_id, module_id)
	const { data, error } = await supabase
		.from("assessments")
		.upsert(payload, { onConflict: "student_id,module_id" })
		.select("*")
		.single();
	return ensure(data, error);
}

export async function deleteAssessmentById(assessmentId: string): Promise<void> {
	const { error } = await supabase
		.from("assessments")
		.delete()
		.eq("id", assessmentId);
	if (error) throw error;
}

// CRUD: Student basic info (edited from report page)
export async function getStudentById(studentId: string): Promise<Student | null> {
	const { data, error } = await supabase
		.from("students")
		.select("*")
		.eq("id", studentId)
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data ?? null;
}

export async function updateStudent(studentId: string, patch: Partial<Pick<Student, "full_name" | "contact_info" | "date_of_birth" | "group_id">>): Promise<Student> {
	const { data, error } = await supabase
		.from("students")
		.update(patch)
		.eq("id", studentId)
		.select("*")
		.single();
	return ensure(data, error);
}

// Read: Group + Modules for student
export async function getGroupById(groupId: string): Promise<Group | null> {
	const { data, error } = await supabase
		.from("groups")
		.select("*")
		.eq("id", groupId)
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data ?? null;
}

export async function listModulesByGroup(groupId: string): Promise<Module[]> {
	const { data, error } = await supabase
		.from("modules")
		.select("*")
		.eq("group_id", groupId)
		.order("name", { ascending: true });
	return ensure(data, error);
}

// Aggregated: All data needed for StudentDetails + PDF generation
export async function getStudentSummary(studentId: string): Promise<StudentSummary> {
	const student = ensure(await getStudentById(studentId), null);
	const group = student.group_id ? await getGroupById(student.group_id) : null;
	const modules = student.group_id ? await listModulesByGroup(student.group_id) : [];
	const assessments = await listAssessmentsByStudent(studentId);
	const report = await getOrCreateStudentReport(studentId);
	return { student, group, modules, assessments, report };
}

// Helper: compute a simple final note based on assessments average (optional)
export function computeFinalNoteFromAssessments(assessments: Assessment[]): number | null {
	const scores = assessments.map(a => a.score).filter((s): s is number => typeof s === "number");
	if (!scores.length) return null;
	const avg = scores.reduce((sum, v) => sum + v, 0) / scores.length;
	return Number(avg.toFixed(2));
}

// Convenience: Update final note/observation derived from current assessments
export async function refreshReportSummary(studentId: string, options?: { updateReportRow?: boolean }): Promise<{ report: StudentReport; final_note: number | null }> {
	const assessments = await listAssessmentsByStudent(studentId);
	const final_note = computeFinalNoteFromAssessments(assessments);
	const report = await getOrCreateStudentReport(studentId);

	if (options?.updateReportRow) {
		const updated = await updateStudentReport(report.id, { final_note });
		return { report: updated, final_note };
	}
	return { report, final_note };
}

// Data shape tailored for PDF export generation in UI
export async function getReportDataForPdf(studentId: string) {
	const summary = await getStudentSummary(studentId);
	const { final_note } = await refreshReportSummary(studentId);
	return {
		student: summary.student,
		group: summary.group,
		modules: summary.modules,
		assessments: summary.assessments,
		report: summary.report,
		computed_final_note: final_note,
	};
}

