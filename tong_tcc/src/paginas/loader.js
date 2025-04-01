import React, { useState, useEffect } from 'react';
import Carpa from '../images/koi_no_background.png'; 

const Loader = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); 
  }, []);

  return (
    <>
      {loading && (
        <div style={styles.overlay}>
          <div style={styles.loader}></div>
        </div>
      )}
      <div style={styles.content}>
        {!loading && (
          <img
            src={Carpa}
            alt="Conteúdo carregado"
            style={styles.image}
          />
        )}
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, 
  },
  loader: {
    width: '150px',
    height: '150px',
    backgroundImage: `url(${Carpa})`, 
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    animation: 'spin 3s linear infinite', 
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
  },
};

const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
`;

const styleTag = document.createElement('style');
styleTag.innerHTML = spinKeyframes;
document.head.appendChild(styleTag);

export default Loader;
