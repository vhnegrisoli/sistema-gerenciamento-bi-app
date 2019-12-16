import React, { Component } from "react";
import {
  Alert,
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row
} from "reactstrap";
import axios from "axios";
import {
  BACK_END,
  USERS,
  AUTH_USER,
  RELATORIOS_URI,
  CHECK_SESSION,
  REFRESH_REPORT
} from "../../../utils/BackEndUrl";
import cookie from "react-cookies";
import Iframe from "react-iframe";
import ReactLoading from "react-loading";
import "font-awesome/css/font-awesome.min.css";

const style = {
  color: "red",
  fontSize: "15px"
};
const SABADO = 6;
const HORARIO_COMERCIAL_INICIO = 8;
const HORARIO_COMERCIAL_FIM = 18;
const OK = 200;
const BAD_REQUEST = 400;
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
      authUser: null,
      fullscreen: true,
      fullscreenText: "Tela Cheia",
      fullscreenIcon: "fa fa-window-maximize",
      refreshModal: false,
      refreshError: false,
      refreshErrorMessage: "",
      modalResponse: false,
      modalResponseMessage: false,
      refreshResponse: "",
      refreshStatus: 200
    };
    this.getToken();
    this.getAuthUser();
    this.fetchRelatorios();
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

  async getAuthUser() {
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

  async fetchRelatorios() {
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

  toggleFullscreen() {
    this.setState({
      fullscreen: !this.state.fullscreen,
      fullscreenText: this.state.fullscreen ? "Tela Normal" : "Tela Cheia",
      fullscreenIcon: this.state.fullscreen
        ? "fa fa-window-minimize"
        : "fa fa-window-maximize"
    });
    this.handleFullscreen();
  }

  openRefreshModal() {
    let dataAtual = new Date();
    if (dataAtual.getDay() >= SABADO) {
      this.setState({
        refreshError: true,
        refreshErrorMessage:
          "Não é possível atualizar os dados aos finais de semana"
      });
    }
    if (
      dataAtual.getHours() < HORARIO_COMERCIAL_INICIO &&
      dataAtual.getHours() > HORARIO_COMERCIAL_FIM
    ) {
      this.setState({
        refreshError: true,
        refreshErrorMessage:
          "Não é atualizar os dados fora do período entre 08:00 - 18:00"
      });
    }
    this.setState({ refreshModal: true });
  }

  closeRefreshModal() {
    this.setState({ refreshModal: false });
  }

  openModalResponse() {
    this.setState({ modalResponse: true });
  }

  closeModalResponse() {
    this.setState({ modalResponse: false });
  }

  async atualizarDados() {
    await axios
      .put(BACK_END + RELATORIOS_URI + REFRESH_REPORT, {
        headers: {
          Authorization: `Bearer ${cookie.load("token")}`
        }
      })
      .then(res => {
        this.setState({
          refreshStatus: OK,
          modalResponseMessage:
            "Os dados foram atualizados, aguarde até que sejam disponibilizados na plataforma"
        });
      })
      .catch(err => {
        this.setState({
          refreshStatus: BAD_REQUEST,
          modalResponseMessage: err.message
        });
      });
    this.openModalResponse();
  }

  handleFullscreen() {
    this.state.fullscreen
      ? document.documentElement.requestFullscreen()
      : document.exitFullscreen();
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="d-flex justify-content-between">
          <Button onClick={() => this.toggleFullscreen()}>
            <span class={this.state.fullscreenIcon} aria-hidden="true" />
            {" " + this.state.fullscreenText}
          </Button>
          <Button color="success" onClick={() => this.openRefreshModal()}>
            <spam class="fa fa-refresh" aria-hidden="true"></spam> Atualizar
            Dados
          </Button>
          <Modal
            className={this.props.className}
            isOpen={this.state.refreshModal}
            toggle={() => this.closeRefreshModal()}
          >
            {this.state.refreshError ? (
              <div>
                <ModalHeader>Erro ao processar operação</ModalHeader>
                <ModalBody>
                  <div>
                    <Alert color="danger">
                      {this.state.refreshErrorMessage}
                    </Alert>
                  </div>
                  <div>
                    <Button onClick={() => this.closeRefreshModal()}>
                      <spam
                        class="fa fa-window-close"
                        aria-hidden="true"
                      ></spam>{" "}
                      Voltar
                    </Button>
                  </div>
                </ModalBody>
              </div>
            ) : (
              <div>
                <ModalHeader>
                  Tem certeza que deseja atualizar os dados?
                  <p style={style}>Essa operação não pode ser desfeita!</p>
                </ModalHeader>
                <ModalBody>
                  <div className="d-flex justify-content-between">
                    <Button onClick={() => this.closeRefreshModal()}>
                      <spam
                        class="fa fa-window-close"
                        aria-hidden="true"
                      ></spam>{" "}
                      Voltar
                    </Button>
                    <Button
                      color="success"
                      onClick={() => this.atualizarDados()}
                    >
                      <spam class="fa fa-refresh" aria-hidden="true"></spam>{" "}
                      Atualizar
                    </Button>
                  </div>
                </ModalBody>
                <ModalFooter>
                  O horário de funcionamento da atualização dos dados é de
                  Segunda a Sexta-Feira, das 08:00 às 18:00, não incluindo
                  feriados.
                </ModalFooter>
              </div>
            )}
          </Modal>
          <Modal
            className={this.props.className}
            isOpen={this.state.refreshResponse}
            toggle={() => this.closeRefreshModal()}
          >
            <ModalHeader>Resultado da Atualização</ModalHeader>
            <ModalBody>
              {this.state.refreshStatus === OK && (
                <Alert
                  color={this.state.refreshStatus === OK ? "success" : "danger"}
                >
                  {this.state.modalResponseMessage}
                </Alert>
              )}
            </ModalBody>
          </Modal>
        </div>
        {this.state.isLoading ? (
          <ReactLoading
            type={"spinningBubbles"}
            color={"blue"}
            height={100}
            width={50}
          />
        ) : (
          <Row className="mt-4">
            <Col xs="12">
              <Iframe
                url={this.state.relatorios[0].link}
                width="100%"
                id={this.state.relatorios[0].titulo}
                className="myClassname"
                height="400%"
                allowFullScreen
              />
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default Cards;
