import React, { useState } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { changePassword } from '../../services/userService';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSuccessMessage('');

        setIsSubmitting(true);

        try {
            // Get current user ID from localStorage (assuming it's stored there)
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (!currentUser || !currentUser.id) {
                setSubmitError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
                setIsSubmitting(false);
                return;
            }

            // Call change password API
            await changePassword(
                currentUser.id,
                formData.currentPassword,
                formData.newPassword,
                formData.confirmPassword
            );

            // Success
            setSuccessMessage('✅ Đổi mật khẩu thành công! Đang đăng xuất...');

            // Reset form
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Auto logout and redirect after 2 seconds
            setTimeout(() => {
                // Clear localStorage (logout)
                localStorage.removeItem('user');
                localStorage.removeItem('token'); // if you have token

                // Redirect to home page
                window.location.href = 'http://localhost:3000/';
            }, 2000);
        } catch (error) {
            // Handle validation errors
            if (error.validationErrors) {
                setErrors(error.validationErrors);
            } else {
                setSubmitError(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="mb-4 border-bottom pb-2">
                    <h2 className="fw-bold mb-1">
                        <i className="bi bi-key me-2"></i>
                        Đổi mật khẩu
                    </h2>
                    <p className="text-muted mb-0">Thay đổi mật khẩu đăng nhập của bạn</p>
                </div>

                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card>
                            <Card.Body className="p-4">
                                {submitError && (
                                    <Alert variant="danger" dismissible onClose={() => setSubmitError('')}>
                                        {submitError}
                                    </Alert>
                                )}

                                {successMessage && (
                                    <Alert variant="success">
                                        {successMessage}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    {/* Mật khẩu hiện tại */}
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            Mật khẩu hiện tại <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            isInvalid={!!errors.currentPassword}
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.currentPassword}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Mật khẩu mới */}
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            Mật khẩu mới <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            isInvalid={!!errors.newPassword}
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.newPassword}
                                        </Form.Control.Feedback>
                                        <Form.Text className="text-muted">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Mật khẩu phải có ít nhất 6 ký tự và không chứa khoảng trắng
                                        </Form.Text>
                                    </Form.Group>

                                    {/* Nhập lại mật khẩu mới */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            Nhập lại mật khẩu mới <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            isInvalid={!!errors.confirmPassword}
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.confirmPassword}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Buttons */}
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-grow-1"
                                        >
                                            <i className="bi bi-check-circle me-2"></i>
                                            {isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setFormData({
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: ''
                                                });
                                                setErrors({});
                                                setSubmitError('');
                                                setSuccessMessage('');
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            <i className="bi bi-x-circle me-2"></i>
                                            Hủy
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
};

export default ChangePassword;
