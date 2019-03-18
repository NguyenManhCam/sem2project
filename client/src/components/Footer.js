import React, { Component } from "react";
import { Layout } from "antd";

const { Footer } = Layout;

export default class Footers extends Component {
  render() {
    return (
      <Footer>
        <footer>
          <div className="container f-main">
            <div className="copyright">Copyright © 2019 Design by Q</div>
            <div className="author-info">
              <div className="box">
                <div className="icon-contact">
                  <i className="fas fa-map-marker-alt" />
                  Our Location
                </div>
                <div className="detail">Hanoi</div>
              </div>
              <div className="box">
                <div className="icon-contact">
                  <i className="fas fa-phone-volume" />
                  Call Us
                </div>
                <div className="detail">+84 962 580 916</div>
              </div>
              <div className="box">
                <div className="icon-contact">
                  <i className="fas fa-envelope" />
                  Write Us
                </div>
                <div className="detail">SEM2.project</div>
              </div>
            </div>
          </div>
        </footer>
      </Footer>
    );
  }
}
