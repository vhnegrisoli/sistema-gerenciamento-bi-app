import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, CardFooter, Col, Modal, ModalHeader, ModalBody, ModalFooter, Row } from 'reactstrap';
import axios from 'axios'

const RELATORIOS_URL = 'http://localhost:8080/api/relatorios'
const DETALHAMENTO_RELATORIO = 'http://localhost:3000/#/detalhar-relatorio/'
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
            titulo: '',
            id: '',
            error: [],
            modalOpen: false,
            relatorioAberto: null
        };
        this.fetchRelatorios();
    }

    async fetchRelatorios() {
        await axios.get(RELATORIOS_URL)
            .then(res => {
                this.setState({
                    isLoading: false,
                    relatorios: res.data,
                    titulo: res.data.titulo,
                    id: res.data.id
                })
            })
            .catch(error => {
                this.setState({
                    error: error.data
                })
            })
        
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    openModal() {
        this.setState({
          modalOpen: true,
        });
      }
    
    closeModal() {
        this.setState({
          modalOpen: false,
        });
      }

    toggleFade() {
       
    }

    onSubmit(relatorio) {
         this.setState({
          relatorioAberto: relatorio
        });
        this.openModal()
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                        {this.state.relatorios.map(
                            relatorio => (
                    <Col xs="12" sm="6" md="4">
                                <Card>
                            <CardHeader>
                                {relatorio.titulo}
                            </CardHeader>
                            <CardBody>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                                laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
                                ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                            </CardBody>
                        <CardFooter>
                                <Button color="success" onClick={() => this.onSubmit(relatorio)}>Visualizar Relatório</Button>
                            </CardFooter>
                        </Card>
                         </Col> 
                            )
                        )}
                </Row>
                <Modal size="xl"  isOpen={this.state.modalOpen} toggle={() => this.closeModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.openModal()}>{this.state.relatorioAberto && this.state.relatorioAberto.titulo}</ModalHeader>
          <ModalBody>
                    <div class="resp-container">
                      <iframe
                        class="resp-iframe"
                        src={this.state.relatorioAberto && this.state.relatorioAberto.linkRelatorio}
                        gesture="media"
                        allow="encrypted-media"
                        width="1080"
                        height="600"
                        allowfullscreen
                      />
                    </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.closeModal()}>Voltar</Button>
          </ModalFooter>
        </Modal>
            </div>
        );
    }
}

export default Cards;
