import { supabase } from "@/lib/supabaseClient";

// -------------------------
// TYPES
// -------------------------
export interface Group {
  id?: string;
  name: string;
  teacher_name: string;
  timing: string;
  school_id: string;
}

// -------------------------
// GROUP DETAILS
// -------------------------
export async function getGroupDetails(groupId: string) {
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single();
  if (groupError) throw groupError;

  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('*')
    .eq('group_id', groupId);
  if (studentsError) throw studentsError;

  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('*')
    .eq('group_id', groupId);
  if (modulesError) throw modulesError;

  return { group, students, modules };
}

// -------------------------
// DELETE STUDENT / MODULE
// -------------------------
export async function deleteStudent(studentId: string) {
  const { error } = await supabase.from('students').delete().eq('id', studentId);
  if (error) throw error;
  return true;
}

export async function deleteModule(moduleId: string) {
  const { error } = await supabase.from('modules').delete().eq('id', moduleId);
  if (error) throw error;
  return true;
}

// -------------------------
// ADD / GET GROUPS BY SCHOOL
// -------------------------
export async function addGroup(group: Group) {
  const { data, error } = await supabase
    .from('groups')
    .insert([group])
    .select();
  if (error) throw error;
  return data;
}

export async function getGroupsBySchool(school_id: string) {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('school_id', school_id);
  if (error) throw error;
  return data;
}