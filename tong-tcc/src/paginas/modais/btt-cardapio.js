import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';  // Importando Link

const Btt = () => {
  return (
    <StyledWrapper>
      <button>
        <span className="shadow" />
        <span className="edge" />
        <span className="front text"><Link className="nav-link" to="/cardapio">Ir ao Cardápio</Link></span>
        
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
/* From Uiverse.io by cssbuttons-io */ 
button {
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  margin-top: 10px;
  margin-left: 15%;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;
  user-select: none;
  touch-action: manipulation;
}

.shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: hsl(0deg 0% 0% / 0.25);
  will-change: transform;
  transform: translateY(2px);
  transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
}

.edge {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: linear-gradient(
    to left,
    hsl(24deg 80% 30%) 0%,
    hsl(24deg 80% 40%) 8%,
    hsl(24deg 80% 40%) 92%,
    hsl(24deg 80% 30%) 100%
  );
}

.front {
  display: block;
  position: relative;
  padding: 12px 27px;
  border-radius: 12px;
  font-size: 1.1rem;
  color: white;
  background: #F48347;
  will-change: transform;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
}

button:hover {
  filter: brightness(110%);
}

button:hover .front {
  transform: translateY(-6px);
  transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5);
}

button:active .front {
  transform: translateY(-2px);
  transition: transform 34ms;
}

button:hover .shadow {
  transform: translateY(4px);
  transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5);
}

button:active .shadow {
  transform: translateY(1px);
  transition: transform 34ms;
}

button:focus:not(:focus-visible) {
  outline: none;
}`;

export default Btt;
