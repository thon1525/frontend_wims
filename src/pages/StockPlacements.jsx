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
import StockPlacementForm from "../components/StockPlacementForm";
import ExportExcel from "../components/ExportExcel";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ProductsPDF from "../components/ProductsPDF";
import { debounce } from "lodash"; // Add lodash for debouncing

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

const API_ENDPOINTS = {
  PRODUCTS: "/api/products/",
  WAREHOUSES: "/api/warehouses/",
  CATEGORIES: "/api/categories/",
  SUPPLIERS: "/api/suppliers/",
  STOCK_PLACEMENTS: "/api/stock-placements/",
  IMPORT_EXCEL: "/api/products/import-excel/",
};

const useApiFetch = (endpoint, setData, setError, setLoading) => {
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}${endpoint}`);
      // Handle paginated or non-paginated response
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setData(data);
      console.log("Fetched stock placements:", data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.message || "Failed to fetch data";
      setError(errorMessage);
      setData([]);
      console.error("Error fetching data:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, setData, setError, setLoading]);
  return fetchData;
};

const StockPlacements = () => {
  const [stockPlacements, setStockPlacements] = useState([]);
  const [filteredStockPlacements, setFilteredStockPlacements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dt = useRef(null);

  const fetchStockPlacements = useApiFetch(
    API_ENDPOINTS.STOCK_PLACEMENTS,
    setStockPlacements,
    setError,
    setLoading
  );

  useEffect(() => {
    fetchStockPlacements();
  }, [fetchStockPlacements]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  useEffect(() => {
    if (!Array.isArray(stockPlacements)) {
      setFilteredStockPlacements([]);
      return;
    }

    if (!searchTerm) {
      setFilteredStockPlacements(stockPlacements);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = stockPlacements.filter((stock) =>
      [
        stock.product?.name || stock.product_name,
        stock.warehouse?.name || stock.warehouse_name,
        stock.location?.section_name || stock.location_section,
        stock.batch_number,
        stock.storage_type,
      ].some((field) => field?.toLowerCase?.().includes(lowercasedSearch))
    );
    setFilteredStockPlacements(filtered);
  }, [searchTerm, stockPlacements]);

  const handleSaveStock = useCallback(
    async (formData) => {
      setOperationLoading(true);
      setError(null);
      try {
        const url = currentStock
          ? `${API_URL}${API_ENDPOINTS.STOCK_PLACEMENTS}${currentStock.stock_id}/`
          : `${API_URL}${API_ENDPOINTS.STOCK_PLACEMENTS}`;
        const method = currentStock ? "put" : "post";
        // Validate quantity and reserved_quantity
        if (formData.quantity < formData.reserved_quantity) {
          throw new Error(
            "Quantity cannot be less than reserved quantity"
          );
        }
        await axios({ method, url, data: formData });
        await fetchStockPlacements();
        closeModal();
      } catch (error) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.error ||
          error.message ||
          "Failed to save stock placement";
        setError(errorMessage);
      } finally {
        setOperationLoading(false);
      }
    },
    [currentStock, fetchStockPlacements]
  );

  const handleDelete = useCallback(
    async (stockId) => {
      if (!window.confirm("Are you sure you want to delete this stock placement?"))
        return;
      setOperationLoading(true);
      setError(null);
      try {
        await axios.delete(
          `${API_URL}${API_ENDPOINTS.STOCK_PLACEMENTS}${stockId}/`
        );
        setStockPlacements((prev) =>
          prev.filter((stock) => stock.stock_id !== stockId)
        );
      } catch (error) {
        const errorMessage =
          error.response?.data?.detail ||
          error.message ||
          "Failed to delete stock placement";
        setError(errorMessage);
      } finally {
        setOperationLoading(false);
      }
    },
    []
  );

  const openModal = (stock = null) => {
    setCurrentStock(stock);
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStock(null);
    setError(null);
  };

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        classNames="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md"
        onClick={() => openModal(rowData)}
        disabled={operationLoading}
      >
        <i className="pi pi-pencil mr-1" /> Edit
      </Button>
      <Button
        classNames="bg-red-100 text-red-700 px-3 py-1 rounded-md"
        onClick={() => handleDelete(rowData.stock_id)}
        disabled={operationLoading}
      >
        <i className="pi pi-trash mr-1" /> Delete
      </Button>
    </div>
  );

  const expiryDateBodyTemplate = (rowData) => (
    <span>
      {rowData.expiry_date
        ? moment(rowData.expiry_date).format("YYYY-MM-DD")
        : "N/A"}
    </span>
  );

  const columns = [
    { field: "stock_id", header: "ID", sortable: true, filter: true, style: { width: "8%" } },
    { field: "product.name", header: "Product", sortable: true, filter: true, body: (row) => row.product?.name || row.product_name, style: { width: "15%" } },
    { field: "warehouse.name", header: "Warehouse", sortable: true, filter: true, body: (row) => row.warehouse?.name || row.warehouse_name, style: { width: "15%" } },
    { field: "location.section_name", header: "Location", sortable: true, filter: true, body: (row) => row.location?.section_name || row.location_section, style: { width: "12%" } },
    { field: "quantity", header: "Quantity", sortable: true, filter: true, style: { width: "10%" } },
    { field: "reserved_quantity", header: "Reserved", sortable: true, filter: true, style: { width: "10%" } },
    { field: "batch_number", header: "Batch", sortable: true, filter: true, style: { width: "10%" } },
    { field: "storage_type", header: "Storage Type", sortable: true, filter: true, style: { width: "10%" } },
    { field: "expiry_date", header: "Expiry Date", sortable: true, filter: true, body: expiryDateBodyTemplate, style: { width: "10%" } },
    { body: actionBodyTemplate, style: { width: "10%" } },
  ];

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <PrimeButton
        label="CSV"
        icon="pi pi-file"
        className="p-button-outlined p-button-secondary"
        onClick={() => dt.current?.exportCSV()}
        disabled={loading || operationLoading}
      />
      <ExportExcel
        products={filteredStockPlacements}
        onError={setError}
        disabled={loading || operationLoading}
      />
      <PDFDownloadLink
        document={<ProductsPDF products={filteredStockPlacements} />}
        fileName={`StockPlacements_${moment().format("YYYYMMDD_HHmmss")}.pdf`}
        className="p-button p-button-outlined p-button-danger p-component"
      >
        <span className="pi pi-file-pdf mr-2" />
        PDF
      </PDFDownloadLink>
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <PagesTitle
          title="Stock Placements"
          classNames="text-3xl font-bold text-gray-800"
        />
        <Button
          classNames="bg-indigo-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
          onClick={() => openModal()}
          disabled={loading || operationLoading}
        >
          <i className="pi pi-plus" /> Add New Stock Placement
        </Button>
      </div>

      <Card classNames="p-6 bg-white shadow-md rounded-lg">
        <Toolbar className="mb-4" right={rightToolbarTemplate} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Stock Placements List
          </h2>
          <div className="w-1/4 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              onChange={(e) => debouncedSearch(e.target.value)}
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
        {error && (
          <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>
        )}
        <DataTable
          ref={dt}
          value={filteredStockPlacements || []}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-striped p-datatable-sm rounded-lg"
          stripedRows
          rowHover
          responsiveLayout="scroll"
          emptyMessage="No stock placements found."
          exportFilename={`StockPlacements_${moment().format("YYYYMMDD")}`}
        >
          {columns.map((col, index) => (
            <Column key={index} {...col} bodyClassName="text-gray-600" />
          ))}
        </DataTable>
      </Card>

      <Dialog
        visible={isModalOpen}
        onHide={closeModal}
        header={
          currentStock ? "Edit Stock Placement" : "Add New Stock Placement"
        }
        modal
        dismissableMask
        closeOnEscape
        style={{ width: "700px" }}
        className="p-fluid shadow-lg rounded-lg"
      >
        <StockPlacementForm
          stock={currentStock}
          onSave={handleSaveStock}
          onCancel={closeModal}
          error={error}
          loading={operationLoading}
        />
      </Dialog>
    </div>
  );
};

export default StockPlacements;