import React from 'react';
import styled from 'styled-components';
import Tong from './../images/tong-2.svg';

const Carrossel = () => {
  return (
    <StyledWrapper>
      <div
        className="slider"
        style={{
          '--width': '300px', 
          '--height': '300px', 
          '--quantity': 9
        }}
      >
        <div className="list">
          <div className="item" style={{ '--position': 1 }}>
            <div
              className="card"
              style={{
                background: '#000',
              }}
            >
              <img src={Tong} style={{width: '800%;', height: '800%',}}/>
            </div>
          </div>

          <div className="item" style={{ '--position': 2 }}>
            <div
              className="card"
              style={{
                  background: '#000',
                }}
                >
              <img src={Tong} style={{width: '800%;', height: '800%',}}/>
                <p>Os Mais Pedidos</p>
            </div>
          </div>

          <div className="item" style={{ '--position': 3 }}>
            <div
              className="card"
              style={{
                background: '#000',
              }}
            >
              <img src={Tong} style={{width: '800%;', height: '800%',}}/>
            </div>
          </div>

          <div className="item" style={{ '--position': 4 }}>
            <div
              className="card"
              style={{
                background: '#000',
              }}
            >
              <img src={Tong} style={{width: '800%;', height: '800%',}}/>
            </div>
          </div>
          
          <div className="item" style={{ '--position': 5 }}>
            <div
              className="card"
              style={{
                background: '#000',
              }}
            >
              <img src={Tong} style={{width: '800%;', height: '800%',}}/>
            </div>
          </div>

          <div className="item" style={{ '--position': 6 }}>
            <div
              className="card"
              style={{
                background: '#000',
              }}
            >
              <img src={Tong} style={{width: '800%;', height: '800%',}}/>
            </div>
          </div>

          <div className="item" style={{ '--position': 7 }}>
            <div
              className="card"
              style={{
                background: '#000',
              }}
            >
              <img src={Tong} style={{width: '800%;', height: '800%',}}/>
            </div>
          </div>

          <div className="item" style={{ '--position': 8 }}>
            <div
              className="card"
              style={{
                background: '#000',
              }}
            >
              <img src={Tong} style={{width: '800%;', height: '800%',}}/>
            </div>
          </div>
          
          <div className="item" style={{ '--position': 9 }}>
            <div
              className="card"
              style={{
                background: '#000',
              }}
            >
              <img src={Tong} style={{width: '800%;', height: '800%',}}/>
            </div>
          </div>

        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    height: 100%;
    padding: 10%; 
    border: 1px solid #ccc;
    border-radius: 7px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    color: white;
    text-align: center;
  }

  .card p {
    font-size: 18px; 
    color: white;
  }

  .slider {
    width: 100%;
    height: var(--height);
    overflow: hidden;
  }

  .slider .list {
    display: flex;
    width: 100%;
    min-width: calc(var(--width) * var(--quantity));
    position: relative;
  }

  .slider .list .item {
    width: var(--width);
    height: var(--height);
    position: absolute;
    left: 100%;
    animation: autoRun 20s linear infinite;
    transition: filter 0.5s;
    animation-delay: calc(
      (20s / var(--quantity)) * (var(--position) - 1) - 20s
    ) !important;
  }

  .slider .list .item img {
    width: 100%;
  }

  @keyframes autoRun {
    from {
      left: 100%;
    }
    to {
      left: calc(var(--width) * -1);
    }
  }

  .slider:hover .item {
    animation-play-state: paused !important;
    filter: grayscale(1);
  }

  .slider .item:hover {
    filter: grayscale(0);
  }

  .slider[reverse="true"] .item {
    animation: reversePlay 10s linear infinite;
  }

  @keyframes reversePlay {
    from {
      left: calc(var(--width) * -1);
    }
    to {
      left: 100%;
    }
  }
`;

export default Carrossel;
