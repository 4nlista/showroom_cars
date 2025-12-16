// Modal tạo người dùng mới (Admin)
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { createNewUser } from '../../services/userService';
import './UserModal.css';

const CreateUserModal = ({ show, onHide, onUserCreated }) => {
    // State lưu thông tin form
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        phone: '',
        email: '',
        address: '',
        birth_date: '',
        password: '',
        confirmPassword: '',
        role_id: 2 // Mặc định là User
    });

    // State lưu lỗi validation
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Reset form khi đóng modal
    const handleClose = () => {
        setFormData({
            username: '',
            full_name: '',
            phone: '',
            email: '',
            address: '',
            birth_date: '',
            password: '',
            confirmPassword: '',
            role_id: 2
        });
        setErrors({});
        setSubmitError('');
        onHide();
    };

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

    // Xử lý thay đổi role
    const handleRoleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            role_id: parseInt(e.target.value)
        }));
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setIsSubmitting(true);
        try {
            await createNewUser(formData);
            onUserCreated();
            handleClose();
            alert('✅ New user created successfully!');
        } catch (error) {
            if (error.validationErrors) {
                setErrors(error.validationErrors);
            } else {
                setSubmitError(error.message || 'An error occurred while creating user');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered className="user-modal">
            <Modal.Header closeButton className="border-bottom">
                <Modal.Title className="text-primary fw-bold">
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Create New User
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {submitError && (
                    <Alert variant="danger" dismissible onClose={() => setSubmitError('')}>
                        {submitError}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        {/* Username */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-secondary">
                                    Username <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    isInvalid={!!errors.username}
                                    placeholder="Enter username"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.username}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        {/* Họ tên */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-secondary">
                                    Full Name <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.full_name}
                                    placeholder="Enter full name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.full_name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
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
                                    placeholder="Enter email"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        {/* Số điện thoại */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-secondary">
                                    Phone Number <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    isInvalid={!!errors.phone}
                                    placeholder="Enter phone number"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phone}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        {/* Địa chỉ */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-secondary">Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter address"
                                />
                            </Form.Group>
                        </Col>
                        {/* Ngày sinh */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-secondary">Date of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    placeholder="Select date of birth"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        {/* Mật khẩu */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-secondary">
                                    Password <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                    placeholder="Enter password"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        {/* Xác nhận mật khẩu */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-secondary">
                                    Confirm Password <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    isInvalid={!!errors.confirmPassword}
                                    placeholder="Re-enter password"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        {/* Vai trò - Radio buttons */}
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-secondary">
                                    Role <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="d-flex gap-4">
                                    <Form.Check
                                        type="radio"
                                        id="role-admin"
                                        label="Admin"
                                        name="role"
                                        value={1}
                                        checked={formData.role_id === 1}
                                        onChange={handleRoleChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="role-user"
                                        label="User"
                                        name="role"
                                        value={2}
                                        checked={formData.role_id === 2}
                                        onChange={handleRoleChange}
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Modal.Footer className="border-top mt-4">
                        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                            <i className="bi bi-x-circle me-2"></i>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            {isSubmitting ? 'Creating...' : 'Create User'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateUserModal;
