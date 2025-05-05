import PropTypes from 'prop-types';

// Dialog Components
export function Dialog({ children, onOpen, onOpenChange, ...props }) {
    if (!children) return null;

    if (!onOpen) {
        console.error("Dialog component requires an onOpen prop to control its open state.");
        return null;
    }

    const handleOpenChange = () => {
        if (onOpenChange) onOpenChange(open);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
            onClick={() => handleOpenChange(false)}
            {...props}
        >
            <div onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

Dialog.propTypes = {
    children: PropTypes.node,
    onOpenChange: PropTypes.func,
    onOpen: PropTypes.func,
};

export function DialogContent({ children, ...props }) {
    return (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[85vh] overflow-auto p-6" {...props}>
            {children}
        </div>
    );
}

DialogContent.propTypes = {
    children: PropTypes.node,
};

export function DialogHeader({ children, ...props }) {
    return (
        <div className="flex flex-col space-y-1.5 pb-4" {...props}>
            {children}
        </div>
    );
}

DialogHeader.propTypes = {
    children: PropTypes.node,
};

export function DialogTitle({ children, ...props }) {
    return (
        <h2 className="text-lg font-semibold leading-none tracking-tight" {...props}>
            {children}
        </h2>
    );
}

DialogTitle.propTypes = {
    children: PropTypes.node,
};

export function DialogFooter({ children, ...props }) {
    return (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4" {...props}>
            {children}
        </div>
    );
}

DialogFooter.propTypes = {
    children: PropTypes.node,
};