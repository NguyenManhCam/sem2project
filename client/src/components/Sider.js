import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";

const { Sider } = Layout;

const SubMenu = Menu.SubMenu;

class SideBar extends Component {
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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>Video Camera</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>Upload</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />
                  <span>User</span>
                </span>
              }
            >
              <Menu.Item key="4">Tom</Menu.Item>
              <Menu.Item key="5">Bill</Menu.Item>
              <Menu.Item key="6">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="team" />
                  <span>Team</span>
                </span>
              }
            >
              <Menu.Item key="7">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
            <Menu.Item key="10">
              <Icon type="shop" />
              <span>Shop</span>
            </Menu.Item>
            <Menu.Item key="11">
              <Icon type="appstore-o" />
              <span>App Store</span>
            </Menu.Item>
            <Menu.Item key="12">
              <Icon type="cloud-o" />
              <span>Cloud</span>
            </Menu.Item>
            <Menu.Item key="13">
              <Icon type="bar-chart" />
              <span>Bar Chat</span>
            </Menu.Item>
          </Menu>
        </Sider>
    );
  }
}

export default SideBar;
