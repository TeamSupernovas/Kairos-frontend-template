import React from "react";

const TextField = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
  disabled = false,
  variant = "medium",
  className = "",
}) => {
  const widthClass =
    variant === "large" ? "w-50" : variant === "medium" ? "w-25" : "w-15";

  return (
    <div className={`mb-3 ${widthClass} ${className}`}>
      {label && <label className="form-label fw-bold">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        className="form-control border rounded px-3 py-2"
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default TextField;

export const LargeTextField = (props) => {
  return <TextField {...props} variant="large" />;
};

export const MediumTextField = (props) => {
  return <TextField {...props} variant="medium" />;
};

export const SmallTextField = (props) => {
  return <TextField {...props} variant="small" />;
};
