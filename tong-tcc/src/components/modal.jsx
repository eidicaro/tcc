export default function Modal({ title, children, onClose }) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <header>
            <h2>{title}</h2>
            <button onClick={onClose}>X</button>
          </header>
          <main>{children}</main>
        </div>
      </div>
    );
  }
  