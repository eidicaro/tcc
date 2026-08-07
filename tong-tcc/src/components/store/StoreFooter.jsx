import { Link } from "../../routing/Router";
import { FiFacebook, FiInstagram, FiMapPin, FiPhone } from "react-icons/fi";
import { useStore } from "../../contexts/StoreContext";
import { whatsappUrl } from "../../utils/formatters";
import { getStoreVocabulary } from "../../utils/storefront";

export default function StoreFooter() {
  const { store } = useStore();
  const whatsapp = whatsappUrl(store.contact.whatsapp || store.contact.phone);
  const vocabulary = getStoreVocabulary(store);

  return (
    <footer className="store-footer">
      <div className="store-shell store-footer__grid">
        <div className="store-footer__brand">
          <img src={store.logo} alt="" width="72" height="72" />
          <div>
            <strong>{store.name}</strong>
            <p>{store.tagline}</p>
          </div>
        </div>

        <div>
          <h2>Descubra</h2>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/cardapio">{vocabulary.catalog} completo</Link></li>
            <li><Link to="/#store-hours">Horários</Link></li>
          </ul>
        </div>

        <div>
          <h2>Contato</h2>
          <ul>
            <li><FiMapPin aria-hidden="true" /> {store.location.city}</li>
            {store.contact.phone && (
              <li><FiPhone aria-hidden="true" /> {store.contact.phone}</li>
            )}
          </ul>
          <div className="store-footer__socials" aria-label="Redes sociais">
            {store.contact.instagram && (
              <a href={store.contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <FiInstagram aria-hidden="true" />
              </a>
            )}
            {store.contact.facebook && (
              <a href={store.contact.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <FiFacebook aria-hidden="true" />
              </a>
            )}
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <FiPhone aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="store-shell store-footer__legal">
        <span>© {new Date().getFullYear()} {store.name}</span>
        <span>Feito para servir experiências memoráveis.</span>
      </div>
    </footer>
  );
}
