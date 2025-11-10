import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import './../../styles/home.css'

const ClienteModal = ({ onConfirm }) => {
  const [show, setShow] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  // abre o modal automaticamente ao entrar na home, se não tiver cliente salvo
useEffect(() => {
  const clienteSalvo = localStorage.getItem("cliente");
  if (!clienteSalvo) {
    setShow(true);
  } else {
    onConfirm(JSON.parse(clienteSalvo));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const handleSalvar = async () => {
    if (!nome || !telefone) {
      alert("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/cliente", {
        nome,
        telefone,
      });
      localStorage.setItem("cliente", JSON.stringify(res.data)); // salva localmente
      onConfirm(res.data);
      setShow(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} backdrop="static" centered>
      <Modal.Header>
        <Modal.Title>Identifique-se 😊</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>WhatsApp</Form.Label>
            <Form.Control
              type="tel"
              placeholder="(15) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" disabled={loading} onClick={handleSalvar}>
          {loading ? "Salvando..." : "Confirmar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClienteModal;
