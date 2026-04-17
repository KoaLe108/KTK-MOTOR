import axios from 'axios'; // [cite: 57]
import React, { Component } from 'react'; // [cite: 58]
import MyContext from '../contexts/MyContext'; // [cite: 59]
import '../styles/general.css';
import '../styles/datatable.css';
import '../styles/customer.css';

class Customer extends Component {
  static contextType = MyContext; // Truy cập global state [cite: 62]
  
  constructor(props) {
    super(props);
    this.state = {
      customers: [], // [cite: 69]
      orders: [],    // [cite: 71]
      order: null    // [cite: 73]
    };
  }

  render() {
    // Render danh sách khách hàng [cite: 90, 91]
    const customers = this.state.customers.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trCustomerClick(item)}>
          <td>{item._id}</td>
          <td>{item.username}</td>
          <td>{item.password}</td>
          <td>{item.name}</td>
          <td>{item.phone}</td>
          <td>{item.email}</td>
          <td>{item.active}</td>
          <td>
            {item.active === 0 ? (
              <span className="link" onClick={() => this.lnkEmailClick(item)}>EMAIL</span> // [cite: 111, 562]
            ) : (
              <span className="link" onClick={() => this.lnkDeactiveClick(item)}>DEACTIVE</span> // [cite: 112, 446]
            )}
          </td>
        </tr>
      );
    });

    // Render danh sách đơn hàng của khách hàng được chọn [cite: 122, 124]
    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trOrderClick(item)}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
        </tr>
      );
    });

    // Render chi tiết một đơn hàng [cite: 144, 146]
    let items = null;
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className="datatable">
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        );
      });
    }

    return (
      <div className="customer-page">
        <div className="customer-header">
          <div>
            <h2>CUSTOMER MANAGEMENT</h2>
            <p className="customer-subtitle">Quản lý khách hàng và theo dõi đơn hàng trong hệ thống bán xe máy.</p>
          </div>
        </div>

        <div className="customer-table-container">
          <table className="customer-table" border="1">
            <tbody>
              <tr>
                <th>ID</th><th>Username</th><th>Password</th><th>Name</th>
                <th>Phone</th><th>Email</th><th>Active</th><th>Action</th>
              </tr>
              {customers}
            </tbody>
          </table>
        </div>

        {this.state.orders.length > 0 ? (
          <div className="customer-table-container">
            <h2>ORDER LIST</h2>
            <table className="customer-table" border="1">
              <tbody>
                <tr>
                  <th>ID</th><th>Creation date</th><th>Cust.name</th>
                  <th>Cust.phone</th><th>Total</th><th>Status</th>
                </tr>
                {orders}
              </tbody>
            </table>
          </div>
        ) : <div />}

        {this.state.order ? (
          <div className="customer-table-container customer-detail-card">
            <h2>ORDER DETAIL</h2>
            <table className="customer-table" border="1">
              <tbody>
                <tr>
                  <th>No.</th><th>Prod. ID</th><th>Prod.name</th><th>Image</th>
                  <th>Price</th><th>Quantity</th><th>Amount</th>
                </tr>
                {items}
              </tbody>
            </table>
          </div>
        ) : <div />}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCustomers(); // [cite: 302]
  }

  // Event-handlers
  trCustomerClick(item) {
    this.setState({ orders: [], order: null }); // [cite: 332]
    this.apiGetOrdersByCustID(item._id); // [cite: 333]
  }

  trOrderClick(item) {
    this.setState({ order: item }); // [cite: 335]
  }

  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id, item.token); // [cite: 447]
  }

  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id); // [cite: 600]
  }

  // APIs
  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } }; // [cite: 338]
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ customers: res.data }); // [cite: 340]
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } }; // [cite: 342]
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data }); // [cite: 344]
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token: token }; // [cite: 493]
    const config = { headers: { 'x-access-token': this.context.token } }; // [cite: 494]
    axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
      if (res.data) {
        this.apiGetCustomers(); // [cite: 498]
      } else {
        alert('SORRY BABY!'); // [cite: 500]
      }
    });
  }

  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } }; // [cite: 603]
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      alert(res.data.message); // [cite: 605]
    });
  }
}
export default Customer; // [cite: 350]