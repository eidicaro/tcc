import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import InfosProd from './infos-prod';
import '../../style.css';

const Carrossel = ({ adicionarProduto }) => {
  const [produtos, setProdutos] = useState(Array(9).fill(null));
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [adicionais, setAdicionais] = useState([]);

  useEffect(() => {
    const ids = [1, 5, 8, 12, 15, 18, 22, 19, 20];

    axios
      .get(`http://localhost:8000/api/produtos/by-ids?ids=${ids.join(',')}`)
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar produtos:", error);
      });
  }, []);

  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setProdutoSelecionado(null);
  };

  

  // Carregar adicionais (todos iguais para todos os produtos)
  useEffect(() => {
    axios.get('http://localhost:8000/api/adicionais')
      .then(res => setAdicionais(res.data))
      .catch(err => console.error("Erro ao carregar adicionais:", err));
  }, []);

  
  return (
    <StyledWrapper>
      <div
        className="slider"
        style={{
          '--width': '300px',
          '--height': '300px',
          '--quantity': 9
        }}
      >
        <div className="list">
          {produtos.map((produto, index) => (
            <div key={index} className="item" style={{ '--position': index + 1 }}>
              <div className="card" style={{ background: '#fff', border:'none' }}>
                {produto ? (
                  <>
                    <img
                      src={produto.imagem_url}
                      alt={produto.nome}
                      onClick={() => abrirModal(produto)}
                      style={{ width: '110%', borderRadius: '15px', cursor: 'pointer' }}
                    />
                    <p>{produto.nome}</p>
                  </>
                ) : (
                  <p>Carregando...</p>
                )}
              </div>
            </div>
          ))}
        </div>

           {mostrarModal && produtoSelecionado && (
        <InfosProd
          produto={produtoSelecionado}
          adicionais={adicionais}
          onClose={fecharModal}
          adicionarProduto={adicionarProduto}
        />)}

      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    height: 100%;
    padding: 10%;
    border: 1px solid #ccc;
    border-radius: 7px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    color: white;
    text-align: center;
  }

  .card p {
    font-size: 18px;
    color: white;
  }


  .slider {
    width: 100%;
    height: var(--height);
    overflow: hidden;
  }

  .slider .list {
    display: flex;
    width: 100%;
    min-width: calc(var(--width) * var(--quantity));
    position: relative;
  }

  .slider .list .item {
    width: var(--width);
    height: var(--height);
    position: absolute;
    left: 100%;
    animation: autoRun 20s linear infinite;
    transition: filter 0.5s;
    animation-delay: calc(
      (20s / var(--quantity)) * (var(--position) - 1) - 20s
    ) !important;
  }

  .slider .list .item img {
    width: 100%;
  }

  @keyframes autoRun {
    from {
      left: 100%;
    }
    to {
      left: calc(var(--width) * -1);
    }
  }

  .slider:hover .item {
    animation-play-state: paused !important;
    filter: grayscale(1);
  }

  .slider .item:hover {
    filter: grayscale(0);
  }

  .slider[reverse="true"] .item {
    animation: reversePlay 10s linear infinite;
  }

  @keyframes reversePlay {
    from {
      left: calc(var(--width) * -1);
    }
    to {
      left: 100%;
    }
  }
`;

export default Carrossel;
