import { supabase } from "../supabaseClient";

/**
 * Get all students for a given group
 */
export async function getStudentsByGroup(groupId: number) {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("group_id", groupId)
    .order("id", { ascending: true });

  return { data, error };
}

/**
 * Check for duplicate student - ALL THREE FIELDS (name, phone, birthdate)
 */
export const checkDuplicateStudent = async (
  groupId: number,
  name: string,
  phone: string,
  birthdate: string,
  excludeStudentId?: number
) => {
  try {
    // Clean the inputs
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, '');
    
    let query = supabase
      .from('students')
      .select('id, full_name, contact_info, date_of_birth')
      .eq('group_id', groupId)
      .eq('full_name', cleanName)
      .eq('contact_info', cleanPhone)
      .eq('date_of_birth', birthdate);

    // Exclude current student when editing
    if (excludeStudentId) {
      query = query.neq('id', excludeStudentId);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error };
    }

    return {
      data: {
        exists: data.length > 0,
        studentData: data.length > 0 ? data[0] : null
      },
      error: null
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

/**
 * Get a single student by id
 */
export async function getStudentById(studentId: number) {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();
  return { data, error };
}

/**
 * Insert a new student with full duplicate check
 */
export async function addStudent(payload: {
  full_name: string;
  contact_info?: string | null;
  date_of_birth?: string | null;
  group_id: number;
}) {
  try {
    // Clean inputs
    const cleanName = payload.full_name.trim();
    const cleanPhone = payload.contact_info ? payload.contact_info.replace(/\D/g, '') : null;
    
    // Check for duplicate with ALL THREE FIELDS
    const { data: duplicateCheck, error: checkError } = await supabase
      .from("students")
      .select("id, full_name")
      .eq("group_id", payload.group_id)
      .eq("full_name", cleanName)
      .eq("contact_info", cleanPhone || "")
      .eq("date_of_birth", payload.date_of_birth || "")
      .maybeSingle();

    if (checkError) {
      return { data: null, error: checkError };
    }

    if (duplicateCheck) {
      return { 
        data: null, 
        error: new Error(`طالب بنفس البيانات موجود بالفعل في المجموعة: ${duplicateCheck.full_name}`) 
      };
    }

    // Prepare data for insertion
    const insertData = {
      full_name: cleanName,
      contact_info: cleanPhone,
      date_of_birth: payload.date_of_birth,
      group_id: payload.group_id
    };

    // Insert new student
    const { data, error } = await supabase
      .from("students")
      .insert(insertData)
      .select();

    return { data, error };
  } catch (error: any) {
    return { data: null, error: error.message || "حدث خطأ أثناء إضافة الطالب" };
  }
}

/**
 * Update student by id with duplicate check
 */
export async function updateStudent(
  studentId: number, 
  payload: Partial<{
    full_name: string;
    contact_info: string | null;
    date_of_birth: string | null;
    group_id: number;
  }>,
  options?: {
    checkDuplicates?: boolean;
    originalData?: {
      full_name: string;
      contact_info: string | null;
      date_of_birth: string | null;
    };
  }
) {
  try {
    // Clean inputs
    const cleanName = payload.full_name ? payload.full_name.trim() : undefined;
    const cleanPhone = payload.contact_info ? payload.contact_info.replace(/\D/g, '') : payload.contact_info;
    
    // Update payload with cleaned data
    const updatePayload = {
      ...payload,
      ...(cleanName && { full_name: cleanName }),
      ...(cleanPhone !== undefined && { contact_info: cleanPhone })
    };

    // Check for duplicates if requested
    if (options?.checkDuplicates && options?.originalData && payload.group_id) {
      // Skip duplicate check if nothing changed
      const isNameChanged = cleanName !== options.originalData.full_name.trim();
      const isPhoneChanged = cleanPhone !== (options.originalData.contact_info?.replace(/\D/g, '') || null);
      const isBirthdateChanged = payload.date_of_birth !== options.originalData.date_of_birth;
      
      if (isNameChanged || isPhoneChanged || isBirthdateChanged) {
        // Check if another student has the same data
        const { data: duplicateCheck } = await supabase
          .from("students")
          .select("id, full_name")
          .eq("group_id", payload.group_id)
          .eq("full_name", cleanName || options.originalData.full_name.trim())
          .eq("contact_info", cleanPhone || options.originalData.contact_info?.replace(/\D/g, '') || "")
          .eq("date_of_birth", payload.date_of_birth || options.originalData.date_of_birth || "")
          .neq("id", studentId)
          .maybeSingle();

        if (duplicateCheck) {
          return { 
            data: null, 
            error: new Error(`طالب آخر بنفس البيانات موجود في المجموعة: ${duplicateCheck.full_name}`) 
          };
        }
      }
    }

    // Update student
    const { data, error } = await supabase
      .from("students")
      .update(updatePayload)
      .eq("id", studentId)
      .select();

    return { data, error };
  } catch (error: any) {
    return { data: null, error: error.message || "حدث خطأ أثناء تحديث بيانات الطالب" };
  }
}

/**
 * Delete student by id
 */
export async function deleteStudentById(studentId: number) {
  const { data, error } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId)
    .select(); // optional: returns deleted row(s)
  return { data, error };
}

/**
 * Quick check: Check if phone number exists in group (for phone-only duplicate check)
 */
export const checkPhoneDuplicate = async (
  groupId: number,
  phone: string,
  excludeStudentId?: number
) => {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    
    let query = supabase
      .from('students')
      .select('id, full_name')
      .eq('group_id', groupId)
      .eq('contact_info', cleanPhone);

    if (excludeStudentId) {
      query = query.neq('id', excludeStudentId);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error };
    }

    return {
      data: {
        exists: data.length > 0,
        studentName: data.length > 0 ? data[0].full_name : ''
      },
      error: null
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
  
};