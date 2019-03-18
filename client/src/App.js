import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import HomeScreen from "./containers/HomeScreen";
import Login from "./components/Login";


class App extends Component {
  state = {}

  onLogin = (username, password) => {
    this.setState({ username: username, password: password });
  }

  render() {
    return (
      <div>
        {this.state.username === "admin" && this.state.password === "123456" ? <HomeScreen /> :
        <Login onLogin={this.onLogin}/> }
      </div>
    );
  }
}

export default App;
