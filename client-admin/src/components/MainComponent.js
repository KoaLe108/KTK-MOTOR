import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
// Import thêm các component khác nếu bạn đã viết xong
// import Category from './CategoryComponent';
// import Product from './ProductComponent';

class Main extends Component {
  static contextType = MyContext; // Truy cập global state để kiểm tra token

  render() {
    if (this.context.token !== '') {
      return (
        <div className="body-admin">
          <Menu />
          <Routes>
            {/* Tự động điều hướng từ /admin sang /admin/home */}
            <Route path='/admin' element={<Navigate replace to='/admin/home' />} />
            
            {/* Route cho trang Home */}
            <Route path='/admin/home' element={<Home />} />
            
            {/* Bạn có thể thêm các Route cho Category và Product tại đây */}
            {/* <Route path='/admin/category' element={<Category />} /> */}
            {/* <Route path='/admin/product' element={<Product />} /> */}
          </Routes>
        </div>
      );
    }
    // Nếu chưa đăng nhập (token rỗng), không hiển thị gì (vì App.js đã hiển thị Login rồi)
    return (<div />);
  }
}

export default Main;