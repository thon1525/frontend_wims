/* eslint-disable react/prop-types */
import { FaCircle } from "react-icons/fa";
import { capitalizeWords } from "../utils/capitalize";
import { useDeleteProductMutation } from "../services/Product";
import ProductStockActionButton from "./ProductStockActionButtons";

export default function ProductStockTable({ header, data }) {

    const deleteProductMutation = useDeleteProductMutation();

    if (!Array.isArray(data)) {
        return <div>No data available</div>;
    }

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteProductMutation.mutateAsync({ id: productId });
            console.log('product', productId, 'deleted');
            
        } catch (error) {
            console.error("Error deleting product:", error.message);
            throw new Error("Failed to delete product");
            // todo - some toastify
        }
    };

    const headerMapping = {
        'image': 'image',
        'product name': 'name',
        'category': 'category',
        'price': 'price',
        'piece': 'quantity',
        'available color': 'color',
        'action': 'action'
    };

    return (
        // <div className="px-4">
        <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6">
                    <table className="min-w-full divide-y divide-gray-300">
                        {/* //fixme - rounded padding */}
                        <thead className="">
                            <tr>
                                {header?.map((thead, index) => (
                                    <th key={index} scope="col" className="py-3.5 text-left text-sm font-semibold text-gray-900">
                                        {capitalizeWords(thead)} {/* Capitalize header titles */}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data?.map((tableRow, rowIndex) => (
                                <tr key={rowIndex}>
                                    {header.map((thead, colIndex) => (
                                        <td key={colIndex} className="whitespace-nowrap px-3 py-4 text-sm text-brand-primary-black sm:pl-0 text-left">
                                            {thead === 'image'
                                                ? <img src={tableRow[thead]} alt={tableRow['image']} className="w-28 rounded-md" />
                                                : thead === 'product name'
                                                    ? capitalizeWords(tableRow[headerMapping[thead]])
                                                    : thead === 'category'
                                                        ? capitalizeWords(tableRow[headerMapping[thead]])
                                                        : thead === 'price'
                                                            ? '$' + tableRow[headerMapping[thead]]?.toLocaleString()
                                                            : thead === 'piece'
                                                                ? tableRow[headerMapping[thead]]?.toLocaleString()
                                                                : thead === 'available color'
                                                                    ? (
                                                                        <div className="flex space-x-2">
                                                                            {tableRow[headerMapping[thead]].map((color, index) => (
                                                                                <FaCircle key={index} style={{ color }} />
                                                                            ))}
                                                                        </div>
                                                                    )
                                                                    : thead === 'action'
                                                                    && <ProductStockActionButton productId={tableRow.id} onDelete={handleDeleteProduct} />
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        // </div>
    )
}
