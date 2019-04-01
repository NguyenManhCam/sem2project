import React, { Component } from "react";
import { Layout, Breadcrumb, Row, Col, Tag } from "antd";
import { Link } from "react-router-dom";
import axios from "../axios";

const { Content } = Layout;

export default class SemContent extends Component {
  state = {};

  componentDidMount() {
    this.getSem();
  }

  getSem = () => {
    axios
      .get("/api/sem")
      .then(data => this.setState({ data: data.data }))
      .catch(err => console.log(err));
  };

  displayData = () => {
    return this.state.data
      ? this.state.data.map((sem, index) => (
          <Col span={12}>
            <Content
              style={{
                margin: `24px`,
                padding: 24,
                background: "#fff"
              }}
            ><h3>{`Học kỳ` + sem.numOfSem}</h3>
            <Tag color="#f50">{'Môn học'}</Tag>
            {sem.subjects.map(sj => <div><div>{'- ' + sj.name + ": " + sj.lessions + " buổi học"}</div><div>{`(${sj.description})`}</div></div>)}
            <div style={{ paddingTop: "15px" }}><Tag color="#2db7f5">Mô tả</Tag>
            <p>{sem.description}</p></div>
            </Content>
          </Col>
        ))
      : console.log("");
  };

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
              Học kỳ
            </Breadcrumb.Item>
          </Breadcrumb>
        </Content>

        <Row gutter={8}>
          {this.displayData()}
        </Row>
      </div>
    );
  }
}
