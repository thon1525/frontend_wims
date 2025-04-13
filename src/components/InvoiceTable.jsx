import { capitalizeWords } from "../utils/capitalize";

/* eslint-disable react/prop-types */

export default function InvoiceTable({ header, data }) {
    if (!Array.isArray(data)) {
        return <div>No data available</div>; // Handle the no data case gracefully  
    }

    const headerMapping = {
        'description': 'description',
        'quantity': 'quantity',
        'base cost': 'base',
        'total cost': 'total',
    };

    const totalItemsCost = data.reduce((acc, tableRow) => {
        return acc + (tableRow.cost?.total || 0); // Ensure it handles cases where cost may not exist  
    }, 0);

    return (
        <div className="px-4 sm:px-6">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6">
                        <table className="min-w-full divide-y divide-gray-300">
                            {/* //fixme - rounded padding */}
                            <thead className="bg-[#F1F4F9]">
                                <tr className="bg-[#F1F4F9]">
                                    {header.map((thead, index) => (
                                        <th key={index} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                            {capitalizeWords(thead)} {/* Capitalize header titles */}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.map((tableRow, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {header.map((thead, colIndex) => (
                                            <td key={colIndex} className="whitespace-nowrap px-3 py-4 text-sm text-brand-primary-black sm:pl-0 text-center">
                                                {thead === 'serial no'
                                                    ? rowIndex + 1
                                                    : thead === 'description'
                                                        ? capitalizeWords(tableRow[headerMapping[thead]])
                                                        : thead === 'quantity'
                                                            ? tableRow[headerMapping[thead]]
                                                            : thead === 'base cost'
                                                                ? tableRow.cost?.base.toLocaleString()
                                                                : thead === 'total cost'
                                                                && tableRow.cost?.total.toLocaleString()
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr>
                                    <td className="text-brand-primary-black font-bold px-3 py-4 text-sm sm:pl-0 text-right pr-16" colSpan="5">
                                        Total = ${totalItemsCost.toLocaleString()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
