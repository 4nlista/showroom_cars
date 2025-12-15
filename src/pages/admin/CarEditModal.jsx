// Car edit modal (Admin)
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Image } from 'react-bootstrap';
import { updateCar, validateCarImageFile, handleCarImageUpload } from '../../services/carsApi';
import { getCategory } from '../../services/categoryApi';

const CarEditModal = ({ show, onHide, car, onCarUpdated }) => {
    // State for form data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: 1,
        image: '',
        imageDetail: [],
        transmission: '',
        fuel_type: '',
        seats: '',
        doors: '',
        category_id: '',
        rating: null,
        reviews: null,
        view: null
    });

    // State for image files
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [detailImageFiles, setDetailImageFiles] = useState([]);
    const [detailImagePreviews, setDetailImagePreviews] = useState([]);

    // State for categories
    const [categories, setCategories] = useState([]);

    // State for validation errors
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Load categories when component mounts
    useEffect(() => {
        if (show) {
            loadCategories();
        }
    }, [show]);

    // Load car data when `car` changes
    useEffect(() => {
        if (car && show) {
            setFormData({
                name: car.name || '',
                description: car.description || '',
                price: car.price || '',
                stock: car.stock || 1,
                image: car.image || '',
                imageDetail: car.imageDetail || [],
                transmission: car.transmission || '',
                fuel_type: car.fuel_type || '',
                seats: car.seats || '',
                doors: car.doors || '',
                category_id: car.category_id || '',
                rating: car.rating || null,
                reviews: car.reviews || null,
                view: car.view || null
            });
            setMainImagePreview(car.image || '');
            setDetailImagePreviews(car.imageDetail || []);
        }
    }, [car, show]);

    const loadCategories = async () => {
        try {
            const data = await getCategory();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    // Reset state when modal closes
    const handleClose = () => {
        setMainImageFile(null);
        setDetailImageFiles([]);
        setErrors({});
        setSubmitError('');
        onHide();
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts editing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle main image upload
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file
            const error = validateCarImageFile(file);
            if (error) {
                setErrors(prev => ({ ...prev, image: error }));
                return;
            }

            setMainImageFile(file);

            // Create preview
            handleCarImageUpload(file, (preview) => {
                setMainImagePreview(preview);
                setFormData(prev => ({ ...prev, image: preview }));
            });

            // Clear error if exists
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: '' }));
            }
        }
    };

    // Handle detail image upload
    const handleDetailImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file
            const error = validateCarImageFile(file);
            if (error) {
                alert(error);
                return;
            }

            // Create preview
            handleCarImageUpload(file, (preview) => {
                const newFiles = [...detailImageFiles];
                const newPreviews = [...detailImagePreviews];

                newFiles[index] = file;
                newPreviews[index] = preview;

                setDetailImageFiles(newFiles);
                setDetailImagePreviews(newPreviews);

                // Update formData
                setFormData(prev => ({
                    ...prev,
                    imageDetail: newPreviews.filter(p => p) // Filter out null/undefined
                }));
            });
        }
    };

    // Add new detail image field
    const addDetailImageField = () => {
        setDetailImagePreviews(prev => [...prev, null]);
    };

    // Remove detail image field
    const removeDetailImageField = (index) => {
        const newFiles = detailImageFiles.filter((_, i) => i !== index);
        const newPreviews = detailImagePreviews.filter((_, i) => i !== index);

        setDetailImageFiles(newFiles);
        setDetailImagePreviews(newPreviews);

        setFormData(prev => ({
            ...prev,
            imageDetail: newPreviews.filter(p => p)
        }));
    };

    // Handle stock change
    const handleStockChange = (delta) => {
        setFormData(prev => ({
            ...prev,
            stock: Math.max(1, prev.stock + delta)
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        setIsSubmitting(true);

        try {
            // Call updateCar from carsApi
            await updateCar(car.id, formData);

            // Success - call callback and close modal
            onCarUpdated();
            handleClose();
            alert('✅ Car updated successfully!');
        } catch (error) {
            // Handle errors
            if (error.validationErrors) {
                setErrors(error.validationErrors);
            } else {
                setSubmitError(error.message || 'An error occurred while updating the car');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!car) return null;

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton className="border-bottom">
                <Modal.Title className="text-primary fw-bold">
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit car information
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {submitError && (
                    <Alert variant="danger" dismissible onClose={() => setSubmitError('')}>
                        {submitError}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        {/* Left column: Images */}
                        <Col md={4}>
                        {/* Main image */}
                            <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold text-secondary">
                                    Main image <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="text-center">
                                    <div className="mb-3">
                                        <Image
                                            src={mainImagePreview || 'https://via.placeholder.com/200x150?text=Select+image'}
                                            alt="Main"
                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                            className="border rounded"
                                        />
                                    </div>
                                    <Form.Label className="btn btn-primary btn-sm w-100">
                                        <i className="bi bi-upload me-2"></i>
                                        Select main image
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleMainImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </Form.Label>
                                    {errors.image && (
                                        <div className="text-danger small mt-2">{errors.image}</div>
                                    )}
                                    <div className="text-muted small mt-2">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Max file size: 2MB
                                    </div>
                                </div>
                            </Form.Group>

                            {/* Detail images */}
                            <Form.Group>
                                <Form.Label className="fw-semibold text-secondary">
                                    Detail images
                                </Form.Label>
                                {detailImagePreviews.map((preview, index) => (
                                    <div key={index} className="mb-2">
                                        <div className="d-flex gap-2 align-items-center">
                                            <div style={{ flex: 1 }}>
                                                {preview ? (
                                                    <Image
                                                        src={preview}
                                                        alt={`Detail ${index + 1}`}
                                                        style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                                                        className="border rounded"
                                                    />
                                                ) : (
                                                    <Form.Label className="btn btn-outline-secondary btn-sm w-100 mb-0">
                                                        <i className="bi bi-image me-2"></i>
                                                        Select image {index + 1}
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleDetailImageChange(e, index)}
                                                            style={{ display: 'none' }}
                                                        />
                                                    </Form.Label>
                                                )}
                                            </div>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeDetailImageField(index)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="w-100 mt-2"
                                    onClick={addDetailImageField}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add detail image
                                </Button>
                            </Form.Group>
                        </Col>

                        {/* Right column: Information */}
                        <Col md={8}>
                            <Row className="mb-3">
                                {/* ID - read only */}
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
                                        <Form.Label className="fw-semibold text-secondary">
                                            Car name <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            isInvalid={!!errors.name}
                                            placeholder="Enter car name"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Description */}
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Description <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            isInvalid={!!errors.description}
                                            placeholder="Enter detailed description of the car"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Price */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Price (VND) <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            isInvalid={!!errors.price}
                                            placeholder="Enter car price"
                                            min="0"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.price}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* Stock */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Stock <span className="text-danger">*</span>
                                        </Form.Label>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => handleStockChange(-1)}
                                                disabled={formData.stock <= 1}
                                            >
                                                <i className="bi bi-dash"></i>
                                            </Button>
                                            <Form.Control
                                                type="number"
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleChange}
                                                isInvalid={!!errors.stock}
                                                min="1"
                                                className="text-center"
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => handleStockChange(1)}
                                            >
                                                <i className="bi bi-plus"></i>
                                            </Button>
                                        </div>
                                        {errors.stock && (
                                            <div className="text-danger small mt-1">{errors.stock}</div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Transmission */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Transmission <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="transmission"
                                            value={formData.transmission}
                                            onChange={handleChange}
                                            isInvalid={!!errors.transmission}
                                        >
                                            <option value="">Select transmission type</option>
                                            <option value="Automatic">Automatic</option>
                                            <option value="Manual">Manual</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.transmission}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* Fuel type */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Fuel type <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="fuel_type"
                                            value={formData.fuel_type}
                                            onChange={handleChange}
                                            isInvalid={!!errors.fuel_type}
                                        >
                                            <option value="">Select fuel type</option>
                                            <option value="gasoline">Gasoline</option>
                                            <option value="diesel">Diesel</option>
                                            <option value="electric">Electric</option>
                                            <option value="hybrid">Hybrid</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.fuel_type}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Seats */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Seats <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="seats"
                                            value={formData.seats}
                                            onChange={handleChange}
                                            isInvalid={!!errors.seats}
                                        >
                                            <option value="">Select seats</option>
                                            <option value="4">4 seats</option>
                                            <option value="5">5 seats</option>
                                            <option value="7">7 seats</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.seats}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* Doors */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Doors <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="doors"
                                            value={formData.doors}
                                            onChange={handleChange}
                                            isInvalid={!!errors.doors}
                                        >
                                            <option value="">Select doors</option>
                                            <option value="4">4 doors</option>
                                            <option value="5">5 doors</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.doors}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* Category */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Category <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            isInvalid={!!errors.category_id}
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.category_id}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
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
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CarEditModal;
