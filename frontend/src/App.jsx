import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart,
  Line,
  Treemap,
} from 'recharts';
import {
  Home,
  Users,
  CreditCard,
  PieChart as PieIcon,
  TrendingUp,
  Cpu,
  AlertTriangle,
  FileText,
  Settings2,
  Search,
  Bell,
  SunMoon,
  UserCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Award,
  Building2,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5000/api';
const COLOR_PALETTE = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#7C3AED'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function AnimatedCounter({ value, prefix = '', suffix = '', className = '', duration = 900 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      setDisplayValue(0);
      return;
    }

    let animationFrame = 0;
    const startValue = 0;
    const endValue = value;
    const startTime = performance.now();

    const update = (currentTime) => {
      const progress = Math.min(1, (currentTime - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + (endValue - startValue) * eased));
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(update);
      }
    };

    animationFrame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(displayValue);

  return <span className={className}>{`${prefix}${formatted}${suffix}`}</span>;
}

const siderItems = [
  { key: 'dashboard', label: 'Executive Dashboard', path: '/', icon: Home },
  { key: 'customers', label: 'Customer Analytics', path: '/customers', icon: Users },
  { key: 'loans', label: 'Loan Analytics', path: '/loans', icon: CreditCard },
  { key: 'segmentation', label: 'Customer Segmentation', path: '/segmentation', icon: PieIcon },
  { key: 'forecast', label: 'Financial Forecast', path: '/forecast', icon: TrendingUp },
  { key: 'predictions', label: 'AI Predictions', path: '/predictions', icon: Cpu },
  { key: 'risk', label: 'Risk Analytics', path: '/risk', icon: AlertTriangle },
  { key: 'reports', label: 'Reports', path: '/reports', icon: FileText },
  { key: 'settings', label: 'Settings', path: '/settings', icon: Settings2 },
];

const defaultData = {
  customers: [
    { id: 'CUST-1001', name: 'Ava Morgan', region: 'New York', branch: 'Midtown', customerType: 'Premium', gender: 'Female', ageGroup: '26-35', age: 32, creditScore: 782, creditScoreRange: '740-799', loanStatus: 'Approved', loanType: 'Mortgage', year: 2024, month: 'Jan', satisfaction: 92, accountStatus: 'Active' },
    { id: 'CUST-1002', name: 'Noah Patel', region: 'Chicago', branch: 'Lincoln Park', customerType: 'Retail', gender: 'Male', ageGroup: '36-45', age: 41, creditScore: 715, creditScoreRange: '670-739', loanStatus: 'Approved', loanType: 'Auto', year: 2024, month: 'Feb', satisfaction: 86, accountStatus: 'Active' },
    { id: 'CUST-1003', name: 'Mia Chen', region: 'San Francisco', branch: 'Downtown SF', customerType: 'Wealth', gender: 'Female', ageGroup: '26-35', age: 29, creditScore: 803, creditScoreRange: '800+', loanStatus: 'Pending', loanType: 'Personal', year: 2024, month: 'Mar', satisfaction: 78, accountStatus: 'Active' },
    { id: 'CUST-1004', name: 'Liam Smith', region: 'Dallas', branch: 'Uptown', customerType: 'SMB', gender: 'Male', ageGroup: '46-55', age: 50, creditScore: 698, creditScoreRange: '670-739', loanStatus: 'Rejected', loanType: 'Business', year: 2024, month: 'Apr', satisfaction: 63, accountStatus: 'Active' },
    { id: 'CUST-1005', name: 'Emma Johnson', region: 'Miami', branch: 'Brickell', customerType: 'Retail', gender: 'Female', ageGroup: '18-25', age: 24, creditScore: 745, creditScoreRange: '740-799', loanStatus: 'Approved', loanType: 'Credit Card', year: 2024, month: 'May', satisfaction: 91, accountStatus: 'Active' },
    { id: 'CUST-1006', name: 'Lucas Carter', region: 'Houston', branch: 'River Oaks', customerType: 'Premium', gender: 'Male', ageGroup: '36-45', age: 38, creditScore: 770, creditScoreRange: '740-799', loanStatus: 'Pending', loanType: 'Home Equity', year: 2024, month: 'Jun', satisfaction: 88, accountStatus: 'Active' },
    { id: 'CUST-1007', name: 'Zoe Brooks', region: 'New York', branch: 'Brooklyn', customerType: 'Retail', gender: 'Female', ageGroup: '56+', age: 58, creditScore: 690, creditScoreRange: '670-739', loanStatus: 'Rejected', loanType: 'Personal', year: 2024, month: 'Jul', satisfaction: 55, accountStatus: 'Dormant' },
    { id: 'CUST-1008', name: 'Ethan Davis', region: 'Chicago', branch: 'River North', customerType: 'SMB', gender: 'Male', ageGroup: '26-35', age: 33, creditScore: 733, creditScoreRange: '670-739', loanStatus: 'Approved', loanType: 'Auto', year: 2024, month: 'Aug', satisfaction: 88, accountStatus: 'Active' },
    { id: 'CUST-1009', name: 'Harper Hall', region: 'San Francisco', branch: 'SoMa', customerType: 'Wealth', gender: 'Female', ageGroup: '36-45', age: 44, creditScore: 820, creditScoreRange: '800+', loanStatus: 'Approved', loanType: 'Mortgage', year: 2024, month: 'Sep', satisfaction: 95, accountStatus: 'Active' },
    { id: 'CUST-1010', name: 'Elijah Turner', region: 'Dallas', branch: 'Downtown', customerType: 'Premium', gender: 'Male', ageGroup: '46-55', age: 47, creditScore: 756, creditScoreRange: '740-799', loanStatus: 'Pending', loanType: 'Business', year: 2024, month: 'Oct', satisfaction: 82, accountStatus: 'Active' },
    { id: 'CUST-1011', name: 'Amelia Reed', region: 'Miami', branch: 'Coral Gables', customerType: 'Retail', gender: 'Female', ageGroup: '26-35', age: 30, creditScore: 701, creditScoreRange: '670-739', loanStatus: 'Approved', loanType: 'Auto', year: 2024, month: 'Nov', satisfaction: 90, accountStatus: 'Active' },
    { id: 'CUST-1012', name: 'Mason Lee', region: 'Houston', branch: 'Midtown', customerType: 'SMB', gender: 'Male', ageGroup: '18-25', age: 23, creditScore: 678, creditScoreRange: '580-669', loanStatus: 'Rejected', loanType: 'Credit Card', year: 2024, month: 'Dec', satisfaction: 60, accountStatus: 'Dormant' },
  ],
  loans: [
    { id: 'LOAN-2001', customerId: 'CUST-1001', branch: 'Midtown', region: 'New York', loanType: 'Mortgage', customerType: 'Premium', amount: 280000, status: 'Approved', year: 2024, month: 'Jan', applicationCount: 12, riskScore: 18, loanPurpose: 'Home Purchase' },
    { id: 'LOAN-2002', customerId: 'CUST-1002', branch: 'Lincoln Park', region: 'Chicago', loanType: 'Auto', customerType: 'Retail', amount: 42000, status: 'Approved', year: 2024, month: 'Feb', applicationCount: 8, riskScore: 22, loanPurpose: 'Vehicle Financing' },
    { id: 'LOAN-2003', customerId: 'CUST-1003', branch: 'Downtown SF', region: 'San Francisco', loanType: 'Personal', customerType: 'Wealth', amount: 18000, status: 'Pending', year: 2024, month: 'Mar', applicationCount: 5, riskScore: 15, loanPurpose: 'Debt Consolidation' },
    { id: 'LOAN-2004', customerId: 'CUST-1004', branch: 'Uptown', region: 'Dallas', loanType: 'Business', customerType: 'SMB', amount: 112000, status: 'Rejected', year: 2024, month: 'Apr', applicationCount: 10, riskScore: 44, loanPurpose: 'Working Capital' },
    { id: 'LOAN-2005', customerId: 'CUST-1005', branch: 'Brickell', region: 'Miami', loanType: 'Credit Card', customerType: 'Retail', amount: 26000, status: 'Approved', year: 2024, month: 'May', applicationCount: 14, riskScore: 20, loanPurpose: 'Card Limit Increase' },
    { id: 'LOAN-2006', customerId: 'CUST-1006', branch: 'River Oaks', region: 'Houston', loanType: 'Home Equity', customerType: 'Premium', amount: 94000, status: 'Pending', year: 2024, month: 'Jun', applicationCount: 7, riskScore: 17, loanPurpose: 'Renovation' },
    { id: 'LOAN-2007', customerId: 'CUST-1007', branch: 'Brooklyn', region: 'New York', loanType: 'Personal', customerType: 'Retail', amount: 23000, status: 'Rejected', year: 2024, month: 'Jul', applicationCount: 9, riskScore: 39, loanPurpose: 'Emergency Funding' },
    { id: 'LOAN-2008', customerId: 'CUST-1008', branch: 'River North', region: 'Chicago', loanType: 'Auto', customerType: 'SMB', amount: 51000, status: 'Approved', year: 2024, month: 'Aug', applicationCount: 11, riskScore: 24, loanPurpose: 'Fleet Purchase' },
    { id: 'LOAN-2009', customerId: 'CUST-1009', branch: 'SoMa', region: 'San Francisco', loanType: 'Mortgage', customerType: 'Wealth', amount: 420000, status: 'Approved', year: 2024, month: 'Sep', applicationCount: 18, riskScore: 14, loanPurpose: 'Investment Property' },
    { id: 'LOAN-2010', customerId: 'CUST-1010', branch: 'Downtown', region: 'Dallas', loanType: 'Business', customerType: 'Premium', amount: 150000, status: 'Pending', year: 2024, month: 'Oct', applicationCount: 13, riskScore: 26, loanPurpose: 'Expansion' },
    { id: 'LOAN-2011', customerId: 'CUST-1011', branch: 'Coral Gables', region: 'Miami', loanType: 'Auto', customerType: 'Retail', amount: 26000, status: 'Approved', year: 2024, month: 'Nov', applicationCount: 10, riskScore: 21, loanPurpose: 'Personal Vehicle' },
    { id: 'LOAN-2012', customerId: 'CUST-1012', branch: 'Midtown', region: 'Houston', loanType: 'Credit Card', customerType: 'SMB', amount: 14000, status: 'Rejected', year: 2024, month: 'Dec', applicationCount: 6, riskScore: 48, loanPurpose: 'Business Expenses' },
  ],
  branches: [
    { id: 'BR-301', branch: 'Midtown', region: 'New York', revenue: 3_120_000, loansProcessed: 152, approvalRate: 81 },
    { id: 'BR-302', branch: 'Lincoln Park', region: 'Chicago', revenue: 2_450_000, loansProcessed: 126, approvalRate: 78 },
    { id: 'BR-303', branch: 'Downtown SF', region: 'San Francisco', revenue: 4_200_000, loansProcessed: 178, approvalRate: 86 },
    { id: 'BR-304', branch: 'Uptown', region: 'Dallas', revenue: 1_780_000, loansProcessed: 98, approvalRate: 72 },
    { id: 'BR-305', branch: 'Brickell', region: 'Miami', revenue: 2_050_000, loansProcessed: 112, approvalRate: 79 },
  ],
  predictions: [
    { id: 'PRED-4101', model: 'Loan Approval', value: '89%', confidence: 'High', date: '2024-07-08' },
    { id: 'PRED-4102', model: 'Default Risk', value: '4.6%', confidence: 'Medium', date: '2024-07-09' },
    { id: 'PRED-4103', model: 'Cross-sell Success', value: '23%', confidence: 'High', date: '2024-07-10' },
  ],
  alerts: [
    { id: 'AL-5001', title: 'Default risk rose above threshold', type: 'Risk', time: '12 min ago', severity: 'High' },
    { id: 'AL-5002', title: 'New high-value mortgage application', type: 'Opportunity', time: '35 min ago', severity: 'Medium' },
    { id: 'AL-5003', title: 'Regional deposit inflow is strong', type: 'Revenue', time: '1 hr ago', severity: 'Low' },
  ],
};

function getUniqueOptions(data, field) {
  return Array.from(new Set(data.map((item) => item[field]).filter(Boolean))).sort();
}

function filterData(rows, filters) {
  return rows.filter((row) => {
    if (filters.search && ![row.id, row.name, row.branch, row.region, row.loanType, row.customerType, row.gender, row.loanStatus]
      .some((value) => value?.toString().toLowerCase().includes(filters.search.toLowerCase()))) {
      return false;
    }

    if (filters.region && row.region !== filters.region) return false;
    if (filters.branch && row.branch !== filters.branch) return false;
    if (filters.loanType && row.loanType !== filters.loanType) return false;
    if (filters.customerType && row.customerType !== filters.customerType) return false;
    if (filters.gender && row.gender !== filters.gender) return false;
    if (filters.ageGroup && row.ageGroup !== filters.ageGroup) return false;
    if (filters.creditScore && row.creditScoreRange !== filters.creditScore) return false;
    if (filters.loanStatus && row.loanStatus !== filters.loanStatus) return false;
    if (filters.year && row.year !== Number(filters.year)) return false;
    if (filters.month && row.month !== filters.month) return false;
    return true;
  });
}

function packChartData(array, key, labelKey = 'name', valueKey = 'value') {
  return array.map((item) => ({ [labelKey]: item[key], [valueKey]: item[valueKey] }));
}

function normalizeMonths(data, key = 'month', valueKey = 'value') {
  return MONTHS.map((month) => ({
    month,
    value: data.find((entry) => entry.month === month)?.[valueKey] ?? 0,
  }));
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
        <div className="h-10 w-1/4 animate-pulse rounded-2xl bg-slate-800" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-28 rounded-[1.75rem] bg-slate-800/90 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-64 rounded-[1.75rem] bg-slate-800/90 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function DataTable({ title, data, columns, searchText, onSearch, pageSizeOptions = [5, 10, 15] }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [sortKey, setSortKey] = useState(columns[0].accessor);
  const [sortDirection, setSortDirection] = useState('desc');

  const filtered = useMemo(() => {
    const query = searchText?.toLowerCase().trim();
    const rows = data.filter((item) => {
      if (!query) return true;
      return columns.some((col) => item[col.accessor]?.toString().toLowerCase().includes(query));
    });
    return rows;
  }, [data, searchText, columns]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue === bValue) return 0;
      if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }, [filtered, sortKey, sortDirection]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchText, pageSize, data]);

  function toggleSort(accessor) {
    if (sortKey === accessor) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(accessor);
      setSortDirection('desc');
    }
  }

  function exportCsv() {
    const csvHeaders = columns.map((col) => col.header).join(',');
    const csvRows = sorted.map((row) => columns.map((col) => `"${row[col.accessor] ?? ''}"`).join(','));
    const csv = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${title.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm text-slate-400">{columns.length} columns · {filtered.length} records</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-700">
            <DownloadCloud size={16} /> Export CSV
          </button>
          <input
            type="search"
            value={searchText}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search table"
            className="rounded-full border border-slate-800 bg-slate-950/90 py-2 px-4 text-sm text-slate-100 outline-none transition focus:border-sky-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/90">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-slate-900/95 text-slate-400 shadow-inner">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  onClick={() => column.sortable !== false && toggleSort(column.accessor)}
                  className="cursor-pointer px-4 py-4 font-medium uppercase tracking-[0.18em] text-slate-500"
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {sortKey === column.accessor && (
                      <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {paged.map((row) => (
              <tr key={row.id} className="hover:bg-slate-900/80 transition-colors">
                {columns.map((column) => (
                  <td key={column.accessor} className="px-4 py-4 align-top">
                    {column.cell ? column.cell(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-full border border-slate-800 bg-slate-950/90 px-3 py-1 text-sm text-slate-100 outline-none"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-300">
          <button onClick={() => setPage(Math.max(1, page - 1))} className="rounded-full bg-slate-800 px-3 py-2 hover:bg-slate-700">
            Prev
          </button>
          <span>{page} / {pages}</span>
          <button onClick={() => setPage(Math.min(pages, page + 1))} className="rounded-full bg-slate-800 px-3 py-2 hover:bg-slate-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function TopFilterBar({ filters, onFilter, options, onReset }) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
      <div className="grid gap-4 lg:grid-cols-5 xl:grid-cols-6">
        {[
          { label: 'Region', key: 'region', options: options.region },
          { label: 'Branch', key: 'branch', options: options.branch },
          { label: 'Loan Type', key: 'loanType', options: options.loanType },
          { label: 'Customer Type', key: 'customerType', options: options.customerType },
          { label: 'Gender', key: 'gender', options: options.gender },
          { label: 'Age Group', key: 'ageGroup', options: options.ageGroup },
          { label: 'Credit Score', key: 'creditScore', options: options.creditScore },
          { label: 'Loan Status', key: 'loanStatus', options: options.loanStatus },
          { label: 'Year', key: 'year', options: options.year },
          { label: 'Month', key: 'month', options: options.month },
        ].map((filter) => (
          <label key={filter.key} className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{filter.label}</span>
            <select
              value={filters[filter.key] ?? ''}
              onChange={(event) => onFilter(filter.key, event.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500"
            >
              <option value="">All</option>
              {filter.options.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-400">All filters update every visualization in real time.</div>
        <button onClick={onReset} className="inline-flex items-center justify-center rounded-full bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">
          Reset filters
        </button>
      </div>
    </div>
  );
}

function TopNavbar({ searchText, onSearch, theme, onToggleTheme }) {
  return (
    <div className="border-b border-slate-800 bg-slate-950/95 px-4 py-4 shadow-sm shadow-slate-950/10 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-800 to-slate-700 text-xl font-semibold text-slate-100 shadow-lg shadow-slate-950/20">
            B
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Banking Analytics Suite</p>
            <h1 className="text-2xl font-semibold text-white">Enterprise Dashboard</h1>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-800 bg-slate-900/90 px-4 py-2 shadow-inner shadow-slate-950/20">
          <Search size={16} className="text-slate-500" />
          <input
            type="search"
            value={searchText}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search customers, loans, branches..."
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/90 p-3 text-slate-300 transition hover:bg-slate-800">
            <Bell size={18} />
          </button>
          <button onClick={onToggleTheme} className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/90 p-3 text-slate-300 transition hover:bg-slate-800">
            <SunMoon size={18} />
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-800">
            <UserCircle size={20} />
            Jordan Lee
          </button>
        </div>
      </div>
    </div>
  );
}

function RightPanel({ summary, topBranch, highRisk, alerts }) {
  return (
    <aside className="hidden w-96 shrink-0 flex-col gap-6 border-l border-slate-800 bg-slate-950/95 px-4 py-6 text-slate-200 xl:flex">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
        <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">Actionable recommendations to maximize approvals and minimize portfolio risk.</p>
        <div className="mt-6 space-y-4">
          {summary.map((item) => (
            <div key={item.title} className="rounded-3xl bg-slate-950/90 p-4 border border-slate-800">
              <p className="text-sm text-slate-400">{item.title}</p>
              <p className="mt-2 text-lg font-semibold text-white">{item.metric}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
        <h3 className="text-lg font-semibold text-white">Top Performing Branch</h3>
        <p className="mt-3 text-sm text-slate-400">This branch leads the portfolio on revenue and approval quality.</p>
        <div className="mt-6 space-y-3">
          <div className="rounded-3xl bg-slate-950/90 p-4">
            <p className="text-sm text-slate-400">{topBranch.branch}</p>
            <p className="mt-2 text-2xl font-semibold text-white">${topBranch.revenue.toLocaleString()}</p>
            <p className="mt-1 text-sm text-slate-400">Approval rate {topBranch.approvalRate}%</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
        <h3 className="text-lg font-semibold text-white">Highest Revenue Branch</h3>
        <p className="mt-3 text-sm text-slate-400">Revenue leader for the selected filter set.</p>
        <div className="mt-6 flex items-center justify-between gap-3 rounded-3xl bg-slate-950/90 p-4">
          <div>
            <p className="text-sm text-slate-400">{topBranch.branch}</p>
            <p className="mt-2 text-2xl font-semibold text-white">${topBranch.revenue.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-300">{topBranch.region}</div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
        <h3 className="text-lg font-semibold text-white">High Risk Customers</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          {highRisk.map((customer) => (
            <li key={customer.id} className="rounded-3xl bg-slate-950/90 px-4 py-3 border border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white">{customer.name}</span>
                <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-rose-300">Risk {customer.risk}</span>
              </div>
              <p className="mt-2 text-slate-400">{customer.reason}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
        <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{alert.title}</p>
                <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', alert.severity === 'High' ? 'bg-rose-500/15 text-rose-300' : alert.severity === 'Medium' ? 'bg-amber-500/15 text-amber-300' : 'bg-sky-500/15 text-sky-300')}>
                  {alert.severity}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{alert.time}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function KPISection({ kpis }) {
  const kpiCards = [
    { label: 'Total Customers', value: kpis.totalCustomers, accent: 'from-slate-800 to-slate-700', format: 'number' },
    { label: 'Active Customers', value: kpis.activeCustomers, accent: 'from-sky-700 to-slate-800', format: 'number' },
    { label: 'Approved Loans', value: kpis.approvedLoans, accent: 'from-emerald-600 to-slate-800', format: 'number' },
    { label: 'Rejected Loans', value: kpis.rejectedLoans, accent: 'from-rose-600 to-slate-800', format: 'number' },
    { label: 'Total Revenue', value: kpis.totalRevenue, accent: 'from-blue-700 to-slate-800', format: 'currency' },
    { label: 'Avg Loan Amount', value: kpis.avgLoanAmount, accent: 'from-orange-500 to-slate-800', format: 'currency' },
    { label: 'Avg Credit Score', value: kpis.avgCreditScore, accent: 'from-violet-600 to-slate-800', format: 'number' },
    { label: 'Default Rate', value: kpis.defaultRate, accent: 'from-rose-500 to-slate-800', format: 'percent' },
    { label: 'Monthly Growth', value: kpis.monthlyGrowth, accent: 'from-sky-600 to-slate-800', format: 'percent' },
    { label: 'Customer Satisfaction', value: kpis.customerSatisfaction, accent: 'from-emerald-500 to-slate-800', format: 'percent' },
  ];

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {kpiCards.map((card) => (
        <div
          key={card.label}
          className="group relative min-w-0 overflow-hidden rounded-[2rem] border border-slate-800/80 bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#1E293B] p-6 shadow-xl shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <p className="min-w-0 text-sm uppercase tracking-[0.24em] text-slate-500">{card.label}</p>
              <div className={classNames('h-12 w-12 shrink-0 rounded-3xl bg-gradient-to-br', card.accent)} />
            </div>
            <div className="mt-8 flex min-h-[84px] flex-1 items-end overflow-hidden">
              <p className="min-w-0 overflow-hidden break-words text-3xl font-bold leading-none text-white sm:text-2xl md:text-3xl lg:text-4xl">
                {card.format === 'currency' ? (
                  <AnimatedCounter prefix="$" value={card.value} className="whitespace-nowrap" />
                ) : card.format === 'percent' ? (
                  <AnimatedCounter suffix="%" value={card.value} className="whitespace-nowrap" />
                ) : (
                  <AnimatedCounter value={card.value} className="whitespace-nowrap" />
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AISummary({ insight }) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">AI Executive Report</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Automated insights</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">{insight}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-2 text-sm text-slate-300">
          Live analysis · Real-time
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
          <p className="text-sm text-slate-400">Portfolio outlook</p>
          <p className="mt-2 text-lg font-semibold text-white">Stable growth with stronger approvals</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
          <p className="text-sm text-slate-400">Risk posture</p>
          <p className="mt-2 text-lg font-semibold text-white">Balanced exposure across regions</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
          <p className="text-sm text-slate-400">Action priority</p>
          <p className="mt-2 text-lg font-semibold text-white">Expand premium segments and protect margins</p>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ filtered, options, filters, onFilter, onReset, kpis, insight, rightPanelData, customerSegmentation }) {
  const [tableSearch, setTableSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filteredCustomers = useMemo(() => {
    const query = tableSearch.toLowerCase().trim();
    const rows = filtered.customers.filter((customer) => {
      if (!query) return true;
      return [customer.name, customer.id, customer.branch, customer.region, customer.customerType, customer.loanStatus]
        .some((value) => value?.toString().toLowerCase().includes(query));
    });

    return rows.sort((a, b) => a.name.localeCompare(b.name));
  }, [filtered.customers, tableSearch]);

  const pagedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, page]);

  useEffect(() => {
    setPage(1);
  }, [tableSearch]);
  const monthlyRevenueData = useMemo(() => {
    return MONTHS.map((month) => ({
      month,
      revenue: filtered.loans.filter((loan) => loan.month === month).reduce((sum, loan) => sum + loan.amount, 0),
    }));
  }, [filtered.loans]);

  const loanApprovalDonutData = useMemo(() => {
    const approved = filtered.loans.filter((loan) => loan.status === 'Approved').length;
    const pending = filtered.loans.filter((loan) => loan.status === 'Pending').length;
    const rejected = filtered.loans.filter((loan) => loan.status === 'Rejected').length;
    return [
      { name: 'Approved', value: approved },
      { name: 'Pending', value: pending },
      { name: 'Rejected', value: rejected },
    ];
  }, [filtered.loans]);

  const loanStatusStackedData = useMemo(() => {
    return MONTHS.map((month) => {
      const loans = filtered.loans.filter((loan) => loan.month === month);
      return {
        month,
        Approved: loans.filter((loan) => loan.status === 'Approved').length,
        Pending: loans.filter((loan) => loan.status === 'Pending').length,
        Rejected: loans.filter((loan) => loan.status === 'Rejected').length,
      };
    });
  }, [filtered.loans]);

  const segmentationTreemapData = useMemo(() => ({
    name: 'Portfolio',
    children: customerSegmentation.map((segment) => ({ name: segment.name, size: segment.value })),
  }), [customerSegmentation]);

  const loanApprovalTrend = useMemo(() => {
    return MONTHS.map((month) => ({
      month,
      approvals: filtered.loans.filter((loan) => loan.month === month && loan.status === 'Approved').length,
      applications: filtered.loans.filter((loan) => loan.month === month).length,
    }));
  }, [filtered.loans]);

  const loanStatusDistribution = useMemo(() => {
    const statusNames = ['Approved', 'Rejected', 'Pending'];
    return statusNames.map((status) => ({ name: status, value: filtered.loans.filter((loan) => loan.status === status).length }));
  }, [filtered.loans]);

  const branchPerformance = useMemo(() => {
    const branches = Array.from(new Set(filtered.loans.map((loan) => loan.branch))).sort();
    return branches.map((branch) => ({
      branch,
      revenue: filtered.loans.filter((loan) => loan.branch === branch).reduce((sum, loan) => sum + loan.amount, 0),
      approvals: filtered.loans.filter((loan) => loan.branch === branch && loan.status === 'Approved').length,
    }));
  }, [filtered.loans]);

  const loanAmountByBranch = useMemo(() => {
    const branches = Array.from(new Set(filtered.loans.map((loan) => loan.branch))).sort();
    return branches.map((branch) => ({
      branch,
      amount: filtered.loans.filter((loan) => loan.branch === branch).reduce((sum, loan) => sum + loan.amount, 0),
    }));
  }, [filtered.loans]);

  const ageDistribution = useMemo(() => {
    const groups = ['18-25', '26-35', '36-45', '46-55', '56+'];
    return groups.map((group) => ({ name: group, customers: filtered.customers.filter((customer) => customer.ageGroup === group).length }));
  }, [filtered.customers]);

  const creditScoreDistribution = useMemo(() => {
    const ranges = ['300-579', '580-669', '670-739', '740-799', '800+'];
    return ranges.map((range) => ({
      range,
      score: filtered.customers.filter((customer) => customer.creditScoreRange === range).length,
    }));
  }, [filtered.customers]);

  const riskHeatmapData = useMemo(() => {
    const regions = Array.from(new Set(filtered.customers.map((customer) => customer.region))).sort();
    return regions.map((region) => {
      const regionCustomers = filtered.customers.filter((customer) => customer.region === region);
      const riskCount = regionCustomers.filter((customer) => customer.loanStatus === 'Rejected' || customer.satisfaction < 70).length;
      return {
        region,
        total: regionCustomers.length,
        riskCount,
        intensity: regionCustomers.length ? Math.round((riskCount / regionCustomers.length) * 100) : 0,
      };
    });
  }, [filtered.customers]);

  const monthlyApplications = useMemo(() => {
    return MONTHS.map((month) => {
      const applications = filtered.loans.filter((loan) => loan.month === month);
      return {
        month,
        Personal: applications.filter((loan) => loan.loanType === 'Personal').length,
        Auto: applications.filter((loan) => loan.loanType === 'Auto').length,
        Mortgage: applications.filter((loan) => loan.loanType === 'Mortgage').length,
        Business: applications.filter((loan) => loan.loanType === 'Business').length,
      };
    });
  }, [filtered.loans]);

  const genderRatio = useMemo(() => {
    const genders = ['Male', 'Female'];
    return genders.map((gender) => ({ name: gender, value: filtered.customers.filter((customer) => customer.gender === gender).length }));
  }, [filtered.customers]);

  const loanTypeComparison = useMemo(() => {
    const types = ['Personal', 'Auto', 'Mortgage', 'Business'];
    return types.map((type) => ({
      type,
      value: filtered.loans.filter((loan) => loan.loanType === type).length,
    }));
  }, [filtered.loans]);

  const monthlyLoanGrowth = useMemo(() => {
    return MONTHS.map((month, index) => {
      const current = monthlyRevenueData[index]?.revenue ?? 0;
      const previous = index > 0 ? monthlyRevenueData[index - 1]?.revenue ?? 0 : current;
      const growth = previous ? Math.round(((current - previous) / previous) * 100) : 0;
      return { month, growth };
    });
  }, [monthlyRevenueData]);

  const revenueForecast = useMemo(() => {
    return MONTHS.map((month, index) => ({
      month,
      forecast: Math.round(
        filtered.loans.filter((loan) => loan.month === month).reduce((sum, loan) => sum + loan.amount, 0) * (1 + 0.05 * index)
      ),
    }));
  }, [filtered.loans]);

  const segmentationStackedData = useMemo(() => {
    const total = customerSegmentation.reduce((sum, item) => sum + item.value, 0);
    const findValue = (name) => customerSegmentation.find((segment) => segment.name === name)?.value ?? 0;
    return [{
      name: 'Portfolio',
      Retail: total ? Math.round((findValue('Retail') / total) * 100) : 0,
      Premium: total ? Math.round((findValue('Premium') / total) * 100) : 0,
      SMB: total ? Math.round((findValue('SMB') / total) * 100) : 0,
      Wealth: total ? Math.round((findValue('Wealth') / total) * 100) : 0,
    }];
  }, [customerSegmentation]);

  return (
    <div className="space-y-6">
      <TopFilterBar filters={filters} onFilter={onFilter} options={options} onReset={onReset} />

      <div className="grid gap-6 xl:grid-cols-[1.75fr_0.95fr]">
        <div className="space-y-6">
          <KPISection kpis={kpis} />
          <AISummary insight={insight} />

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Revenue Trend</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Line</h3>
                </div>
                <div className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-slate-300">Projected</div>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.75} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #334155' }} formatter={(value) => `$${value.toLocaleString()}`} />
                    <Area type="monotone" dataKey="revenue" stroke="#2563EB" fill="url(#revenueGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Loan Approval</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Donut</h3>
                </div>
                <div className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-slate-300">Portfolio mix</div>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={loanApprovalDonutData} innerRadius={70} outerRadius={110} paddingAngle={6} dataKey="value">
                      {loanApprovalDonutData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #334155' }} />
                    <Legend verticalAlign="bottom" wrapperStyle={{ color: '#cbd5e1' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Branch Performance</p>
                <span className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-slate-300">Bar</span>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchPerformance} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="#334155" vertical={false} />
                    <XAxis dataKey="branch" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #334155' }} formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="#2563EB" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Customer Segmentation</p>
                <span className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-slate-300">Treemap</span>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap data={segmentationTreemapData} dataKey="size" stroke="#0f172a" fill="#2563EB" />
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Loan Status</p>
                <span className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-slate-300">Stacked bar</span>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={loanStatusStackedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #334155' }} />
                    <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                    <Bar dataKey="Approved" stackId="status" fill="#10B981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Pending" stackId="status" fill="#F59E0B" />
                    <Bar dataKey="Rejected" stackId="status" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Credit Score Distribution</p>
                <span className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-slate-300">Histogram</span>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={creditScoreDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke="#334155" vertical={false} />
                    <XAxis dataKey="range" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #334155' }} />
                    <Bar dataKey="score" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Risk Heatmap</p>
                <span className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-slate-300">Exposure</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {Object.values(filtered.customers.reduce((acc, customer) => {
                  const branch = customer.branch;
                  if (!acc[branch]) {
                    acc[branch] = { branch, risk: 0 };
                  }
                  acc[branch].risk += customer.loanStatus === 'Rejected' ? 3 : customer.satisfaction < 70 ? 2 : 1;
                  return acc;
                }, {})).map((item) => (
                  <div key={item.branch} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white">{item.branch}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.risk} pts</span>
                    </div>
                    <div className="mt-3 grid grid-cols-5 gap-1">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className={classNames('h-2 rounded-full', index < item.risk ? 'bg-rose-500/80' : 'bg-slate-800')} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Monthly Applications</p>
                <span className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-slate-300">Area</span>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyApplications} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.75} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #334155' }} />
                    <Area type="monotone" dataKey="Personal" stroke="#10B981" fill="url(#applicationsGradient)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Customer Intelligence</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Premium customer portfolio</h3>
              </div>
              <input
                value={tableSearch}
                onChange={(event) => setTableSearch(event.target.value)}
                placeholder="Search customers"
                className="rounded-full border border-slate-800 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500"
              />
            </div>
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-950/90 text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Branch</th>
                      <th className="px-4 py-3">Segment</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/70">
                    {pagedCustomers.map((customer) => (
                      <tr key={customer.id} className="transition hover:bg-slate-800/70">
                        <td className="px-4 py-3 text-white">{customer.name}</td>
                        <td className="px-4 py-3 text-slate-300">{customer.branch}</td>
                        <td className="px-4 py-3 text-slate-300">{customer.customerType}</td>
                        <td className="px-4 py-3">
                          <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', customer.loanStatus === 'Approved' ? 'bg-emerald-500/15 text-emerald-300' : customer.loanStatus === 'Rejected' ? 'bg-rose-500/15 text-rose-300' : 'bg-amber-500/15 text-amber-300')}>
                            {customer.loanStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">Showing {Math.min(pageSize, filteredCustomers.length)} of {filteredCustomers.length} records</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-full border border-slate-800 bg-slate-950/90 px-3 py-2 text-sm text-slate-300">Prev</button>
                <span className="text-sm text-slate-300">Page {page}</span>
                <button onClick={() => setPage((current) => Math.min(Math.ceil(filteredCustomers.length / pageSize), current + 1))} className="rounded-full border border-slate-800 bg-slate-950/90 px-3 py-2 text-sm text-slate-300">Next</button>
              </div>
            </div>
          </div>
        </div>

        <RightPanel summary={rightPanelData.summary} topBranch={rightPanelData.topBranch} highRisk={rightPanelData.highRisk} alerts={rightPanelData.alerts} />
      </div>
    </div>
  );
}

function CustomerPage({ filtered }) {
  const [searchText, setSearchText] = useState('');
  const columns = [
    { header: 'Customer ID', accessor: 'id' },
    { header: 'Customer', accessor: 'name' },
    { header: 'Region', accessor: 'region' },
    { header: 'Branch', accessor: 'branch' },
    { header: 'Type', accessor: 'customerType' },
    { header: 'Status', accessor: 'loanStatus' },
    { header: 'Credit', accessor: 'creditScore' },
    { header: 'Satisfaction', accessor: 'satisfaction' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Customer Table</h2>
        <p className="mt-3 text-slate-400">Search, sort and export customer records with a premium enterprise table.</p>
      </div>
      <DataTable title="Customer Table" data={filtered.customers} columns={columns} searchText={searchText} onSearch={setSearchText} />
    </div>
  );
}

function LoanPage({ filtered }) {
  const [searchText, setSearchText] = useState('');
  const columns = [
    { header: 'Loan ID', accessor: 'id' },
    { header: 'Customer ID', accessor: 'customerId' },
    { header: 'Branch', accessor: 'branch' },
    { header: 'Type', accessor: 'loanType' },
    { header: 'Amount', accessor: 'amount', cell: (row) => `$${row.amount.toLocaleString()}` },
    { header: 'Status', accessor: 'status' },
    { header: 'Risk', accessor: 'riskScore' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Loan Table</h2>
        <p className="mt-3 text-slate-400">Review loan origination, approvals, and branch-level loan performance.</p>
      </div>
      <DataTable title="Loan Table" data={filtered.loans} columns={columns} searchText={searchText} onSearch={setSearchText} />
    </div>
  );
}

function PredictionPage({ filtered }) {
  const [searchText, setSearchText] = useState('');
  const columns = [
    { header: 'Prediction ID', accessor: 'id' },
    { header: 'Model', accessor: 'model' },
    { header: 'Value', accessor: 'value' },
    { header: 'Confidence', accessor: 'confidence' },
    { header: 'Date', accessor: 'date' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Prediction Table</h2>
        <p className="mt-3 text-slate-400">Keep track of AI model outputs and confidence signals for the portfolio.</p>
      </div>
      <DataTable title="Prediction Table" data={filtered.predictions} columns={columns} searchText={searchText} onSearch={setSearchText} />
    </div>
  );
}

function BranchPage({ filtered }) {
  const [searchText, setSearchText] = useState('');
  const columns = [
    { header: 'Branch ID', accessor: 'id' },
    { header: 'Branch', accessor: 'branch' },
    { header: 'Region', accessor: 'region' },
    { header: 'Revenue', accessor: 'revenue', cell: (row) => `$${row.revenue.toLocaleString()}` },
    { header: 'Loans Processed', accessor: 'loansProcessed' },
    { header: 'Approval Rate', accessor: 'approvalRate', cell: (row) => `${row.approvalRate}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Branch Table</h2>
        <p className="mt-3 text-slate-400">Branch performance metrics support operational review and executive reporting.</p>
      </div>
      <DataTable title="Branch Table" data={filtered.branches} columns={columns} searchText={searchText} onSearch={setSearchText} />
    </div>
  );
}

function ForecastPage({ filtered }) {
  const revenueForecast = useMemo(() => {
    return MONTHS.map((month, index) => ({
      month,
      forecast: Math.round(filtered.loans.filter((loan) => loan.month === month).reduce((sum, loan) => sum + loan.amount, 0) * (1 + 0.05 * index)),
    }));
  }, [filtered.loans]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Financial Forecast</h2>
        <p className="mt-3 text-slate-400">Forecast future revenue and portfolio growth by product and region.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Revenue Forecast</p>
          <div className="mt-6 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueForecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #334155' }} formatter={(value) => `$${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="forecast" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Current growth</p>
            <span className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-slate-300">Forecast</span>
          </div>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-slate-950/90 p-5 border border-slate-800">
              <p className="text-sm text-slate-400">Projected revenue increase</p>
              <p className="mt-2 text-3xl font-semibold text-white">+14.8%</p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-5 border border-slate-800">
              <p className="text-sm text-slate-400">Expected new approvals</p>
              <p className="mt-2 text-3xl font-semibold text-white">1,240</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskPage({ filtered }) {
  const riskCustomers = filtered.customers.filter((customer) => customer.loanStatus === 'Rejected' || customer.satisfaction < 70);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Risk Analytics</h2>
        <p className="mt-3 text-slate-400">Monitor portfolio risk drivers, default exposure, and customer vulnerability.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">High Risk Exposure</p>
          <div className="mt-6">
            <p className="text-4xl font-semibold text-white">{riskCustomers.length}</p>
            <p className="mt-2 text-sm text-slate-400">Customers with elevated risk or poor satisfaction.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Risk Heatmap</p>
          <div className="mt-6 h-72 rounded-[1.75rem] bg-gradient-to-br from-rose-950 via-slate-950 to-slate-900" />
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Settings</h2>
        <p className="mt-3 text-slate-400">Manage dashboard preferences, alerts, and analytics behavior.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
          <h3 className="text-lg font-semibold text-white">Dashboard Mode</h3>
          <p className="mt-3 text-slate-400">Dark mode is optimized for enterprise analytics and long sessions.</p>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
          <h3 className="text-lg font-semibold text-white">Alert Settings</h3>
          <p className="mt-3 text-slate-400">Configure threshold alerts for loans, approvals, and credit risk.</p>
        </div>
      </div>
    </div>
  );
}

function Segmentation({ dashboard }) {
  const segments = dashboard?.customer_segmentation || [];
  const totalValue = segments.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Customer Segmentation</h2>
        <p className="mt-3 text-slate-400">A clear view of how the banking portfolio is distributed across key customer segments.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Segment Mix</p>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segments} dataKey="value" innerRadius={60} outerRadius={110} paddingAngle={4}>
                  {segments.map((entry, index) => (
                    <Cell key={entry.name} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #334155' }} />
                <Legend verticalAlign="bottom" wrapperStyle={{ color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          {segments.map((segment, index) => {
            const share = totalValue ? Math.round((segment.value / totalValue) * 100) : 0;
            return (
              <div key={segment.name} className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{segment.name}</span>
                  <span className="text-sm text-slate-400">{share}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full" style={{ width: `${share}%`, backgroundColor: COLOR_PALETTE[index % COLOR_PALETTE.length] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Reports({ dashboard }) {
  const summaryCards = [
    { label: 'Total Customers', value: dashboard?.total_customers ?? 0 },
    { label: 'Active Customers', value: dashboard?.active_customers ?? 0 },
    { label: 'Average Loan Amount', value: `$${(dashboard?.average_loan_amount ?? 0).toLocaleString()}` },
    { label: 'Default Rate', value: `${dashboard?.default_rate ?? 0}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">Executive Reports</h2>
        <p className="mt-3 text-slate-400">Summaries and portfolio metrics ready for leadership review and board reporting.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [dashboard, setDashboard] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    search: '', region: '', branch: '', loanType: '', customerType: '', gender: '', ageGroup: '', creditScore: '', loanStatus: '', year: '', month: '',
  });
  const [topSearch, setTopSearch] = useState('');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/dashboard`)
      .then((response) => {
        setDashboard((prev) => ({ ...prev, ...response.data }));
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || 'Unable to fetch analytics data.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filterOptions = useMemo(() => ({
    region: getUniqueOptions(dashboard.customers, 'region'),
    branch: getUniqueOptions(dashboard.customers, 'branch'),
    loanType: getUniqueOptions(dashboard.loans, 'loanType'),
    customerType: getUniqueOptions(dashboard.customers, 'customerType'),
    gender: getUniqueOptions(dashboard.customers, 'gender'),
    ageGroup: getUniqueOptions(dashboard.customers, 'ageGroup'),
    creditScore: getUniqueOptions(dashboard.customers, 'creditScoreRange'),
    loanStatus: getUniqueOptions(dashboard.customers, 'loanStatus'),
    year: Array.from(new Set(dashboard.loans.map((item) => item.year))).sort(),
    month: MONTHS,
  }), [dashboard]);

  const effectiveFilters = useMemo(() => ({ ...filters, search: topSearch || filters.search }), [filters, topSearch]);

  const filtered = useMemo(() => ({
    customers: filterData(dashboard.customers, effectiveFilters),
    loans: filterData(dashboard.loans, effectiveFilters),
    branches: dashboard.branches,
    predictions: dashboard.predictions,
  }), [dashboard, effectiveFilters]);

  const customerSegmentation = useMemo(() => {
    const groups = ['Retail', 'Premium', 'SMB', 'Wealth'];
    return groups.map((type) => ({ name: type, value: filtered.customers.filter((customer) => customer.customerType === type).length }));
  }, [filtered.customers]);

  const kpis = useMemo(() => {
    const totalCustomers = filtered.customers.length;
    const activeCustomers = filtered.customers.filter((customer) => customer.accountStatus === 'Active').length;
    const approvedLoans = filtered.loans.filter((loan) => loan.status === 'Approved').length;
    const rejectedLoans = filtered.loans.filter((loan) => loan.status === 'Rejected').length;
    const totalRevenue = filtered.loans.reduce((sum, loan) => sum + loan.amount, 0);
    const avgLoanAmount = filtered.loans.length ? Math.round(totalRevenue / filtered.loans.length) : 0;
    const avgCreditScore = filtered.customers.length ? Math.round(filtered.customers.reduce((sum, customer) => sum + customer.creditScore, 0) / filtered.customers.length) : 0;
    const defaultRate = filtered.loans.length ? Number(((rejectedLoans / filtered.loans.length) * 100).toFixed(1)) : 0;
    const monthlyGrowth = Math.round(((filtered.loans.filter((loan) => loan.month === 'Dec').reduce((sum, loan) => sum + loan.amount, 0) - filtered.loans.filter((loan) => loan.month === 'Nov').reduce((sum, loan) => sum + loan.amount, 0)) / Math.max(1, filtered.loans.filter((loan) => loan.month === 'Nov').reduce((sum, loan) => sum + loan.amount, 0))) * 100);
    const customerSatisfaction = filtered.customers.length ? Math.round(filtered.customers.reduce((sum, customer) => sum + customer.satisfaction, 0) / filtered.customers.length) : 0;
    return { totalCustomers, activeCustomers, approvedLoans, rejectedLoans, totalRevenue, avgLoanAmount, avgCreditScore, defaultRate, monthlyGrowth, customerSatisfaction };
  }, [filtered]);

  const insight = useMemo(() => {
    const approvalsThisMonth = filtered.loans.filter((loan) => loan.month === 'Dec' && loan.status === 'Approved').length;
    const approvalsLastMonth = filtered.loans.filter((loan) => loan.month === 'Nov' && loan.status === 'Approved').length;
    const defaultThisMonth = filtered.loans.filter((loan) => loan.month === 'Dec' && loan.status === 'Rejected').length;
    const defaultLastMonth = filtered.loans.filter((loan) => loan.month === 'Nov' && loan.status === 'Rejected').length;
    const approvalDelta = approvalsLastMonth ? Math.round(((approvalsThisMonth - approvalsLastMonth) / approvalsLastMonth) * 100) : approvalsThisMonth * 5;
    const defaultDelta = defaultLastMonth ? Math.round(((defaultThisMonth - defaultLastMonth) / defaultLastMonth) * 100) : 0;
    return `AI detected that loan approvals ${approvalDelta >= 0 ? 'increased' : 'decreased'} ${Math.abs(approvalDelta)}% this month while the customer default rate ${defaultDelta <= 0 ? 'decreased' : 'increased'} ${Math.abs(defaultDelta)}%.`; 
  }, [filtered.loans]);

  const rightPanelData = useMemo(() => {
    const branchRevenue = filtered.loans.reduce((acc, loan) => {
      acc[loan.branch] = (acc[loan.branch] || 0) + loan.amount; return acc;
    }, {});
    const topBranchKey = Object.keys(branchRevenue).reduce((best, branch) => {
      if (!best || branchRevenue[branch] > branchRevenue[best]) return branch;
      return best;
    }, '');
    const topBranch = filtered.branches.find((branch) => branch.branch === topBranchKey) || { branch: 'Midtown', region: 'New York', revenue: 3120000, approvalRate: 81 };
    const highRisk = filtered.customers.filter((customer) => customer.loanStatus === 'Rejected' || customer.satisfaction < 70).slice(0, 3).map((customer) => ({
      id: customer.id,
      name: customer.name,
      risk: customer.loanStatus === 'Rejected' ? 'High' : 'Medium',
      reason: customer.loanStatus === 'Rejected' ? 'Declined loan outcome' : 'Low satisfaction score',
    }));
    return { summary: [
      { title: 'Approval momentum', metric: `+${kpis.monthlyGrowth}%` },
      { title: 'Expected revenue lift', metric: '+12.5%' },
      { title: 'Portfolio health', metric: `${100 - kpis.defaultRate}%` },
    ], topBranch, highRisk, alerts: dashboard.alerts };
  }, [filtered, dashboard.alerts, kpis.monthlyGrowth]);

  const onFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const onReset = () => {
    setFilters({ search: '', region: '', branch: '', loanType: '', customerType: '', gender: '', ageGroup: '', creditScore: '', loanStatus: '', year: '', month: '' });
    setTopSearch('');
  };

  const pageContent = (
    <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      <div className={classNames('relative flex min-h-screen flex-col border-r border-slate-800 bg-slate-950/95 transition-all duration-300', collapsed ? 'w-24' : 'w-80')}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-700 text-center text-xl font-semibold text-slate-100 shadow-lg shadow-slate-950/20">B</div>
            {!collapsed && (
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Banking</p>
                <p className="text-lg font-semibold text-white">Analytics</p>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed((current) => !current)} className="rounded-full border border-slate-800 bg-slate-900/90 p-2 text-slate-300 hover:bg-slate-800">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-6">
          {siderItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) => classNames('group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition', isActive ? 'bg-slate-800 text-white shadow-inner shadow-slate-900/40' : 'text-slate-400 hover:bg-slate-900/80 hover:text-white')}
            >
              <item.icon size={18} className="text-slate-400 transition group-hover:text-white" />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-hidden">
        <TopNavbar searchText={topSearch} onSearch={setTopSearch} theme={theme} onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
        <main className="flex min-h-[calc(100vh-96px)] flex-col overflow-y-auto px-4 py-6 lg:px-8">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="rounded-[2rem] border border-rose-500 bg-rose-500/10 p-8 text-rose-100 shadow-xl shadow-rose-500/10">
              <h2 className="text-2xl font-semibold">Unable to load dashboard</h2>
              <p className="mt-3 text-slate-200">{error}</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<DashboardPage filtered={filtered} options={filterOptions} filters={filters} onFilter={onFilter} onReset={onReset} kpis={kpis} insight={insight} rightPanelData={rightPanelData} customerSegmentation={customerSegmentation} />} />
              <Route path="/customers" element={<CustomerPage filtered={filtered} />} />
              <Route path="/loans" element={<LoanPage filtered={filtered} />} />
              <Route path="/segmentation" element={<Segmentation {...{ dashboard: { ...dashboard, customer_segmentation: customerSegmentation } }} />} />
              <Route path="/forecast" element={<ForecastPage filtered={filtered} />} />
              <Route path="/predictions" element={<PredictionPage filtered={filtered} />} />
              <Route path="/risk" element={<RiskPage filtered={filtered} />} />
              <Route path="/reports" element={<Reports dashboard={{ ...dashboard, total_customers: kpis.totalCustomers, active_customers: kpis.activeCustomers, average_loan_amount: kpis.avgLoanAmount, default_rate: kpis.defaultRate }} />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );

  return (
    <div className={classNames('min-h-screen overflow-hidden text-slate-100', theme === 'dark' ? 'bg-[#0F172A]' : 'bg-slate-100 text-slate-950')}>
      <BrowserRouter>{pageContent}</BrowserRouter>
    </div>
  );
}

export default App;
