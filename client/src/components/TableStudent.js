import React, { Component } from "react";
import { Table, Divider, Tag, Layout } from "antd";
import axios from "../axios";

const { Content } = Layout;

export default class TableStudent extends Component {
  state = {};
  componentDidMount() {
    this.getStudents();
  }

  getStudents = () => {
    axios
      .get("/api/users/")
      .then(data => this.setState({ data: data.data }))
      .catch(err => console.log(err));
  };

  render() {
    const columns = [
      {
        title: "Mã sinh viên",
        dataIndex: "id",
        key: "id",
        // width: "50",
        render: text => <a href="javascript:;">{text}</a>
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
        render: tags => (
          <span>
            {tags.map(tag => {
              let color = tag.length > 5 ? "geekblue" : "green";
              if (tag === "loser") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      {
        title: "Phone",
        key: "phone",
        dataIndex: "phone"
      }
    ];

    const data = this.state.data
      ? this.state.data.map((std, index) => {
          return {
            key: index,
            id: std._id,
            name: std.username,
            email: std.email,
            phone: std.phone,
            tags: ["nice", "developer"]
          };
        })
      : "";
    return (
      <div>
        <Content style={{ margin: "24px", padding: 24, background: "#fff" }}>
          <Table columns={columns} dataSource={data} />
        </Content>
      </div>
    );
  }
}
