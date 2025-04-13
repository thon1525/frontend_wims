/* eslint-disable react/prop-types */
import { Star } from "lucide-react";

const EmailItem = ({
    email,
}) => (
    <div
        // onClick={() => onClick(email)}
        className="flex items-center p-2 rounded relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-200"
    >
        <input
            type="checkbox"
            //   onChange={() => toggleEmailSelection(email.id)}
            className="mr-5 bg-inherit"
        />
        {email.starred ? (
            <Star
                className="mr-5 cursor-pointer text-yellow-400 fill-yellow-400"
                // onClick={() => toggleStar(email.id)}
                size={20}
            />
        ) : (
            <Star
                className="mr-5 cursor-pointer text-gray-400"
                // onClick={() => toggleStar(email.id)}
                size={20}
            />
        )}
        <div className="flex-1 grid grid-cols-5">
            <span className="col-span-4 flex-col items-center md:grid md:grid-cols-5">
                <span className="font-semibold text-brand-primary-black md:col-span-1 mr-5">{email.sender}</span>
                <span className="md:col-span-4 flex items-center justify-star">
                    {email.label && (
                        <span
                            className={`text-xs px-2 py-1 rounded mr-5
                                ${email.label === "Primary"
                                    ? "bg-[#00B69B] bg-opacity-20 text-[#00B69B]"
                                    : email.label === "Social"
                                        ? "bg-[#5A8CFF] bg-opacity-20 text-[#5A8CFF]"
                                        : email.label === "Work"
                                            ? "bg-[#FD9A56] bg-opacity-20 text-[#FD9A56]"
                                            : email.label === "Friends"
                                                ? "bg-[#D456FD] bg-opacity-20 text-[#D456FD]"
                                                : "bg-gray-500 bg-opacity-20 text-gray-500"
                                }`}
                        >
                            {email.label}
                        </span>
                    )}
                    <span className="text-brand-primary-black opacity-80"> {email.subject.length > 50
                        ? email.subject.slice(0, 50) + '...'
                        : email.subject}</span>
                </span>
            </span>
            <span className="text-brand-primary-black opacity-90 col-span-1 flex justify-end">{email.time}</span>
        </div>
    </div>
);

export default EmailItem;