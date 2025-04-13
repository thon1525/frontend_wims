import { capitalizeWords } from '../utils/capitalize'

/* eslint-disable react/prop-types */
export default function Badge({ title }) {
    const badgeClass =
        title === "completed"
            ? "bg-[#00B69B] bg-opacity-20 text-[#00B69B]"
            : title === "processing"
                ? "bg-[#6226EF] bg-opacity-20 text-[#6226EF]"
                : title === "rejected"
                    ? "bg-[#EF3826] bg-opacity-20 text-[#EF3826]"
                    : title === "hold"
                        ? "bg-[#FFA756] bg-opacity-20 text-[#FFA756]"
                        : title === "transit"
                            ? "bg-[#BA29FF] bg-opacity-20 text-[#BA29FF]"
                            : "bg-[#e5e7eb] bg-opacity-20 text-brand-primary-black"; // Default case  

    return (
        <span className={`inline-flex items-center rounded-md ${badgeClass} px-2 py-1 text-xs font-medium`}>
            {capitalizeWords(title)}
        </span>
    );
}