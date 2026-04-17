import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import '../styles/general.css';
import '../styles/datatable.css';
import '../styles/category.css';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
      showDetail: false
    };
  }
  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
        </tr>
      );
    });
    return (
      <div className="category-page">
        <div className="category-header">
          <div>
            <h2>Cửa hàng xe máy KTK</h2>
            <p className="category-subtitle">Quản lý danh mục xe máy, cập nhật nhanh sản phẩm và bộ lọc theo loại</p>
          </div>
          <button className="category-button" onClick={() => this.handleAddNew()}>
            ADD NEW CATEGORY
          </button>
        </div>
        <div className="category-table-container">
          <table className="category-table" border="0">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
              </tr>
              {cates}
            </tbody>
          </table>
        </div>
        {this.state.showDetail && (
          <div className="modal-backdrop" onClick={() => this.closeDetail()}>
            <div className="modal-window category-modal" onClick={(e) => e.stopPropagation()}>
              <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} onClose={() => this.closeDetail()} />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // THÊM MỚI: Hàm updateCategories để cập nhật lại state từ component con
  updateCategories = (categories) => {
    this.setState({ categories: categories });
  }

  componentDidMount() {
    this.apiGetCategories();
  }
  // event-handlers
  handleAddNew() {
    this.setState({ itemSelected: { _id: '', name: '' }, showDetail: true });
  }

  trItemClick(item) {
    this.setState({ itemSelected: item, showDetail: true });
  }

  closeDetail() {
    this.setState({ showDetail: false, itemSelected: null });
  }
  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default Category;