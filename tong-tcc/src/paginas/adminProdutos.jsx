// import React, { useState } from "react";
// import Modal from "../components/modal";
// import ProdutoForm from "../components/produtoForm";
// import "./../styles/adminProdutos.css";

// export default function ProdutosPage() {
//   const [modalOpen, setModalOpen] = useState(null); // null, "criar", "editar", "promocao"
//   const [produtos, setProdutos] = useState([]);
//   const [produtoSelecionado, setProdutoSelecionado] = useState(null);

//   // Salvar produto
//   const handleSave = (produto) => {
//     if (produtoSelecionado) {
//       setProdutos(
//         produtos.map((p) =>
//           p.id === produtoSelecionado.id ? { ...produto, id: p.id } : p
//         )
//       );
//     } else {
//       setProdutos([...produtos, { ...produto, id: Date.now() }]);
//     }
//     setModalOpen(null);
//     setProdutoSelecionado(null);
//   };

//   // Editar produto existente
//   const handleEdit = (produto) => {
//     setProdutoSelecionado(produto);
//     setModalOpen("criar"); // reabre o modal de criar com dados preenchidos
//   };

//   // Excluir produto
//   const handleDelete = (id) => {
//     setProdutos(produtos.filter((p) => p.id !== id));
//   };

//   return (
//     <div className="produtos-container">
//       {/* Card central com botões */}
//       <div className="produtos-card">
//         <h2>PRODUTOS</h2>
//         <button onClick={() => setModalOpen("criar")}>CRIAR PRODUTO</button>
//         <button onClick={() => setModalOpen("editar")}>EDITAR PRODUTO</button>
//         <button onClick={() => setModalOpen("promocao")}>CRIAR PROMOÇÃO</button>
//       </div>

//       {/* Botão sair */}
//       <button
//         className="logout-btn"
//         onClick={() => {
//           fetch("http://localhost:8000/api/logout", {
//             method: "POST",
//             credentials: "include",
//           }).finally(() => (window.location.href = "/admin"));
//         }}
//       >
//         SAIR
//       </button>

//       {/* Modal Criar Produto */}
//       {modalOpen === "criar" && (
//         <Modal title="Criar Produto" onClose={() => setModalOpen(null)}>
//           <ProdutoForm onSubmit={handleSave} initialData={produtoSelecionado} />
//         </Modal>
//       )}

//       {/* Modal Editar Produto */}
//       {modalOpen === "editar" && (
//         <Modal title="Editar Produto" onClose={() => setModalOpen(null)}>
//           {produtos.length === 0 ? (
//             <p>Nenhum produto cadastrado.</p>
//           ) : (
//             <table border="1" cellPadding="8" style={{ width: "100%" }}>
//               <thead>
//                 <tr>
//                   <th>Nome</th>
//                   <th>Preço</th>
//                   <th>Categoria</th>
//                   <th>Descrição</th>
//                   <th>Ações</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {produtos.map((p) => (
//                   <tr key={p.id}>
//                     <td>{p.nome}</td>
//                     <td>{p.preco}</td>
//                     <td>{p.categoria}</td>
//                     <td>{p.descricao}</td>
//                     <td>
//                       <button onClick={() => handleEdit(p)}>Editar</button>
//                       <button onClick={() => handleDelete(p.id)}>Excluir</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </Modal>
//       )}

//       {/* Modal Criar Promoção */}
//       {modalOpen === "promocao" && (
//         <Modal title="Criar Promoção" onClose={() => setModalOpen(null)}>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               alert("Promoção criada com sucesso!");
//               setModalOpen(null);
//             }}
//           >
//             <label>
//               Nome da Promoção:
//               <input type="text" required />
//             </label>
//             <br />
//             <label>
//               Desconto (%):
//               <input type="number" required />
//             </label>
//             <br />
//             <label>
//               Validade:
//               <input type="date" required />
//             </label>
//             <br />
//             <button type="submit">Salvar</button>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import Modal from "../components/modal";
import ProdutoForm from "../components/produtoForm";
import "./../styles/adminProdutos.css";

export default function ProdutosPage() {
  const [modalOpen, setModalOpen] = useState(null); // null, "criar", "editar", "promocao"
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // Salvar produto
  const handleSave = (produto) => {
    if (produtoSelecionado) {
      setProdutos(
        produtos.map((p) =>
          p.id === produtoSelecionado.id ? { ...produto, id: p.id } : p
        )
      );
    } else {
      setProdutos([...produtos, { ...produto, id: Date.now() }]);
    }
    setModalOpen(null);
    setProdutoSelecionado(null);
  };

  // Editar produto existente
  const handleEdit = (produto) => {
    setProdutoSelecionado(produto);
    setModalOpen("criar"); // reabre o modal de criar com dados preenchidos
  };

  // Excluir produto
  const handleDelete = (id) => {
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  return (
    <div className="produtos-container">
      {/* Card central com botões */}
      <div className="produtos-card">
        <h2>PRODUTOS</h2>
        <button onClick={() => setModalOpen("criar")}>CRIAR PRODUTO</button>
        <button onClick={() => setModalOpen("editar")}>EDITAR PRODUTO</button>
        <button onClick={() => setModalOpen("promocao")}>CRIAR PROMOÇÃO</button>
      </div>

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

      {/* Modal Criar Produto */}
      {modalOpen === "criar" && (
        <Modal title="Criar Produto" onClose={() => setModalOpen(null)}>
          <ProdutoForm onSubmit={handleSave} initialData={produtoSelecionado} />
        </Modal>
      )}

      {/* Modal Editar Produto */}
      {modalOpen === "editar" && (
        <Modal title="Editar Produto" onClose={() => setModalOpen(null)}>
          {produtos.length === 0 ? (
            <p>Nenhum produto cadastrado.</p>
          ) : (
            <table border="1" cellPadding="8" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.preco}</td>
                    <td>{p.categoria}</td>
                    <td>{p.descricao}</td>
                    <td>
                      <button onClick={() => handleEdit(p)}>Editar</button>
                      <button onClick={() => handleDelete(p.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal>
      )}

      {/* Modal Criar Promoção */}
      {modalOpen === "promocao" && (
        <Modal title="Criar Promoção" onClose={() => setModalOpen(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Promoção criada com sucesso!");
              setModalOpen(null);
            }}
          >
            <label>
              Nome da Promoção:
              <input type="text" required />
            </label>
            <br />
            <label>
              Desconto (%):
              <input type="number" required />
            </label>
            <br />
            <label>
              Validade:
              <input type="date" required />
            </label>
            <br />
            <button type="submit">Salvar</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

