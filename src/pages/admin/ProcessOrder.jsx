import React from 'react';
import AdminLayout from '../../layouts/admin/AdminLayout';

const ProcessOrder = () => {
    return (
        <AdminLayout>
            <div className="container py-4">
                <div className="mb-4 border-bottom pb-2">
                    <h2 className="fw-bold mb-1">
                        Xử lý đơn hàng
                    </h2>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Đơn hàng chờ xử lý</h5>
                                <p className="card-text">Danh sách các đơn hàng chờ xử lý.</p>
                                <a href="#" className="btn btn-primary">Xem chi tiết</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Đơn hàng đã xử lý</h5>
                                <p className="card-text">Danh sách các đơn hàng đã xử lý.</p>
                                <a href="#" className="btn btn-primary">Xem chi tiết</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProcessOrder;
