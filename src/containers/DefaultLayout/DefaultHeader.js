import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import PropTypes from "prop-types";

import { AppNavbarBrand, AppSidebarToggler } from "@coreui/react";
import logo from "../../assets/img/brand/logo.svg";
import sygnet from "../../assets/img/brand/sygnet.svg";
import { BACK_END, USERS, AUTH_USER } from "../../utils/BackEndUrl";
import cookie from "react-cookies";
import axios from "axios";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};
let name = "";
let permissao = "";

class DefaultHeader extends Component {
  async getAuthUser() {
    await axios
      .get(BACK_END + USERS + AUTH_USER, {
        headers: {
          Authorization: `Bearer ${cookie.load("token")}`
        }
      })
      .then(res => {
        name = res.data.nome;
        permissao = res.data.permissao;
      });
  }

  render() {
    this.getAuthUser();
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: "CoreUI Logo" }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: "CoreUI Logo" }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <Link to="/" className="nav-link">
              Usuário: {name} |{" "}
              {permissao === "USER"
                ? "Usuário"
                : permissao === "ADMIN"
                ? "Administrador"
                : "Super Administrador"}
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
