import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AdminModal from "./admin/AdminModal";
import AccessibleDialog from "./store/AccessibleDialog";

describe("foco dos diálogos", () => {
  it("não reinicia o foco do formulário quando o modal administrativo renderiza novamente", async () => {
    const user = userEvent.setup();

    function FormModal() {
      const [value, setValue] = useState("");
      return (
        <AdminModal open title="Editar" onClose={() => undefined}>
          <label>
            Nome
            <input value={value} onChange={(event) => setValue(event.target.value)} />
          </label>
        </AdminModal>
      );
    }

    render(<FormModal />);
    const input = screen.getByRole("textbox", { name: "Nome" });
    await waitFor(() => expect(input).toHaveFocus());
    await user.type(input, "Produto");
    expect(input).toHaveFocus();
    expect(input).toHaveValue("Produto");
  });

  it("preserva o controle ativo no drawer durante atualizações", async () => {
    const user = userEvent.setup();

    function Drawer() {
      const [quantity, setQuantity] = useState(1);
      return (
        <AccessibleDialog open onClose={() => undefined} labelledBy="drawer-title" variant="drawer">
          <h2 id="drawer-title">Pedido</h2>
          <button type="button" onClick={() => setQuantity((value) => value + 1)}>
            Aumentar {quantity}
          </button>
        </AccessibleDialog>
      );
    }

    render(<Drawer />);
    const button = screen.getByRole("button", { name: "Aumentar 1" });
    await user.click(button);
    const updatedButton = screen.getByRole("button", { name: "Aumentar 2" });
    expect(updatedButton).toHaveFocus();
  });
});
