import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import {BACK_END, LOGIN_API} from '../../../utils/BackEndUrl';
import axios from 'axios';

const APP_CLIENT = 'dge_bi-client';
const APP_SECRET = 'dge_bi-secret';
const APP_BASE_64 = 'ZGdlX2JpLWNsaWVudA==';
const APP_CONTENT_TYPE = 'application/x-www-form-urlencoded';

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      usuario: '',
      senha: '',
      token: ''
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state)
  }

  getUserFormDataLogin = () => {
    var loginForm = new FormData();
    loginForm.append('user', this.state.usuario);
    loginForm.append('password', this.state.senha);
    loginForm.append('client-id', APP_CLIENT);
    loginForm.append('client-secret', APP_SECRET);
    loginForm.append('grant_type', 'password');
    console.log(loginForm)
    return loginForm;
  }

  getAuthToken = (e) => {
    e.preventDefault();
    const url = BACK_END + LOGIN_API;
    var formLogin = this.getUserFormDataLogin();
    console.log(formLogin)
    axios.post(url, formLogin, {
      Headers: {
        Authorization: 'Bearer' + APP_BASE_64,
        Content_Type: APP_CONTENT_TYPE
    }})
    .then(res => {
      if (res.status === 200) {
        this.setState({token: res.data.access_token});
        this.props.push('/relatorios')
      }
    })
    .catch(err => {
      
    });
  }

  setTokenCookie(token) {

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
                    <Form onSubmit={e => this.getAuthToken()}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" name="usuario" placeholder="Usuário" autoComplete="usuario" onChange ={e => this.onChange(e)}/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" name="senha" placeholder="Senha" autoComplete="senha" onChange ={e => this.onChange(e)}/>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
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
