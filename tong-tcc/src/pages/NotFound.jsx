import { Link } from "../routing/Router";
import { FiArrowLeft } from "react-icons/fi";
import PublicLayout from "../components/store/PublicLayout";
import { useStore } from "../contexts/StoreContext";
import { getStoreVocabulary } from "../utils/storefront";

export default function NotFound() {
  const { store } = useStore();
  const vocabulary = getStoreVocabulary(store);

  return (
    <PublicLayout>
      <section className="store-not-found store-shell">
        <span aria-hidden="true">404</span>
        <p className="store-eyebrow">Este endereço não existe</p>
        <h1>Vamos levar você de volta.</h1>
        <p>A página pode ter mudado, mas o {vocabulary.catalogLower} continua esperando por você.</p>
        <Link className="store-button store-button--primary" to="/">
          <FiArrowLeft aria-hidden="true" /> Voltar ao início
        </Link>
      </section>
    </PublicLayout>
  );
}
