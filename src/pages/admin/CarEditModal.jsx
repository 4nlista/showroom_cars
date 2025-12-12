// Modal chỉnh sửa xe (Admin)
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Image } from 'react-bootstrap';
import { updateCar, validateCarImageFile, handleCarImageUpload } from '../../services/carsApi';
import { getCategory } from '../../services/categoryApi';

const CarEditModal = ({ show, onHide, car, onCarUpdated }) => {
    // State lưu thông tin form
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

    // State lưu file ảnh
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [detailImageFiles, setDetailImageFiles] = useState([]);
    const [detailImagePreviews, setDetailImagePreviews] = useState([]);

    // State lưu categories
    const [categories, setCategories] = useState([]);

    // State lưu lỗi validation
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Load categories khi component mount
    useEffect(() => {
        if (show) {
            loadCategories();
        }
    }, [show]);

    // Load dữ liệu xe khi car thay đổi
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

    // Reset form khi đóng modal
    const handleClose = () => {
        setMainImageFile(null);
        setDetailImageFiles([]);
        setErrors({});
        setSubmitError('');
        onHide();
    };

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi khi user bắt đầu sửa
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Xử lý upload ảnh chính
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

            // Tạo preview
            handleCarImageUpload(file, (preview) => {
                setMainImagePreview(preview);
                setFormData(prev => ({ ...prev, image: preview }));
            });

            // Xóa lỗi nếu có
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: '' }));
            }
        }
    };

    // Xử lý upload ảnh chi tiết
    const handleDetailImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file
            const error = validateCarImageFile(file);
            if (error) {
                alert(error);
                return;
            }

            // Tạo preview
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
                    imageDetail: newPreviews.filter(p => p) // Lọc bỏ null/undefined
                }));
            });
        }
    };

    // Thêm field ảnh chi tiết mới
    const addDetailImageField = () => {
        setDetailImagePreviews(prev => [...prev, null]);
    };

    // Xóa field ảnh chi tiết
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

    // Xử lý thay đổi số lượng
    const handleStockChange = (delta) => {
        setFormData(prev => ({
            ...prev,
            stock: Math.max(1, prev.stock + delta)
        }));
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        setIsSubmitting(true);

        try {
            // Gọi hàm updateCar từ carsApi
            await updateCar(car.id, formData);

            // Thành công - gọi callback và đóng modal
            onCarUpdated();
            handleClose();
            alert('✅ Cập nhật xe thành công!');
        } catch (error) {
            // Xử lý lỗi
            if (error.validationErrors) {
                setErrors(error.validationErrors);
            } else {
                setSubmitError(error.message || 'Có lỗi xảy ra khi cập nhật xe');
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
                    Chỉnh sửa thông tin xe
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
                        {/* Cột bên trái: Ảnh */}
                        <Col md={4}>
                            {/* Ảnh chính */}
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-secondary">
                                    Ảnh chính <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="text-center">
                                    <div className="mb-3">
                                        <Image
                                            src={mainImagePreview || 'https://via.placeholder.com/200x150?text=Chọn+ảnh'}
                                            alt="Main"
                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                            className="border rounded"
                                        />
                                    </div>
                                    <Form.Label className="btn btn-primary btn-sm w-100">
                                        <i className="bi bi-upload me-2"></i>
                                        Chọn ảnh chính
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
                                        Dung lượng tối đa: 2MB
                                    </div>
                                </div>
                            </Form.Group>

                            {/* Ảnh chi tiết */}
                            <Form.Group>
                                <Form.Label className="fw-semibold text-secondary">
                                    Ảnh chi tiết
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
                                                        Chọn ảnh {index + 1}
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
                                    Thêm ảnh chi tiết
                                </Button>
                            </Form.Group>
                        </Col>

                        {/* Cột bên phải: Thông tin */}
                        <Col md={8}>
                            <Row className="mb-3">
                                {/* ID - Không cho sửa */}
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
                                        <Form.Label className="fw-semibold text-secondary">
                                            Tên xe <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            isInvalid={!!errors.name}
                                            placeholder="Nhập tên xe"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Mô tả */}
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Mô tả <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            isInvalid={!!errors.description}
                                            placeholder="Nhập mô tả chi tiết về xe"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                {/* Giá */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Giá (VNĐ) <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            isInvalid={!!errors.price}
                                            placeholder="Nhập giá xe"
                                            min="0"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.price}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* Số lượng */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Số lượng <span className="text-danger">*</span>
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
                                {/* Hộp số */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Hộp số <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="transmission"
                                            value={formData.transmission}
                                            onChange={handleChange}
                                            isInvalid={!!errors.transmission}
                                        >
                                            <option value="">Chọn loại hộp số</option>
                                            <option value="Automatic">Automatic</option>
                                            <option value="Manual">Manual</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.transmission}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* Nhiên liệu */}
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Nhiên liệu <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="fuel_type"
                                            value={formData.fuel_type}
                                            onChange={handleChange}
                                            isInvalid={!!errors.fuel_type}
                                        >
                                            <option value="">Chọn loại nhiên liệu</option>
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
                                {/* Số chỗ */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Số chỗ <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="seats"
                                            value={formData.seats}
                                            onChange={handleChange}
                                            isInvalid={!!errors.seats}
                                        >
                                            <option value="">Chọn số chỗ</option>
                                            <option value="4">4 chỗ</option>
                                            <option value="5">5 chỗ</option>
                                            <option value="7">7 chỗ</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.seats}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* Số cửa */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Số cửa <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="doors"
                                            value={formData.doors}
                                            onChange={handleChange}
                                            isInvalid={!!errors.doors}
                                        >
                                            <option value="">Chọn số cửa</option>
                                            <option value="4">4 cánh</option>
                                            <option value="5">5 cánh</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.doors}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* Dòng xe */}
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">
                                            Dòng xe <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            isInvalid={!!errors.category_id}
                                        >
                                            <option value="">Chọn dòng xe</option>
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
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CarEditModal;
