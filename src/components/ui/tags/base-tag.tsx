import React from "react";
import clsx from "clsx";

export default function BaseTag({
  children,
  large = false,
  hoverable = false,
  containerClass,
  title = "",
}: {
  children: React.ReactNode;
  large?: boolean;
  hoverable?: boolean;
  containerClass?: string;
  title?: string;
}) {
  return (
    <code
      title={title}
      className={clsx(
        "inline-block bg-dracula-dark/30",
        large ? "text-4xl px-4 py-2" : "px-2 py-1",
        hoverable && "hover:bg-dracula-dark transition",
        containerClass
      )}
    >
      {children}
    </code>
  );
}
