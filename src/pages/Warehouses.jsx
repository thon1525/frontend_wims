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
import ProductsPDF from "../components/ProductsPDF";
import PrintProducts from "../components/PrintProducts";
import ExportExcel from "../components/ExportExcel";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { UNIT_CHOICES } from "../utils/constants";

// import * as XLSX from "xlsx";

// Constants
const API_ENDPOINTS = {
  PRODUCTS: "/api/products/",
  WAREHOUSES: `/api/warehouses/`,
  CATEGORIES: "/api/categories/",
  SUPPLIERS: "/api/suppliers/",
  IMPORT_EXCEL: "/api/products/import-excel/",
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

// Excel Import Logic (Moved to a separate utility function)
const handleImportExcel = async (event, setLoading, setError, fetchProducts, fileInputRef) => {
  const file = event.target.files[0];
  if (!file) return;

  setLoading(true);
  setError(null);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(API_ENDPOINTS.IMPORT_EXCEL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    await fetchProducts();  // Refresh product list

    if (response.data.errors) {
      const errorDetails = response.data.errors.map(err => 
        `Row ${err.row}: ${err.error || JSON.stringify(err.errors)}`
      ).join('; ');
      setError(`Imported ${response.data.created} products with errors: ${errorDetails}`);
    } else {
      setError(null);  // Clear any previous errors
      console.log(`Successfully imported ${response.data.created} products`);
    }
  } catch (err) {
    const errorMsg = err.response?.data?.error || err.message || "Unknown error occurred";
    setError(`Failed to import Excel file: ${errorMsg}`);
  } finally {
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
};
const Warehouses  = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [unitChoices] = useState(UNIT_CHOICES);
  const dt = useRef(null); // Ref for DataTable
  const fileInputRef = useRef(null); // Ref for file input
  console.log("this is ",products)
  const fetchProducts = useApiFetch(API_ENDPOINTS.WAREHOUSES, setProducts, setError);
  const fetchCategories = useApiFetch(API_ENDPOINTS.CATEGORIES, setCategories, setError);
  const fetchSuppliers = useApiFetch(API_ENDPOINTS.SUPPLIERS, setSuppliers, setError);
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProducts(), fetchCategories(), fetchSuppliers(),]).finally(() =>
      setLoading(false)
    );
  }, [fetchProducts, fetchCategories, fetchSuppliers]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = products.filter((product) =>
      [
        product.name,
        product.sku,
        product.category_name,
        product.supplier_name,
        product.barcode,
        product.weight,
      ].some((field) => field?.toLowerCase().includes(lowercasedSearch))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Wrap handleImportExcel in a callback with proper arguments
  const onImportExcel = useCallback(
    (event) => {
      handleImportExcel(event, setLoading, setError, fetchProducts, fileInputRef);
    },
    [fetchProducts] // Only fetchProducts is a dependency since others are stable
  );

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const handleSaveProduct = useCallback(
    async (formData) => {
      try {
        const url = currentProduct
          ? `${API_ENDPOINTS.WAREHOUSES}${currentProduct.warehouse_id}/`
          : API_ENDPOINTS.WAREHOUSES;
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
        setError(error.response?.data?.detail || error.message || "Failed to save product");
      }
    },
    [currentProduct, fetchProducts]
  );

  const handleDelete = useCallback(async (WarehouseId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_ENDPOINTS.WAREHOUSES}${WarehouseId}/`);
      setProducts((prev) => prev.filter((product) => product.warehouse_id !== WarehouseId));
    } catch (error) {
      setError(error.response?.data?.detail || error.message || "Failed to delete product");
    }
  }, []);

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
        label="Import Excel"
        icon="pi pi-upload"
        className="p-button-outlined p-button-success"
        onClick={() => fileInputRef.current.click()}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImportExcel} // Use the wrapped handler
        accept=".xlsx, .xls"
        style={{ display: "none" }}
      />
      <PrimeButton
        label="CSV"
        icon="pi pi-file"
        className="p-button-outlined p-button-secondary"
        onClick={exportCSV}
      />
      <ExportExcel products={filteredProducts} onError={setError} />
      <PDFDownloadLink
        document={<ProductsPDF products={filteredProducts} />}
        fileName={`Products_${moment().format("YYYYMMDD_HHmmss")}.pdf`}
        className="p-button p-button-outlined p-button-danger p-component"
      >
        <span className="pi pi-file-pdf mr-2" />
        PDF
      </PDFDownloadLink>
      <PrintProducts products={filteredProducts} onError={setError} />
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <PagesTitle title="Products" classNames="text-3xl font-bold text-gray-800" />
        <Button
          classNames="bg-indigo-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
          onClick={() => openModal()}
        >
          <i className="pi pi-plus" /> Add New Product
        </Button>
      </div>

      <Card classNames="p-6 bg-white shadow-md rounded-lg">
        <Toolbar className="mb-4" right={rightToolbarTemplate} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Products List</h2>
          <div className="w-1/4 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Keyword Search"
              className="w-full border-2 border-gray-300 rounded-md pl-10 p-2"
              aria-label="Search products"
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
          value={filteredProducts}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-striped p-datatable-sm rounded-lg"
          stripedRows
          rowHover
          responsiveLayout="scroll"
          emptyMessage="No products found."
          exportFilename={`Products_${moment().format("YYYYMMDD")}`}
        >
          {columns.map((col, index) => (
            <Column key={index} {...col} bodyClassName="text-gray-600" />
          ))}
        </DataTable>
      </Card>

      <Dialog
        visible={isModalOpen}
        onHide={closeModal}
        header={currentProduct ? "Edit Product" : "Add New Product"}
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

export default Warehouses ;