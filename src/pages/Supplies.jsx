import { useEffect, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import PagesTitle from "../components/PagesTitle";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import moment from "moment";

const Supplies = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({ name_company: "", description: "" });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/suppliers/");
      if (!response.ok) throw new Error("Failed to fetch suppliers");

      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleAddSupplier = async () => {
    try {
      const method = currentSupplier ? "PUT" : "POST";
      const url = currentSupplier ? `/api/suppliers/${currentSupplier.id}/` : "/api/suppliers/";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier),
      });

      if (!response.ok) throw new Error(`Failed to ${currentSupplier ? "update" : "add"} supplier`);

      await fetchSuppliers(); // Refresh data
      closeModal();
    } catch (error) {
      console.error(`Error ${currentSupplier ? "updating" : "adding"} supplier:`, error);
    }
  };

  const handleUpdate = (supplier) => {
    setCurrentSupplier(supplier);
    setNewSupplier({ name_company: supplier.name_company, description: supplier.description });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;

    try {
      const response = await fetch(`/api/suppliers/${id}/`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete supplier");

      setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const openModal = () => {
    setCurrentSupplier(null);
    setNewSupplier({ name_company: "", description: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSupplier(null);
    setNewSupplier({ name_company: "", description: "" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <PagesTitle />
        <Button
          classNames="bg-brand-primary-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={openModal}
        >
          Add New Supplier
        </Button>
      </div>

      {/* Suppliers Table */}
      <Card classNames="relative px-4 py-5 sm:p-6">
        <h2 className="text-xl font-bold mb-4">Suppliers</h2>

        <DataTable
          value={suppliers}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="name_company" header="Company Name" sortable filter style={{ width: "30%" }} />
          <Column field="description" header="Description" sortable filter style={{ width: "40%" }} />
          <Column
            field="created_at"
            header="Created At"
            sortable
            body={(rowData) => moment(rowData.created_at).format("LL")}
            style={{ width: "15%" }}
          />
          <Column
            field="updated_at"
            header="Updated At"
            sortable
            body={(rowData) => moment(rowData.updated_at).format("LL")}
            style={{ width: "15%" }}
          />
          {/* Action Column for Update and Delete */}
          <Column
            body={(rowData) => (
              <div className="flex gap-2">
                <Button
                  classNames="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition"
                  onClick={() => handleUpdate(rowData)}
                >
                  Edit
                </Button>
                <Button
                  classNames="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  onClick={() => handleDelete(rowData.id)}
                >
                  Delete
                </Button>
              </div>
            )}
            style={{ width: "20%" }}
          />
        </DataTable>
      </Card>

      {/* Add/Edit Supplier Modal */}
      <Dialog
        visible={isModalOpen}
        onHide={closeModal}
        header={currentSupplier ? "Edit Supplier" : "Add New Supplier"}
        modal
        dismissableMask
        closeOnEscape
        style={{ width: "450px" }}
        className="p-dialog-centered"
      >
        <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
          <label className="font-medium">Company Name</label>
          <InputText
            value={newSupplier.name_company}
            onChange={(e) => setNewSupplier({ ...newSupplier, name_company: e.target.value })}
            className="p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            placeholder="Enter company name"
          />

          <label className="font-medium">Description</label>
          <InputTextarea
            value={newSupplier.description}
            onChange={(e) => setNewSupplier({ ...newSupplier, description: e.target.value })}
            className="p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter description"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              classNames="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              classNames="bg-brand-primary-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              onClick={handleAddSupplier}
            >
              {currentSupplier ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Supplies;
