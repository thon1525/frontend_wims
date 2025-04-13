import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toolbar } from "primereact/toolbar";
import { Button as PrimeButton } from "primereact/button";
import moment from "moment";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Card from "../ui/Card";
import Button from "../ui/Button";
import PagesTitle from "../components/PagesTitle";

// Axios Config
axios.defaults.withCredentials = true;

// API Endpoints
const API_ENDPOINTS = {
  CATEGORIES: "/api/categories/",
};

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

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dt = useRef(null);

  const fetchCategories = useApiFetch(API_ENDPOINTS.CATEGORIES, setCategories, setError);

  useEffect(() => {
    setLoading(true);
    fetchCategories().finally(() => setLoading(false));
  }, [fetchCategories]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
      return;
    }
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = categories.filter((category) =>
      [category.name_category, category.description].some((field) =>
        field?.toLowerCase().includes(lowercasedSearch)
      )
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const handleSaveCategory = useCallback(
    async (categoryData) => {
      // Prevent saving if categoryData is invalid
      if (!categoryData || (!categoryData.name_category && !categoryData.description)) {
        setError("Please provide at least a category name or description.");
        return;
      }

      try {
        const isEdit = categoryData.id && !isNaN(categoryData.id); // Check if id exists and is valid
        const url = isEdit
          ? `${API_ENDPOINTS.CATEGORIES}${categoryData.id}/`
          : API_ENDPOINTS.CATEGORIES;
        const method = isEdit ? "put" : "post";

        const response = await axios({
          method,
          url,
          data: {
            name_category: categoryData.name_category || "",
            description: categoryData.description || "",
          },
          headers: { "Content-Type": "application/json" },
        });

        const savedCategory = response.data;
        setCategories((prev) =>
          isEdit
            ? prev.map((cat) => (cat.id === savedCategory.id ? savedCategory : cat))
            : [...prev, savedCategory]
        );
        closeModal();
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            Object.values(error.response?.data || {})[0]?.[0] ||
            error.message ||
            `Failed to ${categoryData.id ? "update" : "create"} category`
        );
      }
    },
    []
  );

  const handleDelete = useCallback(async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${API_ENDPOINTS.CATEGORIES}${categoryId}/`);
      setCategories((prev) => prev.filter((category) => category.id !== categoryId));
      setError(null);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          error.response?.statusText ||
          "Failed to delete category"
      );
    }
  }, []);

  const openModal = (category = null) => {
    setCurrentCategory(
      category
        ? { ...category } // Copy existing category for edit
        : { name_category: "", description: "" } // New category
    );
    setIsModalOpen(true);
    setError(null); // Clear any previous errors
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
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
        onClick={() => handleDelete(rowData.id)}
      >
        <i className="pi pi-trash mr-1" /> Delete
      </Button>
    </div>
  );

  const columns = [
    { field: "id", header: "ID", sortable: true, filter: true, style: { width: "10%" } },
    {
      field: "name_category",
      header: "Category Name",
      sortable: true,
      filter: true,
      style: { width: "30%" },
    },
    {
      field: "description",
      header: "Description",
      sortable: true,
      filter: true,
      style: { width: "40%" },
    },
    {
      field: "created_at",
      header: "Created At",
      sortable: true,
      body: (rowData) => moment(rowData.created_at).format("LL"),
      style: { width: "15%" },
    },
    { body: actionBodyTemplate, header: "Actions", style: { width: "15%" } },
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
        <PagesTitle title="Categories" classNames="text-3xl font-bold text-gray-800" />
        <Button
          classNames="bg-indigo-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
          onClick={() => openModal()}
        >
          <i className="pi pi-plus" /> Add New Category
        </Button>
      </div>

      <Card classNames="p-6 bg-white shadow-md rounded-lg">
        <Toolbar className="mb-4" right={rightToolbarTemplate} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Categories List</h2>
          <div className="w-1/4 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Keyword Search"
              className="w-full border-2 border-gray-300 rounded-md pl-10 p-2"
              aria-label="Search categories"
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
          value={filteredCategories}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-striped p-datatable-sm rounded-lg"
          stripedRows
          rowHover
          responsiveLayout="scroll"
          emptyMessage="No categories found."
          exportFilename={`Categories_${moment().format("YYYYMMDD")}`}
        >
          {columns.map((col, index) => (
            <Column key={index} {...col} bodyClassName="text-gray-600" />
          ))}
        </DataTable>
      </Card>

      <Dialog
        visible={isModalOpen}
        onHide={closeModal}
        header={currentCategory?.id ? "Edit Category" : "Add New Category"}
        modal
        dismissableMask
        closeOnEscape
        style={{ width: "450px" }}
        className="p-fluid shadow-lg rounded-lg"
      >
        <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
          <label className="font-medium text-gray-700">Category Name</label>
          <InputText
            value={currentCategory?.name_category || ""}
            onChange={(e) =>
              setCurrentCategory({ ...currentCategory, name_category: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter category name"
          />

          <label className="font-medium text-gray-700">Description</label>
          <InputTextarea
            value={currentCategory?.description || ""}
            onChange={(e) =>
              setCurrentCategory({ ...currentCategory, description: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500"
            rows={3}
            placeholder="Enter category description"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              classNames="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              classNames="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              onClick={() => handleSaveCategory(currentCategory)}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Category;