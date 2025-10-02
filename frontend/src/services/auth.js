import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// تسجيل مستخدم جديد
export const registerUser = async (userData) => {
  console.log("Attempting to register user:", userData);
  
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 seconds timeout
    });
    
    console.log("Registration successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
      throw new Error(error.response.data.message || "Registration failed");
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("No response from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
      throw new Error("Request setup error");
    }
  }
};

// تسجيل الدخول
export const loginUser = async (credentials) => {
  console.log("Attempting to login user:", credentials);
  
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 seconds timeout
    });
    
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("No response from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
      throw new Error("Request setup error");
    }
  }
};

// جلب بيانات المستخدم
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("لم يتم العثور على توكن المصادقة");
    }
    
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error.response?.data || error;
  }
};

// تحديث بيانات المستخدم
export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("لم يتم العثور على توكن المصادقة");
    }
    
    const response = await axios.put(`${API_URL}/profile`, userData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error.response?.data || error;
  }
};