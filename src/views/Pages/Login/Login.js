import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import { BACK_END, LOGIN_API } from "../../../utils/BackEndUrl";
import axios from "axios";
import cookie from "react-cookies";
const APP_CLIENT = "dge_bi-client";
const APP_SECRET = "dge_bi-secret";
const APP_BASE_64 = "ZGdlX2JpLWNsaWVudA==";
const APP_CONTENT_TYPE = "application/x-www-form-urlencoded";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isError: false,
      isSuccess: false,
      usuario: "",
      senha: "",
      token: ""
    };
    this.removeCookies();
  }

  removeCookies() {
    cookie.remove("token");
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state);
  };

  onSubmit(e) {
    e.preventDefault();
    this.setState({
      isLoading: true,
      isSuccess: false,
      isError: false
    });
    this.getAuthToken();
  }

  getUserFormDataLogin = () => {
    const loginForm = new FormData();
    loginForm.append("username", this.state.usuario);
    loginForm.append("password", this.state.senha);
    loginForm.append("client_id", APP_CLIENT);
    loginForm.append("client_secret", APP_SECRET);
    loginForm.append("grant_type", "password");
    console.log(loginForm);
    return loginForm;
  };

  async getAuthToken() {
    console.log(this.state);
    const url = BACK_END + LOGIN_API;
    var formLogin = this.getUserFormDataLogin();
    console.log(formLogin);
    await axios
      .post(url, formLogin, {
        Headers: {
          Authorization: "Basic " + APP_BASE_64,
          Content_Type: APP_CONTENT_TYPE
        }
      })
      .then(res => {
        this.setState({
          isSuccess: true,
          isLoading: false,
          token: res.data.access_token
        });
        this.setTokenCookie(this.state.token);
        this.props.history.push("/relatorios");
      })
      .catch(err => {
        this.setState({
          isSuccess: false,
          isLoading: false,
          isError: true
        });
      });
    console.log(this.state);
  }

  async setTokenCookie(token) {
    await cookie.save("token", token);
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={e => this.onSubmit(e)}>
                      <h1>Login</h1>
                      <p className="text-muted">Entre em sua conta</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="usuario"
                          placeholder="Usuário"
                          autoComplete="usuario"
                          onChange={e => this.onChange(e)}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          name="senha"
                          placeholder="Senha"
                          autoComplete="senha"
                          onChange={e => this.onChange(e)}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4">
                            Entrar
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Esqueceu sua senha?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
