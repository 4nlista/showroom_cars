// Modal xem chi tiết xe (Admin)
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Image, Carousel } from 'react-bootstrap';

const CarDetailModal = ({ show, onHide, car, categories }) => {
    // State for description
    const [showFullDescription, setShowFullDescription] = useState(false);

    if (!car) return null;

    // Helper function to get category name
    const getCategoryName = (categoryId) => {
        const category = categories?.find(cat => cat.id === String(categoryId));
        return category ? category.name : 'Unknown';
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Handle long description
    const renderDescription = () => {
        if (!car.description) return 'No description';

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
                    see more
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
                    {/* Left column: Images */}
                    <Col md={4}>
                        {/* Main image */}
                        <div className="mb-3">
                            <Form.Label className="fw-semibold text-secondary">
                                Main image
                            </Form.Label>
                            <Image
                                src={car.image || 'https://via.placeholder.com/200x150?text=No+Image'}
                                alt={car.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                className="border rounded"
                            />
                        </div>

                        {/* Detail image carousel */}
                        {car.imageDetail && car.imageDetail.length > 0 && (
                            <div>
                                <Form.Label className="fw-semibold text-secondary">
                                    Detail images
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
                                                Image {index + 1} / {car.imageDetail.length}
                                                </p>
                                            </Carousel.Caption>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>
                        )}
                    </Col>

                    {/* Right column: Information */}
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
                            {/* Car name */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Car name</Form.Label>
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
                            {/* Description */}
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Description</Form.Label>
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
                            {/* Price */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Price (VND)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formatPrice(car.price)}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Stock */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Stock</Form.Label>
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
                            {/* Transmission */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Transmission</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.transmission}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Fuel type */}
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Fuel type</Form.Label>
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
                            {/* Seats */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Seats</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={`${car.seats} seats`}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Doors */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Doors</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={`${car.doors} doors`}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Category */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Category</Form.Label>
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

                        {/* Additional information */}
                        <Row className="mb-3">
                            {/* Rating */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Rating</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.rating ? `${car.rating} ⭐` : 'No rating'}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Reviews */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Number of reviews</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.reviews || 'No reviews'}
                                        disabled
                                        readOnly
                                        className="form-control-detail"
                                    />
                                </Form.Group>
                            </Col>
                            {/* Views */}
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold text-secondary">Views</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={car.view ? car.view.toLocaleString() : 'No views'}
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
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CarDetailModal;
