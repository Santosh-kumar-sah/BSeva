import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Compass, 
  CheckSquare, 
  Activity,
  CheckCircle,
  RefreshCw,
  Search,
  Building2,
  ExternalLink
} from 'lucide-react';
import { adminService, schemeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AnalyticsData, Scheme, AuditLog, Department } from '../types';

export default function AdminDashboardPage() {
  const { language } = useAuth();
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string>('');

  // Table filters
  const [searchScheme, setSearchScheme] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, schemesRes, deptRes, logsRes] = await Promise.all([
        adminService.getAnalytics(),
        schemeService.getSchemes({ limit: 50 }),
        schemeService.getDepartments(),
        adminService.getAuditLogs(20)
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes);
      if (schemesRes.success) setSchemes(schemesRes.schemes);
      if (deptRes.success) setDepartments(deptRes.departments);
      if (logsRes.success) setAuditLogs(logsRes.auditLogs || []);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (schemeId: string, newStatus: string) => {
    try {
      const res = await adminService.verifyScheme(schemeId, newStatus);
      if (res.success) {
        setActionMessage(`Scheme status updated to ${newStatus} in Supabase!`);
        fetchAdminData();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error updating scheme:', err);
    }
  };

  // Filter schemes
  const filteredSchemes = schemes.filter(s => {
    const matchQuery = searchScheme === '' || 
      s.title_en.toLowerCase().includes(searchScheme.toLowerCase()) || 
      s.title_hi.toLowerCase().includes(searchScheme.toLowerCase());
    const matchDept = selectedDept === '' || s.departmentId === selectedDept || s.department?.code === selectedDept;
    const matchStatus = selectedStatus === '' || s.status === selectedStatus;
    return matchQuery && matchDept && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'hi' ? 'प्रशासनिक नियंत्रण कक्ष' : 'Admin & Governance Control'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {language === 'hi' ? 'बिहार सहायक एडमिन व सत्यापन डैशबोर्ड' : 'Platform Administration & Verification'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'सुपाबेस डेटाबेस, सत्यापन कार्यप्रवाह और ऑडिट लॉग की लाइव निगरानी।'
              : 'Live Supabase PostgreSQL metrics, scheme verification workflows, and immutable audit trails.'}
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 transition"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">{language === 'hi' ? 'कुल पंजीकृत नागरिक' : 'Total Users'}</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{analytics.metrics.totalUsers}</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Live in Supabase DB</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">{language === 'hi' ? 'सत्यापित योजनाएं' : 'Total Schemes'}</span>
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{analytics.metrics.totalSchemes}</div>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">5 Bihar Departments</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">{language === 'hi' ? 'पात्रता जांच' : 'Eligibility Checks'}</span>
              <CheckSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{analytics.metrics.totalEligibilityChecks}</div>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">Deterministic Queries</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">{language === 'hi' ? 'करियर पाथवे' : 'Career Pathways'}</span>
              <Compass className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{analytics.metrics.totalCareers}</div>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">BSDM Skill Mapped</span>
          </div>
        </div>
      )}

      {/* Scheme Verification Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {language === 'hi' ? 'योजना सत्यापन एवं प्रबंधन (Scheme Verification)' : 'Scheme Verification Workflow'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'hi'
                ? 'आधिकारिक स्रोतों से सत्यापित करने के पश्चात स्थिति अपडेट करें'
                : 'Review and update verification status across departmental schemes'}
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search scheme title..."
              value={searchScheme}
              onChange={(e) => setSearchScheme(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Departments (सभी विभाग)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.code}>{d.name_en}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Statuses (सभी स्थितियां)</option>
            <option value="ACTIVE">ACTIVE (सक्रिय)</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW (समीक्षाधीन)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">योजना (Scheme)</th>
                <th className="py-3 px-4">विभाग (Department)</th>
                <th className="py-3 px-4">स्थिति (Status)</th>
                <th className="py-3 px-4">सत्यापन तिथि</th>
                <th className="py-3 px-4 text-right">कार्रवाई (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchemes.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                    {s.title_hi || s.title_en}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {s.department?.name_hi || s.department?.name_en || s.departmentId}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      s.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {s.last_verified_date}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleVerify(s.id, s.status === 'ACTIVE' ? 'UNDER_REVIEW' : 'ACTIVE')}
                      className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition"
                    >
                      {s.status === 'ACTIVE' ? 'Set Review' : 'Set Active'}
                    </button>
                    <a
                      href={s.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg inline-block"
                      title="Open Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5 inline" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          <span>{language === 'hi' ? 'लाइव सुरक्षा ऑडिट लॉग' : 'Live Security Audit Logs'}</span>
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'hi'
            ? 'प्रशासनिक क्रियाओं और स्थिति परिवर्तनों का अपरिवर्तनीय ऑडिट रिकॉर्ड'
            : 'Immutable logging stream recording all admin and scheme status events'}
        </p>

        <div className="space-y-2 pt-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                  {log.action}
                </span>
                <span className="font-semibold text-slate-800">
                  {log.entityName} ID: {log.entityId}
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
