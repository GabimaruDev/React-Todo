import type { SVGProps } from "react";

export const IconDragIndicator = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" fill="#aaa" viewBox="0 0 24 24" {...props}>
        <circle cx={8} cy={4} r={2} data-original="#000000" />
        <circle cx={8} cy={12} r={2} data-original="#000000" />
        <circle cx={8} cy={20} r={2} data-original="#000000" />
        <circle cx={16} cy={4} r={2} data-original="#000000" />
        <circle cx={16} cy={12} r={2} data-original="#000000" />
        <circle cx={16} cy={20} r={2} data-original="#000000" />
    </svg>
);
