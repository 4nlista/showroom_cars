// Modal chỉnh sửa thông tin người dùng (có thể cập nhật thông tin)
import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, Image, Alert } from 'react-bootstrap';
import { validateUserData, validateAvatarFile, handleAvatarUpload } from '../../services/userService';
import './UserModal.css';

const UserEditModal = ({ show, onHide, user, onUpdate }) => {
    // State lưu thông tin form
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        password: '',
        full_name: '',
        email: '',
        phone: '',
        address: '',
        role_id: 2,
        avatar: ''
    });

    // State lưu file ảnh mới
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    // State lưu lỗi validation
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Khi user thay đổi, cập nhật form data
    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                username: user.username,
                password: user.password,
                full_name: user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                role_id: user.role_id || 2,
                avatar: user.avatar || ''
            });
            setAvatarPreview(user.avatar || '');
        }
    }, [user]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi khi user bắt đầu sửa
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Xử lý upload avatar
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file sử dụng function từ service
            const error = validateAvatarFile(file);
            if (error) {
                setErrors(prev => ({ ...prev, avatar: error }));
                return;
            }

            setAvatarFile(file);

            // Tạo preview sử dụng function từ service
            handleAvatarUpload(file, (preview) => {
                setAvatarPreview(preview);
            });

            // Xóa lỗi avatar nếu có
            if (errors.avatar) {
                setErrors(prev => ({ ...prev, avatar: '' }));
            }
        }
    };

    // Validate form sử dụng function từ service
    const validateForm = () => {
        const newErrors = validateUserData(formData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            let updatedData = { ...formData };
            if (avatarFile) {
                updatedData.avatar = avatarPreview;
            }
            await onUpdate(user.id, updatedData);
            onHide();
        } catch (error) {
            if (error.validationErrors) {
                setErrors(error.validationErrors);
            } else {
                const errorMessage = error.message || 'Có lỗi xảy ra khi cập nhật thông tin';
                setErrors({ submit: errorMessage });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
            <Modal.Header closeButton className="border-bottom">
                <Modal.Title className="text-primary fw-bold">
                    <i className="bi bi-pencil-square me-2"></i>
                    Chỉnh sửa thông tin người dùng
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="p-4">
                    {errors.submit && (
                        <Alert variant="danger">{errors.submit}</Alert>
                    )}

                    <Row>
                        {/* Cột bên trái: Avatar và upload */}
                        <Col md={4} className="text-center">
                            <div className="avatar-container mb-3">
                                <Image
                                    src={avatarPreview || 'https://via.placeholder.com/150'}
                                    alt="Avatar"
                                    roundedCircle
                                    className="avatar-image shadow"
                                />
                            </div>
                            <div className="mt-3">
                                <Form.Group>
                                    <Form.Label className="btn btn-upload-avatar btn-sm">
                                        Chọn ảnh
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </Form.Label>
                                    {errors.avatar && (
                                        <div className="text-danger small mt-2">{errors.avatar}</div>
                                    )}
                                    <div className="text-muted small mt-2">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Dung lượng tối đa: 2MB
                                    </div>
                                </Form.Group>
                            </div>
                        </Col>

                        {/* Cột bên phải: Thông tin */}
                        <Col md={8}>
                            <Row className="mb-3">
                                {/* ID (không chỉnh sửa được) */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={user.id}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Username (không chỉnh sửa được) */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={user.username}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Họ tên */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Họ tên <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            isInvalid={!!errors.full_name}
                                            placeholder="Nhập họ tên"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.full_name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* Email */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Email <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            isInvalid={!!errors.email}
                                            placeholder="Nhập email"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Số điện thoại */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Số điện thoại <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            isInvalid={!!errors.phone}
                                            placeholder="Nhập số điện thoại"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.phone}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* Địa chỉ */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Địa chỉ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Nhập địa chỉ"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Vai trò */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Vai trò</Form.Label>
                                        <Form.Select
                                            name="role_id"
                                            value={formData.role_id}
                                            onChange={handleChange}
                                            disabled
                                        >
                                            <option value={1}>Admin</option>
                                            <option value={2}>User</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="border-top justify-content-end">
                    <Button variant="secondary" onClick={onHide} disabled={isSubmitting} className="px-4">
                        <i className="bi bi-x-circle me-2"></i>
                        Hủy
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting} className="px-4">
                        <i className="bi bi-check-circle me-2"></i>
                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default UserEditModal;
