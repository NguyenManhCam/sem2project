import React, { Component } from "react";

export default class Login extends Component {
  state = {}

  _onLogin = () => {
    this.props.onLogin(this.state.username,this.state.password);
  }

  onChangeUsername = (e) => {
    this.setState({ username: e.target.value })
  }

  onChangePassword = (e) => {
    this.setState({ password: e.target.value })
  }
  render() {
    return (
        <div id="login">
        <div className="container">
        <form onSubmit={this._onLogin}>
          <div className="login-container f-main">
            <div className="form-banner">
              <div className="snow"></div>
              <div className="snow"></div>
              <div className="snow"></div>
              <div className="snow"></div>
            </div>
            <div class="form" ref={(bannerForm) => this.divRef = bannerForm}>
              <div className="login-title">
                <a className="logo f-heading" href="/">
                  <i className="fas fa-heartbeat"></i>
                  SEM2
                </a>
                <p>Đăng nhập</p>
              </div>
              <div className="main-form">
                <div className="username-container">
                  <label>Tên tài khoản</label>
                  <input onChange={this.onChangeUsername} type="text" name="username" placeholder="Tên tài khoản" required />
                </div>

                <div className="password-container">
                  <label>Mật khẩu</label>
                  <input onChange={this.onChangePassword} type="password" name="password" placeholder="Mật khẩu" required />
                </div>
                <div className="submit-container"><button type="submit" onClick={this._onLogin}>Đăng nhập</button></div>
              </div>
              <div className="footer-form">
                <p>
                  Bạn chưa có tài khoản?
                  <a href="javascript:;" className="open-signup">Đăng ký</a>
                </p>
              </div>
            </div>
          </div>
          </form>
        </div>
      </div>
    );
  }
}
