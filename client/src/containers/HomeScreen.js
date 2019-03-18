import React, { Component } from "react";
import { Layout } from "antd";
import Footers from "../components/Footer";
import Headers from "../components/Header";
import MainContent from "../components/MainContent";
import SideBar from "../components/Sider";

export default class HomeScreen extends Component {
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
      <Layout>
        <SideBar collapsed={this.state.collapsed}/>
        <Layout
          id="content-img"
          style={{ marginLeft: `${this.state.marginLeft}` }}
        >
          <Headers collapsed={this.state.collapsed} toggle={this.toggle}/>
          <MainContent />
          <Footers />
        </Layout>
      </Layout>
    );
  }
}

