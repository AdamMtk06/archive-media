import axios from "axios";

const API_URL = "http://localhost:5000/api";

// إعداد Axios مع التوكن
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة التوكن لكل طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// معالجة أخطاء الاستجابة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // تم تسجيل الخروج تلقائياً إذا انتهت صلاحية التوكن
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// جلب وسائط المستخدم
export const getUserMedia = async () => {
  try {
    const response = await api.get("/media/user");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user media:", error);
    return [];
  }
};

// رفع وسائط جديدة
export const uploadMedia = async (formData) => {
  try {
    const response = await api.post("/media/upload", formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
};

// حذف وسائط
export const deleteMedia = async (id) => {
  try {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
};

// جلب إحصائيات المستخدم
export const getUserStats = async () => {
  try {
    const response = await api.get("/user/stats");
    return response.data || {};
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {};
  }
};