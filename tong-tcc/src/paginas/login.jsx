import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (email === "admin@tong" && senha === "tong1234") {
        localStorage.setItem("auth", "true"); 
        navigate("/admin");
      } else {
        setErro("E-mail ou senha inválidos");
      }      
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <form 
        onSubmit={handleLogin} 
        style={{ 
          background: "#fff", 
          padding: 30, 
          borderRadius: 10, 
          boxShadow: "0 0 15px rgba(0,0,0,0.1)" 
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Entrar</h2>

        <label style={{ display: "block", marginBottom: 5 }}>E-mail</label>
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 15 }}
        />

        <label style={{ display: "block", marginBottom: 5 }}>Senha</label>
        <input
          type="password"
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 15 }}
        />

        {erro && <p style={{ color: "red", marginBottom: 10 }}>{erro}</p>}

        <button 
          type="submit" 
          style={{ 
            width: "100%", 
            padding: 10, 
            background: "#ff6600", 
            color: "#fff", 
            border: "none", 
            borderRadius: 5, 
            cursor: "pointer" 
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
