import React from 'react';
import {
  LayoutDashboard,
  Coins,
  ShieldCheck,
  Users,
  ScrollText,
  Eye,
  Radio,
  AlertTriangle,
  FileCheck,
  BarChart3,
  Home,
  Camera,
  Tag,
  Wheat,
  Stethoscope,
  ShieldAlert,
  Cpu,
  Bot
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import { useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ role }) {
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const location = useLocation();
  const navigate = useNavigate();

  const ROLE_METADATA = {
    admin: {
      title: isHi ? "राज्य नियंत्रक (Super Admin)" : "State Controller (Admin)",
      subtitle: isHi ? "सचिव, राज्य गो-सेवा आयोग" : "Secretary, State Commission",
      avatar: "👑",
      nav: [
        { id: "dash", path: "/admin/dashboard", label: isHi ? "राज्य डैशबोर्ड" : "State Dashboard", icon: LayoutDashboard },
        { id: "grants", path: "/admin/grants", label: isHi ? "अनुदान स्वीकृति (DBT)" : "Grant Approvals (DBT)", icon: Coins },
        { id: "audit", path: "/admin/audit", label: isHi ? "AI ऑडिट रिपोर्ट" : "AI Audit Reports", icon: ShieldCheck },
        { id: "sub", path: "/admin/sub-admins", label: isHi ? "उप-प्रशासक प्रबंधन" : "Sub-Admin Management", icon: Users },
        { id: "policy", path: "/admin/policy", label: isHi ? "नीति एवं मानक" : "Policy & Standards", icon: ScrollText },
        { id: "ai", path: "/admin/ai-features", label: isHi ? "भविष्य की तकनीकें (AI)" : "Advanced Tech (AI)", icon: Bot },
        { id: "pub", path: "/admin/public", label: isHi ? "सार्वजनिक निरीक्षण" : "Public Inspection", icon: Eye },
      ]
    },
    sub: {
      title: isHi ? "उप-प्रशासक (Zone/District)" : "Sub-Admin (Zone/District)",
      subtitle: isHi ? "जिला नोडल अधिकारी, रायपुर" : "District Nodal Officer, Raipur",
      avatar: "🧑‍💼",
      nav: [
        { id: "zone", path: "/sub/zone", label: isHi ? "ज़ोन लाइव मॉनिटर" : "Zone Live Monitor", icon: Radio },
        { id: "alerts", path: "/sub/alerts", label: isHi ? "अलर्ट एवं निरीक्षण" : "Alerts & Inspections", icon: AlertTriangle },
        { id: "verify", path: "/sub/verify", label: isHi ? "रिपोर्ट सत्यापन" : "Report Verification", icon: FileCheck },
        { id: "zrep", path: "/sub/reports", label: isHi ? "ज़ोन रिपोर्ट" : "Zone Reports", icon: BarChart3 },
      ]
    },
    mgr: {
      title: isHi ? "गौशाला प्रबंधक" : "Gaushala Manager",
      subtitle: isHi ? "श्री कृष्ण गौशाला, आरंग" : "Shri Krishna Gaushala, Arang",
      avatar: "🐄",
      nav: [
        { id: "mdash", path: "/manager/dashboard", label: isHi ? "मेरी गौशाला" : "My Gaushala", icon: Home },
        { id: "cctv", path: "/manager/cctv", label: isHi ? "CCTV · AI डिटेक्शन" : "CCTV · AI Detection", icon: Camera },
        { id: "gate", path: "/manager/gate", label: isHi ? "RFID गेट ट्रैकिंग" : "RFID Gate Tracking", icon: Tag },
        { id: "feed", path: "/manager/feed", label: isHi ? "चारा एवं स्टॉक" : "Fodder & Stock", icon: Wheat },
        { id: "health", path: "/manager/health", label: isHi ? "स्वास्थ्य एवं चिकित्सा" : "Health & Medical", icon: Stethoscope },
        { id: "perim", path: "/manager/perimeter", label: isHi ? "सुरक्षा / घुसपैठ" : "Security / Perimeter", icon: ShieldAlert },
      ]
    }
  };

  const currentRole = ROLE_METADATA[role] || ROLE_METADATA.admin;

  return (
    <aside className="portal-sidebar">
      {/* Identity Card */}
      <div className="user-identity-card">
        <div className="user-avatar">{currentRole.avatar}</div>
        <div className="user-meta">
          <h4>{currentRole.title}</h4>
          <p>{currentRole.subtitle}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {currentRole.nav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.path);
          return (
            <button
              key={item.id}
              className={`nav-link-btn ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">
                <Icon size={18} />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </aside>
  );
}
