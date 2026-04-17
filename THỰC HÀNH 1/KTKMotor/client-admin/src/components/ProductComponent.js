import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import '../styles/general.css';
import '../styles/datatable.css';
import '../styles/product.css';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
    static contextType = MyContext; // using this.context to access global state
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            noPages: 0,
            curPage: 1,
            itemSelected: null,
            showDetail: false
        };
    }
    render() {
        const prods = this.state.products.map((item) => {
            return (
                <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{new Date(item.cdate).toLocaleString()}</td>
                    <td>{item.category.name}</td>
                    <td><img src={"data:image/jpg;base64," + item.image} width="100px" height="100px" alt="" /></td>
                </tr>
            );
        });
        const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
            if ((index + 1) === this.state.curPage) {
                return (<span key={index}>| <b>{index + 1}</b> | </span>);
            } else {
                return (<span key={index} className="link" onClick={() => this.lnkPageClick(index + 1)}>| {index + 1} | </span>);
            }
        });
        return (
            <div className="product-page">
                <div className="product-header">
                    <div>
                        <h2>Quản lý sản phẩm xe máy</h2>
                        <p className="product-subtitle">Thêm, sửa, xoá nhanh sản phẩm để điều hành cửa hàng</p>
                    </div>
                    <button className="product-button" onClick={() => this.handleAddNew()}>
                        ADD NEW PRODUCT
                    </button>
                </div>
                <div className="product-table-container">
                    <table className="product-table" border="0">
                        <tbody>
                            <tr className="datatable">
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Creation date</th>
                                <th>Category</th>
                                <th>Image</th>
                            </tr>
                            {prods}
                            <tr>
                                <td colSpan="6">{pagination}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {this.state.showDetail && (
                    <div className="modal-backdrop" onClick={() => this.closeDetail()}>
                        <div className="modal-window product-modal" onClick={(e) => e.stopPropagation()}>
                            <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} onClose={() => this.closeDetail()} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
    componentDidMount() {
        this.apiGetProducts(this.state.curPage);
    }
    // event-handlers
    lnkPageClick(index) {
        this.apiGetProducts(index);
    }
    trItemClick(item) {
        this.setState({ itemSelected: item, showDetail: true });
    }

    handleAddNew() {
        this.setState({ itemSelected: { _id: '', name: '', price: '', category: { _id: '' }, image: '' }, showDetail: true });
    }

    closeDetail() {
        this.setState({ showDetail: false, itemSelected: null });
    }
    // apis
    apiGetProducts(page) {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/products?page=' + page, config).then((res) => {
            const result = res.data;
            this.setState({ products: result.products, noPages: result.noPages, curPage: result.curPage });
        });
    }
    updateProducts = (products, noPages) => { // arrow-function
        this.setState({ products: products, noPages: noPages });
    }
}
export default Product;
