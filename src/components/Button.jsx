import React from 'react';

const Button = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  variant = "secondary",
  className = "",
}) => {
  const btnClass = `btn btn-${variant} px-4 ${className}`;

  return (
    <button
      type={type}
      className={btnClass}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;

export const SubmitButton = (props) => {
  return <Button {...props} variant="success" />;
};

export const ResetButton = (props) => {
  return <Button {...props} variant="secondary" />;
};

export const CancelButton = (props) => {
  return <Button {...props} variant="danger" />;
};

export const LoginButton = (props) => {
  return <Button {...props} variant="success" className="rounded-pill" />;
};

export const SignUpButton = (props) => {
  return <Button {...props} variant="dark" className="rounded-pill" />;
};
