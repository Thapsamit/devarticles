import React from "react";

const EmptyState = ({ icon, title, description, action }) => (
  <div className="surface animate-fadeUp flex flex-col items-center justify-center px-6 py-16 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-hair/[0.08] bg-brandSoft text-[26px]">
      {icon || "📭"}
    </div>
    <h3 className="font-display text-[19px] font-bold text-primaryText4">
      {title}
    </h3>
    {description && (
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-primaryText1">
        {description}
      </p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
