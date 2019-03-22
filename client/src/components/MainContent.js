import React, { Component } from "react";
import { Layout, Progress } from "antd";
import test1 from "../images/test1.png";
import test2 from "../images/test2.jpg";
import test3 from "../images/test3.jpg";
import test4 from "../images/test4.jpg";
import test5 from "../images/test5.jpg";
import test6 from "../images/test6.jpg";
import test7 from "../images/test7.jpg";

const { Content } = Layout;

export default class MainContent extends Component {


  render() {
    return (
      <div>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff"
            // overflow: "initial"
          }}
        >
          <div style={{ padding: 24, textAlign: "center" }}>
            <Progress  type="dashboard" percent={50} status="active" />
          </div>
        </Content>
        <Content
          style={{
            background: "#fff",
            margin: "0 16px 24px 16px",
            padding: 24,
            textAlign: "center"
          }}
        >
          Content 2
        </Content>
        <Content
          className="container"
          style={{ background: "#fff", padding: 24 }}
        >
          <div className="post">
            <img src={test1} alt="imgpost" />
          </div>
          <div className="post">
            <img src={test2} alt="imgpost" />
          </div>
          <div className="post">
            <img src={test3} alt="imgpost" />
          </div>
          <div className="post">
            <img src={test4} alt="imgpost" />
          </div>
          <div className="post">
            <img src={test5} alt="imgpost" />
          </div>
          <div className="post">
            <img src={test6} alt="imgpost" />
          </div>
          <div className="post">
            <img src={test7} alt="imgpost" />
          </div>
        </Content>
      </div>
    );
  }
}
