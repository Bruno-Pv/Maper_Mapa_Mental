import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Tooltip.css';

const Tooltip = ({ descricao, uso, children }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseEnter = () => {
    const rect = ref.current.getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setVisible(true);
  };

  const handleMouseLeave = () => setVisible(false);

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ zIndex: 10 }}
      >
        {children}
      </span>

      {visible && ReactDOM.createPortal(
        <>
          <div
            className="tooltip-balao tooltip-descricao"
            style={{
              top: coords.y - 20 + 'px',
              left: coords.x - 100 + 'px',
            }}
          >
            <strong>Descrição:</strong> {descricao}
          </div>

          <div
            className="tooltip-balao tooltip-uso"
            style={{
              top: coords.y - 20 + 'px',
              left: coords.x + 100 + 'px',
            }}
          >
            <strong>Uso:</strong> {uso}
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
