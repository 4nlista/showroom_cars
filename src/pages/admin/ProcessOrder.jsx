import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { getOrdersWithDetails, updateOrderStatus, formatOrderDate, applyOrderFilters } from '../../services/orderApi';
import OrderDetailModal from './OrderDetailModal';

const ProcessOrder = () => {
    // State quản lý danh sách đơn hàng
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Filter state
    const [statusFilter, setStatusFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // Modal state
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Load danh sách đơn hàng khi component mount
    useEffect(() => {
        loadOrders();
    }, []);

    // Apply filters whenever orders or filter states change
    useEffect(() => {
        const filtered = applyOrderFilters(orders, { statusFilter, fromDate, toDate });
        setFilteredOrders(filtered);
    }, [orders, statusFilter, fromDate, toDate]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrdersWithDetails();
            setOrders(data);
            setError('');
        } catch (err) {
            setError(err.message || 'Unable to load order list');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thay đổi trạng thái đơn hàng
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);

            // Cập nhật state local
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );

            // Hiển thị success message
            setSuccessMessage('✅ Order status updated successfully!');

            // Tự động ẩn message sau 2 giây
            setTimeout(() => {
                setSuccessMessage('');
            }, 2000);
        } catch (error) {
            alert(error.message || 'An error occurred while updating status');
        }
    };

    // Xử lý xem chi tiết đơn hàng
    const handleViewDetail = (orderId) => {
        setSelectedOrderId(orderId);
        setShowDetailModal(true);
    };

    // Xử lý thay đổi filter
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
    };

    const handleToDateChange = (e) => {
        setToDate(e.target.value);
    };

    return (
        <AdminLayout>
            <div className="container-fluid py-4">
                <div className="mb-4 border-bottom pb-2">
                    <h2 className="fw-bold mb-1">
                        <i className="bi bi-clipboard-check me-2"></i>
                        Order Processing
                    </h2>
                    <p className="text-muted mb-0">Manage and update order status</p>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                {/* Success Message */}
                {successMessage && (
                    <Alert variant="success" className="mb-3">
                        {successMessage}
                    </Alert>
                )}

                {/* Filter Form */}
                <Form className="mb-4">
                    <Row className="g-3">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">From Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fromDate}
                                    onChange={handleFromDateChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">To Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={toDate}
                                    onChange={handleToDateChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">Filter by Status</Form.Label>
                                <Form.Select
                                    value={statusFilter}
                                    onChange={handleStatusFilterChange}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Loading orders...</p>
                    </div>
                ) : (
                    <>
                        {filteredOrders.length === 0 ? (
                            <Alert variant="info">
                                <i className="bi bi-info-circle me-2"></i>
                                {orders.length === 0 ? 'No orders yet' : 'No orders found matching the filter'}
                            </Alert>
                        ) : (
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: '4%' }}>No.</th>
                                            <th style={{ width: '15%' }}>Buyer</th>
                                            <th style={{ width: '23%' }}>Car Name</th>
                                            <th style={{ width: '7%' }}>Quantity</th>
                                            <th style={{ width: '15%' }}>Order Date</th>
                                            <th style={{ width: '15%' }}>Status</th>
                                            <th style={{ width: '9%' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order, index) => (
                                            <tr key={order.id}>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    {index + 1}
                                                </td>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    {order.user_name}
                                                </td>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    {order.car_name}
                                                </td>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    {order.quantity}
                                                </td>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    {formatOrderDate(order.order_date)}
                                                </td>
                                                <td style={{ verticalAlign: 'middle' }}>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <i
                                                            className={`bi bi-circle-fill ${order.status === 'completed' ? 'text-success' :
                                                                order.status === 'pending' ? 'text-warning' :
                                                                    'text-danger'
                                                                }`}
                                                        ></i>
                                                        <Form.Select
                                                            size="sm"
                                                            value={order.status}
                                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                            style={{ flex: 1 }}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </Form.Select>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'left', verticalAlign: 'middle' }}>
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => handleViewDetail(order.id)}
                                                        title="View details"
                                                    >
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                <div className="mt-3 text-muted">
                                    <small>
                                        <i className="bi bi-info-circle me-1"></i>
                                        Showing: <strong>{filteredOrders.length}</strong> / Total: <strong>{orders.length}</strong> orders
                                    </small>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Order Detail Modal */}
            <OrderDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                orderId={selectedOrderId}
            />
        </AdminLayout>
    );
};

export default ProcessOrder;
