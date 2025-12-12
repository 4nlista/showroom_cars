import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';


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


//3. thêm 1 loại xe mới (Validate dữ liệu , giá cả, thông tin, hình ảnh...)



//4. xóa 1 loại xe theo ID



//5. cập nhât thông tin loại xe theo ID -- chỉ sửa ảnh, thông tin , giá cả... 
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