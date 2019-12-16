import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import PropTypes from "prop-types";

import { AppNavbarBrand, AppSidebarToggler } from "@coreui/react";
import sygnet from "../../assets/img/brand/sygnet.png";
import cookie from "react-cookies";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
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
              Usuário: {cookie.load("user")} | {cookie.load("role_description")}
            </Link>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar />
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
