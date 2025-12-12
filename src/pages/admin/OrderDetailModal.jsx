// Modal xem chi tiết đơn hàng (Admin)
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image, Spinner, Alert } from 'react-bootstrap';
import { getOrderDetailById, formatOrderDate, getStatusLabel } from '../../services/orderApi';

const OrderDetailModal = ({ show, onHide, orderId }) => {
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load order detail when modal opens or orderId changes
    useEffect(() => {
        if (show && orderId) {
            loadOrderDetail();
        }
    }, [show, orderId]);

    const loadOrderDetail = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getOrderDetailById(orderId);
            setOrderDetail(data);
        } catch (err) {
            setError(err.message || 'Không thể tải chi tiết đơn hàng');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Format price
    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        const badgeMap = {
            'completed': 'bg-success',
            'pending': 'bg-warning text-dark',
            'cancelled': 'bg-danger'
        };
        return badgeMap[status] || 'bg-secondary';
    };

    if (!show) return null;

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton className="border-bottom">
                <Modal.Title className="text-primary fw-bold">
                    <i className="bi bi-receipt me-2"></i>
                    Chi tiết đơn hàng
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Đang tải chi tiết đơn hàng...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : orderDetail ? (
                    <Row>
                        {/* Cột bên trái: Ảnh xe */}
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-secondary">Ảnh xe</Form.Label>
                                <div className="text-center">
                                    <Image
                                        src={orderDetail.car_image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                        alt={orderDetail.car_name}
                                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                        className="border rounded"
                                    />
                                </div>
                            </Form.Group>
                        </Col>

                        {/* Cột bên phải: Thông tin đơn hàng */}
                        <Col md={8}>
                            <Row className="mb-3">
                                {/* Mã đơn hàng */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Mã đơn hàng</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.id}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Ngày đặt */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Ngày đặt</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formatOrderDate(orderDetail.order_date)}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Tên người mua */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Tên người mua</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.user_name}
                                            disabled
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
                                            type="text"
                                            value={orderDetail.user_email}
                                            disabled
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
                                            value={orderDetail.user_phone}
                                            disabled
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
                                            value={orderDetail.user_address}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <Row className="mb-3">
                                {/* Tên xe */}
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Tên xe</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.car_name}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Dòng xe */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Dòng xe</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.category_name}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Giá xe */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Giá xe</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formatPrice(orderDetail.car_price)}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Số lượng */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Số lượng</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.quantity}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Hộp số */}
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Hộp số</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.car_transmission}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Nhiên liệu */}
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Nhiên liệu</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.car_fuel_type}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Số chỗ */}
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Số chỗ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={`${orderDetail.car_seats} chỗ`}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Số cửa */}
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Số cửa</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={`${orderDetail.car_doors} cánh`}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Trạng thái */}
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Trạng thái</Form.Label>
                                        <div>
                                            <span className={`badge ${getStatusBadgeClass(orderDetail.status)} fs-6`}>
                                                {getStatusLabel(orderDetail.status)}
                                            </span>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Ghi chú */}
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Ghi chú</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={orderDetail.note || 'Không có ghi chú'}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                ) : (
                    <Alert variant="warning">Không tìm thấy thông tin đơn hàng</Alert>
                )}
            </Modal.Body>

            <Modal.Footer className="border-top">
                <Button variant="secondary" onClick={onHide}>
                    <i className="bi bi-x-circle me-2"></i>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailModal;
