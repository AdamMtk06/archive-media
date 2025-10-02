import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/auth";

const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateUserProfile(formData);
      
      if (response.success) {
        setSuccess("تم تحديث الملف الشخصي بنجاح");
        setIsEditing(false);
      } else {
        throw new Error(response.message || "فشل تحديث الملف الشخصي");
      }
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>ملفي الشخصي</h1>
        <p>إدارة معلوماتك الشخصية وإعدادات الحساب</p>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2>{user?.name || "مستخدم"}</h2>
            <p>{user?.email || "user@example.com"}</p>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">الملفات</span>
              <span className="stat-value">{user?.filesCount || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">المساحة المستخدمة</span>
              <span className="stat-value">{user?.storageUsed || "0 MB"}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">تاريخ الانضمام</span>
              <span className="stat-value">
                {user?.joinDate 
                  ? new Date(user.joinDate).toLocaleDateString("ar-SA") 
                  : "غير معروف"}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/settings" className="btn-secondary">
              الإعدادات
            </Link>
            <Link to="/security" className="btn-secondary">
              الأمان
            </Link>
          </div>
        </div>

        <div className="profile-content">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="info-section">
              <h3>المعلومات الأساسية</h3>
              
              <div className="info-item">
                <div className="form-group" style={{width: "48%"}}>
                  <label>الاسم الكامل</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="form-group" style={{width: "48%"}}>
                  <label>البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              

              
            </div>

            <div className="form-actions">
              {isEditing ? (
                <>
                  <button type="submit" disabled={loading}>
                    {loading ? (
                      <span className="button-spinner"></span>
                    ) : (
                      "حفظ التغييرات"
                    )}
                  </button>
                  <button type="button" className="btn-secondary" onClick={toggleEdit}>
                    إلغاء
                  </button>
                </>
              ) : (
                <button type="button" onClick={toggleEdit}>
                  تعديل الملف الشخصي
                </button>
              )}
            </div>
          </form>

          <div className="info-section" style={{marginTop: "2rem"}}>
            <h3>كلمة المرور</h3>
            <div className="info-item">
              <div className="form-group" style={{width: "48%"}}>
                <label>كلمة المرور الحالية</label>
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور الحالية"
                  disabled
                />
              </div>
              <div className="form-group" style={{width: "48%"}}>
                <label>كلمة المرور الجديدة</label>
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                  disabled
                />
              </div>
            </div>
            <Link to="/change-password" className="btn-secondary">
              تغيير كلمة المرور
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;