import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function Container({ children, ...props }: ContainerProps) {
  return <div {...props}>{children}</div>;
}
