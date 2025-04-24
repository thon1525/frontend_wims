import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button as PrimeButton } from "primereact/button";
import { Card } from "primereact/card";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;
const API_ENDPOINTS = {
  ORDERS: "/api/orders/",
  CUSTOMERS: "/api/customers/",
  PRODUCTS: "/api/products/",
  WAREHOUSES: "/api/warehouses/",
  LOCATIONS: "/api/warehouse-locations/",
  STOCK_PLACEMENTS: "/api/stock-placements/",
};

const PlaceOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    customer: null,
    pos_terminal_id: "POS001",
    items: [{ product: null, warehouse: null, location: null, quantity: 1 }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [custRes, prodRes, whRes, locRes] = await Promise.all([
          axios.get(`${API_URL}${API_ENDPOINTS.CUSTOMERS}`),
          axios.get(`${API_URL}${API_ENDPOINTS.PRODUCTS}`),
          axios.get(`${API_URL}${API_ENDPOINTS.WAREHOUSES}`),
          axios.get(`${API_URL}${API_ENDPOINTS.LOCATIONS}`),
        ]);

        setCustomers(Array.isArray(custRes.data) ? custRes.data : []);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        setWarehouses(Array.isArray(whRes.data) ? whRes.data : []);
        setLocations(Array.isArray(locRes.data) ? locRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Check stock availability using STOCK_PLACEMENTS endpoint
  const checkStock = async (items) => {
    const stockErrors = [];
    for (const item of items) {
      if (item.product && item.warehouse && item.location && item.quantity > 0) {
        try {
          const response = await axios.get(
            `${API_URL}${API_ENDPOINTS.STOCK_PLACEMENTS}?product=${item.product.product_id}&warehouse=${item.warehouse.warehouse_id}&location=${item.location.id}`
          );
          const stockData = response.data;
  
          // Check if stockData is an array or a single object
          const stock = Array.isArray(stockData) ? stockData[0] : stockData;
  
          if (!stock) {
            stockErrors.push(`No stock found for ${item.product.name} in ${item.warehouse.name}`);
            continue;
          }
  
          const availableStock = (stock.quantity || 0) - (stock.reserved_quantity || 0);
          console.log(`Available stock for product ${item.product.name}: ${availableStock}`);
  
          if (availableStock < item.quantity) {
            stockErrors.push(
              `Insufficient stock for ${item.product.name}: ${availableStock} available, ${item.quantity} requested`
            );
          }
        } catch (err) {
          stockErrors.push(`Error checking stock for ${item.product?.name || "product"} in ${item.warehouse?.name || "warehouse"}`);
          console.error("Stock check error:", err);
        }
      } else {
        stockErrors.push("Incomplete item details. Please select product, warehouse, and location.");
      }
    }
    return stockErrors;
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product: null, warehouse: null, location: null, quantity: 1 }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = useCallback(async () => {
    // Validate required fields
    if (!formData.customer) {
      setError("Please select a customer.");
      return;
    }
    const invalidItems = formData.items.filter(
      (item) => !item.product || !item.warehouse || !item.location || item.quantity < 1
    );
    if (invalidItems.length > 0) {
      setError("All items must have a product, warehouse, location, and valid quantity.");
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    // Check stock before submitting
    const stockErrors = await checkStock(formData.items);
    if (stockErrors.length > 0) {
      setError(stockErrors.join("; "));
      setLoading(false);
      return;
    }
  
    const payload = {
      customer: formData.customer.customer_id,
      pos_terminal_id: formData.pos_terminal_id,
      pos_processed: true,
      items: formData.items.map((item) => ({
        product: item.product.product_id,
        warehouse: item.warehouse.warehouse_id,
        location: item.location.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };
  
    try {
      const response = await axios.post(`${API_URL}${API_ENDPOINTS.ORDERS}`, payload);
      setSuccess(`Order ${response.data.order_id} created successfully!`);
      setFormData({
        customer: null,
        pos_terminal_id: "POS001",
        items: [{ product: null, warehouse: null, location: null, quantity: 1 }],
      });
    } catch (err) {
      console.error("Error placing order:", err);
      setError(err.response?.data?.error || err.response?.data?.detail || "Failed to place order");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Place Order</h1>
      <Card className="p-6 bg-white shadow-md rounded-lg">
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
        {success && <p className="text-green-500 bg-green-50 p-3 rounded-md mb-4">{success}</p>}

        <div className="flex flex-col gap-6">
          <div>
            <label className="font-semibold text-gray-700">Customer *</label>
            <Dropdown
              value={formData.customer}
              options={customers.map((c) => ({ label: c.full_name || "Unknown", value: c }))}
              onChange={(e) => handleInputChange("customer", e.value)}
              placeholder="Select a customer"
              className="w-full mt-1"
              disabled={loading || customers.length === 0}
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">POS Terminal ID</label>
            <InputText
              value={formData.pos_terminal_id}
              onChange={(e) => handleInputChange("pos_terminal_id", e.target.value)}
              className="w-full mt-1"
              disabled={loading}
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mt-4">Order Items</h2>
          {formData.items.map((item, index) => (
            <div key={index} className="flex flex-col gap-4 p-4 border rounded-md bg-gray-50">
              <div>
                <label className="font-semibold text-gray-700">Product *</label>
                <Dropdown
                  value={item.product}
                  options={products.map((p) => ({ label: p.name || "Unknown", value: p }))}
                  onChange={(e) => handleItemChange(index, "product", e.value)}
                  placeholder="Select a product"
                  className="w-full mt-1"
                  disabled={loading || products.length === 0}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Warehouse *</label>
                <Dropdown
                  value={item.warehouse}
                  options={warehouses.map((w) => ({ label: w.name || "Unknown", value: w }))}
                  onChange={(e) => handleItemChange(index, "warehouse", e.value)}
                  placeholder="Select a warehouse"
                  className="w-full mt-1"
                  disabled={loading || warehouses.length === 0}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Location *</label>
                <Dropdown
                  value={item.location}
                  options={locations.map((l) => ({ label: l.section_name || "Unknown", value: l }))}
                  onChange={(e) => handleItemChange(index, "location", e.value)}
                  placeholder="Select a location"
                  className="w-full mt-1"
                  disabled={loading || locations.length === 0}
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Quantity *</label>
                <InputText
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                  min={1}
                  className="w-full mt-1"
                  disabled={loading}
                />
              </div>
              {formData.items.length > 1 && (
                <PrimeButton
                  label="Remove"
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm"
                  onClick={() => removeItem(index)}
                  disabled={loading}
                />
              )}
            </div>
          ))}

          <PrimeButton
            label="Add Item"
            icon="pi pi-plus"
            className="p-button-secondary p-button-sm mt-4"
            onClick={addItem}
            disabled={loading}
          />

          <div className="flex justify-end gap-4 mt-6">
            <PrimeButton
              label="Cancel"
              className="p-button-outlined"
              onClick={() =>
                setFormData({
                  customer: null,
                  pos_terminal_id: "POS001",
                  items: [{ product: null, warehouse: null, location: null, quantity: 1 }],
                })
              }
              disabled={loading}
            />
            <PrimeButton
              label="Place Order"
              icon="pi pi-check"
              className="p-button-success"
              onClick={handleSubmit}
              disabled={loading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PlaceOrder;