/* eslint-disable react/prop-types */
import { LuTrash2 } from "react-icons/lu";
import { FaRegPenToSquare } from "react-icons/fa6";

export default function ProductStockActionButton({ productId, onDelete }) {
  
  return (
    <span className="isolate inline-flex rounded-md shadow-sm">
      <button
        type="button"
        className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
      >
        <span className="sr-only">Edit</span>
        <FaRegPenToSquare aria-hidden="true" className="h-5 w-5 text-[#000000] text-opacity-50" />
      </button>
      <button
        type="button"
        className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        onClick={() => onDelete(productId)}
      >
        <span className="sr-only">Delete</span>
        <LuTrash2 aria-hidden="true" className="h-5 w-5 text-[#EF3826]" />
      </button>
    </span>
  )
}
