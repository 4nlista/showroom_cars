import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Profile', path: '/admin/profile' },
    { label: 'Manage Users', path: '/admin/users' },
    { label: 'Manage Cars', path: '/admin/cars' },
    { label: 'Process Orders', path: '/admin/orders' },
    { label: 'Change Password', path: '/admin/change-password' },
    { label: 'Logout', path: '/' },
];


const Sidebar = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const handleLogout = (e) => {
        e.preventDefault();
        if (logout) logout();
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <aside
            style={{
                width: 220,
                background: '#f5f5f5',
                padding: '24px 0',
                minHeight: '100vh',
                boxShadow: '2px 0 8px #eee',
                position: 'sticky',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 100,
                overflowY: 'auto',
            }}
        >
            <nav>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {menuItems.map(item => (
                        <li key={item.path} style={{ marginBottom: 18 }}>
                            {item.label === 'Logout' ? (
                                <a
                                    href="/"
                                    onClick={handleLogout}
                                    style={{
                                        color: '#d32f2f',
                                        fontWeight: 'bold',
                                        textDecoration: 'none',
                                        padding: '8px 24px',
                                        display: 'block',
                                        borderRadius: 6,
                                        background: location.pathname === item.path ? '#e3f2fd' : 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {item.label}
                                </a>
                            ) : (
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
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;