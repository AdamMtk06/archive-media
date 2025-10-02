import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/auth";
import '../styles/login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // التحقق من صحة البيانات قبل الإرسال
      if (!formData.email || !formData.password) {
        throw new Error("يرجى ملء جميع الحقول المطلوبة");
      }

      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // التحقق من وجود البيانات في الاستجابة
      if (!response.user || !response.token) {
        throw new Error("الاستجابة من الخادم غير صالحة");
      }

      // حفظ التوكن إذا تم تحديد "تذكرني"
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      login(response.user);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>مرحباً بعودتك</h2>
          <p>سجل دخولك للوصول إلى حسابك</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>
          
          <div className="form-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="remember">تذكرني</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              نسيت كلمة المرور؟
            </Link>
          </div>
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? (
              <span className="button-spinner"></span>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;