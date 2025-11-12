import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/adminPedidos.css";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  // const [produtoEditando, setProdutoEditando] = useState(null);
  // const [quantidade, setQuantidade] = useState(1);
  // const [adicionaisSelecionados, setAdicionaisSelecionados] = useState([]);
  const [statusEditando, setStatusEditando] = useState({});

  // 🔁 Atualiza pedidos automaticamente a cada 10 segundos
  useEffect(() => {
    carregarPedidos();

    const intervalo = setInterval(() => {
      carregarPedidos();
    }, 90000); // 90 segundos

    return () => clearInterval(intervalo); // limpa o intervalo ao desmontar o componente
  }, []);

  const carregarPedidos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/pedidos");

      const pedidosOrdenados = (response.data.pedidos || []).reverse();
      setPedidos(pedidosOrdenados);

      // console.log("📦 Pedidos carregados:", response.data.pedidos);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    }
  };

  const excluirPedido = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este pedido?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/pedidos/${id}`);
      carregarPedidos();
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
    }
  };

  // const fecharModalEdicao = () => {
  //   setProdutoEditando(null);
  //   setQuantidade(1);
  //   setAdicionaisSelecionados([]);
  // };

  // const salvarEdicao = async () => {
  //   try {
  //     await axios.put(
  //       `http://localhost:8000/api/admin/pedidos/${produtoEditando.id_pedido}/produto/${produtoEditando.id_produto}`,
  //       { quantidade, adicionais: adicionaisSelecionados }
  //     );
  //     carregarPedidos();
  //     fecharModalEdicao();
  //   } catch (error) {
  //     console.error("Erro ao atualizar produto:", error);
  //   }
  // };

  // 🔹 Atualiza apenas o status do pedido
  const atualizarStatus = async (id_pedido, novoStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/pedidos/${id_pedido}/status`,
        { status_pagamento: novoStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      setPedidos((prev) =>
        prev.map((p) =>
          p.id_pedido === id_pedido ? { ...p, status_pagamento: novoStatus } : p
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error.response?.data || error);
    }
  };

  // const toggleAdicional = (id) => {
  //   setAdicionaisSelecionados((prev) =>
  //     prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
  //   );
  // };

  const enviarWhatsApp = (pedido) => {
    if (!pedido.cliente || !pedido.cliente.telefone) {
      alert("Telefone do cliente não encontrado.");
      return;
    }

    const numero = pedido.cliente.telefone.replace(/\D/g, "");

    const itensTexto = pedido.itens
      ?.map((item) => {
        let texto = `➡ ${item.quantidade}x ${item.produto?.nome?.toUpperCase() || "Produto"}`;
        if (item.adicionais?.length > 0) {
          const adicionais = item.adicionais
            .map((ad) => `      ${ad.quantidade}x ${ad.adicional?.nome}`)
            .join("\n");
          texto += `\n${adicionais}`;
        }
        return texto;
      })
      .join("\n") || "Nenhum item listado.";

    const mensagem = `Pedido nº ${pedido.id_pedido}

Itens:
${itensTexto}

Observação: (${pedido.observacao || "Nenhuma"})

💳 ${pedido.forma_pagamento}
🛵 Delivery (taxa de: R$ 3,00)
🏠 ${pedido.endereco}
(Estimativa: entre 40~90 minutos)

Total: R$ ${parseFloat(pedido.total).toFixed(2)}

Obrigado pela preferência, se precisar de algo é só chamar!`;

    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="admin-container">
      {/* Botão sair */}
      <button
        className="logout-btn"
        onClick={() => {
          fetch("http://localhost:8000/api/logout", {
            method: "POST",
            credentials: "include",
          }).finally(() => (window.location.href = "/admin"));
        }}
      >
        VOLTAR
      </button>

      <h2 className="titulo-admin">Pedidos Recebidos</h2>

      <div className="tabela-container">
        <table className="tabela-pedidos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Endereço</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th>Total</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <React.Fragment key={pedido.id_pedido}>
                <tr className="pedido-principal">
                  <td>{pedido.id_pedido}</td>
                  <td>{pedido.endereco}</td>
                  <td>{pedido.forma_pagamento}</td>

                  <td>
                    <select
                      value={statusEditando[pedido.id_pedido] ?? pedido.status_pagamento}
                      onChange={(e) =>
                        setStatusEditando({
                          ...statusEditando,
                          [pedido.id_pedido]: e.target.value,
                        })
                      }
                    >
                      <option value="pendente">Pendente</option>
                      <option value="pago">Pago</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                    <button
                      className="btn-salvar-status"
                      onClick={() =>
                        atualizarStatus(
                          pedido.id_pedido,
                          statusEditando[pedido.id_pedido] ?? pedido.status_pagamento
                        )
                      }
                    >
                      Salvar
                    </button>
                  </td>

                  <td>R$ {parseFloat(pedido.total).toFixed(2)}</td>
                  <td>
                    {new Date(pedido.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <button
                      className="btn-excluir"
                      onClick={() => excluirPedido(pedido.id_pedido)}
                    >
                      Excluir
                    </button>

                    <button className="btn-whats" onClick={() => enviarWhatsApp(pedido)}>
                      Enviar WhatsApp
                    </button>
                  </td>
                </tr>

                <tr>
                  <td colSpan="7" className="detalhes-produtos">
                    {pedido.itens?.length > 0 ? (
                      pedido.itens.map((item) => (
                        <div key={item.id} className="produto-item">
                          <div className="produto-header">
                            <strong>{item.produto?.nome}</strong>
                            <span> x{item.quantidade}</span>
                            <span className="preco-produto">
                              — R$ {parseFloat(item.preco_unitario).toFixed(2)}
                            </span>
                          </div>

                          {item.adicionais?.length > 0 && (() => {
                            const adicionaisAgrupados = item.adicionais.reduce((acc, ad) => {
                              const id = ad.id_adicional;
                              if (!acc[id]) {
                                acc[id] = { ...ad, quantidade: 0 };
                              }
                              acc[id].quantidade += ad.quantidade;
                              return acc;
                            }, {});

                            const listaAgrupada = Object.values(adicionaisAgrupados);

                            return (
                              <div className="adicionais-container">
                                <p className="titulo-adicionais">Adicionais:</p>
                                <ul className="adicionais-lista">
                                  {listaAgrupada.map((ad) => (
                                    <li key={ad.id_adicional}>
                                      {ad.adicional?.nome} <span>x{ad.quantidade}</span> — R$
                                      {parseFloat(ad.preco_unitario).toFixed(2)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })()}
                        </div>
                      ))
                    ) : (
                      <p>Nenhum item encontrado neste pedido.</p>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPedidos;
