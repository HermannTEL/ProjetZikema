// Tooltip Components
export function TooltipProvider({ children, ...props }) {
    return <div {...props}>{children}</div>;
}

export function Tooltip({ children, ...props }) {
    return <div className="relative inline-block" {...props}>{children}</div>;
}

export function TooltipTrigger({ children, ...props }) {
    return <div className="inline-block" {...props}>{children}</div>;
}

export function TooltipContent({ children, ...props }) {
    return (
        <div className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" {...props}>
            {children}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-gray-900 border-l-transparent border-r-transparent"></div>
        </div>
    );
}