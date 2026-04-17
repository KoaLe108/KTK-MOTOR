import React, { Component } from 'react';
import '../styles/general.css';
import '../styles/home.css';

class Home extends Component {
  render() {
    return (
      <div className="home-page">
        <div className="home-welcome">
          <h2>WELCOME BACK TO KTK MOTOR ADMIN</h2>
          <p>
            Quản lý cửa hàng bán xe máy một cách nhanh chóng và trực quan. Tăng trưởng doanh thu, kiểm soát đơn hàng, và quản lý sản phẩm một cách hiệu quả với giao diện tông đỏ đặc trưng.
          </p>
          <p className="home-highlight">Hãy chọn một mục trong thanh điều hướng để bắt đầu.</p>
        </div>
      </div>
    );
  }
}
export default Home;