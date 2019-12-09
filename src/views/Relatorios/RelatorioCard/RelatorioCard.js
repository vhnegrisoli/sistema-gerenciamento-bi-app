import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import axios from "axios";
import {
  BACK_END,
  USERS,
  AUTH_USER,
  RELATORIOS_URI,
  CHECK_SESSION
} from "../../../utils/BackEndUrl";
import cookie from "react-cookies";

class Cards extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      isLoading: true,
      relatorios: [],
      titulo: "",
      id: "",
      error: [],
      modalOpen: false,
      relatorioAberto: null,
      token: "",
      authUser: null
    };
    this.getToken();
    this.getAuthUser(this.state.token);
    this.fetchRelatorios(this.state.token);
  }

  getToken() {
    let accessToken = cookie.load("token");
    if (accessToken !== "") {
      this.setState({ token: accessToken });
    }
    if (!accessToken) {
      this.props.history.push("/login");
    }
    this.checkSession();
  }

  async checkSession() {
    await axios
      .get(BACK_END + USERS + CHECK_SESSION, {
        headers: {
          Authorization: `Bearer ${cookie.load("token")}`
        }
      })
      .catch(err => {
        if (err.message.includes("401")) {
          this.props.history.push("/login");
        }
      });
  }

  async getAuthUser(token) {
    await axios
      .get(BACK_END + USERS + AUTH_USER, {
        headers: {
          Authorization: `Bearer ${cookie.load("token")}`
        }
      })
      .then(res => {
        this.setState({ authUser: res.data });
      });
  }

  async fetchRelatorios(token) {
    await axios
      .get(BACK_END + RELATORIOS_URI, {
        headers: {
          Authorization: `Bearer ${cookie.load("token")}`
        }
      })
      .then(res => {
        this.setState({
          isLoading: false,
          relatorios: res.data
        });
      })
      .catch(error => {
        this.setState({
          error: error.data
        });
      });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {}

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          {this.state.relatorios.map(relatorio => (
            <Col xs="12">
              <iframe
                class="resp-iframe"
                title={this.state.relatorios[0].titulo}
                src={this.state.relatorios[0].link}
                gesture="media"
                allow="encrypted-media"
                width="100%"
                height="750"
                allowfullscreen
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default Cards;
