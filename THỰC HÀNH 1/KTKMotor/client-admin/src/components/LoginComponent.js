import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import '../styles/general.css';

const styles = {
  loginPage: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at top left, rgba(229, 115, 115, 0.2), transparent 25%), linear-gradient(180deg, #fff0f0 0%, #fde3e3 100%)',
    padding: '24px'
  },
  loginCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '32px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.96)',
    boxShadow: '0 24px 60px rgba(183, 28, 28, 0.15)',
    border: '1px solid rgba(183, 28, 28, 0.18)'
  },
  title: {
    marginBottom: '24px',
    color: '#b71c1c',
    textAlign: 'center'
  },
  loginField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px'
  },
  label: {
    fontWeight: 700,
    color: '#7f1717'
  },
  input: {
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #f2c2c2',
    background: '#fff7f7'
  },
  loginActions: {
    textAlign: 'center'
  },
  loginButton: {
    width: '100%',
    padding: '12px 18px',
    border: 'none',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #c62828 0%, #d32f2f 100%)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer'
  },
  loginButtonHover: {
    opacity: 0.95
  }
};

class Login extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      isHovering: false
    };
  }
  render() {
    if (this.context.token === '') {
      const buttonStyle = this.state.isHovering
        ? { ...styles.loginButton, ...styles.loginButtonHover }
        : styles.loginButton;

      return (
        <div style={styles.loginPage}>
          <div style={styles.loginCard}>
            <h2 style={styles.title}>KTK MOTOR ADMIN LOGIN</h2>
            <form onSubmit={(e) => this.btnLoginClick(e)}>
              <div style={styles.loginField}>
                <label style={styles.label}>Username</label>
                <input
                  style={styles.input}
                  type="text"
                  value={this.state.txtUsername}
                  onChange={(e) => this.setState({ txtUsername: e.target.value })}
                />
              </div>
              <div style={styles.loginField}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  value={this.state.txtPassword}
                  onChange={(e) => this.setState({ txtPassword: e.target.value })}
                />
              </div>
              <div style={styles.loginActions}>
                <button
                  type="submit"
                  style={buttonStyle}
                  onMouseEnter={() => this.setState({ isHovering: true })}
                  onMouseLeave={() => this.setState({ isHovering: false })}
                >
                  LOGIN
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
    return (<div />);
  }
  // event-handlers
  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      alert('Please input username and password');
    }
  }
  // apis
  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        alert(result.message);
      }
    }).catch((error) => {
      console.error('Login error:', error);
      alert('Login error: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    });
  }
}
export default Login;