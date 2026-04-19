import axios from 'axios';
import React, { Component } from 'react';
import { Row, Col, Card, Image, InputNumber, Button, Spin, message, Statistic, Divider } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            product: null,
            quantity: 1,
            loading: true
        };
    }

    render() {
        const prod = this.state.product;

        if (!prod) {
            return (
                <Spin spinning={this.state.loading} style={{ minHeight: '400px' }}>
                    <div />
                </Spin>
            );
        }

        return (
            <div style={{ padding: '20px' }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => this.props.navigate(-1)}
                    style={{ marginBottom: '20px' }}
                >
                    Back
                </Button>

                <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Row gutter={32}>
                        {/* Image Section */}
                        <Col xs={24} sm={24} md={12} lg={10}>
                            <Image
                                src={"data:image/jpg;base64," + prod.image}
                                alt={prod.name}
                                preview
                                style={{
                                    borderRadius: '8px',
                                    width: '100%',
                                    height: 'auto'
                                }}
                            />
                        </Col>

                        {/* Details Section */}
                        <Col xs={24} sm={24} md={12} lg={14}>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                marginBottom: '16px',
                                color: '#333'
                            }}>
                                {prod.name}
                            </h1>

                            <Divider />

                            {/* Category */}
                            <div style={{ marginBottom: '16px' }}>
                                <span style={{ fontSize: '14px', color: '#666' }}>Category: </span>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#1890ff'
                                }}>
                                    {prod.category.name}
                                </span>
                            </div>

                            {/* Price */}
                            <div style={{ marginBottom: '24px' }}>
                                <Statistic
                                    title="Price"
                                    value={prod.price}
                                    suffix=" vnđ"
                                    valueStyle={{
                                        fontSize: '32px',
                                        color: '#ff4d4f',
                                        fontWeight: 'bold'
                                    }}
                                    formatter={(value) => value.toLocaleString('vi-VN')}
                                />
                            </div>

                            <Divider />

                            {/* Quantity Selection */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    marginBottom: '8px',
                                    display: 'block'
                                }}>
                                    Quantity:
                                </label>
                                <InputNumber
                                    min={1}
                                    max={99}
                                    value={this.state.quantity}
                                    onChange={(value) => this.setState({ quantity: value || 1 })}
                                    style={{
                                        width: '100px',
                                        marginBottom: '16px'
                                    }}
                                    size="large"
                                />
                            </div>

                            {/* Action Buttons */}
                            <Row gutter={16}>
                                <Col xs={24} sm={12} md={12}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ShoppingCartOutlined />}
                                        block
                                        onClick={() => this.btnAdd2CartClick()}
                                        style={{
                                            height: '50px',
                                            fontSize: '16px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        ADD TO CART
                                    </Button>
                                </Col>
                                <Col xs={24} sm={12} md={12}>
                                    <Button
                                        size="large"
                                        block
                                        onClick={() => this.props.navigate('/mycart')}
                                        style={{
                                            height: '50px',
                                            fontSize: '16px'
                                        }}
                                    >
                                        VIEW CART
                                    </Button>
                                </Col>
                            </Row>

                            {/* Product Info */}
                            <Divider />
                            <div style={{
                                backgroundColor: '#f5f5f5',
                                padding: '12px',
                                borderRadius: '4px',
                                marginTop: '16px'
                            }}>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                    <strong>Product ID:</strong> {prod._id.substring(0, 12)}...
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }

    componentDidMount() {
        const params = this.props.params;
        this.apiGetProduct(params.id);
    }

    // event-handlers
    btnAdd2CartClick() {
        const { product, quantity } = this.state;

        if (quantity > 0) {
            const mycart = [...this.context.mycart];
            const index = mycart.findIndex(x => x.product._id === product._id);

            if (index === -1) {
                mycart.push({ product: product, quantity: quantity });
            } else {
                mycart[index] = {
                    ...mycart[index],
                    quantity: mycart[index].quantity + quantity
                };
            }

            this.context.setMycart(mycart);
            this.setState({ quantity: 1 });
            message.success(`${product.name} added to cart!`);
        } else {
            message.error('Please select a valid quantity');
        }
    }

    // apis
    apiGetProduct(id) {
        axios
            .get('/api/customer/products/' + id)
            .then((res) => {
                this.setState({
                    product: res.data,
                    loading: false
                });
            })
            .catch(() => {
                this.setState({ loading: false });
                message.error('Product not found');
            });
    }
}

export default withRouter(ProductDetail);