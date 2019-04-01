import React, { Component } from "react";
import { Layout } from "antd";
import Footers from "../components/Footer";
import Headers from "../components/Header";
import MainContent from "../components/MainContent";
import SideBar from "../components/Sider";
import Logins from "../components/Logins";

export default class HomeScreen extends Component {
  state = {
    collapsed: true,
    marginLeft: "80px",
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
        {this.props.username ? <div>
          <SideBar collapsed={this.state.collapsed} />
          <Layout
            id="content-img"
            style={{ marginLeft: `${this.state.marginLeft}` }}
          >
            <Headers collapsed={this.state.collapsed} toggle={this.toggle} onLogout={this.props.onLogout} />
            <MainContent />
            <Footers />
          </Layout>
        </div> : <Logins onLogin={this.props.onLogin} />}
      </div>
    );
  }
}
