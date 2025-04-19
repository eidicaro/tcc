// Modal.jsx
import { createPortal } from "react-dom";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';

export const Modal = ({
  title,
  subtitle,
  modalContent,
  toggleModal,
  isOpen,
}) => {
  const open =
    isOpen === null ? "default" : isOpen ? "open" : "closed";

  const Overlay = () => (
    <div className={`overlay ${open}`} onClick={toggleModal} />
  );

  const Dialog = () => (
    <div
      className={`dialog ${open}`}
      onClick={e => e.stopPropagation()}
    >
      <header>
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
      </header>
      {modalContent}
    </div>
  );

  return (
    <>
      {createPortal(<Overlay />, document.body)}
      {createPortal(<Dialog />, document.body)}
    </>
  );
};
