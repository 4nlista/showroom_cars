import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { getDashboardStats } from '../../services/dashboard';
import { getCars } from '../../services/carsApi';
import { getCategory } from '../../services/categoryApi';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
                    <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                        <div style={cardStyle}>
                            <span style={{ color: '#888', fontSize: 16 }}>Tổng số người dùng</span>
                            <span style={{ fontWeight: 700, fontSize: 32, color: '#1976d2' }}>{stats.totalUsers}</span>
                        </div>
                        <div style={cardStyle}>
                            <span style={{ color: '#888', fontSize: 16 }}>Tổng số xe</span>
                            <span style={{ fontWeight: 700, fontSize: 32, color: '#43a047' }}>{stats.totalCars}</span>
                        </div>
                        <div style={cardStyle}>
                            <span style={{ color: '#888', fontSize: 16 }}>Tổng số danh mục</span>
                            <span style={{ fontWeight: 700, fontSize: 32, color: '#fbc02d' }}>{stats.totalCategories}</span>
                        </div>
                        <div style={cardStyle}>
                            <span style={{ color: '#888', fontSize: 16 }}>Tổng số bài viết</span>
                            <span style={{ fontWeight: 700, fontSize: 32, color: '#e53935' }}>{stats.totalPosts}</span>
                        </div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 24, marginBottom: 32 }}>
                        <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Biểu đồ số lượng xe theo danh mục</h3>
                        <Bar
                            data={{
                                labels: carCategoryData.labels,
                                datasets: [
                                    {
                                        label: 'Số lượng xe',
                                        data: carCategoryData.data,
                                        backgroundColor: [
                                            '#1976d2', '#43a047', '#fbc02d', '#e53935', '#8e24aa', '#00acc1', '#fb8c00'
                                        ],
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: false },
                                    title: { display: false },
                                },
                                scales: {
                                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                                },
                            }}
                            height={320}
                        />
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default Dashboard;
