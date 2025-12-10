export const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);
};

export const parseCarPrice = (priceString) => {
    if (!priceString) return 0;
    return parseInt(String(priceString).replace(/[^0-9]/g, ""), 10);
};