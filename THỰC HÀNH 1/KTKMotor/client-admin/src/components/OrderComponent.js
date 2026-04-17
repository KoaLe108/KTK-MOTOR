import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  render() {
    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trOrderClick(item)}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
          <td>
            {item.status !== 'completed' ? (
              <span className="link" onClick={(e) => { e.stopPropagation(); this.lnkConfirmClick(item._id); }}>CONFIRM</span>
            ) : (
              <span>Completed</span>
            )}
          </td>
        </tr>
      );
    });

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
      <div>
        <div className="align-center">
          <h2 className="text-center">ORDER LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th><th>Creation date</th><th>Cust.name</th>
                <th>Cust.phone</th><th>Total</th><th>Status</th><th>Action</th>
              </tr>
              {orders}
            </tbody>
          </table>
        </div>
        {this.state.order ? (
          <div className="align-center">
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
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
    this.apiGetOrders();
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkConfirmClick(id) {
    if (window.confirm('Are you sure to confirm this order?')) {
      this.apiPutOrderStatus(id, 'completed');
    }
  }

  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/' + id + '/status', body, config).then((res) => {
      if (res.data.success) {
        alert('Order confirmed!');
        this.apiGetOrders(); // Refresh the list
      } else {
        alert('Failed to confirm order');
      }
    });
  }
}
export default Order;