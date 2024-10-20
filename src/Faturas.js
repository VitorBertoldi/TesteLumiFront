import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Faturas() {
  const [contacts, setContacts] = useState([]);  
  const [search, setSearch] = useState('');  
  const [dateFilter, setDateFilter] = useState('');  

  useEffect(() => {
    axios.get('http://teste-lumi-backend.vercel.app/api/fatura/faturas')  
      .then((response) => {
        console.log(response.data);
        setContacts(response.data);  
      })
      .catch((error) => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  return (
    <Container>
      <h1 className='text-center mt-4'>Faturas</h1>
      
      <Form>
        <InputGroup className='my-3'>
          <Form.Control
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Buscar faturas por cliente'
          />
        </InputGroup>
        
        <InputGroup className='my-3'>
          <Form.Control
            onChange={(e) => setDateFilter(e.target.value)}
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
              const matchesClient = search === '' || item.numero_cliente.toLowerCase().includes(search.toLowerCase());
              const matchesDate = dateFilter === '' || item.mes_referencia.toLowerCase().includes(dateFilter.toLowerCase());
              return matchesClient && matchesDate;
            })
            .map((item, index) => (
              <tr key={index}>
                <td>{item.numero_cliente}</td>
                <td>{item.mes_referencia}</td>
                <td>{item.energia_eletrica_valor}</td>
                <td>
                  {}
                  <a 
                    href={`/pdfs/${item.numero_cliente}-${item.mes_referencia.replace('/', '-')}.pdf`} 
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
}

export default Faturas;
