import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
    { label: 'Trang quản trị', path: '/admin/quan-tri' },
    { label: 'Hồ sơ cá nhân', path: '/admin/ho-so-ca-nhan' },
    { label: 'Quản lí người dùng', path: '/admin/quan-ly-nguoi-dung' },
    { label: 'Quản lí mẫu xe', path: '/admin/quan-ly-xe' },
    { label: 'Đổi mật khẩu', path: '/admin/doi-mat-khau' },
    { label: 'Đăng xuất', path: '/dang-xuat' },
];

const Sidebar = () => {
    const location = useLocation();
    return (
        <aside style={{ width: 220, background: '#f5f5f5', padding: '24px 0', minHeight: '100vh', boxShadow: '2px 0 8px #eee' }}>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {menuItems.map(item => (
                        <li key={item.path} style={{ marginBottom: 18 }}>
                            <Link
                                to={item.path}
                                style={{
                                    color: location.pathname === item.path ? '#1976d2' : '#333',
                                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                                    textDecoration: 'none',
                                    padding: '8px 24px',
                                    display: 'block',
                                    borderRadius: 6,
                                    background: location.pathname === item.path ? '#e3f2fd' : 'none',
                                }}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;