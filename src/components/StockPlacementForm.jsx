import  { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Button as PrimeButton } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const API_ENDPOINTS = {
  WAREHOUSES: "/api/warehouses/",
  PRODUCTS: "/api/products/",
  LOCATIONS: "/api/warehouse-locations/", // Assuming you have an endpoint for WarehouseLocation
  CATEGORIES: "/api/categories/",
  STOCK_PLACEMENTS: "/api/stock-placements/",
};

const STORAGE_TYPE_OPTIONS = [
  { label: "Shelf", value: "shelf" },
  { label: "Rack", value: "rack" },
  { label: "Cold Storage", value: "cold_storage" },
  { label: "Pallet", value: "pallet" },
];

const StockPlacementForm = ({ stock, onSave, onCancel, error }) => {
  const [formData, setFormData] = useState({
    warehouse: stock?.warehouse || null,
    product: stock?.product || null,
    
    location: stock?.location || null,
    category: stock?.category || null,
    quantity: stock?.quantity || 0,
    weight: stock?.weight || 0,
    storage_type: stock?.storage_type || "shelf",
    batch_number: stock?.batch_number || "",
    expiry_date: stock?.expiry_date ? new Date(stock.expiry_date) : null,
    min_stock_level: stock?.min_stock_level || 0,
    max_stock_level: stock?.max_stock_level || 1000,
  });

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch related data
  const fetchData = useCallback(async (endpoint, setData) => {
    try {
      const response = await axios.get(endpoint);
      setData(response.data);
    } catch (err) {
      setFormError(err.message || "Failed to fetch data");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchData(API_ENDPOINTS.WAREHOUSES, setWarehouses),
      fetchData(API_ENDPOINTS.PRODUCTS, setProducts),
      fetchData(API_ENDPOINTS.LOCATIONS, setLocations),
      fetchData(API_ENDPOINTS.CATEGORIES, setCategories),
    ]).finally(() => setLoading(false));
  }, [fetchData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Prepare data for API
    const dataToSend = {
      ...formData,
      expiry_date: formData.expiry_date
        ? formData.expiry_date.toISOString().split("T")[0]
        : null,
    };

    try {
      setLoading(true);
      await onSave(dataToSend);
    } catch (err) {
      setFormError(err.message || "Failed to save stock placement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid space-y-4">
      {loading && (
        <div className="flex justify-center items-center">
          <i className="pi pi-spin pi-spinner text-indigo-600 text-2xl" />
          <span className="ml-2">Loading...</span>
        </div>
      )}
      {(error || formError) && (
        <p className="text-red-500 bg-red-50 p-3 rounded-md">
          {error || formError}
        </p>
      )}

      {/* Warehouse */}
      <div className="field">
        <label htmlFor="warehouse" className="block text-gray-700 font-medium mb-1">
          Warehouse
        </label>
        <Dropdown
          id="warehouse"
          name="warehouse"
          value={formData.warehouse}
          options={warehouses.map((w) => ({
            label: w.name,
            value: w.warehouse_id,
          }))}
          onChange={handleChange}
          placeholder="Select a Warehouse"
          required
          className="w-full"
        />
      </div>

      {/* Product */}
      <div className="field">
        <label htmlFor="product" className="block text-gray-700 font-medium mb-1">
          Product
        </label>
        <Dropdown
          id="product"
          name="product"
          value={formData.product}
          options={products.map((p) => ({
            label: p.name,
            value: p.product_id,
          }))}
          onChange={handleChange}
          placeholder="Select a Product"
          required
          className="w-full"
        />
      </div>

      {/* Location */}
      <div className="field">
        <label htmlFor="location" className="block text-gray-700 font-medium mb-1">
          Location
        </label>
        <Dropdown
          id="location"
          name="location"
          value={formData.location}
          options={locations.map((l) => ({
            label: `${l.warehouse.name} - ${l.section_name}`,
            value: l.id, // Assuming WarehouseLocation has an 'id' field
          }))}
          onChange={handleChange}
          placeholder="Select a Location"
          required
          className="w-full"
        />
      </div>

      {/* Category */}
      <div className="field">
        <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
          Category
        </label>
        <Dropdown
          id="category"
          name="category"
          value={formData.category}
          options={categories.map((c) => ({
            label: c.name_category,
            value: c.id, // Assuming Category has an 'id' field
          }))}
          onChange={handleChange}
          placeholder="Select a Category"
          required
          className="w-full"
        />
      </div>

      {/* Quantity */}
      <div className="field">
        <label htmlFor="quantity" className="block text-gray-700 font-medium mb-1">
          Quantity
        </label>
        <InputNumber
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onValueChange={handleChange}
          min={0}
          required
          className="w-full"
        />
      </div>

      {/* Weight */}
      <div className="field">
        <label htmlFor="weight" className="block text-gray-700 font-medium mb-1">
          Weight
        </label>
        <InputNumber
          id="weight"
          name="weight"
          value={formData.weight}
          onValueChange={handleChange}
          min={0}
          mode="decimal"
          minFractionDigits={2}
          maxFractionDigits={2}
          className="w-full"
        />
      </div>

      {/* Storage Type */}
      <div className="field">
        <label htmlFor="storage_type" className="block text-gray-700 font-medium mb-1">
          Storage Type
        </label>
        <Dropdown
          id="storage_type"
          name="storage_type"
          value={formData.storage_type}
          options={STORAGE_TYPE_OPTIONS}
          onChange={handleChange}
          placeholder="Select Storage Type"
          required
          className="w-full"
        />
      </div>

      {/* Batch Number */}
      <div className="field">
        <label htmlFor="batch_number" className="block text-gray-700 font-medium mb-1">
          Batch Number
        </label>
        <InputText
          id="batch_number"
          name="batch_number"
          value={formData.batch_number}
          onChange={handleChange}
          required
          className="w-full p-2 border-2 border-gray-300 rounded-md"
        />
      </div>

      {/* Expiry Date */}
      <div className="field">
        <label htmlFor="expiry_date" className="block text-gray-700 font-medium mb-1">
          Expiry Date
        </label>
        <Calendar
          id="expiry_date"
          name="expiry_date"
          value={formData.expiry_date}
          onChange={(e) => setFormData((prev) => ({ ...prev, expiry_date: e.value }))}
          dateFormat="yy-mm-dd"
          showIcon
          className="w-full"
        />
      </div>

      {/* Min Stock Level */}
      <div className="field">
        <label htmlFor="min_stock_level" className="block text-gray-700 font-medium mb-1">
          Minimum Stock Level
        </label>
        <InputNumber
          id="min_stock_level"
          name="min_stock_level"
          value={formData.min_stock_level}
          onValueChange={handleChange}
          min={0}
          className="w-full"
        />
      </div>

      {/* Max Stock Level */}
      <div className="field">
        <label htmlFor="max_stock_level" className="block text-gray-700 font-medium mb-1">
          Maximum Stock Level
        </label>
        <InputNumber
          id="max_stock_level"
          name="max_stock_level"
          value={formData.max_stock_level}
          onValueChange={handleChange}
          min={0}
          className="w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        <PrimeButton
          label="Cancel"
          icon="pi pi-times"
          className="p-button-outlined p-button-secondary"
          onClick={onCancel}
          type="button"
        />
        <PrimeButton
          label="Save"
          icon="pi pi-check"
          className="p-button-raised p-button-success"
          type="submit"
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default StockPlacementForm;