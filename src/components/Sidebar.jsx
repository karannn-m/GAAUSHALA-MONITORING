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
  Cpu
} from 'lucide-react';

const ROLE_METADATA = {
  admin: {
    title: "राज्य नियंत्रक (Super Admin)",
    subtitle: "सचिव, राज्य गो-सेवा आयोग",
    avatar: "👑",
    nav: [
      { id: "dash", label: "राज्य डैशबोर्ड", icon: LayoutDashboard },
      { id: "grants", label: "अनुदान स्वीकृति (DBT)", icon: Coins },
      { id: "audit", label: "AI ऑडिट रिपोर्ट", icon: ShieldCheck },
      { id: "sub", label: "उप-प्रशासक प्रबंधन", icon: Users },
      { id: "policy", label: "नीति एवं मानक", icon: ScrollText },
      { id: "pub", label: "सार्वजनिक गोवंश निरीक्षण", icon: Eye },
    ]
  },
  sub: {
    title: "उप-प्रशासक (Zone/District)",
    subtitle: "जिला नोडल अधिकारी, रायपुर ज़ोन",
    avatar: "🧑‍💼",
    nav: [
      { id: "zone", label: "ज़ोन लाइव मॉनिटर", icon: Radio },
      { id: "alerts", label: "अलर्ट एवं निरीक्षण", icon: AlertTriangle },
      { id: "verify", label: "रिपोर्ट सत्यापन", icon: FileCheck },
      { id: "zrep", label: "ज़ोन रिपोर्ट", icon: BarChart3 },
    ]
  },
  mgr: {
    title: "गौशाला प्रबंधक",
    subtitle: "श्री कृष्ण गौशाला, आरंग",
    avatar: "🐄",
    nav: [
      { id: "mdash", label: "मेरी गौशाला", icon: Home },
      { id: "cctv", label: "CCTV · AI डिटेक्शन", icon: Camera },
      { id: "gate", label: "RFID गेट एवं ट्रैकिंग", icon: Tag },
      { id: "feed", label: "चारा एवं स्टॉक", icon: Wheat },
      { id: "health", label: "स्वास्थ्य एवं चिकित्सा", icon: Stethoscope },
      { id: "perim", label: "सुरक्षा / घुसपैठ", icon: ShieldAlert },
    ]
  }
};

export default function Sidebar({ role, activeTab, onTabSelect }) {
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
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link-btn ${isActive ? 'active' : ''}`}
              onClick={() => onTabSelect(item.id)}
            >
              <span className="nav-icon">
                <Icon size={18} />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer AI Engine Status */}
      <div className="sidebar-footer">
        <div className="ai-engine-pill">
          <Cpu size={14} />
          <span>YOLOv8 + RFID Online</span>
        </div>
        <div style={{ opacity: 0.8 }}>
          Edge Nodes: <b>48 Active</b> • Sync: <b>Real-time</b>
        </div>
      </div>
    </aside>
  );
}
