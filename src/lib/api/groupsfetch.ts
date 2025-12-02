// import { supabase } from "../supabaseClient";

// // Define your group type manually (avoid Supabase deep types)
// export interface Group {
//   id?: number;
//   name: string;
//   teacher_name: string;
//   timing: string;
//   school_id: number;
// }

// // -------------------------
// // ADD A GROUP
// // -------------------------
// export async function addGroup(group: Group) {
//   const { data, error } = await supabase
//     .from("groups")
//     .insert(group)
//     .select();

//   if (error) {
//     console.error("Error inserting group:", error);
//     throw error;
//   }

//   return data;
// }

// // -------------------------
// // GET GROUPS BY SCHOOL
// // -------------------------
// export async function getGroupsBySchool(schoolId: number) {
//   const { data, error } = await supabase
//     .from("groups")
//     .select("*")
//     .eq("school_id", schoolId);

//   if (error) {
//     console.error("Error fetching groups:", error);
//     throw error;
//   }

//   return data;
// }
