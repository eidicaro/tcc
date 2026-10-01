import { Component } from "react";

export default class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, details) {
    console.error("Falha inesperada na interface", error, details);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-fatal-error" role="alert">
          <span aria-hidden="true">◇</span>
          <h1>Não foi possível abrir esta tela</h1>
          <p>Uma atualização ou falha temporária interrompeu a interface.</p>
          <div>
            <button type="button" onClick={() => window.location.reload()}>
              Recarregar com segurança
            </button>
            <a href="/">Voltar ao início</a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
