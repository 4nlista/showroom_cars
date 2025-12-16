import React, { useState, useEffect } from 'react';
import { Table, Button, Image, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import AdminLayout from '../../layouts/admin/AdminLayout';
import UserDetailModal from './UserDetailModal';
import UserEditModal from './UserEditModal';
import CreateUserModal from './CreateUserModal';
import { updateUser, filterUsers } from '../../services/userService';
import { fetchAllUsers } from '../../services/userApi';

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
            setError(err.message || 'Unable to load user list');
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
            alert('✅ User information updated successfully!');
        } catch (err) {
            console.error('Error updating user:', err);
            // Throw lại error để UserEditModal có thể bắt và hiển thị
            throw err;
        }
    };

    // Xử lý khóa/mở khóa user
    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'inactive' ? 'lock' : 'unlock';

        const confirmAction = window.confirm(
            `⚠️ Are you sure you want to ${action} the account "${user.full_name}"?`
        );

        if (confirmAction) {
            try {
                await updateUser(user.id, { ...user, status: newStatus });
                await loadUsers();
                alert(`✅ Account ${action}ed successfully!`);
            } catch (err) {
                console.error('Error toggling user status:', err);
                alert(`❌ An error occurred while ${action}ing the account`);
            }
        }
    };

    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="mb-4 border-bottom pb-2">
                    <h2 className="fw-bold mb-1">
                        <i className="bi bi-people-fill me-2"></i>
                        User Management
                    </h2>
                    <div className="text-muted">Manage user information in the system</div>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                <Form className="mb-3">
                    <div className="row g-2 align-items-center">
                        <div className="col-auto" style={{ minWidth: 320 }}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <i className="bi bi-search"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by name, username, email, phone..."
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
                        </div>
                        <div className="col-auto">
                            <Form.Select
                                value={roleFilter}
                                onChange={handleRoleFilterChange}
                                style={{ minWidth: 160 }}
                            >
                                <option value="all">All roles</option>
                                <option value="1">Admin</option>
                                <option value="2">User</option>
                            </Form.Select>
                        </div>
                        <div className="col ms-auto text-end">
                            <Button
                                variant="primary"
                                onClick={handleCreateUser}
                            >
                                <i className="bi bi-person-plus-fill me-2"></i>
                                Add User
                            </Button>
                        </div>
                    </div>
                </Form>

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <Table bordered hover style={{ fontSize: 14 }}>
                            <thead className="table-light">
                                <tr>
                                    <th style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px', height: 26 }}>No.</th>
                                    <th style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px', height: 26 }}>Avatar</th>
                                    <th style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px', height: 26 }}>Name</th>
                                    <th style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px', height: 26 }}>Phone</th>
                                    <th style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px', height: 26 }}>Email</th>
                                    <th style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px', height: 26 }}>Role</th>
                                    <th style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px', height: 26 }}>Status</th>
                                    <th style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px', height: 26 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ padding: '18px 6px', textAlign: 'left', verticalAlign: 'middle', color: '#888' }}>
                                            <div>
                                                <i className="bi bi-inbox" style={{ fontSize: 28, opacity: 0.5 }}></i>
                                                <span className="ms-2 fw-bold">No data found</span>
                                                {searchTerm && (
                                                    <span className="ms-2 small">No results for keyword "{searchTerm}"</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, index) => (
                                        <tr key={user.id} style={{ height: 26 }}>
                                            <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px' }}>{index + 1}</td>
                                            <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px', borderRadius: '0%!important' }}>
                                                <Image
                                                    src={user.avatar || 'https://via.placeholder.com/50'}
                                                    alt={user.full_name}
                                                    style={{ width: 40, height: 30, objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px' }}>{user.full_name}</td>
                                            <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px' }}>{user.phone}</td>
                                            <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px' }}>{user.email}</td>
                                            <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px' }}>{getRoleName(user.role_id)}</td>
                                            <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px' }}>
                                                <span className={`badge px-2 py-1 fw-semibold ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}>{user.status === 'active' ? 'Active' : 'Locked'}</span>
                                            </td>
                                            <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '8px 6px' }}>
                                                <Button
                                                    size="sm"
                                                    variant="info"
                                                    className="me-1"
                                                    onClick={() => handleViewDetail(user)}
                                                    title="View details"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="warning"
                                                    className="me-1"
                                                    onClick={() => handleEdit(user)}
                                                    title="Edit"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={user.status === 'active' ? 'danger' : 'success'}
                                                    onClick={() => handleToggleStatus(user)}
                                                    title={user.status === 'active' ? 'Lock account' : 'Unlock account'}
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
                            <div className="d-flex justify-content-end mt-2">
                                <span className="text-muted">
                                    Showing {filteredUsers.length} / {users.length} users
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <UserDetailModal
                    show={showDetailModal}
                    onHide={() => setShowDetailModal(false)}
                    user={selectedUser}
                />
                <UserEditModal
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    user={selectedUser}
                    onUpdate={handleUpdate}
                />
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
