import {
    getOrdersWithDetails,
    getOrderDetailById,
    formatOrderDate,
    getStatusLabel,
    getStatusBadgeClass,
    filterOrdersByStatus,
    filterOrdersByDateRange
} from '../../services/orderApi';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import MainLayout from '../../layouts/user-layouts/MainLayout';
import { Table, Button, Spinner, Alert, Modal, Row, Col, Form } from 'react-bootstrap';

const HistoryOrder = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState('');

    const { user } = useContext(AuthContext);
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError('');
            try {
                if (!user || !user.id) {
                    setError('Không xác định được người dùng. Vui lòng đăng nhập lại.');
                    setOrders([]);
                    return;
                }
                // Lấy orders đã join đủ thông tin, chỉ lấy của user hiện tại
                const allOrders = await getOrdersWithDetails();
                const userOrders = allOrders.filter(order => order.user_id === user.id);
                setOrders(userOrders);
            } catch (err) {
                setError('Không thể tải danh sách đơn hàng');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    useEffect(() => {
        let result = [...orders];
        result = filterOrdersByStatus(result, statusFilter);
        result = filterOrdersByDateRange(result, fromDate, toDate);
        setFilteredOrders(result);
    }, [orders, statusFilter, fromDate, toDate]);

    // Xem chi tiết đơn hàng
    const handleViewDetail = async (orderId) => {
        setShowDetailModal(true);
        setSelectedOrderId(orderId);
        setOrderDetail(null);
        setDetailError('');
        setDetailLoading(true);
        try {
            const detail = await getOrderDetailById(orderId);
            setOrderDetail(detail);
        } catch (err) {
            setDetailError('Không thể tải chi tiết đơn hàng');
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedOrderId(null);
        setOrderDetail(null);
        setDetailError('');
    };

    return (
        <MainLayout>
            <div className="container py-4" style={{ minHeight: 600, marginTop: '100px' }}>
                <div className="mb-4 border-bottom pb-2">
                    <h2 className="fw-bold mb-1">
                        <i className="bi bi-clock-history me-2"></i>
                        Lịch sử đơn hàng
                    </h2>
                </div>
                <div className="mb-3">
                    <Row className="g-2 align-items-end">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                    <option value="all">Tất cả</option>
                                    <option value="pending">Đang xử lý</option>
                                    <option value="completed">Đã xử lý</option>
                                    <option value="cancelled">Đã từ chối</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Từ ngày</Form.Label>
                                <Form.Control type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Đến ngày</Form.Label>
                                <Form.Control type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Table bordered hover responsive className="align-middle mt-3">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '4%' }}>STT</th>
                                <th style={{ width: '23%' }}>Tên xe</th>
                                <th style={{ width: '10%' }}>Số lượng</th>
                                <th style={{ width: '15%' }}>Ngày đặt</th>
                                <th style={{ width: '15%' }}>Trạng thái</th>
                                <th style={{ width: '9%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted">Không có đơn hàng nào</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, idx) => (
                                    <tr key={order.id}>
                                        <td>{idx + 1}</td>
                                        <td>{order.car_name}</td>
                                        <td>{order.quantity}</td>
                                        <td>{formatOrderDate(order.order_date)}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeClass(order.status)}`}>{getStatusLabel(order.status)}</span>
                                        </td>
                                        <td>
                                            <Button size="sm" variant="outline-primary" onClick={() => handleViewDetail(order.id)}>
                                                <i className="bi bi-eye"></i> Xem chi tiết
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                )}

                {/* Modal xem chi tiết đơn hàng - giao diện giống admin */}
                <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="lg" style={{ marginTop: '30px' }} centered>
                    <Modal.Header closeButton className="border-bottom">
                        <Modal.Title className="text-primary fw-bold">
                            <i className="bi bi-receipt me-2"></i>
                            Chi tiết đơn hàng
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ width: 700, maxWidth: '100%', maxHeight: 420, overflowY: 'auto', margin: '0 auto' }}>
                        {detailLoading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3 text-muted">Đang tải chi tiết đơn hàng...</p>
                            </div>
                        ) : detailError ? (
                            <Alert variant="danger">{detailError}</Alert>
                        ) : orderDetail ? (
                            <div>
                                {/* Thông tin user */}
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <h6 className="fw-bold text-secondary mb-2">Thông tin khách hàng</h6>
                                        <div className="p-3 bg-light rounded">
                                            <p className="mb-1"><strong>Tên:</strong> {orderDetail.user_name}</p>
                                            <p className="mb-1"><strong>Email:</strong> {orderDetail.user_email}</p>
                                            <p className="mb-1"><strong>SĐT:</strong> {orderDetail.user_phone}</p>
                                            <p className="mb-0"><strong>Địa chỉ:</strong> {orderDetail.user_address}</p>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Danh sách xe - Cấu trúc mới (items array) */}
                                {orderDetail.items && Array.isArray(orderDetail.items) ? (
                                    <div>
                                        <h6 className="fw-bold text-secondary mb-2">Danh sách xe đặt mua</h6>
                                        {orderDetail.items.map((item, index) => (
                                            <Row key={index} className="mb-3 border rounded p-3">
                                                <Col md={4}>
                                                    <img
                                                        src={item.car_image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                                        alt={item.car_name}
                                                        style={{ width: '100%', height: 120, objectFit: 'cover' }}
                                                        className="border rounded"
                                                    />
                                                </Col>
                                                <Col md={8}>
                                                    <h6 className="fw-bold">{item.car_name}</h6>
                                                    <p className="mb-1 text-muted small">{item.category_name}</p>
                                                    <Row>
                                                        <Col xs={6}>
                                                            <small><strong>Giá:</strong> {item.car_price?.toLocaleString('vi-VN')}₫</small>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <small><strong>Số lượng:</strong> {item.quantity}</small>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <small><strong>Hộp số:</strong> {item.car_transmission}</small>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <small><strong>Nhiên liệu:</strong> {item.car_fuel_type}</small>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        ))}

                                        {/* Thông tin đơn hàng */}
                                        <Row className="mt-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold text-secondary">Ngày nhận xe</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={formatOrderDate(orderDetail.order_date)}
                                                        disabled
                                                        readOnly
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold text-secondary">Tổng tiền</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={orderDetail.total_amount?.toLocaleString('vi-VN') + '₫'}
                                                        disabled
                                                        readOnly
                                                        className="fw-bold text-danger"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mt-3">
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

                                        <Row className="mt-3">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold text-secondary">Ghi chú</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        value={orderDetail.note || 'Không có ghi chú'}
                                                        disabled
                                                        readOnly
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>
                                ) : (
                                    /* Cấu trúc cũ - Hiển thị 1 xe */
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold text-secondary">Ảnh xe</Form.Label>
                                                <div className="text-center">
                                                    <img
                                                        src={orderDetail.car_image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                                        alt={orderDetail.car_name}
                                                        style={{ width: '100%', height: 140, objectFit: 'cover' }}
                                                        className="border rounded"
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={8}>
                                            <Row className="mb-3">
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
                                                <Col md={4}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold text-secondary">Giá xe</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={orderDetail.car_price ? orderDetail.car_price.toLocaleString('vi-VN') + '₫' : ''}
                                                            disabled
                                                            readOnly
                                                            className="form-control-detail"
                                                        />
                                                    </Form.Group>
                                                </Col>
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
                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold text-secondary">Số chỗ</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={orderDetail.car_seats}
                                                            disabled
                                                            readOnly
                                                            className="form-control-detail"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group>
                                                        <Form.Label className="fw-semibold text-secondary">Số cửa</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={orderDetail.car_doors}
                                                            disabled
                                                            readOnly
                                                            className="form-control-detail"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className="mb-3">
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
                                )}
                            </div>
                        ) : (
                            <Alert variant="warning">Không tìm thấy thông tin đơn hàng</Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="border-top">
                        <Button variant="secondary" onClick={handleCloseDetailModal}>
                            <i className="bi bi-x-circle me-2"></i>
                            Đóng
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </MainLayout>
    );
};

export default HistoryOrder;