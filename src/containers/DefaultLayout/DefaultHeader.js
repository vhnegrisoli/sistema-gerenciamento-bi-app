import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import PropTypes from "prop-types";

import { AppNavbarBrand, AppSidebarToggler } from "@coreui/react";
import sygnet from "../../assets/img/brand/sygnet.png";
import cookie from "react-cookies";
import moment from "moment";
const propTypes = {
  children: PropTypes.node
};
const DATE_TIME = "DD/MM/YY HH:mm:ss";
const defaultProps = {};

class DefaultHeader extends Component {
  state = {
    now: moment().format(DATE_TIME)
  };

  componentWillMount() {
    this.startTime();
  }

  getTimeNow = () => moment().format(DATE_TIME);

  startTime = () => {
    this.timer = setInterval(() => {
      this.setState({
        now: this.getTimeNow()
      });
    }, 1000);
  };

  render() {
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{
            src: sygnet,
            width: 90,
            height: 50,
            align: "left",
            alt: "DGE Logo"
          }}
          minimized={{ src: sygnet, width: 60, height: 30, alt: "DGE Logo" }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <Link to="/" className="nav-link">
              Usuário: {cookie.load("user")} | {cookie.load("role_description")}{" "}
              | {this.state.now}
            </Link>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar />
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
