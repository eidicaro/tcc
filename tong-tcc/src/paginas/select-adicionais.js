import React, { useEffect, useState } from 'react';

const SelecionarAdicionais = ({ produtoId }) => {
  const [adicionais, setAdicionais] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/adicionais') // ajuste a URL se precisar
      .then(res => res.json())
      .then(data => {
        setAdicionais(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleSelecionado = (id) => {
    setSelecionados(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const salvarAdicionais = () => {
    fetch(`http://localhost:8000/api/produtos/${produtoId}/adicionais`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ adicionais: selecionados })
    })
    .then(res => res.json())
    .then(data => {
      setMensagem(data.message || 'Salvo com sucesso!');
    })
    .catch(() => {
      setMensagem('Erro ao salvar adicionais.');
    });
  };

  if (loading) {
    return <div>Carregando adicionais...</div>;
  }

  if (adicionais.length === 0) {
    return <div>Não há adicionais disponíveis para este produto.</div>;
  }

  return (
    <div>
      <p>Selecione Adicionais para o Produto #{produtoId}</p>

      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {adicionais.map(item => (
          <label key={item.id_adicional} style={{ display: 'block', marginBottom: '5px' }}>
            <input
              type="checkbox"
              value={item.id_adicional}
              checked={selecionados.includes(item.id_adicional)}
              onChange={() => toggleSelecionado(item.id_adicional)}
              style={{ marginRight: '8px' }}
            />
            {item.nome} - R$ {item.preco.toFixed(2)}
          </label>
        ))}
      </div>

      <button onClick={salvarAdicionais} style={{ marginBottom: '10px' }}>Salvar Adicionais</button>

      {mensagem && <div>{mensagem}</div>}
    </div>
  );
};

export default SelecionarAdicionais;
