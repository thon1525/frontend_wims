// eslint-disable-next-line react/prop-types
export default function Pill({ title }) {
    const pillBgMap = {
        delivered: '#00B69B',
        processing: '#6226EF',
        returned: '#EF3826'
    };

    // Get the background color based on the title, defaulting to gray if not found  
    const backgroundColor = pillBgMap[title] || '#d1d5db'; // Default to gray  

    return (
        <>
            <span
                style={{ backgroundColor }}
                className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white capitalize"
            >
                {title}
            </span>
        </>
    );
}