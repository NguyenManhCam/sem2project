import React, { Component } from "react";
import { Layout, Breadcrumb, Row, Col, Tag } from "antd";
import { Link } from "react-router-dom";
import axios from "../axios";

const { Content } = Layout;

export default class ClassContent extends Component {
  render() {
    return (
      <div>
        <Content
          style={{
            marginTop: "2px",
            padding: 24,
            background: "#fff"
          }}
        >
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ color: "#212529" }}>
              Lớp học
            </Breadcrumb.Item>
          </Breadcrumb>
        </Content>
      </div>
    );
  }
}
