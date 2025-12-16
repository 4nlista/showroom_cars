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
            setError(err.message || 'Unable to load order details');
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
                        <p className="mt-3 text-muted">Loading order details...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : orderDetail ? (
                    <Row>
                        {/* Left column: Car image */}
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-secondary">Car image</Form.Label>
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

                        {/* Right column: Order information */}
                        <Col md={8}>
                            <Row className="mb-3">
                                {/* Order ID */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Order ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.id}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Order date */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Order date</Form.Label>
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
                                {/* Buyer name */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Buyer name</Form.Label>
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
                                {/* Phone number */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Phone number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.user_phone}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Address */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Address</Form.Label>
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
                                {/* Car name */}
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Car name</Form.Label>
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
                                {/* Category */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Category</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.category_name}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Car price */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Car price</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formatPrice(orderDetail.car_price)}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Quantity */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Quantity</Form.Label>
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
                                {/* Transmission */}
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Transmission</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.car_transmission}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Fuel type */}
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Fuel type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={orderDetail.car_fuel_type}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Seats */}
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Seats</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={`${orderDetail.car_seats} seats`}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                                {/* Doors */}
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Doors</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={`${orderDetail.car_doors} doors`}
                                            disabled
                                            readOnly
                                            className="form-control-detail"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Status */}
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Status</Form.Label>
                                        <div>
                                            <span className={`badge ${getStatusBadgeClass(orderDetail.status)} fs-6`}>
                                                {getStatusLabel(orderDetail.status)}
                                            </span>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Note */}
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Note</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={orderDetail.note || 'No notes'}
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
                    <Alert variant="warning">Order information not found</Alert>
                )}
            </Modal.Body>

            <Modal.Footer className="border-top">
                <Button variant="secondary" onClick={onHide}>
                    <i className="bi bi-x-circle me-2"></i>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailModal;
