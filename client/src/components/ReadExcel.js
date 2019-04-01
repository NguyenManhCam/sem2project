import React, { Component } from "react";
import XLSX from "xlsx";
import axios from "../axios";
import moment from "moment";
import { Upload, Icon, Button } from "antd";

export default class ReadExcel extends Component {
  onDrop = ({ file }) => {
    this.setState({ fileName: file.name });
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = e => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary", cellDates: true });
      const firstSheetNames = workbook.SheetNames[0];
      const roa = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetNames], {
        raw: true
      });
      console.log(roa);

      const subject = roa.filter(subject => typeof subject.__EMPTY == "number");
      console.log(subject);

      let arr = [];
      subject.forEach(sj => {
        `${sj["FPT ACADEMY INTERNATIONAL"]}`.includes("-")
          ? arr.push(`${sj["FPT ACADEMY INTERNATIONAL"]}`.split(" ")[0])
          : console.log("");
        for (let i = 3; i < 8; i++) {
          `${sj[`__EMPTY_${i}`]}`.includes("-")
            ? arr.push(`${sj[`__EMPTY_${i}`]}`.split(" ")[0])
            : console.log("");
        }
      });

      let deduplicate = arr => {
        let isExist = (arr, x) => {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === x) return true;
          }
          return false;
        };

        let ans = [];
        arr.forEach(element => {
          if (!isExist(ans, element)) ans.push(element);
        });
        return ans;
      };

      let newArr = deduplicate(arr);
      let json = newArr.map(name => {
        let sessions = {};
        subject.forEach(sj => {
          if (`${sj["FPT ACADEMY INTERNATIONAL"]}`.split(" - ")[0] === name) {
            let time = moment(`${sj.__EMPTY_1}`).format("MM-DD-YYYY");
            sessions[sj["FPT ACADEMY INTERNATIONAL"]] = time;

            // sessions[`${time}.${sj["FPT ACADEMY INTERNATIONAL"]}`] = sj["FPT ACADEMY INTERNATIONAL"];
          }
          for (let i = 3; i < 8; i++) {
            if (`${sj[`__EMPTY_${i}`]}`.split(" - ")[0] === name) {
              if (i === 3) {
                let time = moment(`${sj.__EMPTY_1}`).format("MM/DD/YYYY");
                sessions[sj[`__EMPTY_${i}`]] = time;
              } else if (i === 4 || i === 5) {
                let time = moment(`${sj.__EMPTY_1}`).format("MM-DD-YYYY");
                sessions[sj[`__EMPTY_${i}`]] = moment(time)
                  .add(2, "days")
                  .calendar();
              } else if (i === 6 || i === 7) {
                let time = moment(`${sj.__EMPTY_2}`).format("MM/DD/YYYY");
                sessions[sj[`__EMPTY_${i}`]] = time;
              }
            }
          }
        });
        return {
          nameOfSubject: name,
          start: Object.values(sessions)[0],
          end: Object.values(sessions)[Object.values(sessions).length - 1],
          sessions: sessions
        };
      });
      console.log(json)
    //   axios.post("/api/class", {
    //     name: "T1804M",
    //     sem: "5c9e3242430ae612784bf87b",
    //     schedule: json
    //   });
    };
  };
  render() {
    return (
      <div>
        <Upload
          accept=".xlsx, .xls"
          multiple={false}
          customRequest={this.onDrop}
        >
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
      </div>
    );
  }
}
