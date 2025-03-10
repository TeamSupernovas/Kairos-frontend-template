import React from "react";

const TextArea = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  disabled = false,
  rows = 3,
  className = "",
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && <label className="form-label fw-bold">{label}</label>}
      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        className="form-control border rounded px-3 py-2"
        rows={rows}
        onChange={onChange}
        disabled={disabled}
      ></textarea>
    </div>
  );
};

export default TextArea;
