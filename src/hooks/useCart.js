import { useState, useEffect, useCallback } from 'react';
import { getCart, addToCart, updateCart, deleteCartItem } from '../services/cartApi';
import getCarDetail from '../services/carDetail';

export const useCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const cartData = await getCart();

            // Lấy danh sách ID đã chọn từ localStorage
            const selectedIdsStr = localStorage.getItem('selectedCartItems');
            const selectedIds = selectedIdsStr ? JSON.parse(selectedIdsStr) : [];

            const itemsWithDetails = await Promise.all(
                cartData.map(async (cartItem) => {
                    try {
                        const productDetail = await getCarDetail(cartItem.car_id);
                        return {
                            id: cartItem.id,
                            car_id: cartItem.car_id,
                            quantity: cartItem.quantity,
                            name: productDetail.name,
                            image: productDetail.image,
                            price: productDetail.price,
                            transmission: productDetail.transmission,
                            fuel_type: productDetail.fuel_type,
                            seats: productDetail.seats,
                            doors: productDetail.doors,
                            selected: selectedIds.includes(cartItem.id), // Khôi phục trạng thái selected
                        };
                    } catch (err) {
                        console.error(`Error fetching product ${cartItem.car_id}:`, err);
                        return null;
                    }
                })
            );

            const validItems = itemsWithDetails.filter(item => item !== null);
            setCartItems(validItems);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addItem = useCallback(async (productId, quantity = 1) => {
        try {
            // Kiểm tra authentication trước khi thêm vào giỏ hàng
            const user = localStorage.getItem('user');
            if (!user) {
                return {
                    success: false,
                    error: 'NOT_AUTHENTICATED',
                    message: 'Please login to add items to cart'
                };
            }

            const existingItem = cartItems.find(item => String(item.car_id) === String(productId));

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                await updateCart(existingItem.id, newQuantity);
                await fetchCart();
            } else {
                await addToCart({
                    car_id: productId,
                    quantity: quantity,
                });
                await fetchCart();
            }

            window.dispatchEvent(new Event('cartUpdated'));

            return { success: true, isUpdate: !!existingItem };
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError(err);
            return { success: false, error: err };
        }
    }, [cartItems, fetchCart]);

    const updateItemQuantity = useCallback(async (cartItemId, quantity) => {
        try {
            setCartItems(prev =>
                prev.map(item =>
                    item.id === cartItemId
                        ? { ...item, quantity: Math.max(1, quantity) }
                        : item
                )
            );

            await updateCart(cartItemId, Math.max(1, quantity));

            return { success: true };
        } catch (err) {
            console.error('Error updating cart:', err);
            setError(err);
            await fetchCart();
            return { success: false, error: err };
        }
    }, [fetchCart]);

    const removeItem = useCallback(async (cartItemId) => {
        const oldItems = cartItems;

        try {
            setCartItems(prev => prev.filter(item => item.id !== cartItemId));

            await deleteCartItem(cartItemId);

            window.dispatchEvent(new Event('cartUpdated'));

            return { success: true };
        } catch (err) {
            console.error('Error removing from cart:', err);
            setError(err);
            setCartItems(oldItems);
            return { success: false, error: err };
        }
    }, [cartItems]);

    const toggleItemSelection = useCallback((cartItemId, selected) => {
        setCartItems(prev => {
            const updated = prev.map(item =>
                item.id === cartItemId ? { ...item, selected } : item
            );
            // Lưu danh sách ID đã chọn vào localStorage
            const selectedIds = updated.filter(item => item.selected).map(item => item.id);
            localStorage.setItem('selectedCartItems', JSON.stringify(selectedIds));
            return updated;
        });
    }, []);

    const toggleAllSelection = useCallback((selected) => {
        setCartItems(prev => {
            const updated = prev.map(item => ({ ...item, selected }));
            // Lưu danh sách ID đã chọn vào localStorage
            const selectedIds = selected ? updated.map(item => item.id) : [];
            localStorage.setItem('selectedCartItems', JSON.stringify(selectedIds));
            return updated;
        });
    }, []);

    const removeSelectedItems = useCallback(async () => {
        const selectedIds = cartItems.filter(item => item.selected).map(item => item.id);

        try {
            await Promise.all(selectedIds.map(id => deleteCartItem(id)));
            setCartItems(prev => prev.filter(item => !item.selected));

            window.dispatchEvent(new Event('cartUpdated'));

            return { success: true };
        } catch (err) {
            console.error('Error removing selected items:', err);
            setError(err);
            await fetchCart();
            return { success: false, error: err };
        }
    }, [cartItems, fetchCart]);

    const getCartCount = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const getUniqueItemCount = useCallback(() => {
        return cartItems.length;
    }, [cartItems]);

    const getSelectedCount = useCallback(() => {
        return cartItems.filter(item => item.selected).length;
    }, [cartItems]);

    const getSelectedTotal = useCallback(() => {
        return cartItems
            .filter(item => item.selected)
            .reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const isAllSelected = useCallback(() => {
        return cartItems.length > 0 && cartItems.every(item => item.selected);
    }, [cartItems]);

    const getSelectedItems = useCallback(() => {
        return cartItems.filter(item => item.selected);
    }, [cartItems]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        const handleCartUpdate = () => {
            fetchCart();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [fetchCart]);

    return {
        cartItems,
        loading,
        error,
        fetchCart,
        addItem,
        updateItemQuantity,
        removeItem,
        toggleItemSelection,
        toggleAllSelection,
        removeSelectedItems,
        getCartCount,
        getUniqueItemCount,
        getSelectedCount,
        getSelectedTotal,
        isAllSelected,
        getSelectedItems,
    };
};