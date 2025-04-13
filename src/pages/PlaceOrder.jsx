// src/components/PlaceOrder.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button as PrimeButton } from "primereact/button";
import { Card } from "primereact/card";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const API_ENDPOINTS = {
  ORDERS: "/api/orders/",
  CUSTOMERS: "/api/customers/",
  PRODUCTS: "/api/products/",
  WAREHOUSES: "/api/warehouses/",
  LOCATIONS: "/api/warehouse-locations/",
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
          axios.get(API_ENDPOINTS.CUSTOMERS),
          axios.get(API_ENDPOINTS.PRODUCTS),
          axios.get(API_ENDPOINTS.WAREHOUSES),
          axios.get(API_ENDPOINTS.LOCATIONS),
        ]);
        setCustomers(custRes.data);
        setProducts(prodRes.data);
        setWarehouses(whRes.data);
        setLocations(locRes.data);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    if (!formData.customer || formData.items.some(item => !item.product || !item.warehouse || !item.location)) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      customer: formData.customer.customer_id,
      pos_terminal_id: formData.pos_terminal_id,
      pos_processed: true,
      items: formData.items.map(item => ({
        product: item.product.product_id,
        warehouse: item.warehouse.warehouse_id,
        location: item.location.id, 
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(API_ENDPOINTS.ORDERS, payload);
      setSuccess(`Order ${response.data.order_id} created successfully!`);
      setFormData({
        customer: null,
        pos_terminal_id: "POS001",
        items: [{ product: null, warehouse: null, location: null, quantity: 1 }],
      });
    } catch (err) {
        console.log("this error data",err);
      setError(err.response?.data?.error || "Failed to place order");
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
              options={customers.map(c => ({ label: c.full_name, value: c }))}
              onChange={(e) => handleInputChange("customer", e.value)}
              placeholder="Select a customer"
              className="w-full mt-1"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">POS Terminal ID</label>
            <InputText
              value={formData.pos_terminal_id}
              onChange={(e) => handleInputChange("pos_terminal_id", e.target.value)}
              className="w-full mt-1"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mt-4">Order Items</h2>
          {formData.items.map((item, index) => (
            <div key={index} className="flex flex-col gap-4 p-4 border rounded-md bg-gray-50">
              <div>
                <label className="font-semibold text-gray-700">Product *</label>
                <Dropdown
                  value={item.product}
                  options={products.map(p => ({ label: p.name, value: p }))}
                  onChange={(e) => handleItemChange(index, "product", e.value)}
                  placeholder="Select a product"
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Warehouse *</label>
                <Dropdown
                  value={item.warehouse}
                  options={warehouses.map(w => ({ label: w.name, value: w }))}
                  onChange={(e) => handleItemChange(index, "warehouse", e.value)}
                  placeholder="Select a warehouse"
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Location *</label>
                <Dropdown
                  value={item.location}
                  options={locations.map(l => ({ label: l.section_name, value: l }))}
                  onChange={(e) => handleItemChange(index, "location", e.value)}
                  placeholder="Select a location"
                  className="w-full mt-1"
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
                />
              </div>
              {formData.items.length > 1 && (
                <PrimeButton
                  label="Remove"
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm"
                  onClick={() => removeItem(index)}
                />
              )}
            </div>
          ))}

          <PrimeButton
            label="Add Item"
            icon="pi pi-plus"
            className="p-button-secondary p-button-sm mt-4"
            onClick={addItem}
          />

          <div className="flex justify-end gap-4 mt-6">
            <PrimeButton
              label="Cancel"
              className="p-button-outlined"
              onClick={() => setFormData({
                customer: null,
                pos_terminal_id: "POS001",
                items: [{ product: null, warehouse: null, location: null, quantity: 1 }],
              })}
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