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
import WarehouseForm from "../components/WarehouseForm";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

const API_ENDPOINTS = {
  WAREHOUSES: "/api/warehouses/",
};

const useApiFetch = (endpoint, setData, setError) => {
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(endpoint);
      console.log("API Response:", response.data);
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("API Error:", error);
      setError(error.response?.data?.detail || error.message || "Failed to fetch data");
      setData([]);
    }
  }, [endpoint, setData, setError]);

  return fetchData;
};

const Warehouses = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dt = useRef(null);

  const fetchProducts = useApiFetch(API_ENDPOINTS.WAREHOUSES, setProducts, setError);

  useEffect(() => {
    setLoading(true);
    fetchProducts().finally(() => setLoading(false));
  }, [fetchProducts]);

  useEffect(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = products.filter((product) =>
      [product.name, product.address].some((field) =>
        field?.toLowerCase?.().includes(lowercasedSearch)
      )
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const handleSaveProduct = useCallback(
    async (formData) => {
      try {
        const url = currentProduct
          ? `${API_URL}${API_ENDPOINTS.WAREHOUSES}${currentProduct.warehouse_id}/`
          : `${API_URL}${API_ENDPOINTS.WAREHOUSES}`;
        const method = currentProduct ? "put" : "post";
        await axios({
          method,
          url,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        await fetchProducts();
        closeModal();
      } catch (error) {
        setError(error.response?.data?.detail || error.message || "Failed to save warehouse");
      }
    },
    [currentProduct, fetchProducts]
  );

  const handleDelete = useCallback(
    async (warehouseId) => {
      if (!window.confirm("Are you sure you want to delete this warehouse?")) return;
      try {
        await axios.delete(`${API_URL}${API_ENDPOINTS.WAREHOUSES}${warehouseId}/`);
        setProducts((prev) => prev.filter((product) => product.warehouse_id !== warehouseId));
      } catch (error) {
        setError(error.response?.data?.detail || error.message || "Failed to delete warehouse");
      }
    },
    []
  );

  const openModal = (product = null) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
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
        onClick={() => handleDelete(rowData.warehouse_id)}
      >
        <i className="pi pi-trash mr-1" /> Delete
      </Button>
    </div>
  );

  const columns = [
    { field: "warehouse_id", header: "ID", sortable: true, filter: true, style: { width: "10%" } },
    { field: "name", header: "Name", sortable: true, filter: true, style: { width: "30%" } },
    { field: "address", header: "Address", sortable: true, filter: true, style: { width: "45%" } },
    { body: actionBodyTemplate, style: { width: "15%" } },
  ];

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <PrimeButton
        label="CSV"
        icon="pi pi-file"
        className="p-button-outlined p-button-secondary"
        onClick={exportCSV}
      />
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <PagesTitle title="Warehouses" classNames="text-3xl font-bold text-gray-800" />
        <Button
          classNames="bg-indigo-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
          onClick={() => openModal()}
        >
          <i className="pi pi-plus" /> Add New Warehouse
        </Button>
      </div>

      <Card classNames="p-6 bg-white shadow-md rounded-lg">
        <Toolbar className="mb-4" right={rightToolbarTemplate} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Warehouses List</h2>
          <div className="w-1/4 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Keyword Search"
              className="w-full border-2 border-gray-300 rounded-md pl-10 p-2"
              aria-label="Search warehouses"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-4">
            <i className="pi pi-spin pi-spinner text-indigo-600 text-2xl" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : error ? (
          <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>
        ) : (
          <DataTable
            ref={dt}
            value={filteredProducts || []}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            className="p-datatable-striped p-datatable-sm rounded-lg"
            stripedRows
            rowHover
            responsiveLayout="scroll"
            emptyMessage="No warehouses found."
            exportFilename={`Warehouses_${moment().format("YYYYMMDD")}`}
          >
            {columns.map((col, index) => (
              <Column key={index} {...col} bodyClassName="text-gray-600" />
            ))}
          </DataTable>
        )}
      </Card>

      <Dialog
        visible={isModalOpen}
        onHide={closeModal}
        header={currentProduct ? "Edit Warehouse" : "Add New Warehouse"}
        modal
        dismissableMask
        closeOnEscape
        style={{ width: "700px" }}
        className="p-fluid shadow-lg rounded-lg"
      >
        <WarehouseForm
          product={currentProduct}
          onSave={handleSaveProduct}
          onCancel={closeModal}
          error={error}
        />
      </Dialog>
    </div>
  );
};

export default Warehouses;