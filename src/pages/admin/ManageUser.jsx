import React, { useState, useEffect } from 'react';
import { Table, Button, Image, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import AdminLayout from '../../layouts/admin/AdminLayout';
import UserDetailModal from './UserDetailModal';
import UserEditModal from './UserEditModal';
import CreateUserModal from './CreateUserModal';
import { fetchAllUsers } from '../../services/userApi';
import { updateUser, deleteUser, filterUsers } from '../../services/userService';
import './ManageUser.css';

const ManageUser = () => {
    // State quản lý danh sách users
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all'); // all, 1 (admin), 2 (user)

    // State quản lý modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Hàm lấy tên vai trò
    const getRoleName = (roleId) => {
        return roleId === 1 ? 'Admin' : 'User';
    };

    // Load danh sách users khi component mount
    useEffect(() => {
        loadUsers();
    }, []);

    // Lọc users khi searchTerm hoặc roleFilter thay đổi
    useEffect(() => {
        let filtered = filterUsers(users, searchTerm);

        // Lọc theo role nếu không phải 'all'
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role_id === parseInt(roleFilter));
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, roleFilter]);

    // Hàm lấy danh sách users từ API
    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await fetchAllUsers();
            setUsers(data);
            setFilteredUsers(data);
            setError('');
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách người dùng');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thay đổi từ khóa tìm kiếm
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Xử lý thay đổi lọc vai trò
    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
    };

    // Mở modal tạo người dùng mới
    const handleCreateUser = () => {
        setShowCreateModal(true);
    };

    // Xử lý sau khi tạo user thành công
    const handleUserCreated = async () => {
        await loadUsers();
    };

    // Mở modal xem chi tiết
    const handleViewDetail = (user) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };

    // Mở modal chỉnh sửa
    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    // Xử lý cập nhật user
    const handleUpdate = async (userId, userData) => {
        try {
            await updateUser(userId, userData);
            await loadUsers();
            setShowEditModal(false);
            alert('✅ Cập nhật thông tin thành công!');
        } catch (err) {
            console.error('Error updating user:', err);
            // Throw lại error để UserEditModal có thể bắt và hiển thị
            throw err;
        }
    };

    // Xử lý khóa/mở khóa user
    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'inactive' ? 'khóa' : 'mở khóa';

        const confirmAction = window.confirm(
            `⚠️ Bạn có chắc chắn muốn ${action} tài khoản "${user.full_name}"?`
        );

        if (confirmAction) {
            try {
                await updateUser(user.id, { ...user, status: newStatus });
                await loadUsers();
                alert(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản thành công!`);
            } catch (err) {
                console.error('Error toggling user status:', err);
                alert(`❌ Có lỗi xảy ra khi ${action} tài khoản`);
            }
        }
    };

    return (
        <AdminLayout>
            <div className="manage-user-container">
                {/* Header */}
                <div className="page-header">
                    <h2>
                        <i className="bi bi-people-fill me-3"></i>
                        Quản lý người dùng
                    </h2>
                    <p>Quản lý thông tin người dùng trong hệ thống</p>
                </div>

                {/* Hiển thị lỗi nếu có */}
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                {/* Filter Section: search + role filter + add user button trên cùng 1 hàng */}
                <Form className="mb-3">
                    <div className="d-flex gap-3 align-items-center flex-wrap">
                        <InputGroup style={{ maxWidth: 350 }}>
                            <InputGroup.Text>
                                <i className="bi bi-search"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm theo tên, username, email, số điện thoại..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            {searchTerm && (
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </Button>
                            )}
                        </InputGroup>
                        <Form.Select
                            value={roleFilter}
                            onChange={handleRoleFilterChange}
                            style={{ minWidth: 180, maxWidth: 220 }}
                        >
                            <option value="all">Tất cả vai trò</option>
                            <option value="1">Admin</option>
                            <option value="2">User</option>
                        </Form.Select>
                        <Button
                            variant="primary"
                            onClick={handleCreateUser}
                            className="btn-create-user ms-auto"
                        >
                            <i className="bi bi-person-plus-fill me-2"></i>
                            Thêm người dùng
                        </Button>
                    </div>
                </Form>

                {/* Hiển thị loading spinner */}
                {loading ? (
                    <div className="loading-container">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Đang tải...</span>
                        </Spinner>
                    </div>
                ) : (
                    <div className="user-table-container">
                        <Table className="user-table" bordered hover>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Avatar</th>
                                    <th>Tên</th>
                                    <th>Điện thoại</th>
                                    <th>Email</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8">
                                            <div className="no-data-container">
                                                <i className="bi bi-inbox"></i>
                                                <h5>Không tìm thấy dữ liệu</h5>
                                                {searchTerm && (
                                                    <p className="text-muted">
                                                        Không có kết quả nào cho từ khóa "{searchTerm}"
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Image
                                                    src={user.avatar || 'https://via.placeholder.com/50'}
                                                    alt={user.full_name}
                                                    className="user-avatar"
                                                />
                                            </td>
                                            <td className="text-start">
                                                {user.full_name}
                                            </td>
                                            <td>{user.phone}</td>
                                            <td className="text-start">{user.email}</td>
                                            <td className="text-start">{getRoleName(user.role_id)}</td>
                                            <td>
                                                <span className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                                    {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                                                </span>
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    className="action-btn btn-view"
                                                    onClick={() => handleViewDetail(user)}
                                                    title="Xem chi tiết"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="action-btn btn-edit"
                                                    onClick={() => handleEdit(user)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className={`action-btn ${user.status === 'active' ? 'btn-lock' : 'btn-unlock'}`}
                                                    onClick={() => handleToggleStatus(user)}
                                                    title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                                >
                                                    <i className={`bi ${user.status === 'active' ? 'bi-lock-fill' : 'bi-unlock-fill'}`}></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                        {filteredUsers.length > 0 && (
                            <div className="pagination-info">
                                <span className="text-muted">
                                    Hiển thị {filteredUsers.length} / {users.length} người dùng
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal xem chi tiết */}
                <UserDetailModal
                    show={showDetailModal}
                    onHide={() => setShowDetailModal(false)}
                    user={selectedUser}
                />

                {/* Modal chỉnh sửa */}
                <UserEditModal
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    user={selectedUser}
                    onUpdate={handleUpdate}
                />

                {/* Modal tạo người dùng mới */}
                <CreateUserModal
                    show={showCreateModal}
                    onHide={() => setShowCreateModal(false)}
                    onUserCreated={handleUserCreated}
                />
            </div>
        </AdminLayout>
    );
};

export default ManageUser;
