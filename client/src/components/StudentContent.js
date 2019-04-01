import React, { Component } from "react";
import { Layout, Breadcrumb, Row, Col, Tag } from "antd";
import { Link } from "react-router-dom";
import axios from "../axios";
import TableStudent from "./TableStudent";

const { Content } = Layout;

export default class StudentContent extends Component {
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
              Học sinh
            </Breadcrumb.Item>
          </Breadcrumb>
        </Content>
        <Content>
            <TableStudent />
        </Content>
      </div>
    );
  }
}
