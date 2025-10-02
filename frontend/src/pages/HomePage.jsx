import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserStats, getUserMedia } from '../services/api';
import MediaList from '../components/Media/MediaList';
import { Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../styles/home.css';

const HomePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMedia: 0,
    images: 0,
    videos: 0,
    audio: 0,
    documents: 0,
    storageUsed: 0,
    storageLimit: 1024 * 1024 * 1024
  });
  const [recentMedia, setRecentMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await getUserStats();
        setStats(statsData);
        
        const media = await getUserMedia();
        setRecentMedia(media.slice(0, 6));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const storagePercentage = Math.min(100, (stats.storageUsed / stats.storageLimit) * 100);

  // حساب النسب المئوية لكل نوع من أنواع الملفات
  const getPercentage = (count) => {
    return stats.totalMedia > 0 ? Math.round((count / stats.totalMedia) * 100) : 0;
  };

  // Format bytes to readable format
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // مكون الدائرة المتحركة
  const CircleProgress = ({ percentage, title, icon, color, count }) => (
    <div className="circle-stat-card">
      <div className="circle-container">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textColor: "#fff",
            pathColor: color,
            trailColor: "#2c3e50",
            backgroundColor: "#1a1a1a",
            textSize: "16px",
          })}
        />
      </div>
      <div className="circle-info">
        <div className="circle-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{count} ملف</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>مرحباً، {user?.name}</h1>
        <p>هذا هو أرشيف الوسائط الخاص بك</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      ) : (
        <>
          <div className="circles-stats-container">
            <CircleProgress 
              percentage={getPercentage(stats.images)} 
              title="الصور" 
              icon="🖼️" 
              color="#3498db" 
              count={stats.images}
            />
            <CircleProgress 
              percentage={getPercentage(stats.videos)} 
              title="الفيديوهات" 
              icon="🎬" 
              color="#e74c3c" 
              count={stats.videos}
            />
            <CircleProgress 
              percentage={getPercentage(stats.audio)} 
              title="الصوتيات" 
              icon="🎵" 
              color="#2ecc71" 
              count={stats.audio}
            />
            <CircleProgress 
              percentage={getPercentage(stats.documents)} 
              title="المستندات" 
              icon="📄" 
              color="#f39c12" 
              count={stats.documents}
            />
          </div>

          {/* Storage Usage Circle */}
          <div className="storage-circle-container">
            <div className="storage-circle-card">
              <div className="storage-circle-wrapper">
                <CircularProgressbar
                  value={storagePercentage}
                  text={`${storagePercentage.toFixed(1)}%`}
                  styles={buildStyles({
                    textColor: "#fff",
                    pathColor: "#9b59b6",
                    trailColor: "#2c3e50",
                    backgroundColor: "#1a1a1a",
                    textSize: "16px",
                  })}
                />
              </div>
              <div className="storage-info">
                <h3>مساحة التخزين المستخدمة</h3>
                <p>{formatBytes(stats.storageUsed)} / {formatBytes(stats.storageLimit)}</p>
                <p>متبقي: {formatBytes(stats.storageLimit - stats.storageUsed)}</p>
              </div>
            </div>
          </div>

          <div className="recent-media">
            <div className="section-header">
              <h2>آخر الوسائط المرفوعة</h2>
              <button className="view-all-btn">
                <Link to="/media">عرض الكل</Link>
              </button>
            </div>
            
            {recentMedia.length > 0 ? (
              <MediaList media={recentMedia} />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3>لا توجد وسائط مرفوعة بعد</h3>               
                <p>ابدأ برفع أول ملف وسائط لك</p>
                <button className="upload-btn">
                  <Link to="/upload">رفع وسائط</Link>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;