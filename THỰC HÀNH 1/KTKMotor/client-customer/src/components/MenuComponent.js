import axios from 'axios';
import React, { Component } from 'react';
import { Layout, Menu, Input, Button, AutoComplete } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class MenuComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            txtKeyword: '',
            categoriesOptions: []
        };
    }

    render() {
        const menuItems = [
            {
                key: 'home',
                icon: <HomeOutlined />,
                label: 'Home',
                onClick: () => this.props.navigate('/'),
            },
            ...this.state.categories.map((cat) => ({
                key: cat._id,
                label: cat.name,
                onClick: () => this.props.navigate('/product/category/' + cat._id),
            })),
        ];

        return (
            <Layout.Header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#001529',
                    paddingLeft: '50px',
                    paddingRight: '50px',
                }}
            >
                <Menu
                    mode="horizontal"
                    items={menuItems}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        background: 'transparent',
                    }}
                    theme="dark"
                />
                <form
                    style={{ display: 'flex', gap: '8px' }}
                    onSubmit={(e) => this.btnSearchClick(e)}
                >
                    <Input
                        placeholder="Enter keyword"
                        value={this.state.txtKeyword}
                        onChange={(e) => this.setState({ txtKeyword: e.target.value })}
                        style={{ width: '200px' }}
                    />
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        htmlType="submit"
                    >
                        SEARCH
                    </Button>
                </form>
            </Layout.Header>
        );
    }

    componentDidMount() {
        this.apiGetCategories();
    }

    // event-handlers
    btnSearchClick(e) {
        e.preventDefault();
        if (this.state.txtKeyword.trim()) {
            this.props.navigate('/product/search/' + this.state.txtKeyword);
        }
    }

    // apis
    apiGetCategories() {
        axios.get('/api/customer/categories').then((res) => {
            this.setState({ categories: res.data });
        });
    }
}

export default withRouter(MenuComponent);
