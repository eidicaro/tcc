import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminGerenciarItens.css";

export default function AdminGerenciarItens() {
  const [abaAtiva, setAbaAtiva] = useState("categorias");

  // Categorias
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [editandoCategoria, setEditandoCategoria] = useState(null);

  // Adicionais
  const [adicionais, setAdicionais] = useState([]);
  const [novoAdicional, setNovoAdicional] = useState({ nome: "", preco: "" });
  const [editandoAdicional, setEditandoAdicional] = useState(null);

  // =====================
  // CATEGORIAS
  // =====================
  const listarCategorias = async () => {
    const res = await axios.get("http://localhost:8000/api/admin/categorias");
    setCategorias(res.data);
  };

  const salvarCategoria = async () => {
    if (!novaCategoria.trim()) return;
    if (editandoCategoria) {
      await axios.put(
        `http://localhost:8000/api/admin/categorias/${editandoCategoria.id_categoria}`,
        { nome: novaCategoria }
      );
    } else {
      await axios.post("http://localhost:8000/api/admin/categorias", {
        nome: novaCategoria,
      });
    }
    setNovaCategoria("");
    setEditandoCategoria(null);
    listarCategorias();
  };

  const editarCategoria = (cat) => {
    setNovaCategoria(cat.nome);
    setEditandoCategoria(cat);
  };

  const excluirCategoria = async (id) => {
    if (window.confirm("Deseja excluir esta categoria?")) {
      await axios.delete(`http://localhost:8000/api/admin/categorias/${id}`);
      listarCategorias();
    }
  };

  // =====================
  // ADICIONAIS
  // =====================
  const listarAdicionais = async () => {
    const res = await axios.get("http://localhost:8000/api/admin/adicionais");
    setAdicionais(res.data);
  };

const salvarAdicional = async () => {
  if (!novoAdicional.nome.trim() || !novoAdicional.preco) return;

  const formData = new FormData();
  formData.append("nome", novoAdicional.nome);
  formData.append("preco", novoAdicional.preco);
  if (novoAdicional.imagem) {
    formData.append("imagem", novoAdicional.imagem);
  }

  try {
    if (editandoAdicional) {
      await axios.post(
        `http://localhost:8000/api/admin/adicionais/${editandoAdicional.id_adicional}?_method=PUT`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } else {
      await axios.post(
        "http://localhost:8000/api/admin/adicionais",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    }

    setNovoAdicional({ nome: "", preco: "", imagem: null });
    setEditandoAdicional(null);
    listarAdicionais();
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar o adicional");
  }
};


  const editarAdicional = (adc) => {
    setNovoAdicional({ nome: adc.nome, preco: adc.preco });
    setEditandoAdicional(adc);
  };

  const excluirAdicional = async (id) => {
    if (window.confirm("Deseja excluir este adicional?")) {
      await axios.delete(`http://localhost:8000/api/admin/adicionais/${id}`);
      listarAdicionais();
    }
  };

  // =====================
  // EFEITO INICIAL
  // =====================
  useEffect(() => {
    listarCategorias();
    listarAdicionais();
  }, []);

  // =====================
  // RENDER
  // =====================
  return (

    <div className="admin-itens-container">

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
        SAIR
      </button>

      <h1>Gerenciar Itens</h1>
      <div className="abas-container">
        <button
          className={`aba ${abaAtiva === "categorias" ? "ativa" : ""}`}
          onClick={() => setAbaAtiva("categorias")}
        >
          Categorias
        </button>
        <button
          className={`aba ${abaAtiva === "adicionais" ? "ativa" : ""}`}
          onClick={() => setAbaAtiva("adicionais")}
        >
          Adicionais
        </button>
      </div>

      {/* ABA CATEGORIAS */}
      {abaAtiva === "categorias" && (
        <div className="conteudo-aba">
          <div className="form-linha">
            <input
              type="text"
              placeholder="Nome da categoria"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
            />
            <button onClick={salvarCategoria}>
              {editandoCategoria ? "Atualizar" : "Adicionar"}
            </button>
          </div>

          <table className="tabela-admin">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat) => (
                <tr key={cat.id_categoria}>
                  <td>{cat.id_categoria}</td>
                  <td>{cat.nome}</td>
                  <td>
                    <button className="editar" onClick={() => editarCategoria(cat)}>
                      Editar
                    </button>
                    <button className="excluir" onClick={() => excluirCategoria(cat.id_categoria)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ABA ADICIONAIS */}
      {abaAtiva === "adicionais" && (
        <div className="conteudo-aba">
          <div className="form-linha">
            <input
              type="text"
              placeholder="Nome do adicional"
              value={novoAdicional.nome}
              onChange={(e) => setNovoAdicional({ ...novoAdicional, nome: e.target.value })}
            />
            <input
              type="number"
              placeholder="Preço"
              value={novoAdicional.preco}
              onChange={(e) => setNovoAdicional({ ...novoAdicional, preco: e.target.value })}
            />
              <label htmlFor="imagem">Imagem do adicional:</label>
                <input
                    type="file"
                    id="imagem"
                    name="imagem"
                    accept="image/*"
                    onChange={(e) => setNovoAdicional({ ...novoAdicional, imagem: e.target.files[0] })}
                />
                
            <button onClick={salvarAdicional}>
              {editandoAdicional ? "Atualizar" : "Adicionar"}
            </button>
          </div>

          <table className="tabela-admin">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Preço (R$)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {adicionais.map((adc) => (
                <tr key={adc.id_adicional}>
                  <td>{adc.id_adicional}</td>
                  <td>{adc.nome}</td>
                  <td>{adc.preco}</td>
                  <td>
                    <button className="editar" onClick={() => editarAdicional(adc)}>
                      Editar
                    </button>
                    <button className="excluir" onClick={() => excluirAdicional(adc.id_adicional)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
