/* eslint-disable react/prop-types */
export default function Button({ children, classNames, style, onClick }) {

    return (
        <button
            type="button"
            className={`rounded px-2 py-1 text-xs font-semibold shadow-sm   
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2   
                       transition-colors ${classNames}`}
            style={{
                ...style,
                // Do not set hover color here, it should be handled by Tailwind CSS class  
            }}
            onClick={onClick}
        >
            {children}
        </button>
    );
}