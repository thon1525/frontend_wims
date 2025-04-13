// src/components/WarehouseStockAudit.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Button as PrimeButton } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import moment from "moment";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Card from "../ui/Card"; // Adjust path as needed
import Button from "../ui/Button"; // Adjust path as needed
import PagesTitle from "../components/PagesTitle"; // Adjust path as needed

// Constants
const API_ENDPOINTS = {
  STOCK_AUDITS: "/api/stock-audits/",
  WAREHOUSES: "/api/warehouses/",
  PRODUCTS: "/api/products/",
  LOCATIONS: "/api/warehouse-locations/",
};

// Axios Config
axios.defaults.withCredentials = true;

// Custom Hook for API Fetching
const useApiFetch = (endpoint, setData, setError) => {
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(endpoint);
      setData(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || error.message || "Failed to fetch data");
    }
  }, [endpoint, setData, setError]);

  return fetchData;
};

const WarehouseStockAudit = () => {
  const [audits, setAudits] = useState([]);
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAudit, setCurrentAudit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dt = useRef(null);

  const fetchAudits = useApiFetch(API_ENDPOINTS.STOCK_AUDITS, setAudits, setError);
  const fetchWarehouses = useApiFetch(API_ENDPOINTS.WAREHOUSES, setWarehouses, setError);
  const fetchProducts = useApiFetch(API_ENDPOINTS.PRODUCTS, setProducts, setError);
  const fetchLocations = useApiFetch(API_ENDPOINTS.LOCATIONS, setLocations, setError);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAudits(), fetchWarehouses(), fetchProducts(), fetchLocations()]).finally(() =>
      setLoading(false)
    );
  }, [fetchAudits, fetchWarehouses, fetchProducts, fetchLocations]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAudits(audits);
      return;
    }
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = audits.filter((audit) =>
      [
        audit.warehouse_name,
        audit.product_name,
        audit.location_name,
        audit.recorded_quantity.toString(),
        audit.audit_date,
      ].some((field) => field?.toLowerCase().includes(lowercasedSearch))
    );
    setFilteredAudits(filtered);
  }, [searchTerm, audits]);

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const handleSaveAudit = useCallback(
    async (formData) => {
      try {
        const url = currentAudit
          ? `${API_ENDPOINTS.STOCK_AUDITS}${currentAudit.audit_id}/`
          : API_ENDPOINTS.STOCK_AUDITS;
        const method = currentAudit ? "put" : "post";
        const response = await axios({
          method,
          url,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        await fetchAudits();
        closeModal();
        console.log("Success:", response.data);
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Failed to save audit"
        );
        console.error("Error:", error.response?.data);
      }
    },
    [currentAudit, fetchAudits]
  );

  const handleDelete = useCallback(
    async (auditId) => {
      if (!window.confirm("Are you sure you want to delete this audit?")) return;
      try {
        await axios.delete(`${API_ENDPOINTS.STOCK_AUDITS}${auditId}/`);
        setAudits((prev) => prev.filter((audit) => audit.audit_id !== auditId));
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Failed to delete audit"
        );
      }
    },
    []
  );

  const openModal = (audit = null) => {
    setCurrentAudit(audit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAudit(null);
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
        onClick={() => handleDelete(rowData.audit_id)}
      >
        <i className="pi pi-trash mr-1" /> Delete
      </Button>
    </div>
  );

  const columns = [
    { field: "audit_id", header: "Audit ID", sortable: true, filter: true, style: { width: "10%" } },
    { field: "warehouse_name", header: "Warehouse", sortable: true, filter: true, style: { width: "20%" } },
    { field: "product_name", header: "Product", sortable: true, filter: true, style: { width: "20%" } },
    { field: "location_name", header: "Location", sortable: true, filter: true, style: { width: "20%" } },
    { field: "recorded_quantity", header: "Quantity", sortable: true, filter: true, style: { width: "15%" } },
    { field: "audit_date", header: "Audit Date", sortable: true, filter: true, style: { width: "15%" } },
    { body: actionBodyTemplate, style: { width: "15%" } },
  ];

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <PrimeButton
        label="Export CSV"
        icon="pi pi-file"
        className="p-button-outlined p-button-secondary"
        onClick={exportCSV}
      />
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <PagesTitle title="Stock Audits" classNames="text-3xl font-bold text-gray-800" />
        <Button
          classNames="bg-indigo-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
          onClick={() => openModal()}
        >
          <i className="pi pi-plus" /> Add New Audit
        </Button>
      </div>

      <Card classNames="p-6 bg-white shadow-md rounded-lg">
        <Toolbar className="mb-4" right={rightToolbarTemplate} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Audit List</h2>
          <div className="w-1/4 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Keyword Search"
              className="w-full border-2 border-gray-300 rounded-md pl-10 p-2"
              aria-label="Search audits"
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
          value={filteredAudits}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-striped p-datatable-sm rounded-lg"
          stripedRows
          rowHover
          responsiveLayout="scroll"
          emptyMessage="No audits found."
          exportFilename={`StockAudits_${moment().format("YYYYMMDD")}`}
        >
          {columns.map((col, index) => (
            <Column key={index} {...col} bodyClassName="text-gray-600" />
          ))}
        </DataTable>
      </Card>

      <Dialog
        visible={isModalOpen}
        onHide={closeModal}
        header={currentAudit ? "Edit Audit" : "Add New Audit"}
        modal
        dismissableMask
        closeOnEscape
        style={{ width: "700px" }}
        className="p-fluid shadow-lg rounded-lg"
      >
        <AuditForm
          audit={currentAudit}
          warehouses={warehouses}
          products={products}
          locations={locations}
          onSave={handleSaveAudit}
          onCancel={closeModal}
          error={error}
        />
      </Dialog>
    </div>
  );
};

// Audit Form Component
const AuditForm = ({ audit, warehouses, products, locations, onSave, onCancel, error }) => {
  const initialFormData = {
    warehouse: 0,
    product: 0,
    location: 0,
    recorded_quantity: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (audit) {
      setFormData({
        warehouse: audit.warehouse || 0,
        product: audit.product || 0,
        location: audit.location || 0,
        recorded_quantity: audit.recorded_quantity || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [audit]);

  const handleChange = (field) => (e) => {
    const value = e.target?.value ?? e.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === "warehouse" || field === "product" || field === "location" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = () => {
    const requiredFields = ["warehouse", "product", "location", "recorded_quantity"];
    if (requiredFields.some((field) => !formData[field])) {
      alert("Please fill in all required fields.");
      return;
    }

    const data = new FormData();
    data.append("warehouse", formData.warehouse);
    data.append("product", formData.product);
    data.append("location", formData.location);
    data.append("recorded_quantity", formData.recorded_quantity);

    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    onSave(data);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex flex-col gap-6">
        <div className="field">
          <label htmlFor="warehouse" className="font-semibold text-gray-700">
            Warehouse *
          </label>
          <Dropdown
            id="warehouse"
            value={formData.warehouse}
            options={warehouses.map((w) => ({ label: w.name, value: w.warehouse_id }))}
            onChange={(e) => setFormData((prev) => ({ ...prev, warehouse: e.value }))}
            placeholder="Select a warehouse"
            className="w-full border-2 border-gray-300 rounded-md"
          />
        </div>
        <div className="field">
          <label htmlFor="product" className="font-semibold text-gray-700">
            Product *
          </label>
          <Dropdown
            id="product"
            value={formData.product}
            options={products.map((p) => ({ label: p.name, value: p.product_id }))}
            onChange={(e) => setFormData((prev) => ({ ...prev, product: e.value }))}
            placeholder="Select a product"
            className="w-full border-2 border-gray-300 rounded-md"
          />
        </div>
        <div className="field">
          <label htmlFor="location" className="font-semibold text-gray-700">
            Location *
          </label>
          <Dropdown
            id="location"
            value={formData.location}
            options={locations.map((l) => ({ label: l.section_name, value: l.id }))}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.value }))}
            placeholder="Select a location"
            className="w-full border-2 border-gray-300 rounded-md"
          />
        </div>
        <div className="field">
          <label htmlFor="recorded_quantity" className="font-semibold text-gray-700">
            Recorded Quantity *
          </label>
          <InputText
            id="recorded_quantity"
            value={formData.recorded_quantity}
            onChange={handleChange("recorded_quantity")}
            placeholder="Enter recorded quantity"
            type="number"
            min="0"
            required
            className="w-full px-4 p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button
          classNames="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          classNames="bg-indigo-600 text-white px-4 py-2 rounded-md"
          onClick={handleSubmit}
        >
          {audit ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default WarehouseStockAudit;