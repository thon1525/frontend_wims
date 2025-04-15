import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Button as PrimeButton } from "primereact/button";
import moment from "moment";
import Barcode from "react-barcode";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Card from "../ui/Card";
import Button from "../ui/Button";
import PagesTitle from "../components/PagesTitle";
import ProductForm from "../components/ProductForm";
import ProductsPDF from "../components/ProductsPDF";
import PrintProducts from "../components/PrintProducts";
import ExportExcel from "../components/ExportExcel";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { UNIT_CHOICES } from "../utils/constants";

// Define API_URL with a fallback
const API_URL = import.meta.env.VITE_API_URL ;

// Constants
const API_ENDPOINTS = {
  PRODUCTS: "/api/products/",
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
      const response = await axios.get(`${API_URL}${endpoint}`);
      setData(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || error.message || "Failed to fetch data");
    }
  }, [endpoint, setData, setError]);

  return fetchData;
};

// Excel Import Logic
const handleImportExcel = async (event, setLoading, setError, fetchProducts, fileInputRef) => {
  const file = event.target.files[0];
  if (!file) return;

  setLoading(true);
  setError(null);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}${API_ENDPOINTS.IMPORT_EXCEL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await fetchProducts();

    if (response.data.errors) {
      const errorDetails = response.data.errors
        .map((err) => `Row ${err.row}: ${err.error || JSON.stringify(err.errors)}`)
        .join("; ");
      setError(`Imported ${response.data.created} products with errors: ${errorDetails}`);
    } else {
      setError(null);
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

const Products = () => {
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
  const dt = useRef(null);
  const fileInputRef = useRef(null);

  const fetchProducts = useApiFetch(API_ENDPOINTS.PRODUCTS, setProducts, setError);
  const fetchCategories = useApiFetch(API_ENDPOINTS.CATEGORIES, setCategories, setError);
  const fetchSuppliers = useApiFetch(API_ENDPOINTS.SUPPLIERS, setSuppliers, setError);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProducts(), fetchCategories(), fetchSuppliers()]).finally(() =>
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

  const onImportExcel = useCallback(
    (event) => {
      handleImportExcel(event, setLoading, setError, fetchProducts, fileInputRef);
    },
    [fetchProducts]
  );

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const handleSaveProduct = useCallback(
    async (formData) => {
      try {
        const url = currentProduct
          ? `${API_URL}${API_ENDPOINTS.PRODUCTS}${currentProduct.product_id}/`
          : `${API_URL}${API_ENDPOINTS.PRODUCTS}`;
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

  const handleDelete = useCallback(
    async (productId) => {
      if (!window.confirm("Are you sure you want to delete this product?")) return;
      try {
        await axios.delete(`${API_URL}${API_ENDPOINTS.PRODUCTS}${productId}/`);
        setProducts((prev) => prev.filter((product) => product.product_id !== productId));
      } catch (error) {
        setError(error.response?.data?.detail || error.message || "Failed to delete product");
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
        onClick={() => handleDelete(rowData.product_id)}
      >
        <i className="pi pi-trash mr-1" /> Delete
      </Button>
    </div>
  );

  const isActiveBodyTemplate = (rowData) => (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold ${
        rowData.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {rowData.is_active ? "Active" : "Inactive"}
    </span>
  );

  const columns = [
    {
      field: "image",
      header: "Image",
      body: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.name}
            className="w-16 h-16 object-cover rounded-md"
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          />
        ) : (
          "No Image"
        ),
      sortable: true,
      filter: true,
      style: { width: "20%" },
    },
    { field: "name", header: "Name", sortable: true, filter: true, style: { width: "20%" } },
    { field: "sku", header: "SKU", sortable: true, filter: true, style: { width: "15%" } },
    {
      field: "weight",
      header: "Weight",
      body: (rowData) => `${rowData.weight} kg`,
      sortable: true,
      filter: true,
      style: { width: "20%" },
    },
    {
      field: "barcode",
      header: "Barcode",
      body: (row) => <Barcode value={row.barcode} width={1} height={30} displayValue fontSize={12} />,
      sortable: true,
      filter: true,
      style: { width: "15%" },
    },
    {
      field: "price",
      header: "Price",
      body: (row) => `$${parseFloat(row.price).toFixed(2)}`,
      sortable: true,
      style: { width: "10%" },
    },
    { field: "quantity", header: "Quantity", sortable: true, style: { width: "10%" } },
    { field: "category_name", header: "Category", sortable: true, style: { width: "15%" } },
    { field: "supplier_name", header: "Supplier", sortable: true, style: { width: "15%" } },
    {
      field: "unit_type",
      header: "Unit Type",
      sortable: true,
      filter: true,
      style: { width: "20%" },
    },
    {
      field: "is_active",
      header: "Status",
      body: isActiveBodyTemplate,
      sortable: true,
      style: { width: "10%" },
    },
    {
      field: "created_at",
      header: "Created At",
      body: (row) => moment(row.created_at).format("LL"),
      sortable: true,
      style: { width: "15%" },
    },
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
        onChange={onImportExcel}
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
        <ProductForm
          product={currentProduct}
          categories={categories}
          suppliers={suppliers}
          unitChoices={unitChoices}
          onSave={handleSaveProduct}
          onCancel={closeModal}
          error={error}
        />
      </Dialog>
    </div>
  );
};

export default Products;