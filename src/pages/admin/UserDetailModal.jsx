// Modal hiển thị chi tiết thông tin người dùng (chỉ xem, không chỉnh sửa)
import React from 'react';
import { Modal, Button, Row, Col, Image, Form } from 'react-bootstrap';
import './UserModal.css';

const UserDetailModal = ({ show, onHide, user }) => {
    if (!user) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
            <Modal.Header closeButton className="border-bottom">
                <Modal.Title className="text-primary fw-bold">
                    <i className="bi bi-person-circle me-2"></i>
                    Chi tiết người dùng
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Row>
                    {/* Cột bên trái: Hiển thị avatar */}
                    <Col md={4} className="text-center">
                        <div className="avatar-container mb-3">
                            <Image
                                src={user.avatar || 'https://via.placeholder.com/150'}
                                alt="Avatar"
                                roundedCircle
                                className="avatar-image shadow"
                            />
                        </div>
                        <h6 className="text-muted">Avatar</h6>
                    </Col>

                    {/* Cột bên phải: Hiển thị thông tin */}
                    <Col md={8}>
                        <Form>
                            <Row className="mb-3">
                                {/* ID */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={user.id}
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Username */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={user.username}
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
                                        <Form.Label className="fw-semibold text-secondary">Họ tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={user.full_name}
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Email */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Số điện thoại */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Số điện thoại</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={user.phone}
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Địa chỉ */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Địa chỉ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={user.address || 'Chưa cập nhật'}
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Role */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Vai trò</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={user.role_id === 1 ? 'Admin' : 'User'}
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="border-top">
                <Button variant="secondary" onClick={onHide} className="px-4">
                    <i className="bi bi-x-circle me-2"></i>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserDetailModal;