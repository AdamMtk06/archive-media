import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/header.css';

const Header = ({ toggleSidebar }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  return (
    <header className="app-header">
      <div className="header-container">

      
        <Link to="/dashboard" className="logo">
          <div className="logo-icon">📁</div>
          <span className="logo-text">أرشيف الوسائط</span>
        </Link>
        
        {/* زر القائمة للشاشات الصغيرة */}

        
        {/* القائمة الرئيسية */}
        <nav className="main-nav">
          <Link to="/dashboard" className="nav-link active">الرئيسية</Link>
          <Link to="/media" className="nav-link">وسائطي</Link>
          <Link to="/upload" className="nav-link">رفع وسائط</Link>
        </nav>
        
        {/* قائمة المستخدم */}
        {isAuthenticated && (
          <div className="user-menu">
            <div className="user-avatar" onClick={toggleUserDropdown}>
              {user?.name?.charAt(0)}
            </div>
            
            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="user-info">
                  <h4>{user?.name}</h4>
                  <p>{user?.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  الملف الشخصي
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <span className="dropdown-icon">⚙️</span>
                  الإعدادات
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <span className="dropdown-icon">🚪</span>
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;