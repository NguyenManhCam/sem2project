import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import HomeScreen from "./containers/HomeScreen";
import { BrowserRouter, Route } from "react-router-dom";
import DashBoardScreen from "./containers/DashBoardScreen";
import axios from "./axios";
import SemScreen from "./containers/SemScreen";
import ClassScreen from "./containers/ClassScreen";
import StudentScreen from "./containers/StudentScreen";
class App extends Component {
  state = {};

  componentDidMount() {
    this.checkLogin();
  }

  checkLogin = () => {
    axios
      .get("/api/auth/login")
      .then(data => this.setState({ username: data.data.username }))
      .catch(err => console.log(err));
  };

  onLogout = async () => {
    await axios.delete('/api/auth');
    this.checkLogin();
  }

  onLogin = ({ username, password }) => {
    axios
      .post("/api/auth", { username, password })
      .then(data => this.setState({ username: data.data.username }))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route
            exact
            path="/"
            render={props => {
              return (
                <HomeScreen
                  {...props}
                  onLogin={this.onLogin}
                  onLogout={this.onLogout}
                  username={this.state.username}
                />
              );
            }}
          />
          <Route
            exact
            path="/:tab"
            render={props => {
              switch (props.match.params.tab) {
                case 'dashboard':
                  return <DashBoardScreen />
                case 'sem':
                  return <SemScreen />
                case 'class': 
                  return <ClassScreen />
                default:
                  break;
              }
            }}
          />
          <Route
            exact
            path="/manager/students"
            render={props => {
              return <StudentScreen />
            }}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
