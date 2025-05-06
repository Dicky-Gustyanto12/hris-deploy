// components/Button.jsx
import React from "react";
import PropTypes from "prop-types";

const Button = ({ label, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm ${className}`}
    >
      {label}
    </button>
  );
};

// Optional: Validasi props
Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default Button;
