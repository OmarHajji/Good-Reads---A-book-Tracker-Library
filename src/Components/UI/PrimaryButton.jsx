import React from "react";

function PrimaryButton({ text, imageUrl, className, link = "#" }) {
  return (
    <a
      href={link}
      className={`bg-brown hover:bg-dark-brown transition hover:cursor-pointer text-white text-base rounded-sm flex items-center justify-center px-4 py-2 hover:underline-offset-0 ${className}`}
    >
      <div className="flex  gap-2">
        {text}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="button icon"
            className="w-[20px] h-[24px] "
          />
        )}
      </div>
    </a>
  );
}

export default PrimaryButton;
