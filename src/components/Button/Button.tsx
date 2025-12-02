import type { CSSProperties } from "react";
import "./Button.scss";

interface ButtonProps {
  text: string;
  onClick: () => void;
  styles?: CSSProperties;
}

function Button({ text, onClick, styles }: ButtonProps) {
  return (
    <div id="button" onClick={onClick} style={{ ...styles }}>
      {text}
    </div>
  );
}

export default Button;
