import React, { Component } from "react";
import { Layout } from "antd";
import Footers from "../components/Footer";
import Headers from "../components/Header";
import MainContent from "../components/MainContent";
import SideBar from "../components/Sider";

export default class DashBoardScreen extends Component {
  state = {
    collapsed: true,
    marginLeft: "80px",
    onLogin: false
  };

  componentDidMount() {
    console.log(this.props)
  }

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
            <Headers collapsed={this.state.collapsed} toggle={this.toggle} />
            <MainContent />
            <Footers />
          </Layout>
        </div>
      </div>
    );
  }
}
