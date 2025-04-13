// src/components/CustomerManagement.jsx
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
import Card from "../ui/Card";
import Button from "../ui/Button";
import PagesTitle from "../components/PagesTitle";

// Constants
const API_ENDPOINTS = {
  CUSTOMERS: "/api/customers/",
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

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dt = useRef(null);

  const fetchCustomers = useApiFetch(API_ENDPOINTS.CUSTOMERS, setCustomers, setError);

  useEffect(() => {
    setLoading(true);
    fetchCustomers().finally(() => setLoading(false));
  }, [fetchCustomers]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = customers.filter((customer) =>
      [
        customer.full_name,
        customer.email,
        customer.phone,
        customer.address,
        customer.account_status,
      ].some((field) => field?.toLowerCase().includes(lowercasedSearch))
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const handleSaveCustomer = useCallback(
    async (formData) => {
      try {
        const url = currentCustomer
          ? `${API_ENDPOINTS.CUSTOMERS}${currentCustomer.customer_id}/`
          : API_ENDPOINTS.CUSTOMERS;
        const method = currentCustomer ? "put" : "post";
        const response = await axios({
          method,
          url,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        await fetchCustomers();
        closeModal();
        console.log("Success:", response.data);
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Failed to save customer"
        );
        console.error("Error:", error.response?.data);
      }
    },
    [currentCustomer, fetchCustomers]
  );

  const handleDelete = useCallback(
    async (customerId) => {
      if (!window.confirm("Are you sure you want to delete this customer?")) return;
      try {
        await axios.delete(`${API_ENDPOINTS.CUSTOMERS}${customerId}/`);
        setCustomers((prev) => prev.filter((c) => c.customer_id !== customerId));
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Failed to delete customer"
        );
      }
    },
    []
  );

  const openModal = (customer = null) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
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
        onClick={() => handleDelete(rowData.customer_id)}
      >
        <i className="pi pi-trash mr-1" /> Delete
      </Button>
    </div>
  );

  const columns = [
    { field: "customer_id", header: "ID", sortable: true, filter: true, style: { width: "10%" } },
    { field: "full_name", header: "Full Name", sortable: true, filter: true, style: { width: "20%" } },
    { field: "email", header: "Email", sortable: true, filter: true, style: { width: "20%" } },
    { field: "phone", header: "Phone", sortable: true, filter: true, style: { width: "15%" } },
    { field: "address", header: "Address", sortable: true, filter: true, style: { width: "20%" } },
    { field: "account_status", header: "Status", sortable: true, filter: true, style: { width: "15%" } },
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
        <PagesTitle title="Customer Management" classNames="text-3xl font-bold text-gray-800" />
        <Button
          classNames="bg-indigo-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
          onClick={() => openModal()}
        >
          <i className="pi pi-plus" /> Add New Customer
        </Button>
      </div>

      <Card classNames="p-6 bg-white shadow-md rounded-lg">
        <Toolbar className="mb-4" right={rightToolbarTemplate} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Customer List</h2>
          <div className="w-1/4 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Keyword Search"
              className="w-full border-2 border-gray-300 rounded-md pl-10 p-2"
              aria-label="Search customers"
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
          value={filteredCustomers}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-striped p-datatable-sm rounded-lg"
          stripedRows
          rowHover
          responsiveLayout="scroll"
          emptyMessage="No customers found."
          exportFilename={`Customers_${moment().format("YYYYMMDD")}`}
        >
          {columns.map((col, index) => (
            <Column key={index} {...col} bodyClassName="text-gray-600" />
          ))}
        </DataTable>
      </Card>

      <Dialog
        visible={isModalOpen}
        onHide={closeModal}
        header={currentCustomer ? "Edit Customer" : "Add New Customer"}
        modal
        dismissableMask
        closeOnEscape
        style={{ width: "700px" }}
        className="p-fluid shadow-lg rounded-lg"
      >
        <CustomerForm
          customer={currentCustomer}
          onSave={handleSaveCustomer}
          onCancel={closeModal}
          error={error}
        />
      </Dialog>
    </div>
  );
};

// Customer Form Component
const CustomerForm = ({ customer, onSave, onCancel, error }) => {
  const initialFormData = {
    full_name: "",
    email: "",
    phone: "",
    address: "",
    account_status: "Pending",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (customer) {
      setFormData({
        full_name: customer.full_name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        account_status: customer.account_status || "Pending",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [customer]);

  const handleChange = (field) => (e) => {
    const value = e.target?.value ?? e.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const requiredFields = ["full_name"];
    if (requiredFields.some((field) => !formData[field])) {
      alert("Please fill in all required fields.");
      return;
    }

    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("account_status", formData.account_status);

    onSave(data);
  };

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Pending", value: "Pending" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex flex-col gap-6">
        <div className="field">
          <label htmlFor="full_name" className="font-semibold text-gray-700">
            Full Name *
          </label>
          <InputText
            id="full_name"
            value={formData.full_name}
            onChange={handleChange("full_name")}
            placeholder="Enter full name"
            required
            className="w-full px-4 p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
          />
        </div>
        <div className="field">
          <label htmlFor="email" className="font-semibold text-gray-700">
            Email
          </label>
          <InputText
            id="email"
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="Enter email"
            type="email"
            className="w-full px-4 p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
          />
        </div>
        <div className="field">
          <label htmlFor="phone" className="font-semibold text-gray-700">
            Phone
          </label>
          <InputText
            id="phone"
            value={formData.phone}
            onChange={handleChange("phone")}
            placeholder="Enter phone number"
            className="w-full px-4 p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
          />
        </div>
        <div className="field">
          <label htmlFor="address" className="font-semibold text-gray-700">
            Address
          </label>
          <InputText
            id="address"
            value={formData.address}
            onChange={handleChange("address")}
            placeholder="Enter address"
            className="w-full px-4 p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
          />
        </div>
        <div className="field">
          <label htmlFor="account_status" className="font-semibold text-gray-700">
            Account Status
          </label>
          <Dropdown
            id="account_status"
            value={formData.account_status}
            options={statusOptions}
            onChange={(e) => setFormData((prev) => ({ ...prev, account_status: e.value }))}
            placeholder="Select status"
            className="w-full border-2 border-gray-300 rounded-md"
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
          {customer ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default CustomerManagement;