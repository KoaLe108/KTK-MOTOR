import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext'; // 1. Import MyContext

class ProductDetail extends Component {
    static contextType = MyContext; // 2. Thiết lập contextType để dùng this.context

    constructor(props) {
        super(props);
        this.state = {
            product: null,
            txtQuantity: 1 // 3. Khởi tạo giá trị mặc định cho ô nhập số lượng
        };
    }

    render() {
        const prod = this.state.product;
        if (prod != null) {
            return (
                <div className="align-center">
                    <h2 className="text-center">PRODUCT DETAILS</h2>
                    <figure className="caption-right">
                        <img src={"data:image/jpg;base64," + prod.image} width="400px" height="400px" alt="" />
                        <figcaption>
                            <form>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td align="right">ID:</td>
                                            <td>{prod._id}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Name:</td>
                                            <td>{prod.name}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Price:</td>
                                            <td>{prod.price}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Category:</td>
                                            <td>{prod.category.name}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Quantity:</td>
                                            <td>
                                                <input 
                                                    type="number" min="1" max="99" 
                                                    value={this.state.txtQuantity} 
                                                    onChange={(e) => { this.setState({ txtQuantity: e.target.value }) }} 
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <input 
                                                    type="submit" value="ADD TO CART"
                                                    onClick={(e) => this.btnAdd2CartClick(e)} 
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </figcaption>
                    </figure>
                </div>
            );
        }
        return (<div />);
    }

    componentDidMount() {
        const params = this.props.params;
        this.apiGetProduct(params.id);
    }

    // apis
    apiGetProduct(id) {
        axios.get('/api/customer/products/' + id).then((res) => {
            const result = res.data;
            this.setState({ product: result });
        });
    }

    // event-handlers
    // event-handlers
    btnAdd2CartClick(e) {
        e.preventDefault();
        const { product, txtQuantity } = this.state;
        const quantity = parseInt(txtQuantity);

        if (quantity > 0) {
            // 1. Tạo bản sao mới của mảng giỏ hàng
            const mycart = [...this.context.mycart];
            
            // 2. Tìm vị trí sản phẩm
            const index = mycart.findIndex(x => x.product._id === product._id);

            if (index === -1) {
                // Thêm mới nếu chưa có
                mycart.push({ product: product, quantity: quantity });
            } else {
                // 3. QUAN TRỌNG: Tạo một object mới cho item này thay vì sửa trực tiếp
                // Điều này giúp React chắc chắn nhận ra sự thay đổi để cập nhật giao diện
                const updatedItem = { 
                    ...mycart[index], 
                    quantity: mycart[index].quantity + quantity 
                };
                mycart[index] = updatedItem;
            }

            // 4. Cập nhật vào context
            this.context.setMycart(mycart);
            
            // 5. Reset lại ô nhập số lượng về 1 (tùy chọn nhưng nên làm)
            this.setState({ txtQuantity: 1 });
            
            alert('OK BABY!');
        } else {
            alert('Please input quantity');
        }
    }
}

export default withRouter(ProductDetail);