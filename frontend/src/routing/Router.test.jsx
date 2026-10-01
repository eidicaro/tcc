import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { BrowserRouter, Link, Navigate, NavLink, useLocation } from "./Router";

function LocationProbe() {
  const location = useLocation();
  return <output>{`${location.pathname}${location.search}${location.hash}`}</output>;
}

describe("Router", () => {
  beforeEach(() => window.history.replaceState(null, "", "/"));

  it("navega internamente sem recarregar a página", async () => {
    const user = userEvent.setup();
    document.documentElement.scrollTop = 240;
    render(
      <BrowserRouter>
        <Link to="/cardapio?busca=temaki#resultados">Abrir cardápio</Link>
        <LocationProbe />
      </BrowserRouter>,
    );

    await user.click(screen.getByRole("link", { name: "Abrir cardápio" }));
    expect(screen.getByText("/cardapio?busca=temaki#resultados")).toBeInTheDocument();
    expect(document.documentElement.scrollTop).toBe(240);
  });

  it("marca somente a navegação correspondente como atual", () => {
    window.history.replaceState(null, "", "/cardapio");
    render(
      <BrowserRouter>
        <NavLink to="/" end>Início</NavLink>
        <NavLink to="/cardapio">Cardápio</NavLink>
      </BrowserRouter>,
    );

    expect(screen.getByRole("link", { name: "Início" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Cardápio" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Cardápio" })).toHaveClass("active");
  });

  it("leva novas páginas sem hash ao topo", async () => {
    const user = userEvent.setup();
    document.documentElement.scrollTop = 240;
    render(
      <BrowserRouter>
        <Link to="/cardapio">Trocar página</Link>
      </BrowserRouter>,
    );

    await user.click(screen.getByRole("link", { name: "Trocar página" }));
    expect(document.documentElement.scrollTop).toBe(0);
  });

  it("preserva estado em redirecionamentos internos", async () => {
    function Destination() {
      const location = useLocation();
      return <output>{location.state?.from ?? "sem estado"}</output>;
    }

    render(
      <BrowserRouter>
        <Navigate to="/login" replace state={{ from: "/admin" }} />
        <Destination />
      </BrowserRouter>,
    );

    await waitFor(() => expect(screen.getByText("/admin")).toBeInTheDocument());
    expect(window.location.pathname).toBe("/login");
  });
});
