import { supabase } from "../supabaseClient";


 // Get all modules for a given group

export async function getModulesByGroup(groupId: number) {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: true });

  return { data, error };
}


 // Check for duplicate module - check if module name already exists in group

export const checkDuplicateModule = async (
  groupId: number,
  name: string,
  excludeModuleId?: string
) => {
  try {
    // Clean the input
    const cleanName = name.trim();
    
    let query = supabase
      .from('modules')
      .select('id, name')
      .eq('group_id', groupId)
      .eq('name', cleanName);

    // Exclude current module when editing
    if (excludeModuleId) {
      query = query.neq('id', excludeModuleId);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error };
    }

    return {
      data: {
        exists: data.length > 0,
        moduleData: data.length > 0 ? data[0] : null
      },
      error: null
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};


 // Get a single module by id

export async function getModuleById(moduleId: string) {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("id", moduleId)
    .single();
  return { data, error };
}


// Insert a new module with duplicate check

export async function addModule(payload: {
  name: string;
  description?: string | null;
  group_id: number;
}) {
  try {
    // Clean input
    const cleanName = payload.name.trim();
    
    // Check for duplicate name in the same group
    const { data: duplicateCheck, error: checkError } = await supabase
      .from("modules")
      .select("id, name")
      .eq("group_id", payload.group_id)
      .eq("name", cleanName)
      .maybeSingle();

    if (checkError) {
      return { data: null, error: checkError };
    }

    if (duplicateCheck) {
      return { 
        data: null, 
        error: new Error(`وحدة بنفس الاسم موجودة بالفعل في المجموعة: ${duplicateCheck.name}`) 
      };
    }

    // Prepare data for insertion
    const insertData = {
      name: cleanName,
      description: payload.description || null,
      group_id: payload.group_id
    };

    // Insert new module
    const { data, error } = await supabase
      .from("modules")
      .insert(insertData)
      .select();

    return { data, error };
  } catch (error: any) {
    return { data: null, error: error.message || "حدث خطأ أثناء إضافة الوحدة" };
  }
}


 // Update module by id with duplicate check

export async function updateModule(
  moduleId: string, 
  payload: Partial<{
    name: string;
    description: string | null;
    group_id: number;
  }>,
  options?: {
    checkDuplicates?: boolean;
    originalData?: {
      name: string;
    };
  }
) {
  try {
    // Clean input
    const cleanName = payload.name ? payload.name.trim() : undefined;
    
    // Update payload with cleaned data
    const updatePayload = {
      ...payload,
      ...(cleanName && { name: cleanName })
    };

    // Check for duplicates if requested
    if (options?.checkDuplicates && options?.originalData && payload.group_id) {
      // Skip duplicate check if name didn't change
      const isNameChanged = cleanName !== options.originalData.name.trim();
      
      if (isNameChanged) {
        // Check if another module has the same name
        const { data: duplicateCheck } = await supabase
          .from("modules")
          .select("id, name")
          .eq("group_id", payload.group_id)
          .eq("name", cleanName || options.originalData.name.trim())
          .neq("id", moduleId)
          .maybeSingle();

        if (duplicateCheck) {
          return { 
            data: null, 
            error: new Error(`وحدة أخرى بنفس الاسم موجودة في المجموعة: ${duplicateCheck.name}`) 
          };
        }
      }
    }

    // Update module
    const { data, error } = await supabase
      .from("modules")
      .update(updatePayload)
      .eq("id", moduleId)
      .select();

    return { data, error };
  } catch (error: any) {
    return { data: null, error: error.message || "حدث خطأ أثناء تحديث الوحدة" };
  }
}


// Delete module by id

export async function deleteModuleById(moduleId: string) {
  const { data, error } = await supabase
    .from("modules")
    .delete()
    .eq("id", moduleId)
    .select();
  return { data, error };
}

//Get module with all student assessments

export async function getModuleWithAssessments(moduleId: string) {
  try {
    // Get module details
    const { data: moduleData, error: moduleError } = await supabase
      .from("modules")
      .select("*, groups(id, name)")
      .eq("id", moduleId)
      .single();

    if (moduleError) {
      return { data: null, error: moduleError };
    }

    // Get all students in the group
    const { data: studentsData, error: studentsError } = await supabase
      .from("students")
      .select("id, full_name")
      .eq("group_id", moduleData.groups.id)
      .order("full_name", { ascending: true });

    if (studentsError) {
      return { data: null, error: studentsError };
    }

    // Get all assessments for this module
    const { data: assessmentsData, error: assessmentsError } = await supabase
      .from("assessments")
      .select("*")
      .eq("module_id", moduleId);

    if (assessmentsError) {
      return { data: null, error: assessmentsError };
    }

    // Combine students with their assessments
    const studentsWithAssessments = studentsData.map(student => {
      const assessment = assessmentsData?.find(a => a.student_id === student.id);
      return {
        studentId: student.id,
        studentName: student.full_name,
        grade: assessment?.score || null,
        remark: assessment?.remark || "",
        assessmentId: assessment?.id || null,
        assessmentDate: assessment?.assessment_date || null
      };
    });

    return {
      data: {
        module: moduleData,
        students: studentsWithAssessments
      },
      error: null
    };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}


// Upsert (insert or update) assessment for a student in a module

export async function upsertAssessment(payload: {
  student_id: number;
  module_id: string;
  score: number;
  remark?: string;
}) {
  try {
    // Check if assessment already exists
    const { data: existingAssessment } = await supabase
      .from("assessments")
      .select("id")
      .eq("student_id", payload.student_id)
      .eq("module_id", payload.module_id)
      .maybeSingle();

    if (existingAssessment) {
      // Update existing assessment
      const { data, error } = await supabase
        .from("assessments")
        .update({
          score: payload.score,
          remark: payload.remark || "",
          assessment_date: new Date().toISOString()
        })
        .eq("id", existingAssessment.id)
        .select();

      return { data, error };
    } else {
      // Insert new assessment
      const { data, error } = await supabase
        .from("assessments")
        .insert({
          student_id: payload.student_id,
          module_id: payload.module_id,
          score: payload.score,
          remark: payload.remark || "",
          assessment_date: new Date().toISOString()
        })
        .select();

      return { data, error };
    }
  } catch (error: any) {
    return { data: null, error: error.message || "حدث خطأ أثناء حفظ التقييم" };
  }
}


//Delete assessment by id

export async function deleteAssessmentById(assessmentId: string) {
  const { data, error } = await supabase
    .from("assessments")
    .delete()
    .eq("id", assessmentId)
    .select();
  return { data, error };
}


 //Get all assessments for a specific student across all modules

export async function getStudentAssessments(studentId: number) {
  const { data, error } = await supabase
    .from("assessments")
    .select("*, modules(id, name, description)")
    .eq("student_id", studentId)
    .order("assessment_date", { ascending: false });

  return { data, error };
}
