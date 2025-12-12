import React, { useState, useEffect } from 'react';
import { Table, Button, Image, Spinner, Alert, Form, InputGroup, Pagination } from 'react-bootstrap';
import AdminLayout from '../../layouts/admin/AdminLayout';
import { getCars, applyAllFilters, getMinMaxPrice } from '../../services/carsApi';
import { getCategory } from '../../services/categoryApi';
import CreateCarModal from './CreateCarModal';

const ManageCar = () => {
    // State quản lý danh sách xe
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 100000 });
    const [priceMinMax, setPriceMinMax] = useState({ min: 0, max: 100000 });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Load danh sách xe khi component mount
    useEffect(() => {
        loadCars();
    }, []);

    // Áp dụng filters khi có thay đổi
    useEffect(() => {
        const filters = {
            searchTerm,
            categoryId: categoryFilter,
            stockFilter,
            priceRange
        };

        const filtered = applyAllFilters(cars, filters);
        setFilteredCars(filtered);
        setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
    }, [cars, searchTerm, categoryFilter, stockFilter, priceRange]);

    // Hàm lấy danh sách xe từ API
    const loadCars = async () => {
        try {
            setLoading(true);
            const [carsData, categoriesData] = await Promise.all([
                getCars(),
                getCategory()
            ]);

            setCars(carsData);
            setFilteredCars(carsData);
            setCategories(categoriesData);

            // Tính min/max price để set range slider
            const minMax = getMinMaxPrice(carsData);
            setPriceMinMax(minMax);
            setPriceRange(minMax);
            setTempPriceRange(minMax);

            setError('');
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách xe');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi tạo xe thành công
    const handleCarCreated = () => {
        loadCars(); // Reload danh sách xe
    };

    // Xử lý thay đổi từ khóa tìm kiếm
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Xử lý thay đổi lọc category
    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    // Xử lý thay đổi lọc stock
    const handleStockFilterChange = (e) => {
        setStockFilter(e.target.value);
    };

    // Xử lý thay đổi giá min (range slider)
    const handleMinPriceChange = (e) => {
        const value = parseFloat(e.target.value);
        setTempPriceRange(prev => ({ ...prev, min: value }));
    };

    // Xử lý thay đổi giá max (range slider)
    const handleMaxPriceChange = (e) => {
        const value = parseFloat(e.target.value);
        setTempPriceRange(prev => ({ ...prev, max: value }));
    };

    // Apply price filter khi kéo - với validation
    const handlePriceRangeChange = () => {
        console.log('Price range change triggered:', tempPriceRange);

        // Validate: min phải < max
        if (tempPriceRange.min > tempPriceRange.max) {
            // Không apply nếu min > max
            alert('Giá tối thiểu phải nhỏ hơn giá tối đa!');
            setTempPriceRange(priceRange); // Reset về giá trị cũ
            return;
        }

        console.log('Applying price range:', tempPriceRange);
        setPriceRange(tempPriceRange);
    };

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Helper function để lấy tên category từ category_id
    const getCategoryNameById = (categoryId) => {
        const category = categories.find(cat => cat.id === String(categoryId));
        return category ? category.name : 'Unknown';
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCars.length / itemsPerPage);

    // Tạo pagination items
    const getPaginationItems = () => {
        let items = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => setCurrentPage(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="mb-4 border-bottom pb-2">
                    <h2 className="fw-bold mb-1">
                        Quản lý mẫu xe
                    </h2>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                <Form className="mb-3">
                    <div className="row g-2 align-items-center">
                        {/* Tìm kiếm theo tên */}
                        <div className="col-auto" style={{ minWidth: 280 }}>
                            <InputGroup>
                                <InputGroup.Text>
                                    <i className="bi bi-search"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm kiếm theo tên xe..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </Button>
                                )}
                            </InputGroup>
                        </div>

                        {/* Lọc theo dòng xe */}
                        <div className="col-auto">
                            <Form.Select
                                value={categoryFilter}
                                onChange={handleCategoryFilterChange}
                                style={{ minWidth: 160 }}
                            >
                                <option value="all">Tất cả dòng xe</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>

                        {/* Lọc theo số lượng */}
                        <div className="col-auto">
                            <Form.Select
                                value={stockFilter}
                                onChange={handleStockFilterChange}
                                style={{ minWidth: 140 }}
                            >
                                <option value="all">Tình trạng</option>
                                <option value="in-stock">Còn hàng</option>
                                <option value="out-of-stock">Hết hàng</option>
                            </Form.Select>
                        </div>

                        {/* Lọc theo khoảng giá - Range Slider */}
                        <div className="col-auto">
                            <div className="border rounded p-2">
                                <Form.Label className="mb-2">
                                    Lọc theo giá: {formatPrice(tempPriceRange.min)} - {formatPrice(tempPriceRange.max)}
                                </Form.Label>
                                <div className="d-flex gap-3 align-items-center">
                                    <div style={{ flex: 1 }}>
                                        <Form.Label className="small text-muted mb-1">Giá tối thiểu</Form.Label>
                                        <Form.Range
                                            min={priceMinMax.min}
                                            max={priceMinMax.max}
                                            step={(priceMinMax.max - priceMinMax.min) / 100}
                                            value={tempPriceRange.min}
                                            onChange={handleMinPriceChange}
                                            onMouseUp={handlePriceRangeChange}
                                            onTouchEnd={handlePriceRangeChange}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Form.Label className="small text-muted mb-1">Giá tối đa</Form.Label>
                                        <Form.Range
                                            min={priceMinMax.min}
                                            max={priceMinMax.max}
                                            step={(priceMinMax.max - priceMinMax.min) / 100}
                                            value={tempPriceRange.max}
                                            onChange={handleMaxPriceChange}
                                            onMouseUp={handlePriceRangeChange}
                                            onTouchEnd={handlePriceRangeChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nút thêm xe */}
                        <div className="col ms-auto text-end">
                            <Button
                                variant="primary"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <i className="bi bi-plus-circle-fill me-2"></i>
                                Thêm loại xe
                            </Button>
                        </div>
                    </div>



                </Form>

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Đang tải...</span>
                        </Spinner>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <Table bordered hover style={{ fontSize: 14 }}>
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '4px 6px', width: '5%' }}>STT</th>
                                        <th style={{ textAlign: 'left', padding: '4px 6px', width: '12%' }}>Ảnh</th>
                                        <th style={{ textAlign: 'left', padding: '4px 6px', width: '28%' }}>Tên</th>
                                        <th style={{ textAlign: 'left', padding: '4px 6px', width: '10%' }}>Dòng xe</th>
                                        <th style={{ textAlign: 'left', padding: '4px 6px', width: '15%' }}>Bảng giá</th>
                                        <th style={{ textAlign: 'left', padding: '4px 6px', width: '10%' }}>Số lượng</th>
                                        <th style={{ textAlign: 'left', padding: '4px 6px', width: '20%' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ padding: '18px 6px', textAlign: 'left', verticalAlign: 'middle', color: '#888' }}>
                                                <div>
                                                    <i className="bi bi-inbox" style={{ fontSize: 28, opacity: 0.5 }}></i>
                                                    <span className="ms-2 fw-bold">Không tìm thấy dữ liệu</span>
                                                    {searchTerm && currentItems.length === 0 && (
                                                        <span className="ms-2 small">Không có kết quả nào cho từ khóa "{searchTerm}"</span>
                                                    )}
                                                    {tempPriceRange.min > tempPriceRange.max && (
                                                        <span className="ms-2 small text-danger">Giá tối thiểu phải nhỏ hơn giá tối đa!</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((car, index) => (
                                            <tr key={`${car.id}-${indexOfFirstItem + index}`}>
                                                <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '4px 6px' }}>
                                                    {indexOfFirstItem + index + 1}
                                                </td>
                                                <td style={{ padding: '0', verticalAlign: 'middle', width: '100px', height: '45px' }}>
                                                    <Image
                                                        src={car.image || 'https://via.placeholder.com/50'}
                                                        alt={car.name}
                                                        style={{ width: '70%', height: '70%', objectFit: 'cover', display: 'block' }}
                                                    />
                                                </td>
                                                <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '4px 6px' }}>{car.name}</td>
                                                <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '4px 6px' }}>
                                                    <span>{getCategoryNameById(car.category_id)}</span>
                                                </td>
                                                <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '4px 6px' }}>
                                                    <span>{formatPrice(car.price)}</span>
                                                </td>
                                                <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '4px 6px' }}>
                                                    <span
                                                        className={`badge ${car.stock > 0 ? 'bg-success' : 'bg-danger'}`}
                                                        style={car.stock === 0 ? { color: 'white' } : {}}
                                                    >
                                                        {car.stock > 0 ? `Còn ${car.stock}` : 'Hết hàng'}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '4px 6px' }}>
                                                    <Button
                                                        size="sm"
                                                        variant="info"
                                                        className="me-1"
                                                        disabled
                                                        title="Xem chi tiết (Phần 2)"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="warning"
                                                        className="me-1"
                                                        disabled
                                                        title="Chỉnh sửa (Phần 2)"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        disabled
                                                        title="Xóa (Phần 2)"
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {filteredCars.length > 0 && (
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className="text-muted">
                                    Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredCars.length)} / {filteredCars.length} loại xe
                                </span>

                                {totalPages > 1 && (
                                    <Pagination className="mb-0">
                                        <Pagination.First
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                        />
                                        <Pagination.Prev
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        />
                                        {getPaginationItems()}
                                        <Pagination.Next
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        />
                                        <Pagination.Last
                                            onClick={() => setCurrentPage(totalPages)}
                                            disabled={currentPage === totalPages}
                                        />
                                    </Pagination>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create Car Modal */}
            <CreateCarModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onCarCreated={handleCarCreated}
            />
        </AdminLayout>
    );
};

export default ManageCar;
