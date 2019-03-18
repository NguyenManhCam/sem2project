import React, { Component } from "react";
import { Layout, Icon, Avatar, Badge } from "antd";
import avatarDefault from "../images/avatarDefault.png";

const { Header } = Layout;

export default class Headers extends Component {

  render() {
    return (
      <Header style={{ background: "#fff", padding: 0 }}>
        <Icon
          className="trigger"
          type={this.props.collapsed ? "menu-unfold" : "menu-fold"}
          onClick={this.props.toggle}
        />
        <div className="avatar">
          <Badge count={2}><Avatar size={32} src={avatarDefault} /></Badge>
        </div>
      </Header>
    );
  }
}
