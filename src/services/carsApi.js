import axios from 'axios';
import API_BASE_URL from '../config';

// Get all cars
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

// Get car detail by ID
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

  // Validate file (<= 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return 'Image size must not exceed 2MB';
  }

  // Validate file type (image only)
  if (!file.type.startsWith('image/')) {
    return 'Please select a valid image file';
  }

  return null;
};

// Handle car image upload and convert to Base64
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

  // Validate car name
  if (!formData.name?.trim()) {
    errors.name = 'Please enter car name';
  }

  // Validate description
  if (!formData.description?.trim()) {
    errors.description = 'Please enter car description';
  } else if (formData.description.trim().length < 20) {
    errors.description = 'Car description must be at least 20 characters long';
  }

  // Validate price
  if (!formData.price) {
    errors.price = 'Please enter car price';
  } else if (parseFloat(formData.price) <= 0) {
    errors.price = 'Car price must be greater than 0';
  }

  // Validate stock
  if (!formData.stock) {
    errors.stock = 'Please enter stock quantity';
  } else if (parseInt(formData.stock) < 1) {
    errors.stock = 'Stock must be at least 1';
  }

  // Validate main image
  if (!formData.image) {
    errors.image = 'Please select a primary image for the car';
  }

  // Validate transmission
  if (!formData.transmission) {
    errors.transmission = 'Please select transmission type';
  }

  // Validate fuel type
  if (!formData.fuel_type) {
    errors.fuel_type = 'Please select fuel type';
  }

  // Validate seats
  if (!formData.seats) {
    errors.seats = 'Please select number of seats';
  }

  // Validate doors
  if (!formData.doors) {
    errors.doors = 'Please select number of doors';
  }

  // Validate category
  if (!formData.category_id) {
    errors.category_id = 'Please select car category';
  }

  return errors;
};

// Create new car
export const createNewCar = async (formData) => {
  // Validation
  const errors = validateCarData(formData);

  // If there are validation errors, throw error
  if (Object.keys(errors).length > 0) {
    throw { validationErrors: errors };
  }

  try {
    // Generate next ID
    const nextId = await generateNextCarId();

    // Create new car object
    const newCar = {
      id: nextId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: String(formData.price),
      stock: parseInt(formData.stock),
      image: formData.image, // Base64 or URL
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
    // If it's a previously thrown validation error, re-throw it
    if (error.validationErrors) {
      throw error;
    }
    // For other types of errors
    console.error('Error creating car:', error);
    throw { message: 'Could not create new car' };
  }
};

// Update car information by ID (images, info, price, etc.)
export const updateCar = async (carId, formData) => {
  // Validation - reuse validateCarData
  const errors = validateCarData(formData);

  // If there are validation errors, throw error
  if (Object.keys(errors).length > 0) {
    throw { validationErrors: errors };
  }

  try {
    // Create car object for update
    const updatedCar = {
      id: carId, // Keep original ID
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: String(formData.price),
      stock: parseInt(formData.stock),
      image: formData.image, // Base64 or URL
      imageDetail: formData.imageDetail || [],
      transmission: formData.transmission,
      fuel_type: formData.fuel_type,
      seats: parseInt(formData.seats),
      doors: parseInt(formData.doors),
      category_id: parseInt(formData.category_id),
      // Keep existing rating, reviews, and view if available
      rating: formData.rating || null,
      reviews: formData.reviews || null,
      view: formData.view || null
    };

    const response = await axios.put(`${API_BASE_URL}/cars/${carId}`, updatedCar);
    console.log('Car updated:', response.data);
    return response.data;
  } catch (error) {
    // If it's a previously thrown validation error, re-throw it
    if (error.validationErrors) {
      throw error;
    }
    // For other types of errors
    console.error('Error updating car:', error);
    throw { message: 'Could not update car information' };
  }
};

// Delete a car by ID
export const deleteCar = async (carId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cars/${carId}`);
    console.log('Car deleted:', carId);
    throw response.data;
  } catch (error) {
    console.error('Error deleting car:', error);
    throw { message: 'Could not delete car' };
  }
};

// Filter cars by search keyword (car name)
export const filterCarsBySearch = (cars, searchTerm) => {
  if (!searchTerm) return cars;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return cars.filter(car =>
    car.name?.toLowerCase().includes(lowerSearchTerm)
  );
};

// Filter cars by category
export const filterCarsByCategory = (cars, categoryId) => {
  if (categoryId === 'all') return cars;
  return cars.filter(car => car.category_id === Number(categoryId));
};

// Filter cars by stock status (in stock / out of stock)
export const filterCarsByStock = (cars, stockFilter) => {
  if (stockFilter === 'all') return cars;

  if (stockFilter === 'in-stock') {
    return cars.filter(car => Number(car.stock) > 0);
  } else if (stockFilter === 'out-of-stock') {
    return cars.filter(car => Number(car.stock) === 0);
  }

  return cars;
};

// Filter cars by price range
export const filterCarsByPriceRange = (cars, minPrice, maxPrice) => {
  console.log('=== PRICE FILTER DEBUG ===');
  console.log('Min Price:', minPrice);
  console.log('Max Price:', maxPrice);
  console.log('Total cars before filter:', cars.length);

  // Validation: min must be less than max
  if (minPrice > maxPrice) {
    console.log('ERROR: min > max, returning empty array');
    return []; // Return empty if range is invalid
  }

  const filtered = cars.filter(car => {
    const price = parseFloat(car.price);
    const inRange = price >= minPrice && price <= maxPrice;
    console.log(`${car.name}: ${price.toLocaleString('vi-VN')} VND - ${inRange ? 'PASS' : 'FAIL'}`); // <<< Dòng này giữ lại định dạng 'vi-VN'
    return inRange;
  });

  console.log('Total cars after filter:', filtered.length);
  console.log('=== END PRICE FILTER ===');
  return filtered;
};

// Apply all filters simultaneously
export const applyAllFilters = (cars, filters) => {
  const { searchTerm, categoryId, stockFilter, priceRange } = filters;

  console.log('=== APPLYING ALL FILTERS ===');
  console.log('Filters:', filters);

  let filtered = cars;

  // Filter by search
  filtered = filterCarsBySearch(filtered, searchTerm);
  console.log('After search filter:', filtered.length);

  // Filter by category
  filtered = filterCarsByCategory(filtered, categoryId);
  console.log('After category filter:', filtered.length);

  // Filter by stock
  filtered = filterCarsByStock(filtered, stockFilter);
  console.log('After stock filter:', filtered.length);

  // Filter by price (with validation)
  filtered = filterCarsByPriceRange(filtered, priceRange.min, priceRange.max);
  console.log('After price filter:', filtered.length);

  return filtered;
};

// Calculate min/max price from car list
export const getMinMaxPrice = (cars) => {
  if (cars.length === 0) return { min: 0, max: 100000 };

  const prices = cars.map(car => parseFloat(car.price));
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };
};

export default getCars;