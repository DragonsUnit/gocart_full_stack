'use client'
import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import {
    CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon,
    TrendingUpIcon, TrendingDownIcon, PackageIcon, UsersIcon,
    MapPinIcon, GlobeIcon, ZapIcon, BellIcon, SearchIcon,
    ArrowUpRightIcon, MoreHorizontalIcon, EyeIcon, CheckCircleIcon,
    ClockIcon, TruckIcon, ShoppingBagIcon, BarChart3Icon
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from "recharts"

// ─── Mock chart data (replace with real API data as needed) ───────────────────
const revenueData = [
    { day: 'Mon', revenue: 1200, orders: 8 },
    { day: 'Tue', revenue: 1900, orders: 14 },
    { day: 'Wed', revenue: 1500, orders: 11 },
    { day: 'Thu', revenue: 2800, orders: 19 },
    { day: 'Fri', revenue: 2200, orders: 16 },
    { day: 'Sat', revenue: 3400, orders: 24 },
    { day: 'Sun', revenue: 2900, orders: 21 },
]

const categoryData = [
    { name: 'Luggage & Bags', value: 38, color: '#f97316' },
    { name: 'Travel Gear', value: 27, color: '#3b82f6' },
    { name: 'Accessories', value: 20, color: '#8b5cf6' },
    { name: 'Clothing', value: 15, color: '#10b981' },
]

const conversionSteps = [
    { label: 'Product Views', value: 25000, color: '#f97316' },
    { label: 'Add to Cart', value: 12000, color: '#fb923c' },
    { label: 'Checkout', value: 8500, color: '#fdba74' },
    { label: 'Purchased', value: 6200, color: '#fed7aa' },
]

const STATUS_MAP = {
    ORDER_PLACED: { label: 'Placed', color: 'bg-blue-100 text-blue-700' },
    PROCESSING: { label: 'Processing', color: 'bg-amber-100 text-amber-700' },
    SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-700' },
    DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const KpiCard = ({ title, value, icon: Icon, change, changeLabel, accent }) => {
    const isPositive = change >= 0
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
                <div className={`p-2 rounded-xl ${accent}`}>
                    <Icon size={16} className="text-white" />
                </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <div className="flex items-center gap-1.5 text-xs">
                {isPositive
                    ? <TrendingUpIcon size={13} className="text-emerald-500" />
                    : <TrendingDownIcon size={13} className="text-red-400" />
                }
                <span className={isPositive ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
                    {isPositive ? '+' : ''}{change}%
                </span>
                <span className="text-slate-400">{changeLabel}</span>
            </div>
        </div>
    )
}

const SectionHeader = ({ title, subtitle, action }) => (
    <div className="flex items-center justify-between mb-4">
        <div>
            <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && (
            <button className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
                {action} <ArrowUpRightIcon size={11} />
            </button>
        )}
    </div>
)

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
    const { getToken } = useAuth()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
    })
    const [recentOrders, setRecentOrders] = useState([])

    const fetchDashboardData = async () => {
        try {
            const token = await getToken()
            const [dashRes, ordersRes] = await Promise.all([
                axios.get('/api/store/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/store/orders', { headers: { Authorization: `Bearer ${token}` } }),
            ])
            setDashboardData(dashRes.data.dashboardData)
            setRecentOrders((ordersRes.data.orders || []).slice(0, 5))
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    useEffect(() => { fetchDashboardData() }, [])

    if (loading) return <Loading />

    const avgRating = dashboardData.ratings.length
        ? (dashboardData.ratings.reduce((a, r) => a + r.rating, 0) / dashboardData.ratings.length).toFixed(1)
        : '—'

    const kpiCards = [
        {
            title: 'Total Revenue', value: `${currency}${dashboardData.totalEarnings.toLocaleString()}`,
            icon: CircleDollarSignIcon, change: 12.4, changeLabel: 'vs last week', accent: 'bg-orange-500'
        },
        {
            title: 'Total Orders', value: dashboardData.totalOrders.toLocaleString(),
            icon: ShoppingBasketIcon, change: 8.1, changeLabel: 'vs last week', accent: 'bg-blue-500'
        },
        {
            title: 'Products Listed', value: dashboardData.totalProducts,
            icon: TagsIcon, change: 3.2, changeLabel: 'this month', accent: 'bg-violet-500'
        },
        {
            title: 'Avg. Rating', value: avgRating,
            icon: StarIcon, change: 0.3, changeLabel: 'vs last month', accent: 'bg-emerald-500'
        },
    ]

    return (
        <div className="text-slate-600 pb-16 space-y-6">

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <GlobeIcon size={20} className="text-orange-500" />
                        Seller Dashboard
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">Welcome back! Here's what's happening with your travel store.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-500 shadow-sm">
                        <SearchIcon size={14} />
                        <input className="outline-none bg-transparent w-36 placeholder-slate-400 text-xs" placeholder="Search orders, products..." />
                    </div>
                    <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition">
                        <BellIcon size={16} className="text-slate-500" />
                        <span className="absolute top-1.5 right-1.5 size-1.5 bg-orange-500 rounded-full" />
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {kpiCards.map((card, i) => <KpiCard key={i} {...card} />)}
            </div>

            {/* ── Revenue Chart + Category Breakdown ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* Revenue Area Chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <SectionHeader title="Revenue Analytics" subtitle="Last 7 days performance" action="See All" />
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                                formatter={(val, name) => [name === 'revenue' ? `${currency}${val}` : val, name === 'revenue' ? 'Revenue' : 'Orders']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
                            <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} fill="url(#ordGrad)" dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-5 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-orange-500 inline-block" />Revenue</span>
                        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-500 inline-block" />Orders</span>
                    </div>
                </div>

                {/* Top Categories Donut */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <SectionHeader title="Top Categories" action="See All" />
                    <div className="flex justify-center">
                        <PieChart width={140} height={140}>
                            <Pie data={categoryData} cx={65} cy={65} innerRadius={42} outerRadius={65} dataKey="value" paddingAngle={3}>
                                {categoryData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: '10px', fontSize: 11 }} />
                        </PieChart>
                    </div>
                    <div className="space-y-2 mt-2">
                        {categoryData.map((cat, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full inline-block" style={{ backgroundColor: cat.color }} />
                                    <span className="text-slate-600">{cat.name}</span>
                                </div>
                                <span className="font-semibold text-slate-700">{cat.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Conversion Funnel + Recent Orders ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* Conversion Funnel */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <SectionHeader title="Conversion Rate" subtitle="This week" />
                    <div className="space-y-3 mt-2">
                        {conversionSteps.map((step, i) => {
                            const pct = Math.round((step.value / conversionSteps[0].value) * 100)
                            return (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">{step.label}</span>
                                        <span className="font-semibold text-slate-700">{step.value.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%`, backgroundColor: step.color }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Weekly bar chart */}
                    <div className="mt-5">
                        <p className="text-xs text-slate-400 mb-2">Daily Orders (This Week)</p>
                        <ResponsiveContainer width="100%" height={80}>
                            <BarChart data={revenueData} barSize={10}>
                                <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
                                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: 11 }} formatter={(v) => [v, 'Orders']} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <SectionHeader title="Recent Orders" subtitle={`${recentOrders.length} latest orders`} action="View All" />
                    {recentOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                            <ShoppingBagIcon size={36} />
                            <p className="text-sm mt-2">No orders yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-slate-400 border-b border-slate-100">
                                        {['#', 'Customer', 'Product', 'Total', 'Status', 'Date'].map(h => (
                                            <th key={h} className="text-left pb-3 font-medium pr-3">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentOrders.map((order, i) => {
                                        const st = STATUS_MAP[order.status] || { label: order.status, color: 'bg-slate-100 text-slate-600' }
                                        const firstItem = order.orderItems?.[0]
                                        return (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-orange-50/40 transition-colors cursor-pointer"
                                                onClick={() => router.push('/store/orders')}
                                            >
                                                <td className="py-3 pr-3 text-orange-500 font-semibold">#{String(i + 1).padStart(5, '0')}</td>
                                                <td className="py-3 pr-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                                            {order.user?.name?.[0] || '?'}
                                                        </div>
                                                        <span className="text-slate-700 font-medium truncate max-w-[80px]">{order.user?.name || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 pr-3">
                                                    <div className="flex items-center gap-2">
                                                        {firstItem?.product?.images?.[0] && (
                                                            <Image src={firstItem.product.images[0]} alt="" width={28} height={28} className="rounded-lg object-contain bg-slate-50 size-7" />
                                                        )}
                                                        <span className="text-slate-600 truncate max-w-[90px]">{firstItem?.product?.name || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 pr-3 font-semibold text-slate-800">{currency}{order.total}</td>
                                                <td className="py-3 pr-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${st.color}`}>{st.label}</span>
                                                </td>
                                                <td className="py-3 text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <button
                        onClick={() => router.push('/store/orders')}
                        className="mt-4 w-full text-xs text-center text-orange-500 hover:text-orange-600 font-medium py-2 border border-orange-100 rounded-xl hover:bg-orange-50 transition"
                    >
                        View All Orders →
                    </button>
                </div>
            </div>

            {/* ── Top Rated Products + Recent Reviews ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <SectionHeader title="Quick Actions" subtitle="Manage your travel store" />
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Add Product', icon: ZapIcon, href: '/store/add-product', color: 'bg-orange-500' },
                            { label: 'Manage Products', icon: PackageIcon, href: '/store/manage-product', color: 'bg-blue-500' },
                            { label: 'View Orders', icon: ShoppingBagIcon, href: '/store/orders', color: 'bg-violet-500' },
                            { label: 'View Store', icon: GlobeIcon, href: '/shop', color: 'bg-emerald-500' },
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={() => router.push(action.href)}
                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition group text-left"
                            >
                                <div className={`p-2 rounded-lg ${action.color}`}>
                                    <action.icon size={14} className="text-white" />
                                </div>
                                <span className="text-xs font-medium text-slate-700 group-hover:text-orange-600 transition">{action.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Travel Store Tip */}
                    <div className="mt-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <MapPinIcon size={18} className="text-orange-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-orange-700">Travel Seller Tip 🌍</p>
                                <p className="text-xs text-orange-600 mt-1 leading-relaxed">
                                    Add destination tags to your products to help travelers find exactly what they need for their next adventure!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <SectionHeader title="Recent Reviews" subtitle={`${dashboardData.ratings.length} total reviews`} action="See All" />
                    {dashboardData.ratings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                            <StarIcon size={36} />
                            <p className="text-sm mt-2">No reviews yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                            {dashboardData.ratings.slice(0, 5).map((review, i) => (
                                <div key={i} className="flex gap-3 pb-4 border-b border-slate-50 last:border-0">
                                    <Image
                                        src={review.user.image}
                                        alt=""
                                        width={36}
                                        height={36}
                                        className="size-9 rounded-full object-cover shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-semibold text-slate-700 truncate">{review.user.name}</p>
                                            <div className="flex shrink-0">
                                                {Array(5).fill('').map((_, idx) => (
                                                    <StarIcon key={idx} size={10} className="text-transparent" fill={review.rating >= idx + 1 ? '#f97316' : '#e2e8f0'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{review.product?.name}</p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{review.review}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}