import axios from 'axios';
import API_BASE_URL from '../config';


// lấy toàn bộ danh sách các xe
export const getCars = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars`);
    console.log('List Cars:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error Cars:', error);
    throw error;
  }
};


// Lấy thông tin chi tiết loại xe dùng theo ID
export const getCarById = async (carId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/${carId}`);
    console.log('Car Detail:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching car detail:', error);
    throw error;
  }
};


//3. Tạo 1 loại xe mới (Validate dữ liệu , giá cả, thông tin, ảnh...), dùng cho CreateCarModal.jsx

// Generate next car ID
export const generateNextCarId = async () => {
  try {
    const cars = await getCars();
    if (cars.length === 0) return "1";

    const maxId = Math.max(...cars.map(car => parseInt(car.id)));
    return String(maxId + 1);
  } catch (error) {
    console.error('Error generating car ID:', error);
    throw error;
  }
};

// Validate car image file
export const validateCarImageFile = (file) => {
  if (!file) return null;

  // Validate kích thước file (max 2MB cho ảnh xe)
  if (file.size > 2 * 1024 * 1024) {
    return 'Kích thước ảnh không được vượt quá 2MB';
  }

  // Validate định dạng file
  if (!file.type.startsWith('image/')) {
    return 'Vui lòng chọn file ảnh hợp lệ';
  }

  return null;
};

// Xử lý upload image và tạo preview
export const handleCarImageUpload = (file, callback) => {
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
};

// Validate car data
export const validateCarData = (formData) => {
  const errors = {};

  // Validate tên xe
  if (!formData.name?.trim()) {
    errors.name = 'Vui lòng nhập tên xe';
  }

  // Validate mô tả
  if (!formData.description?.trim()) {
    errors.description = 'Vui lòng nhập mô tả';
  } else if (formData.description.trim().length < 20) {
    errors.description = 'Mô tả phải có ít nhất 20 ký tự';
  }

  // Validate giá
  if (!formData.price) {
    errors.price = 'Vui lòng nhập giá xe';
  } else if (parseFloat(formData.price) <= 0) {
    errors.price = 'Giá xe phải lớn hơn 0';
  }

  // Validate số lượng
  if (!formData.stock) {
    errors.stock = 'Vui lòng nhập số lượng';
  } else if (parseInt(formData.stock) < 1) {
    errors.stock = 'Số lượng phải ít nhất là 1';
  }

  // Validate ảnh chính
  if (!formData.image) {
    errors.image = 'Vui lòng chọn ảnh chính cho xe';
  }

  // Validate transmission
  if (!formData.transmission) {
    errors.transmission = 'Vui lòng chọn loại hộp số';
  }

  // Validate fuel type
  if (!formData.fuel_type) {
    errors.fuel_type = 'Vui lòng chọn loại nhiên liệu';
  }

  // Validate số chỗ ngồi
  if (!formData.seats) {
    errors.seats = 'Vui lòng chọn số chỗ ngồi';
  }

  // Validate số cửa
  if (!formData.doors) {
    errors.doors = 'Vui lòng chọn số cửa';
  }

  // Validate category
  if (!formData.category_id) {
    errors.category_id = 'Vui lòng chọn dòng xe';
  }

  return errors;
};

// Create new car
export const createNewCar = async (formData) => {
  // Validation
  const errors = validateCarData(formData);

  // Nếu có lỗi validation, throw error
  if (Object.keys(errors).length > 0) {
    throw { validationErrors: errors };
  }

  try {
    // Generate next ID
    const nextId = await generateNextCarId();

    // Tạo car object mới
    const newCar = {
      id: nextId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: String(formData.price),
      stock: parseInt(formData.stock),
      image: formData.image, // Base64 hoặc URL
      imageDetail: formData.imageDetail || [],
      transmission: formData.transmission,
      fuel_type: formData.fuel_type,
      seats: parseInt(formData.seats),
      doors: parseInt(formData.doors),
      category_id: parseInt(formData.category_id),
      rating: null,
      reviews: null,
      view: null
    };

    const response = await axios.post(`${API_BASE_URL}/cars`, newCar);
    console.log('Car created:', response.data);
    return response.data;
  } catch (error) {
    // Nếu là lỗi validation đã throw, throw lại
    if (error.validationErrors) {
      throw error;
    }
    // Nếu là lỗi khác
    console.error('Error creating car:', error);
    throw { message: 'Không thể tạo xe mới' };
  }
};

//4. xóa 1 loại xe theo ID



//5. cập nhât thông tin loại xe theo ID -- chỉ sửa ảnh, thông tin , giá cả... CarEditModal.jsx
// (Validate dữ liệu , giá cả, thông tin, hình ảnh...)




//6. Lọc xe theo từ khóa tìm kiếm (tên xe)
export const filterCarsBySearch = (cars, searchTerm) => {
  if (!searchTerm) return cars;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return cars.filter(car =>
    car.name?.toLowerCase().includes(lowerSearchTerm)
  );
};

//7. Lọc xe theo category
export const filterCarsByCategory = (cars, categoryId) => {
  if (categoryId === 'all') return cars;
  return cars.filter(car => car.category_id === Number(categoryId));
};

//8. Lọc xe theo stock (còn hàng/hết hàng)
export const filterCarsByStock = (cars, stockFilter) => {
  if (stockFilter === 'all') return cars;

  if (stockFilter === 'in-stock') {
    return cars.filter(car => Number(car.stock) > 0);
  } else if (stockFilter === 'out-of-stock') {
    return cars.filter(car => Number(car.stock) === 0);
  }

  return cars;
};

//9. Lọc xe theo khoảng giá
export const filterCarsByPriceRange = (cars, minPrice, maxPrice) => {
  console.log('=== PRICE FILTER DEBUG ===');
  console.log('Min Price:', minPrice);
  console.log('Max Price:', maxPrice);
  console.log('Total cars before filter:', cars.length);

  // Validate: min phải nhỏ hơn max
  if (minPrice > maxPrice) {
    console.log('ERROR: min > max, returning empty array');
    return []; // Không trả về xe nào nếu min > max
  }

  const filtered = cars.filter(car => {
    const price = parseFloat(car.price);
    const inRange = price >= minPrice && price <= maxPrice;
    console.log(`${car.name}: ${price.toLocaleString('vi-VN')} VND - ${inRange ? 'PASS' : 'FAIL'}`);
    return inRange;
  });

  console.log('Total cars after filter:', filtered.length);
  console.log('=== END PRICE FILTER ===');
  return filtered;
};

//10. Áp dụng tất cả các filter
export const applyAllFilters = (cars, filters) => {
  const { searchTerm, categoryId, stockFilter, priceRange } = filters;

  console.log('=== APPLYING ALL FILTERS ===');
  console.log('Filters:', filters);

  let filtered = cars;

  // Lọc theo tìm kiếm
  filtered = filterCarsBySearch(filtered, searchTerm);
  console.log('After search filter:', filtered.length);

  // Lọc theo category
  filtered = filterCarsByCategory(filtered, categoryId);
  console.log('After category filter:', filtered.length);

  // Lọc theo stock
  filtered = filterCarsByStock(filtered, stockFilter);
  console.log('After stock filter:', filtered.length);

  // Lọc theo giá (với validation)
  filtered = filterCarsByPriceRange(filtered, priceRange.min, priceRange.max);
  console.log('After price filter:', filtered.length);

  return filtered;
};

//11. Tính min/max price từ danh sách xe
export const getMinMaxPrice = (cars) => {
  if (cars.length === 0) return { min: 0, max: 100000 };

  const prices = cars.map(car => parseFloat(car.price));
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };
};


export default getCars;