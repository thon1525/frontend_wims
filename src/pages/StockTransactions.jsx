import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Button as PrimeButton } from "primereact/button";
import moment from "moment";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Card from "../ui/Card";
import Button from "../ui/Button";
import PagesTitle from "../components/PagesTitle";
import ExportExcel from "../components/ExportExcel";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ProductsPDF from "../components/ProductsPDF";
import StockTransactionForm from "../components/StockTransactionForm";
axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL ;
const API_ENDPOINTS = {
    STOCK_PLACEMENTS: "/api/stock-placements/",
    STOCK_TRANSACTIONS: "/api/stock-transactions/",
};

const useApiFetch = (endpoint, setData, setError) => {
    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}${endpoint}`);
            // Ensure response.data is an array; fallback to empty array if not
            const data = Array.isArray(response.data) ? response.data : [];
            setData(data);
        } catch (error) {
            setError(error.response?.data?.detail || error.message || "Failed to fetch data");
            setData([]); // Set empty array on error
        }
    }, [endpoint, setData, setError]);
    return fetchData;
};

const StockTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const dt = useRef(null);

    const fetchTransactions = useApiFetch(API_ENDPOINTS.STOCK_TRANSACTIONS, setTransactions, setError);

    useEffect(() => {
        setLoading(true);
        fetchTransactions().finally(() => setLoading(false));
    }, [fetchTransactions]);

    useEffect(() => {
        if (!Array.isArray(transactions)) {
            setFilteredTransactions([]);
            return;
        }
        if (!searchTerm) {
            setFilteredTransactions(transactions);
            return;
        }
        const lowercasedSearch = searchTerm.toLowerCase();
        const filtered = transactions.filter((transaction) =>
            [
                transaction.product_name || "",
                transaction.warehouse_name || "",
                transaction.transaction_type || "",
            ].some((field) => field.toLowerCase().includes(lowercasedSearch))
        );
        setFilteredTransactions(filtered);
    }, [searchTerm, transactions]);

    const handleSaveTransaction = useCallback(
        async (formData) => {
            try {
                const url = currentTransaction
                    ? `${API_URL}${API_ENDPOINTS.STOCK_TRANSACTIONS}${currentTransaction.transaction_id}/`
                    : `${API_URL}${API_ENDPOINTS.STOCK_TRANSACTIONS}`;
                const method = currentTransaction ? "put" : "post";
                await axios({
                    method,
                    url,
                    data: formData,
                });
                await fetchTransactions();
                closeModal();
            } catch (error) {
                setError(error.response?.data?.detail || error.message || "Failed to save transaction");
            }
        },
        [currentTransaction, fetchTransactions]
    );

    const handleDelete = useCallback(async (transactionId) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            await axios.delete(`${API_URL}${API_ENDPOINTS.STOCK_TRANSACTIONS}${transactionId}/`);
            setTransactions((prev) => prev.filter((t) => t.transaction_id !== transactionId));
        } catch (error) {
            setError(error.response?.data?.detail || error.message || "Failed to delete transaction");
        }
    }, []);

    const openModal = (transaction = null) => {
        setCurrentTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTransaction(null);
        setError(null);
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button
                classNames="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md"
                onClick={() => openModal(rowData)}
            >
                <i className="pi pi-pencil mr-1" /> Edit
            </Button>
            <Button
                classNames="bg-red-100 text-red-700 px-3 py-1 rounded-md"
                onClick={() => handleDelete(rowData.transaction_id)}
            >
                <i className="pi pi-trash mr-1" /> Delete
            </Button>
        </div>
    );

    const columns = [
        { field: "transaction_id", header: "ID", sortable: true, filter: true, style: { width: "10%" } },
        { field: "product_name", header: "Product", sortable: true, filter: true, style: { width: "20%" } },
        { field: "warehouse_name", header: "Warehouse", sortable: true, filter: true, style: { width: "20%" } },
        { field: "transaction_type", header: "Type", sortable: true, filter: true, style: { width: "15%" } },
        { field: "quantity", header: "Quantity", sortable: true, filter: true, style: { width: "10%" } },
        {
            field: "transaction_date",
            header: "Date",
            sortable: true,
            filter: true,
            style: { width: "15%" },
            body: (rowData) => moment(rowData.transaction_date).format("YYYY-MM-DD HH:mm"),
        },
        { body: actionBodyTemplate, style: { width: "10%" } },
    ];

    const rightToolbarTemplate = () => (
        <div className="flex gap-2">
            <PrimeButton
                label="CSV"
                icon="pi pi-file"
                className="p-button-outlined p-button-secondary"
                onClick={() => dt.current.exportCSV()}
            />
            <ExportExcel products={filteredTransactions} onError={setError} />
            <PDFDownloadLink
                document={<ProductsPDF products={filteredTransactions} />}
                fileName={`StockTransactions_${moment().format("YYYYMMDD_HHmmss")}.pdf`}
                className="p-button p-button-outlined p-button-danger p-component"
            >
                <span className="pi pi-file-pdf mr-2" />
                PDF
            </PDFDownloadLink>
        </div>
    );

    // Ensure transactionsToDisplay is always an array
    const transactionsToDisplay = Array.isArray(filteredTransactions) ? filteredTransactions : [];

    return (
        <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between">
                <PagesTitle title="Stock Transactions" classNames="text-3xl font-bold text-gray-800" />
                <Button
                    classNames="bg-indigo-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
                    onClick={() => openModal()}
                >
                    <i className="pi pi-plus" /> Add New Transaction
                </Button>
            </div>

            <Card classNames="p-6 bg-white shadow-md rounded-lg">
                <Toolbar className="mb-4" right={rightToolbarTemplate} />

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Stock Transactions List</h2>
                    <div className="w-1/4 relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <i className="pi pi-search"></i>
                        </span>
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Keyword Search"
                            className="w-full border-2 border-gray-300 rounded-md pl-10 p-2"
                        />
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-4">
                        <i className="pi pi-spin pi-spinner text-indigo-600 text-2xl" />
                        <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                )}
                {error && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
                <DataTable
                    ref={dt}
                    value={transactionsToDisplay}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: "50rem" }}
                    className="p-datatable-striped p-datatable-sm rounded-lg"
                    stripedRows
                    rowHover
                    responsiveLayout="scroll"
                    emptyMessage="No transactions found."
                    exportFilename={`StockTransactions_${moment().format("YYYYMMDD")}`}
                >
                    {columns.map((col, index) => (
                        <Column key={index} {...col} bodyClassName="text-gray-600" />
                    ))}
                </DataTable>
            </Card>

            <Dialog
                visible={isModalOpen}
                onHide={closeModal}
                header={currentTransaction ? "Edit Transaction" : "Add New Transaction"}
                modal
                dismissableMask
                closeOnEscape
                style={{ width: "500px" }}
                className="p-fluid shadow-lg rounded-lg"
            >
                <StockTransactionForm
                    transaction={currentTransaction}
                    onSave={handleSaveTransaction}
                    onCancel={closeModal}
                    error={error}
                />
            </Dialog>
        </div>
    );
};

export default StockTransactions;