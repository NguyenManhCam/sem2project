import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import HomeScreen from "./containers/HomeScreen";
import Logins from "./components/Logins";

class App extends Component {
  state = {};

  onLogin = (username, password) => {
    this.setState({ username: username, password: password });
  };

  render() {
    return (
      <div>
        <HomeScreen />
        {/* {this.state.username=="admin" && this.state.password=="123456" ? <HomeScreen /> :
        {/* <Logins /> */}
      </div>
    );
  }
}

export default App;
