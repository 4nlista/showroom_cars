// Modal xem chi tiết xe (Admin)
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Image, Carousel } from 'react-bootstrap';

const CarDetailModal = ({ show, onHide, car, categories }) => {
    // State cho mô tả
    const [showFullDescription, setShowFullDescription] = useState(false);

    if (!car) return null;

    // Helper function để lấy tên category
    const getCategoryName = (categoryId) => {
        const category = categories?.find(cat => cat.id === String(categoryId));
        return category ? category.name : 'Unknown';
    };

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Xử lý mô tả dài
    const renderDescription = () => {
        if (!car.description) return 'Không có mô tả';

        const maxLength = 150;
        if (car.description.length <= maxLength || showFullDescription) {
            return car.description;
        }

        return (
            <>
                {car.description.substring(0, maxLength)}...
                <Button
                    variant="link"
                    size="sm"
                    className="p-0 ms-1"
                    onClick={() => setShowFullDescription(true)}
                >
                    xem thêm
                </Button>
            </>
        );
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton className="border-bottom">
                <Modal.Title className="text-primary fw-bold">
                    <i className="bi bi-eye-fill me-2"></i>
                    Chi tiết xe
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    {/* Cột bên trái: Ảnh */}
                    <Col md={4}>
                        {/* Ảnh chính */}
                        <div className="mb-3">
                            <Form.Label className="fw-semibold text-secondary">
                                Ảnh chính
                            </Form.Label>
                            <Image
                                src={car.image || 'https://via.placeholder.com/200x150?text=No+Image'}
                                alt={car.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                className="border rounded"
                            />
                        </div>

                        {/* Carousel ảnh chi tiết */}
                        {car.imageDetail && car.imageDetail.length > 0 && (
                            <div>
                                <Form.Label className="fw-semibold text-secondary">
                                    Ảnh chi tiết
                                </Form.Label>
                                <Carousel
                                    interval={null}
                                    className="border rounded"
                                    style={{ backgroundColor: '#f8f9fa' }}
                                >
                                    {car.imageDetail.map((img, index) => (
                                        <Carousel.Item key={index}>
                                            <Image
                                                src={img}
                                                alt={`Detail ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <Carousel.Caption
                                                style={{
                                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                                    borderRadius: '5px',
                                                    padding: '5px 10px'
                                                }}
                                            >
                                                <p className="mb-0 small">
                                                    Ảnh {index + 1} / {car.imageDetail.length}
                                                </p>
                                            </Carousel.Caption>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>
                        )}
                    </Col>

                    {/* Cột bên phải: Thông tin */}
                    <Col md={8}>
                        <Row className="mb-3">
                            {/* ID */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.id}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Tên xe */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Tên xe</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.name}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            {/* Mô tả */}
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Mô tả</Form.Label>
                                    <div
                                        className="form-control form-control-detail"
                                        style={{
                                            minHeight: '80px',
                                            whiteSpace: 'pre-wrap',
                                            backgroundColor: '#e9ecef'
                                        }}
                                    >
                                        {renderDescription()}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            {/* Giá */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Giá (VNĐ)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formatPrice(car.price)}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Số lượng */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Số lượng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.stock}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            {/* Hộp số */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Hộp số</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.transmission}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Nhiên liệu */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Nhiên liệu</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.fuel_type}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            {/* Số chỗ */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Số chỗ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={`${car.seats} chỗ`}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Số cửa */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Số cửa</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={`${car.doors} cánh`}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Dòng xe */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Dòng xe</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={getCategoryName(car.category_id)}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Thông tin bổ sung */}
                        <Row className="mb-3">
                            {/* Rating */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Đánh giá</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.rating ? `${car.rating} ⭐` : 'Chưa có'}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Reviews */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Số đánh giá</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.reviews || 'Chưa có'}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Views */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Lượt xem</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.view ? car.view.toLocaleString() : 'Chưa có'}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>
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

export default CarDetailModal;
