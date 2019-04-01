import React, { Component } from "react";
import { Layout } from "antd";
import Footers from "../components/Footer";
import Headers from "../components/Header";
import SideBar from "../components/Sider";
import StudentContent from "../components/StudentContent";

export default class StudentScreen extends Component {
  state = {
    collapsed: true,
    marginLeft: "80px"
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
    !this.state.collapsed
      ? this.setState({ marginLeft: "80px" })
      : this.setState({ marginLeft: "200px" });
  };

  render() {
    return (
      <div>
        <div>
          <SideBar collapsed={this.state.collapsed} />
          <Layout
            id="content-img"
            style={{ marginLeft: `${this.state.marginLeft}` }}
          >
            <Headers
              collapsed={this.state.collapsed}
              toggle={this.toggle}
              onLogout={this.props.onLogout}
            />
            <StudentContent />
            <Footers />
          </Layout>
        </div>
      </div>
    );
  }
}