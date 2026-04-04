const API_BASE_URL= process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const roleKeys = {
    all: ["roles"],
    detail: (id) => ["roles", id],
};

export const fetchRoles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/roles`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        console.log("======= Fetch roles GET ===============" ,response)
        const json = await response.json();
        if (!response.ok) {
            throw new Error(json.message || "Failed to fetch roles");
        }
        return json.data || [];
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
};

export const createRole = async(formData)=>{
  try{
    const payload = {
      roleName:formData.roleName,
      roleEmail:formData.roleEmail,
      rolePassword:formData.rolePassword,
      description:formData.description,
      permissions:formData.permissions
    }
    const response = await fetch(`${API_BASE_URL}/roles`,{
      method:"POST",
      headers : getAuthHeaders(),
      body:JSON.stringify(payload)
    })
    console.log("======= Create role POST ===============" ,response)
    const json = await response.json();
    return json;
  }catch(error){
    console.error("Error creating role:", error);
    throw error;
  }
}

export const updateRole = async(payload)=>{
  const { id, ...formData } = payload;
  try{
    const payload = {
      roleName:formData.roleName,
      roleEmail:formData.roleEmail,
      rolePassword:formData.rolePassword,
      description:formData.description,
      permissions:formData.permissions
    }
    const response = await fetch(`${API_BASE_URL}/roles/${id}`,{
      method:"PATCH",
      headers : getAuthHeaders(),
      body:JSON.stringify(payload)
    })
    console.log("======= Update role PATCH ===============" ,response)
    const json = await response.json();
    return json;
  }catch(error){
    console.error("Error updating role:", error);
    throw error;
  }
}

export const deleteRole = async(id)=>{
  try{
    const response = await fetch(`${API_BASE_URL}/roles/${id}`,{
      method:"DELETE",
      headers : getAuthHeaders(),
    })
    console.log("============DETLETE role =============" ,response)
    const json = await response.json();
    return json;
  }catch(error){
    console.error("Error deleting role:", error);
    throw error;
  }
}