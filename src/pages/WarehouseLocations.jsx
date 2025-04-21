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
// Define API_URL with a fallback
const API_URL = import.meta.env.VITE_API_URL ;
// Constants
const API_ENDPOINTS = {
  LOCATIONS: "/api/warehouse-locations/",
  WAREHOUSES: "/api/warehouses/",
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

const WarehouseLocations = () => {
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dt = useRef(null);

  const fetchLocations = useApiFetch(API_ENDPOINTS.LOCATIONS, setLocations, setError);
  const fetchWarehouses = useApiFetch(API_ENDPOINTS.WAREHOUSES, setWarehouses, setError);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchLocations(), fetchWarehouses()]).finally(() =>
      setLoading(false)
    );
  }, [fetchLocations, fetchWarehouses]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredLocations(locations);
      return;
    }
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = locations.filter((location) =>
      [
        location.section_name,
        location.storage_type,
        location.capacity_class,
        location.max_capacity.toString(),
        warehouses.find((w) => w.warehouse_id === location.warehouse)?.name,
      ].some((field) => field?.toLowerCase().includes(lowercasedSearch))
    );
    setFilteredLocations(filtered);
  }, [searchTerm, locations, warehouses]);

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const handleSaveLocation = useCallback(
    async (formData) => {
      try {
        const url = currentLocation
          ? `${API_URL}${API_ENDPOINTS.LOCATIONS}${currentLocation.id}/`
          :    `${API_URL}${API_ENDPOINTS.LOCATIONS}`;
        const method = currentLocation ? "put" : "post";
        const response = await axios({
          method,
          url,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        await fetchLocations();
        closeModal();
        console.log("Success:", response.data);
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Failed to save location"
        );
        console.error("Error:", error.response?.data);
      }
    },
    [currentLocation, fetchLocations]
  );

  const handleDelete = useCallback(
    async (locationId) => {
      if (!window.confirm("Are you sure you want to delete this location?"))
        return;
      try {
        await axios.delete(`${API_URL}${API_ENDPOINTS.LOCATIONS}${locationId}/`);
        setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Failed to delete location"
        );
      }
    },
    []
  );

  const openModal = (location = null) => {
    setCurrentLocation(location);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentLocation(null);
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

  const warehouseBodyTemplate = (rowData) => {
    const warehouse = warehouses.find((w) => w.warehouse_id === rowData.warehouse);
    return warehouse ? warehouse.name : "Unknown";
  };

  const columns = [
    { field: "id", header: "ID", sortable: true, filter: true, style: { width: "10%" } },
    { field: "section_name", header: "Section Name", sortable: true, filter: true, style: { width: "20%" } },
    { field: "storage_type", header: "Storage Type", sortable: true, filter: true, style: { width: "20%" } },
    { field: "capacity_class", header: "Capacity Class", sortable: true, filter: true, style: { width: "15%" } },
    { field: "max_capacity", header: "Max Capacity", sortable: true, filter: true, style: { width: "15%" } },
    { body: warehouseBodyTemplate, header: "Warehouse", sortable: true, filter: true, style: { width: "20%" } },
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
        <PagesTitle title="Warehouse Locations" classNames="text-3xl font-bold text-gray-800" />
        <Button
          classNames="bg-indigo-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
          onClick={() => openModal()}
        >
          <i className="pi pi-plus" /> Add New Location
        </Button>
      </div>

      <Card classNames="p-6 bg-white shadow-md rounded-lg">
        <Toolbar className="mb-4" right={rightToolbarTemplate} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Locations List</h2>
          <div className="w-1/4 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Keyword Search"
              className="w-full border-2 border-gray-300 rounded-md pl-10 p-2"
              aria-label="Search locations"
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
          value={filteredLocations}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-striped p-datatable-sm rounded-lg"
          stripedRows
          rowHover
          responsiveLayout="scroll"
          emptyMessage="No locations found."
          exportFilename={`Locations_${moment().format("YYYYMMDD")}`}
        >
          {columns.map((col, index) => (
            <Column key={index} {...col} bodyClassName="text-gray-600" />
          ))}
        </DataTable>
      </Card>

      <Dialog
        visible={isModalOpen}
        onHide={closeModal}
        header={currentLocation ? "Edit Location" : "Add New Location"}
        modal
        dismissableMask
        closeOnEscape
        style={{ width: "700px" }}
        className="p-fluid shadow-lg rounded-lg"
      >
        <LocationForm
          location={currentLocation}
          warehouses={warehouses}
          onSave={handleSaveLocation}
          onCancel={closeModal}
          error={error}
        />
      </Dialog>
    </div>
  );
};

// Location Form Component
const LocationForm = ({ location, warehouses, onSave, onCancel, error }) => {
  const initialFormData = {
    warehouse: 0, // Changed to match API field name
    section_name: "",
    storage_type: "",
    capacity_class: "",
    max_capacity: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const storageTypes = [
    { label: "Shelf", value: "Shelf" },
    { label: "Rack", value: "Rack" },
    { label: "Cold Storage", value: "Cold Storage" },
  ];

  const capacityClasses = [
    { label: "Small", value: "Small" },
    { label: "Medium", value: "Medium" },
    { label: "Large", value: "Large" },
  ];

  useEffect(() => {
    if (location) {
      setFormData({
        warehouse: location.warehouse || 0, // Use "warehouse" from API response
        section_name: location.section_name || "",
        storage_type: location.storage_type || "",
        capacity_class: location.capacity_class || "",
        max_capacity: location.max_capacity || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [location]);

  const handleChange = (field) => (e) => {
    const value = e.target?.value ?? e.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === "warehouse" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = () => {
    const requiredFields = [
      "warehouse",
      "section_name",
      "storage_type",
      "capacity_class",
      "max_capacity",
    ];
    if (requiredFields.some((field) => !formData[field])) {
      alert("Please fill in all required fields.");
      return;
    }

    const data = new FormData();
    data.append("warehouse", formData.warehouse);
    data.append("section_name", formData.section_name);
    data.append("storage_type", formData.storage_type);
    data.append("capacity_class", formData.capacity_class);
    data.append("max_capacity", formData.max_capacity);

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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, warehouse: e.value }))
            }
            placeholder="Select a warehouse"
            className="w-full border-2 border-gray-300 rounded-md"
          />
        </div>
        <div className="field">
          <label htmlFor="section_name" className="font-semibold text-gray-700">
            Section Name *
          </label>
          <InputText
            id="section_name"
            value={formData.section_name}
            onChange={handleChange("section_name")}
            placeholder="Enter section name (e.g., Shelf A1)"
            required
            className="w-full px-4 p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
          />
        </div>
        <div className="field">
          <label htmlFor="storage_type" className="font-semibold text-gray-700">
            Storage Type *
          </label>
          <Dropdown
            id="storage_type"
            value={formData.storage_type}
            options={storageTypes}
            onChange={handleChange("storage_type")}
            placeholder="Select storage type"
            className="w-full border-2 border-gray-300 rounded-md"
          />
        </div>
        <div className="field">
          <label htmlFor="capacity_class" className="font-semibold text-gray-700">
            Capacity Class *
          </label>
          <Dropdown
            id="capacity_class"
            value={formData.capacity_class}
            options={capacityClasses}
            onChange={handleChange("capacity_class")}
            placeholder="Select capacity class"
            className="w-full border-2 border-gray-300 rounded-md"
          />
        </div>
        <div className="field">
          <label htmlFor="max_capacity" className="font-semibold text-gray-700">
            Max Capacity *
          </label>
          <InputText
            id="max_capacity"
            value={formData.max_capacity}
            onChange={handleChange("max_capacity")}
            placeholder="Enter maximum capacity"
            type="number"
            min="1"
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
          {location ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default WarehouseLocations;