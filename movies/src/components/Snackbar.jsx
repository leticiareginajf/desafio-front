import React from "react";
import "./Snackbar.css";

const Snackbar = ({ message, type = "error", show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={`snackbar ${type} show`}>
      <p>Nenhum resultado encontrado.</p>
      <button onClick={onClose} className="close-btn">&times;</button>
    </div>
  );
};

export default Snackbar;