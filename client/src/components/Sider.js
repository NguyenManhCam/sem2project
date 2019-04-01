import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const SubMenu = Menu.SubMenu;

class SideBar extends Component {
  state = {};

  render() {
    return (
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0
        }}
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}
      >
        <div className="logo" />
        <Menu
          style={{ position: "relative" }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[
            `${
              window.location.pathname.length > 1
                ? window.location.pathname.split(
                    "/"
                  )[1]
                : window.location.pathname
            }`
          ]}
        >
          <Menu.Item key="/">
            <Link to={`/`}>
              <a>
                <Icon type="home" />
                <span>Trang chủ</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="dashboard">
            <Link to={`/dashboard`}>
              <a>
                <Icon type="dashboard" />
                <span>Thống kê</span>
              </a>
            </Link>
          </Menu.Item>

          <SubMenu
            key="manager"
            title={
              <span>
                <Icon type="table" />
                <span>Quản lý</span>
              </span>
            }
          >
            <Menu.Item key="students">
              <Link to={`/manager/students`}>
                <a>Học sinh</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="teachers">Giáo viên</Menu.Item>
          </SubMenu>
          <Menu.Item key="class">
            <Link to="/class">
              <a>
                <Icon type="book" />
                <span>Lớp học</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="sem">
            <Link to={`/sem`}>
              <a>
                <Icon type="cluster" />
                <span>Học kỳ</span>
              </a>
            </Link>
          </Menu.Item>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="user" />
                <span>Tài khoản</span>
              </span>
            }
          >
            <Menu.Item key="7">Thông tin tài khoản</Menu.Item>
            <Menu.Item key="8">Thay đổi thông tin</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

export default SideBar;
