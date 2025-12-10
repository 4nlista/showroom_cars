
import React from 'react';
import Sidebar from '../../components/admin/Sidebar';

const AdminLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, padding: '32px' }}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
