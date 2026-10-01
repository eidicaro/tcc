import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiMinus, FiPlus, FiX } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";
import { useStoreFormatting } from "../../hooks/useStoreFormatting";
import { normalizeAdditional } from "../../utils/catalog";
import { centsToMoney, moneyToCents } from "../../contexts/cartMath";
import AccessibleDialog from "./AccessibleDialog";

const MAX_ITEM_QUANTITY = 99;
const MAX_DISTINCT_ADDITIONALS = 30;

export default function ProductDialog({ product, additionals = [], onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [additionalQuantities, setAdditionalQuantities] = useState({});
  const [selectionError, setSelectionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addItem, openCart, syncing } = useCart();
  const { formatCurrency } = useStoreFormatting();
  const open = Boolean(product);

  useEffect(() => {
    setQuantity(1);
    setAdditionalQuantities({});
    setSelectionError("");
    setSubmitting(false);
  }, [product?.id]);

  const availableAdditionals = useMemo(() => {
    const productAdditionals = product?.adicionais ?? product?.additionals;
    const explicitlyConfigured = Boolean(
      product?.adicionais_configurados ?? product?.additionalsConfigured,
    );
    const hasProductSelection = Array.isArray(productAdditionals)
      && (productAdditionals.length > 0 || explicitlyConfigured);
    const source = hasProductSelection ? productAdditionals : additionals;
    return source.map(normalizeAdditional).filter(Boolean);
  }, [product, additionals]);

  const selectedAdditionals = useMemo(
    () =>
      availableAdditionals
        .map((additional) => ({
          ...additional,
          quantidade: additionalQuantities[additional.id] ?? 0,
        }))
        .filter((additional) => additional.quantidade > 0),
    [availableAdditionals, additionalQuantities],
  );

  const total = useMemo(() => {
    if (!product) return 0;
    const additionsTotal = selectedAdditionals.reduce(
      (sum, additional) => sum + moneyToCents(additional.price) * additional.quantidade,
      0,
    );
    return centsToMoney((moneyToCents(product.price) + additionsTotal) * quantity);
  }, [product, quantity, selectedAdditionals]);

  if (!product) return null;

  const changeAdditional = (id, difference) => {
    setAdditionalQuantities((current) => {
      const currentQuantity = Number(current[id] || 0);
      const distinctCount = Object.values(current).filter((value) => Number(value) > 0).length;

      if (difference > 0 && currentQuantity === 0 && distinctCount >= MAX_DISTINCT_ADDITIONALS) {
        setSelectionError(`Escolha no máximo ${MAX_DISTINCT_ADDITIONALS} adicionais diferentes.`);
        return current;
      }

      const nextQuantity = Math.min(
        MAX_ITEM_QUANTITY,
        Math.max(0, currentQuantity + difference),
      );
      setSelectionError("");

      return { ...current, [id]: nextQuantity };
    });
  };

  const handleAdd = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await addItem({
        id: product.id,
        name: product.name,
        quantity,
        additionals: selectedAdditionals,
      });
      onClose();
      openCart();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <AccessibleDialog
      open={open}
      onClose={submitting ? () => {} : onClose}
      labelledBy="store-product-dialog-title"
      describedBy="store-product-dialog-description"
      variant="product"
    >
      <button
        type="button"
        className="store-dialog__close"
        onClick={onClose}
        disabled={submitting}
        aria-label="Fechar detalhes do produto"
      >
        <FiX aria-hidden="true" />
      </button>

      <div className="store-product-dialog__media">
        {product.image ? <img src={product.image} alt="" /> : <span aria-hidden="true">✦</span>}
      </div>

      <div className="store-product-dialog__content">
        <span className="store-eyebrow">Escolha cada detalhe</span>
        <h2 id="store-product-dialog-title">{product.name}</h2>
        <p id="store-product-dialog-description">{product.description}</p>
        <strong className="store-product-dialog__price">{formatCurrency(product.price)}</strong>

        {availableAdditionals.length > 0 && (
          <fieldset className="store-additionals">
            <legend>Complete seu pedido</legend>
            <p>Os adicionais são calculados por unidade do produto.</p>
            {selectionError && <p className="store-form-error" role="alert">{selectionError}</p>}
            <div className="store-additionals__list">
              {availableAdditionals.map((additional) => {
                const selectedQuantity = additionalQuantities[additional.id] ?? 0;
                const distinctLimitReached = selectedAdditionals.length >= MAX_DISTINCT_ADDITIONALS;
                return (
                  <div className="store-additional" key={additional.id}>
                    {additional.image ? <img src={additional.image} alt="" loading="lazy" /> : null}
                    <span>
                      <strong>{additional.name}</strong>
                      <small>+ {formatCurrency(additional.price)}</small>
                    </span>
                    <div className="store-stepper" aria-label={`Quantidade de ${additional.name}`}>
                      <button
                        type="button"
                        onClick={() => changeAdditional(additional.id, -1)}
                        disabled={selectedQuantity === 0}
                        aria-label={`Remover um ${additional.name}`}
                      >
                        <FiMinus aria-hidden="true" />
                      </button>
                      <output aria-live="polite">{selectedQuantity}</output>
                      <button
                        type="button"
                        onClick={() => changeAdditional(additional.id, 1)}
                        disabled={
                          selectedQuantity >= MAX_ITEM_QUANTITY
                          || (selectedQuantity === 0 && distinctLimitReached)
                        }
                        aria-label={`Adicionar um ${additional.name}`}
                      >
                        <FiPlus aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="store-product-dialog__action">
          <div className="store-stepper store-stepper--large" aria-label="Quantidade do produto">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              disabled={quantity === 1}
              aria-label="Diminuir quantidade"
            >
              <FiMinus aria-hidden="true" />
            </button>
            <output aria-live="polite">{quantity}</output>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(MAX_ITEM_QUANTITY, value + 1))}
              disabled={quantity >= MAX_ITEM_QUANTITY}
              aria-label="Aumentar quantidade"
            >
              <FiPlus aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className="store-button store-button--primary store-product-dialog__submit"
            onClick={handleAdd}
            disabled={submitting || syncing}
          >
            {submitting ? (
              "Adicionando…"
            ) : (
              <><FiCheck aria-hidden="true" /> Adicionar · {formatCurrency(total)}</>
            )}
          </button>
        </div>
      </div>
    </AccessibleDialog>
  );
}
