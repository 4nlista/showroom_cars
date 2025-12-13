import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { getDashboardStats } from '../../services/dashboard';
import { getCars } from '../../services/carsApi';
import { getCategory } from '../../services/categoryApi';
import { Bar, Pie } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const cardStyle = {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: '24px 32px',
    minWidth: 220,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCars: 0,
        totalCategories: 0,
        totalPosts: 0,
        totalRevenue: 0,
        monthlyRevenue: {},
        userRoleStats: { adminCount: 0, userCount: 0, total: 0 },
        topCars: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [carCategoryData, setCarCategoryData] = useState({ labels: [], data: [] });

    useEffect(() => {
        getDashboardStats()
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải dữ liệu thống kê');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        // Lấy dữ liệu xe theo danh mục để vẽ biểu đồ
        Promise.all([getCars(), getCategory()]).then(([cars, categories]) => {
            const labels = categories.map(c => c.name);
            const data = categories.map(c => cars.filter(car => car.category_id === c.id).length);
            setCarCategoryData({ labels, data });
        });
    }, []);

    return (
        <AdminLayout>
            <div style={{ padding: '0 24px' }}>
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8 }}>E-commerce Dashboard</h2>
                    <span style={{ color: '#888' }}>Thống kê tổng quan hệ thống</span>
                </div>
                {loading ? (
                    <div>Đang tải dữ liệu...</div>
                ) : error ? (
                    <div style={{ color: 'red' }}>{error}</div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                            <div style={{ ...cardStyle, borderTop: '4px solid #ff9800' }}>
                                <span style={{ color: '#ff9800', fontWeight: 700, fontSize: 22 }}>{stats.totalRevenue.toLocaleString('vi-VN')} ₫</span>
                                <span style={{ color: '#888', fontSize: 15 }}>Tổng doanh thu</span>
                            </div>
                            <div style={{ ...cardStyle, borderTop: '4px solid #43a047' }}>
                                <span style={{ color: '#43a047', fontWeight: 700, fontSize: 22 }}>{stats.totalCars}</span>
                                <span style={{ color: '#888', fontSize: 15 }}>Tổng số xe</span>
                            </div>
                            <div style={{ ...cardStyle, borderTop: '4px solid #e53935' }}>
                                <span style={{ color: '#e53935', fontWeight: 700, fontSize: 22 }}>{stats.totalPosts}</span>
                                <span style={{ color: '#888', fontSize: 15 }}>Tổng số bài viết</span>
                            </div>
                            <div style={{ ...cardStyle, borderTop: '4px solid #1976d2' }}>
                                <span style={{ color: '#1976d2', fontWeight: 700, fontSize: 22 }}>{stats.totalUsers}</span>
                                <span style={{ color: '#888', fontSize: 15 }}>Tổng số người dùng</span>
                            </div>
                        </div>

                        {/* Analytics Row: Pie chart left, Top 5 cars right */}
                        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                            <div style={{ flex: 2, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 24, minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <h4 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Tỉ lệ tài khoản</h4>
                                <Pie
                                    data={{
                                        labels: ['Admin', 'User'],
                                        datasets: [
                                            {
                                                data: [stats.userRoleStats.adminCount, stats.userRoleStats.userCount],
                                                backgroundColor: ['#1976d2', '#43a047'],
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: 'bottom' },
                                        },
                                    }}
                                    height={180}
                                />
                                <div style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
                                    Admin: {((stats.userRoleStats.adminCount / (stats.userRoleStats.total || 1)) * 100).toFixed(1)}% &nbsp;|&nbsp; User: {((stats.userRoleStats.userCount / (stats.userRoleStats.total || 1)) * 100).toFixed(1)}%
                                </div>
                            </div>
                            <div style={{ flex: 3, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 24, minHeight: 320 }}>
                                <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Top 5 xe đắt nhất</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f5f5f5' }}>
                                            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#888', fontWeight: 600 }}>Tên xe</th>
                                            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#888', fontWeight: 600 }}>Giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.topCars.map(car => (
                                            <tr key={car.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '8px 12px', fontWeight: 500 }}>{car.name}</td>
                                                <td style={{ padding: '8px 12px', textAlign: 'right', color: '#1976d2', fontWeight: 600 }}>{Number(car.price).toLocaleString('vi-VN')} ₫</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
