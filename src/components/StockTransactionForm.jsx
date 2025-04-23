// StockTransactionForm.jsx
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import axios from "axios";
axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL ;
const API_ENDPOINTS = {
    STOCK_PLACEMENTS: "/api/stock-placements/",
    STOCK_TRANSACTIONS: "/api/stock-transactions/",
};

const StockTransactionForm = ({ transaction, onSave, onCancel, error }) => {
    const [formData, setFormData] = useState({
        stock_id: "",
        transaction_type: "",
        quantity: "",
    });
    const [stockOptions, setStockOptions] = useState([]);

    useEffect(() => {
        if (transaction) {
            setFormData({
                stock_id: transaction.stock_id,
                transaction_type: transaction.transaction_type,
                quantity: transaction.quantity,
            });
        }
    }, [transaction]);

    useEffect(() => {
        const fetchStockPlacements = async () => {
            try {
                const response = await axios.get(`${API_URL}${API_ENDPOINTS.STOCK_PLACEMENTS}`);
                setStockOptions(
                    response.data.map((stock) => ({
                        label: `${stock.product_name} - ${stock.warehouse_name}`,
                        value: stock.stock_id,
                    }))
                );
            } catch (err) {
                console.error("Failed to fetch stock placements", err);
            }
        };
        fetchStockPlacements();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const transactionTypes = [
        { label: "Inbound", value: "INBOUND" },
        { label: "Outbound", value: "OUTBOUND" },
    ];

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label className="block text-gray-700 mb-1">Stock Placement</label>
                <Dropdown
                    name="stock_id"
                    value={formData.stock_id}
                    options={stockOptions}
                    onChange={handleChange}
                    placeholder="Select Stock Placement"
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-gray-700 mb-1">Transaction Type</label>
                <Dropdown
                    name="transaction_type"
                    value={formData.transaction_type}
                    options={transactionTypes}
                    onChange={handleChange}
                    placeholder="Select Type"
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-gray-700 mb-1">Quantity</label>
                <InputText
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    className="w-full"
                />
            </div>
            <div className="flex gap-2 justify-end">
                <Button label="Cancel" className="p-button-secondary" onClick={onCancel} />
                <Button label="Save" type="submit" className="p-button-primary" />
            </div>
        </form>
    );
};

export default StockTransactionForm;