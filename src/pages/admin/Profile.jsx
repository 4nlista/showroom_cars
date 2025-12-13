
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { Row, Col, Form, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { getUserById, updateUser, validateUserData, validateAvatarFile, handleAvatarUpload } from '../../services/userService';


const CURRENT_USER_ID = 1; // TODO: lấy userId thực tế từ context/auth

const Profile = () => {
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        full_name: '',
        email: '',
        phone: '',
        address: '',
        role_id: '',
        status: '',
        avatar: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    // Lấy thông tin user hiện tại
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const user = await getUserById(CURRENT_USER_ID);
                setFormData({
                    id: user.id,
                    username: user.username,
                    full_name: user.full_name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    role_id: user.role_id,
                    status: user.status,
                    avatar: user.avatar || ''
                });
                setAvatarPreview(user.avatar || '');
            } catch (err) {
                setSubmitError('Không thể tải thông tin hồ sơ');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Tự động ẩn alert sau 2.5s
    useEffect(() => {
        let timer;
        if (submitError || submitSuccess) {
            timer = setTimeout(() => {
                setSubmitError('');
                setSubmitSuccess('');
            }, 2500);
        }
        return () => clearTimeout(timer);
    }, [submitError, submitSuccess]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Xử lý upload avatar
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateAvatarFile(file);
            if (error) {
                setErrors(prev => ({ ...prev, avatar: error }));
                return;
            }
            setAvatarFile(file);
            handleAvatarUpload(file, (preview) => setAvatarPreview(preview));
        }
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');
        setIsSubmitting(true);
        // Validate
        const validateFields = {
            ...formData,
            avatar: avatarFile ? avatarFile.name : formData.avatar
        };
        const validationErrors = validateUserData(validateFields);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }
        try {
            // Lấy user hiện tại để giữ lại password và các trường không sửa
            const currentUser = await getUserById(formData.id);
            let updatedData = {
                ...currentUser,
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                avatar: avatarFile && avatarPreview ? avatarPreview : currentUser.avatar
            };
            await updateUser(formData.id, updatedData);
            setSubmitSuccess('Cập nhật hồ sơ thành công!');
        } catch (err) {
            if (err.validationErrors) {
                setErrors(err.validationErrors);
            } else {
                setSubmitError(err.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
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
                        <i className="bi bi-people-fill me-2"></i>
                        Hồ sơ cá nhân
                    </h2>
                </div>
                <div className="mx-auto" style={{ maxWidth: 900 }}>
                    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32, margin: '0 auto' }}>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
                                <Spinner animation="border" />
                            </div>
                        ) : (
                            <Form onSubmit={handleSubmit}>
                                {submitError && <Alert variant="danger">{submitError}</Alert>}
                                {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
                                <Row>
                                    <Col md={4} className="text-center mb-3">
                                        <div className="mb-3">
                                            <Image
                                                src={avatarPreview || 'https://via.placeholder.com/120'}
                                                alt="Avatar"
                                                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                                            />
                                        </div>
                                        <Form.Group controlId="avatarUpload">
                                            <Form.Label className="fw-semibold">Chọn ảnh đại diện</Form.Label>
                                            <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
                                            {errors.avatar && <div className="text-danger small mt-1">{errors.avatar}</div>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={8}>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>ID</Form.Label>
                                                    <Form.Control value={formData.id} readOnly disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Tên đăng nhập</Form.Label>
                                                    <Form.Control value={formData.username} readOnly disabled />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Họ tên</Form.Label>
                                                    <Form.Control
                                                        name="full_name"
                                                        value={formData.full_name}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.full_name}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.full_name}</Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.email}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Số điện thoại</Form.Label>
                                                    <Form.Control
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.phone}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Địa chỉ</Form.Label>
                                                    <Form.Control
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Vai trò</Form.Label>
                                                    <Form.Control value={formData.role_id === 1 ? 'Admin' : 'User'} readOnly disabled />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Trạng thái</Form.Label>
                                                    <Form.Control value={formData.status === 'active' ? 'Hoạt động' : 'Bị khóa'} readOnly disabled />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="text-end">
                                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Profile;
