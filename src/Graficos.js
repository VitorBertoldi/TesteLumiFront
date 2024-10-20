import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import BarChart from './BarChart';

function Charts() {
  const [contacts, setContacts] = useState([]);
  const [selectedClient, setSelectedClient] = useState(''); 

  useEffect(() => {
    axios.get('http://localhost:3000/api/fatura/faturas')  
      .then((response) => {
        console.log(response.data); 
        setContacts(response.data);  
        setSelectedClient(response.data[0]?.numero_cliente || ''); // Selecionar o primeiro cliente automaticamente
      })
      .catch((error) => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);  

  const [energiaChartData, setEnergiaChartData] = useState([0, 0]); 
  const [financeiroChartData, setFinanceiroChartData] = useState([0, 0]); 

  useEffect(() => {
    const filteredContacts = contacts.filter(item => item.numero_cliente === selectedClient);
    
    const consumoEnergia = filteredContacts.reduce((sum, item) => sum + parseFloat(item.energia_eletrica_kwh || 0), 0);
    const energiaCompensada = filteredContacts.reduce((sum, item) => sum + parseFloat(item.energia_compensada_kwh || 0), 0);
    setEnergiaChartData([consumoEnergia, energiaCompensada]);

    const valorTotalSemGD = filteredContacts.reduce((sum, item) => sum + parseFloat(item.energia_eletrica_valor || 0) + parseFloat(item.energia_sceee_valor || 0) + parseFloat(item.contribuicao_iluminacao_valor || 0), 0);
    const economiaGD = filteredContacts.reduce((sum, item) => sum + parseFloat(item.energia_compensada_valor || 0), 0);
    setFinanceiroChartData([valorTotalSemGD, economiaGD]);
  }, [contacts, selectedClient]);

  return (
      <div>
        <Container>
          <h1 className='text-center mt-4'>Gráficos de Faturas</h1>

          {/* Gerar botões dinamicamente com base no numero_cliente */}
          <div className="text-right mb-4">
            {Array.from(new Set(contacts.map(item => item.numero_cliente))).map(client => (
              <Button 
                key={client} 
                variant="outline-secondary" 
                onClick={() => setSelectedClient(client)}
                className={selectedClient === client ? 'active' : ''}
              >
                {client}
              </Button>
            ))}
          </div>

          {/* Gráfico de Energia */}
          <BarChart 
            data={energiaChartData} 
            labels={['Consumo de Energia (kWh)', 'Energia Compensada (kWh)']} 
            title={`Resultados de Energia - Cliente ${selectedClient}`}
          />

          {/* Gráfico Financeiro */}
          <BarChart 
            data={financeiroChartData} 
            labels={['Valor Total Sem GD', 'Economia GD']} 
            title={`Resultados Financeiros (R$) - Cliente ${selectedClient}`}
          />
        </Container>
      </div>
  );
}

export default Charts;
