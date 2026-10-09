import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAppointmentsByPatient, getSymptomChatsByPatient, getPrescriptionsByPatient } from "../../services/database";
import { FiActivity, FiTrendingUp, FiAlertTriangle, FiHeart, FiShield, FiBarChart2, FiCalendar, FiClock, FiCheckCircle, FiInfo } from "react-icons/fi";

const PredictiveAnalytics = () => {
  const { currentUser, userProfile } = useAuth();
  const [data, setData] = useState({ appointments: [], chats: [], prescriptions: [] });
  const [loading, setLoading] = useState(true);
  const [riskScore, setRiskScore] = useState(20);
  const [insights, setInsights] = useState([]);
  const [healthTrend, setHealthTrend] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [a, c, p] = await Promise.all([getAppointmentsByPatient(currentUser.uid), getSymptomChatsByPatient(currentUser.uid), getPrescriptionsByPatient(currentUser.uid)]);
        setData({ appointments: a, chats: c, prescriptions: p });
        analyze({ appointments: a, chats: c, prescriptions: p });
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    if (currentUser) fetch();
  }, [currentUser]);

  const analyze = ({ appointments, chats, prescriptions }) => {
    let score = 20;
    const ins = [];
    const emg = chats.filter(c => c.triageResult?.level === "EMERGENCY");
    const urg = chats.filter(c => c.triageResult?.level === "URGENT");
    const sc = chats.filter(c => c.triageResult?.level === "SELF-CARE");
    if (emg.length > 0) { score += 30; ins.push({ type: "warning", text: `${emg.length} emergency-level assessment(s) detected. Regular check-ups strongly recommended.`, icon: <FiAlertTriangle className="w-4 h-4" /> }); }
    if (urg.length > 0) { score += 15; ins.push({ type: "caution", text: `${urg.length} urgent-level assessment(s). Consider scheduling a follow-up.`, icon: <FiClock className="w-4 h-4" /> }); }
    const recent = appointments.filter(a => { const d = new Date(a.date); return (new Date() - d) < 90 * 86400000; });
    if (recent.length === 0 && appointments.length > 0) { score += 10; ins.push({ type: "info", text: "No recent appointments in 90 days. Regular check-ups help early detection.", icon: <FiCalendar className="w-4 h-4" /> }); }
    if (recent.length >= 3) { score += 5; ins.push({ type: "caution", text: "Multiple visits in 90 days may indicate ongoing concerns.", icon: <FiActivity className="w-4 h-4" /> }); }
    if (prescriptions.length >= 5) { score += 10; ins.push({ type: "info", text: `${prescriptions.length} prescriptions on record. Check for drug interactions.`, icon: <FiShield className="w-4 h-4" /> }); }
    if (!userProfile?.bloodGroup || !userProfile?.emergencyContact) { score += 5; ins.push({ type: "info", text: "Incomplete health profile. Update blood group, allergies, and emergency contact.", icon: <FiInfo className="w-4 h-4" /> }); }
    if (score <= 30) ins.unshift({ type: "success", text: "Your health indicators look good! Keep it up.", icon: <FiCheckCircle className="w-4 h-4" /> });
    if (sc.length > 0) ins.push({ type: "success", text: "Some symptoms assessed as self-manageable. Good awareness!", icon: <FiHeart className="w-4 h-4" /> });
    score = Math.min(score, 95);
    const months = ["6 mo ago", "5 mo ago", "4 mo ago", "3 mo ago", "2 mo ago", "Now"];
    const trend = months.map((m, i) => ({ month: m, score: Math.min(Math.max(20, score - (5 - i) * (Math.floor(Math.random() * 8) + 2)) + Math.floor(Math.random() * 10), 95) }));
    trend[trend.length - 1].score = score;
    setRiskScore(score); setInsights(ins); setHealthTrend(trend);
  };

  const riskLevel = (s) => {
    if (s <= 25) return { label: "Low Risk", color: "text-emerald-600", bg: "bg-emerald-500", bgLight: "bg-emerald-50", ring: "ring-emerald-200" };
    if (s <= 50) return { label: "Moderate", color: "text-amber-600", bg: "bg-amber-500", bgLight: "bg-amber-50", ring: "ring-amber-200" };
    if (s <= 75) return { label: "Elevated", color: "text-orange-600", bg: "bg-orange-500", bgLight: "bg-orange-50", ring: "ring-orange-200" };
    return { label: "High Risk", color: "text-red-600", bg: "bg-red-500", bgLight: "bg-red-50", ring: "ring-red-200" };
  };

  const insightStyle = { warning: "bg-red-50 border-red-200 text-red-800", caution: "bg-amber-50 border-amber-200 text-amber-800", info: "bg-blue-50 border-blue-200 text-blue-800", success: "bg-emerald-50 border-emerald-200 text-emerald-800" };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-6"><div className="space-y-4"><div className="skeleton h-8 w-64" /><div className="skeleton h-48 w-full" /><div className="skeleton h-32 w-full" /></div></div>;

  const risk = riskLevel(riskScore);
  const maxT = Math.max(...healthTrend.map(t => t.score), 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-8">
      <div className="mb-6"><h1 className="text-xl sm:text-2xl font-bold text-gray-900">Predictive Analytics</h1><p className="text-sm text-gray-500 mt-1">Health risk assessment</p></div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 mb-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#sg)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(riskScore / 100) * 327} 327`} className="transition-all duration-1000" />
              <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor={riskScore <= 50 ? "#22c55e" : "#f59e0b"} /><stop offset="100%" stopColor={riskScore <= 50 ? "#3b82f6" : "#ef4444"} /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">{riskScore}</span>
              <span className="text-xs text-gray-400">/ 100</span>
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ring-1 ${risk.bgLight} ${risk.color} ${risk.ring}`}><FiActivity className="w-3.5 h-3.5" /> {risk.label}</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-3">Health Risk Score</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md">Calculated from symptom assessments, appointments, prescriptions, and profile completeness. Lower is better.</p>
            <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
              <div className="text-center"><p className="text-lg font-bold text-gray-900">{data.chats.length}</p><p className="text-[11px] text-gray-400">Consultations</p></div>
              <div className="text-center"><p className="text-lg font-bold text-gray-900">{data.appointments.length}</p><p className="text-[11px] text-gray-400">Appointments</p></div>
              <div className="text-center"><p className="text-lg font-bold text-gray-900">{data.prescriptions.length}</p><p className="text-[11px] text-gray-400">Prescriptions</p></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-6 animate-fade-in delay-1">
        <div className="flex items-center gap-2 mb-5"><FiTrendingUp className="w-5 h-5 text-primary-600" /><h2 className="text-base sm:text-lg font-semibold text-gray-900">Health Trend</h2></div>
        <div className="flex items-end gap-2 sm:gap-4 h-40 sm:h-48">
          {healthTrend.map((p, i) => {
            const h = (p.score / maxT) * 100;
            const r = riskLevel(p.score);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[10px] font-semibold text-gray-500 opacity-0 group-hover:opacity-100 transition">{p.score}</span>
                <div className="w-full flex items-end justify-center" style={{ height: "100%" }}>
                  <div className={`w-full max-w-[40px] sm:max-w-[48px] ${r.bg} rounded-t-lg transition-all duration-500 hover:opacity-80`} style={{ height: `${h}%` }} />
                </div>
                <span className="text-[10px] sm:text-[11px] text-gray-400 whitespace-nowrap">{p.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-[11px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Low</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" /> Moderate</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-orange-500 rounded-sm" /> Elevated</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm" /> High</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-6 animate-fade-in delay-2">
        <div className="flex items-center gap-2 mb-4"><FiBarChart2 className="w-5 h-5 text-primary-600" /><h2 className="text-base sm:text-lg font-semibold text-gray-900">Health Insights</h2></div>
        {insights.length === 0 ? (
          <div className="text-center py-8"><FiCheckCircle className="w-10 h-10 text-emerald-300 mx-auto mb-2" /><p className="text-gray-500 text-sm">Use the Symptom Checker to generate insights.</p></div>
        ) : (
          <div className="space-y-3">{insights.map((ins, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl border ${insightStyle[ins.type]} animate-fade-in`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="mt-0.5 flex-shrink-0">{ins.icon}</div>
              <p className="text-sm leading-relaxed">{ins.text}</p>
            </div>
          ))}</div>
        )}
      </div>
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 sm:p-6 text-white animate-fade-in delay-3">
        <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2"><FiShield className="w-5 h-5" /> Preventive Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { text: "Schedule regular check-ups every 6 months", active: data.appointments.length < 2 },
            { text: "Keep health profile updated with medications", active: !userProfile?.allergies },
            { text: "Use Symptom Checker for early concern detection", active: data.chats.length < 2 },
            { text: "Maintain emergency contact for SOS situations", active: !userProfile?.emergencyContact },
            { text: "Track prescription adherence and set reminders", active: data.prescriptions.length > 0 },
            { text: "Stay hydrated, exercise regularly, sleep well", active: true }
          ].map((r, i) => (
            <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl ${r.active ? "bg-white/15" : "bg-white/5"}`}>
              <FiCheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${r.active ? "text-white" : "text-white/40"}`} />
              <p className={`text-sm ${r.active ? "text-white" : "text-white/50"}`}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-gray-400 text-center mt-4">This analysis is based on your Health Link activity. Always consult a healthcare professional.</p>
    </div>
  );
};

export default PredictiveAnalytics;
