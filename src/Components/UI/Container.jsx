import React from "react";

function Container({ children, className }) {
  return (
    <div className={`max-w-[1360px] mx-auto px-8 ${className}`}>{children}</div>
  );
}

export default Container;
