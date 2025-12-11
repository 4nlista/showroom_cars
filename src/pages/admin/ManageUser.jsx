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

    // State quản lý modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Load danh sách users khi component mount
    useEffect(() => {
        loadUsers();
    }, []);

    // Lọc users khi searchTerm thay đổi
    useEffect(() => {
        const filtered = filterUsers(users, searchTerm);
        setFilteredUsers(filtered);
    }, [users, searchTerm]);

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
            alert('❌ Có lỗi xảy ra khi cập nhật thông tin');
        }
    };

    // Xử lý xóa user
    const handleDelete = async (user) => {
        const confirmDelete = window.confirm(
            `⚠️ Bạn có chắc chắn muốn xóa người dùng "${user.full_name}"?\n\nHành động này không thể hoàn tác!`
        );

        if (confirmDelete) {
            try {
                await deleteUser(user.id);
                await loadUsers();
                alert('✅ Xóa người dùng thành công!');
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('❌ Có lỗi xảy ra khi xóa người dùng');
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

                {/* Filter Section tìm kiếm theo tên */}
                <div className="filter-section-wrapper">
                    <div className="filter-section">
                        <Form>
                            <InputGroup>
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
                        </Form>
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleCreateUser}
                        className="btn-create-user"
                    >
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Thêm người dùng
                    </Button>
                </div>

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
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6">
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
                                                    className="action-btn btn-delete"
                                                    onClick={() => handleDelete(user)}
                                                    title="Xóa"
                                                >
                                                    <i className="bi bi-trash"></i>
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
