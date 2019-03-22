import React, { Component } from "react";
import { Input } from "antd";

const Search = Input.Search;

export default class SearchField extends Component {
  render() {
    return (
      <Search
        placeholder="Search here..."
        onSearch={value => console.log(value)}
        style={{ width: 200 }}
      />
    );
  }
}
