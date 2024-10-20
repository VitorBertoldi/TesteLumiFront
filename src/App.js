import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import BarChart from './BarChart';

function App() {
  const [contacts, setContacts] = useState([]);  
  const [selectedClient, setSelectedClient] = useState('');  
  const [energiaChartData, setEnergiaChartData] = useState([0, 0]); 
  const [financeiroChartData, setFinanceiroChartData] = useState([0, 0]);  
  const [searchClient, setSearchClient] = useState('');  
  const [searchDate, setSearchDate] = useState('');  
  const [currentPage, setCurrentPage] = useState('faturas');  

  useEffect(() => {
    axios.get('http://localhost:teste-lumi-backend.vercel.app/api/fatura/faturas')  

      .then((response) => {
        setContacts(response.data);  
      })
      .catch((error) => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  const uniqueClients = Array.from(new Set(contacts.map(item => item.numero_cliente)));

  useEffect(() => {
    if (selectedClient) {
      const clientData = contacts.filter(item => item.numero_cliente === selectedClient);

      const consumoEnergia = clientData.reduce((sum, item) => sum + (item.energia_eletrica_kwh || 0), 0);
      const energiaCompensada = clientData.reduce((sum, item) => sum + (item.energia_compensada_kwh || 0), 0);
      setEnergiaChartData([consumoEnergia, energiaCompensada]);

      const valorTotalSemGD = clientData.reduce((sum, item) => sum + parseFloat(item.energia_eletrica_valor || 0) + parseFloat(item.energia_sceee_valor || 0) + parseFloat(item.contribuicao_iluminacao_valor || 0), 0);
      const economiaGD = clientData.reduce((sum, item) => sum + parseFloat(item.energia_compensada_valor || 0), 0);
      setFinanceiroChartData([valorTotalSemGD, economiaGD]);
    }
  }, [selectedClient, contacts]);

const getPdfFilename = (numeroCliente, mesReferencia) => {
  const mesReferenciaFormatado = mesReferencia.replace('/', '-'); 
  return `${numeroCliente}-${mesReferenciaFormatado}`; 
};

  const renderFaturasPage = () => (
    <Container>
      <h1 className='text-center mt-4'>Faturas</h1>
      <Form>
        {}
        <InputGroup className='my-3'>
          <Form.Control
            onChange={(e) => setSearchClient(e.target.value)}
            placeholder='Buscar faturas por cliente'
          />
        </InputGroup>

        {}
        <InputGroup className='my-3'>
          <Form.Control
            onChange={(e) => setSearchDate(e.target.value)}
            placeholder='Buscar faturas por data'
          />
        </InputGroup>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Número do Cliente</th>
            <th>Mês de Referência</th>
            <th>Valor da Energia Elétrica</th>
            <th>Download PDF</th> {}
          </tr>
        </thead>
        <tbody>
          {contacts
            .filter((item) => {
              return searchClient.toLowerCase() === ''
                ? item
                : item.numero_cliente.toLowerCase().includes(searchClient.toLowerCase());
            })
            .filter((item) => {
              return searchDate.toLowerCase() === ''
                ? item
                : item.mes_referencia.toLowerCase().includes(searchDate.toLowerCase());
            })
            .map((item, index) => (
              <tr key={index}>
                <td>{item.numero_cliente}</td>
                <td>{item.mes_referencia}</td>
                <td>{item.energia_eletrica_valor}</td>
                <td>
                  <a 
                    href={`/pdfs/${getPdfFilename(item.numero_cliente, item.mes_referencia)}.pdf`} 
                    download
                  >
                    Download PDF
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );

  const renderGraficosPage = () => (
    <Container>
      <h1 className='text-center mt-4'>Selecionar Cliente</h1>
      <Dropdown>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          {selectedClient || "Selecione um Cliente"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {uniqueClients.map((client, index) => (
            <Dropdown.Item key={index} onClick={() => setSelectedClient(client)}>
              {client}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {selectedClient && (
        <>
          <h2 className="text-center mt-4">Gráficos para o cliente {selectedClient}</h2>
          
          {}
          <BarChart 
            data={energiaChartData} 
            labels={['Consumo de Energia (kWh)', 'Energia Compensada (kWh)']} 
            title="Resultados de Energia"
          />

          {}
          <BarChart 
            data={financeiroChartData} 
            labels={['Valor Total Sem GD', 'Economia GD']} 
            title="Resultados Financeiros (R$)"
          />
        </>
      )}
    </Container>
  );

  return (
    <Container>
  {}
  <div className="d-flex justify-content-end align-items-center mb-4" style={{ marginTop: '20px' }}>
    <Button variant="secondary" className="me-2" onClick={() => setCurrentPage('faturas')}>
      Faturas
    </Button>
    <Button variant="secondary" onClick={() => setCurrentPage('graficos')}>
      Gráficos
    </Button>
  </div>

  {}
  {currentPage === 'faturas' ? renderFaturasPage() : renderGraficosPage()}
</Container>

  );
}

export default App;
