import React from "react";
import { avatarGradient, initials } from "../../utils/article";

const SIZES = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-[11px]",
  md: "h-11 w-11 text-[13px]",
  lg: "h-14 w-14 text-[16px]",
};

const Avatar = ({
  name = "",
  src,
  size = "md",
  ring = true,
  className = "",
}) => {
  const base = `${SIZES[size] || SIZES.md} shrink-0 rounded-full object-cover ${
    ring ? "ring-2 ring-hair/10" : ""
  } ${className}`;

  if (src) {
    return <img src={src} alt={name || "avatar"} className={base} />;
  }

  return (
    <span
      aria-hidden="true"
      title={name}
      className={`${base} inline-flex items-center justify-center bg-gradient-to-br ${avatarGradient(
        name,
      )} font-display font-bold text-white`}
    >
      {initials(name)}
    </span>
  );
};

export default Avatar;
