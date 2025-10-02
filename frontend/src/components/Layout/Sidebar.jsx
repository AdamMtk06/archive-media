import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpen ? 'mobile-open' : ''}`}>
      
      
      {!isCollapsed && (
        <>
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0)}
            </div>
            <div className="user-info">
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <Link 
              to="/dashboard" 
              className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={toggleSidebar}
            >
              <i className="fas fa-home"></i>
              <span>الرئيسية</span>
            </Link>
            <Link 
              to="/upload" 
              className={`nav-item ${location.pathname === '/upload' ? 'active' : ''}`}
              onClick={toggleSidebar}
            >
              <i className="fas fa-upload"></i>
              <span>رفع وسائط</span>
            </Link>
            <Link 
              to="/media" 
              className={`nav-item ${location.pathname === '/media' ? 'active' : ''}`}
              onClick={toggleSidebar}
            >
              <i className="fas fa-photo-video"></i>
              <span>وسائطي</span>
            </Link>
            <Link 
              to="/profile" 
              className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
              onClick={toggleSidebar}
            >
              <i className="fas fa-user"></i>
              <span>الملف الشخصي</span>
            </Link>
            
            <div className="sidebar-section">
              <h4>الإعدادات</h4>
              <Link 
                to="/settings" 
                className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <i className="fas fa-cog"></i>
                <span>إعدادات عامة</span>
              </Link>
              <Link 
                to="/storage" 
                className={`nav-item ${location.pathname === '/storage' ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <i className="fas fa-database"></i>
                <span>إدارة التخزين</span>
              </Link>
            </div>
          </nav>
          
          <div className="sidebar-footer">
            <div className="storage-info">
              <div className="storage-bar">
                <div className="storage-progress" style={{ width: '45%' }}></div>
              </div>
              <p>مساحة التخزين المستخدمة: 45%</p>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;