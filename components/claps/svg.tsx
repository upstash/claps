import React from "react";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// https://tablericons.com/
export default function Svg({ size = 20, children, ...props }: ISVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      {...props}
    >
      {children}
    </svg>
  );
}
