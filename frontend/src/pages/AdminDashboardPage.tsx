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
        setActionMessage(`Scheme status updated to ${newStatus} successfully.`);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            <span>{language === 'hi' ? 'प्रशासनिक नियंत्रण कक्ष' : 'Admin & Governance Portal'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary tracking-tight">
            {language === 'hi' ? 'बिहार सहायक एडमिन व सत्यापन डैशबोर्ड' : 'Platform Administration & Verification'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            {language === 'hi'
              ? 'योजना सत्यापन कार्यप्रवाह, डेटाबेस मेट्रिक्स और सुरक्षा ऑडिट लॉग की निगरानी।'
              : 'Scheme verification workflows, database analytics, and immutable audit logs.'}
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="p-2 bg-surface hover:bg-background border border-border rounded-lg text-text-primary transition-colors cursor-pointer shadow-sm"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 text-text-secondary ${loading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
        </button>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-lg bg-success/10 border border-success/20 text-success text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-center justify-between text-text-secondary mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{language === 'hi' ? 'कुल पंजीकृत नागरिक' : 'Total Citizens'}</span>
              <Users className="w-4 h-4 text-brand" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold font-heading text-text-primary">{analytics.metrics.totalUsers}</div>
            <span className="text-[11px] text-success font-medium mt-0.5 block">Active Registrations</span>
          </div>

          <div className="bg-surface rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-center justify-between text-text-secondary mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{language === 'hi' ? 'सत्यापित योजनाएं' : 'Total Schemes'}</span>
              <BookOpen className="w-4 h-4 text-brand" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold font-heading text-text-primary">{analytics.metrics.totalSchemes}</div>
            <span className="text-[11px] text-text-secondary font-medium mt-0.5 block">Across Bihar Departments</span>
          </div>

          <div className="bg-surface rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-center justify-between text-text-secondary mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{language === 'hi' ? 'पात्रता मूल्यांकन' : 'Eligibility Checks'}</span>
              <CheckSquare className="w-4 h-4 text-brand" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold font-heading text-text-primary">{analytics.metrics.totalEligibilityChecks}</div>
            <span className="text-[11px] text-text-secondary font-medium mt-0.5 block">Deterministic Evaluations</span>
          </div>

          <div className="bg-surface rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-center justify-between text-text-secondary mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">{language === 'hi' ? 'करियर पाथवे' : 'Career Pathways'}</span>
              <Compass className="w-4 h-4 text-brand" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold font-heading text-text-primary">{analytics.metrics.totalCareers}</div>
            <span className="text-[11px] text-text-secondary font-medium mt-0.5 block">BSDM Mapped</span>
          </div>
        </div>
      )}

      {/* Scheme Verification Table */}
      <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <h2 className="text-base font-bold font-heading text-text-primary">
              {language === 'hi' ? 'योजना सत्यापन एवं प्रबंधन' : 'Scheme Verification Workflow'}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {language === 'hi'
                ? 'आधिकारिक स्रोतों से सत्यापित करने के पश्चात स्थिति अपडेट करें।'
                : 'Review and update verification status across departmental schemes.'}
            </p>
          </div>

          <span className="text-xs text-text-secondary font-medium">
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
              className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
            />
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" strokeWidth={1.5} />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer"
          >
            <option value="">All Departments (सभी विभाग)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.code}>{d.name_en}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand cursor-pointer"
          >
            <option value="">All Statuses (सभी स्थितियां)</option>
            <option value="ACTIVE">ACTIVE (सक्रिय)</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW (समीक्षाधीन)</option>
          </select>
        </div>

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-background text-text-secondary uppercase font-semibold border-b border-border">
              <tr>
                <th className="py-2.5 px-3">योजना (Scheme)</th>
                <th className="py-2.5 px-3">विभाग (Department)</th>
                <th className="py-2.5 px-3">स्थिति (Status)</th>
                <th className="py-2.5 px-3">सत्यापन तिथि</th>
                <th className="py-2.5 px-3 text-right">कार्रवाई (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {filteredSchemes.map((s) => (
                <tr key={s.id} className="hover:bg-background/60 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-text-primary max-w-xs truncate">
                    {s.title_hi || s.title_en}
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary">
                    {s.department?.name_hi || s.department?.name_en || s.departmentId}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                      s.status === 'ACTIVE'
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary">
                    {s.last_verified_date}
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleVerify(s.id, s.status === 'ACTIVE' ? 'UNDER_REVIEW' : 'ACTIVE')}
                      className="px-2.5 py-1 bg-surface hover:bg-background border border-border text-brand rounded-md text-xs font-medium transition-colors cursor-pointer"
                    >
                      {s.status === 'ACTIVE' ? 'Set Review' : 'Set Active'}
                    </button>
                    <a
                      href={s.official_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-text-secondary hover:text-text-primary inline-block"
                      title="Open Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5 inline" strokeWidth={1.5} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-surface rounded-xl border border-border shadow-card p-6 space-y-4">
        <h2 className="text-base font-bold font-heading text-text-primary flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand" strokeWidth={1.5} />
          <span>{language === 'hi' ? 'सुरक्षा ऑडिट लॉग' : 'Security Audit Logs'}</span>
        </h2>
        <p className="text-xs text-text-secondary">
          {language === 'hi'
            ? 'प्रशासनिक क्रियाओं और स्थिति परिवर्तनों का अपरिवर्तनीय ऑडिट रिकॉर्ड।'
            : 'Immutable logging stream recording all admin actions and scheme verification events.'}
        </p>

        <div className="space-y-2 pt-1">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-lg bg-background border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-brand/10 text-brand border border-brand/20 font-medium text-[10px]">
                  {log.action}
                </span>
                <span className="font-medium text-text-primary">
                  {log.entityName} ID: {log.entityId}
                </span>
              </div>
              <span className="text-text-secondary text-[11px]">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
