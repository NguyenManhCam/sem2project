import React, { Component } from "react";
import { Layout, Icon, Avatar, Badge, Menu, Dropdown } from "antd";
import avatarDefault from "../images/avatarDefault.png";
import SearchField from "./SearchField";

const { Header } = Layout;

export default class Headers extends Component {
  state = {};

  _onCheckToggle = () => {
    this.props.toggle();
    let header = document.getElementById("header");
    if (window.pageYOffset > header.offsetTop && !this.props.collapsed) {
      header.style.position = "fixed";
      header.style.width = "100%";
      this.setState({ right: 100, rightNoti: 250 });
    } else if (window.pageYOffset > header.offsetTop && this.props.collapsed) {
      header.style.position = "fixed";
      header.style.width = "100%";
      this.setState({ right: 220, rightNoti: 370 });
    }
  };

  componentDidMount() {
    this.setState({ right: 20, rightNoti: 170 });
    let header = document.getElementById("header");
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > header.offsetTop && this.props.collapsed) {
        header.style.position = "fixed";
        header.style.width = "100%";
        this.setState({ right: 100, rightNoti: 250 });
      } else if (
        window.pageYOffset > header.offsetTop &&
        !this.props.collapsed
      ) {
        header.style.position = "fixed";
        header.style.width = "100%";
        this.setState({ right: 220, rightNoti: 370 });
      } else {
        header.style.position = "";
        this.setState({ right: 20, rightNoti: 170 });
      }
    });
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="userCenter">
          <Icon type="user" style={{ fontSize: "20px" }} /><span style={{  }}>Thông tin</span>
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" style={{ fontSize: "20px" }} />Cài đặt
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" style={{ fontSize: "20px" }}/>Trigger Error
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" style={{ fontSize: "20px" }}/>Đăng xuất
        </Menu.Item>
      </Menu>);

    return (
      <div id="header" className="f-main">
        <Header
          id="header"
          style={{ background: "#fff", padding: 0, position: "relative" }}
        >
          <Icon
            className="trigger"
            type={this.props.collapsed ? "menu-unfold" : "menu-fold"}
            onClick={this._onCheckToggle}
          />
          <span
            style={{
              position: "absolute",
              lineHeight: "64px",
            }}
          >
            <SearchField />
          </span>
          <span
            style={{
              position: "absolute",
              right: this.state.rightNoti,
              padding: "0 24px"
            }}
          >
            <Badge count={2}><Icon type="bell" style={{ fontSize: '20px' }} /></Badge>
          </span>
          <Dropdown overlay={menu}><span
            style={{
              cursor: "pointer",
              position: "absolute",
              right: this.state.right,
              padding: "0 24px"
            }}
          >
            <Avatar size={32} src={avatarDefault} />
            <span style={{ paddingLeft: "10px" }}>{`username`}</span>
          </span></Dropdown>
        </Header>
      </div>
    );
  }
}
