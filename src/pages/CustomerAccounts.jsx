// src/components/CustomerAccounts.jsx
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

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL ;
// Constants
const API_ENDPOINTS = {
  ACCOUNTS: "/api/customer-accounts/", // Adjust to your Django URL
  CUSTOMERS: "/api/customers/",
};

// Axios Config
axios.defaults.withCredentials = true;

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

const CustomerAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dt = useRef(null);

  const fetchAccounts = useApiFetch(API_ENDPOINTS.ACCOUNTS, setAccounts, setError);
  const fetchCustomers = useApiFetch(API_ENDPOINTS.CUSTOMERS, setCustomers, setError);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAccounts(), fetchCustomers()]).finally(() => setLoading(false));
  }, [fetchAccounts, fetchCustomers]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAccounts(accounts);
      return;
    }
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = accounts.filter((account) =>
      [account.username, account.customer_name, account.account_created_date].some((field) =>
        field?.toLowerCase().includes(lowercasedSearch)
      )
    );
    setFilteredAccounts(filtered);
  }, [searchTerm, accounts]);

  const exportCSV = () => dt.current.exportCSV();

  const handleSaveAccount = useCallback(
    async (formData) => {
      try {
        const url = currentAccount
          ? `${API_URL}${API_ENDPOINTS.ACCOUNTS}${currentAccount.account_id}/`
          : `${API_URL}${API_ENDPOINTS.ACCOUNTS}`;
        const method = currentAccount ? "put" : "post";
        const response = await axios({ method, url, data: formData });
        console.log("Account saved:", response.data);
        await fetchAccounts();
        closeModal();
      } catch (error) {
        setError(error.response?.data?.detail || error.message || "Failed to save account");
      }
    },
    [currentAccount, fetchAccounts]
  );

  const handleDelete = useCallback(
    async (accountId) => {
      if (!window.confirm("Are you sure you want to delete this account?")) return;
      try {
        await axios.delete(`${API_URL}${API_ENDPOINTS.ACCOUNTS}${accountId}/`);
        setAccounts((prev) => prev.filter((account) => account.account_id !== accountId));
      } catch (error) {
        setError(error.response?.data?.detail || error.message || "Failed to delete account");
      }
    },
    []
  );

  const openModal = (account = null) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAccount(null);
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
        onClick={() => handleDelete(rowData.account_id)}
      >
        <i className="pi pi-trash mr-1" /> Delete
      </Button>
    </div>
  );

  const columns = [
    { field: "account_id", header: "Account ID", sortable: true, filter: true, style: { width: "15%" } },
    { field: "customer_name", header: "Customer", sortable: true, filter: true, style: { width: "25%" } },
    { field: "username", header: "Username", sortable: true, filter: true, style: { width: "25%" } },
    { field: "account_created_date", header: "Created Date", sortable: true, filter: true, style: { width: "20%" } },
    { body: actionBodyTemplate, style: { width: "15%" } },
  ];

  const rightToolbarTemplate = () => (
    <PrimeButton
      label="Export CSV"
      icon="pi pi-file"
      className="p-button-outlined p-button-secondary"
      onClick={exportCSV}
    />
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <PagesTitle title="Customer Accounts" classNames="text-3xl font-bold text-gray-800" />
        <Button
          classNames="bg-indigo-600 text-white px-5 py-2 rounded-md flex items-center gap-2"
          onClick={() => openModal()}
        >
          <i className="pi pi-plus" /> Add New Account
        </Button>
      </div>

      <Card classNames="p-6 bg-white shadow-md rounded-lg">
        <Toolbar className="mb-4" right={rightToolbarTemplate} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Accounts List</h2>
          <div className="w-1/4 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Keyword Search"
              className="w-full border-2 border-gray-300 rounded-md pl-10 p-2"
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
          value={filteredAccounts}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          className="p-datatable-striped p-datatable-sm rounded-lg"
          stripedRows
          rowHover
          responsiveLayout="scroll"
          emptyMessage="No accounts found."
          exportFilename={`CustomerAccounts_${moment().format("YYYYMMDD")}`}
        >
          {columns.map((col, index) => (
            <Column key={index} {...col} bodyClassName="text-gray-600" />
          ))}
        </DataTable>
      </Card>

      <Dialog
        visible={isModalOpen}
        onHide={closeModal}
        header={currentAccount ? "Edit Account" : "Add New Account"}
        modal
        dismissableMask
        closeOnEscape
        style={{ width: "500px" }}
        className="p-fluid shadow-lg rounded-lg"
      >
        <AccountForm
          account={currentAccount}
          customers={customers}
          onSave={handleSaveAccount}
          onCancel={closeModal}
          error={error}
        />
      </Dialog>
    </div>
  );
};

const AccountForm = ({ account, customers, onSave, onCancel, error }) => {
  const initialFormData = {
    customer: 0,
    username: "",
    password: "",  // Changed from password_hash to password
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (account) {
      setFormData({
        customer: account.customer || 0,
        username: account.username || "",
        password: "",  // Do not pre-fill password for security
      });
    } else {
      setFormData(initialFormData);
    }
  }, [account]);

  const handleChange = (field) => (e) => {
    const value = e.target?.value ?? e.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === "customer" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = () => {
    const requiredFields = ["customer", "username", "password"];
    if (requiredFields.some((field) => !formData[field])) {
      alert("Please fill in all required fields.");
      return;
    }

    const data = {
      customer: formData.customer,
      username: formData.username,
      password: formData.password,  // Send raw password
    };

    onSave(data);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex flex-col gap-6">
        <div className="field">
          <label htmlFor="customer" className="font-semibold text-gray-700">
            Customer *
          </label>
          <Dropdown
            id="customer"
            value={formData.customer}
            options={customers.map((c) => ({ label: c.full_name, value: c.customer_id }))}
            onChange={(e) => setFormData((prev) => ({ ...prev, customer: e.value }))}
            placeholder="Select a customer"
            className="w-full border-2 border-gray-300 rounded-md"
          />
        </div>
        <div className="field">
          <label htmlFor="username" className="font-semibold text-gray-700">
            Username *
          </label>
          <InputText
            id="username"
            value={formData.username}
            onChange={handleChange("username")}
            placeholder="Enter username"
            required
            className="w-full px-4 p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
          />
        </div>
        <div className="field">
          <label htmlFor="password" className="font-semibold text-gray-700">
            Password *
          </label>
          <InputText
            id="password"
            value={formData.password}
            onChange={handleChange("password")}
            placeholder="Enter password"
            type="password"
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
          {account ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default CustomerAccounts;