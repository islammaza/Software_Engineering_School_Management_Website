// // src/lib/api/groupDetails.ts
// import { supabase } from "@/lib/supabaseClient";

// // Fetch group details including students and modules
// export async function getGroupDetails(groupId: string) {
//   // 1️⃣ Get group info
//   const { data: group, error: groupError } = await supabase
//     .from('groups')
//     .select('*')
//     .eq('id', groupId)
//     .single();

//   if (groupError) throw groupError;

//   // 2️⃣ Get students of this group
//   const { data: students, error: studentsError } = await supabase
//     .from('students')
//     .select('*')
//     .eq('group_id', groupId);

//   if (studentsError) throw studentsError;

//   // 3️⃣ Get modules of this group
//   const { data: modules, error: modulesError } = await supabase
//     .from('modules')
//     .select('*')
//     .eq('group_id', groupId);

//   if (modulesError) throw modulesError;

//   return { group, students, modules };
// }

// // Delete student
// export async function deleteStudent(studentId: string) {
//   const { error } = await supabase.from('students').delete().eq('id', studentId);
//   if (error) throw error;
//   return true;
// }

// // Delete module (will cascade delete assessments)
// export async function deleteModule(moduleId: string) {
//   const { error } = await supabase.from('modules').delete().eq('id', moduleId);
//   if (error) throw error;
//   return true;
// }