import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import Button from "../ui/Button";
import { InputTextarea } from "primereact/inputtextarea";
const WarehouseForm = ({
  product,
  onSave,
  onCancel,
  error,
}) => {
  const initialFormData = {
    name: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        image: null,
      });
     
    } else {
      setFormData({
        ...initialFormData,
      });
    }
  }, [product]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target?.value ?? e.value }));
  };



  const handleSubmit = () => {
    const requiredFields = ["name", "address",];
    if (requiredFields.some((field) => !formData[field])) {
      alert("Please fill in all required fields.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    onSave(data);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex flex-col  gap-6 sm:gap-4 ">
        <div className="field">
          <label htmlFor="name" className="font-semibold text-gray-700">
            Name *
          </label>
          <InputText
            id="name"
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter product name"
            required
            className="w-full px-4  p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
          />
        </div>
        <div className="field">
          <label htmlFor="address" className="font-semibold text-gray-700">
          address *
          </label>
      
                <InputTextarea    value={formData.address} id="address" placeholder="address"  onChange={handleChange("address")} rows={5} cols={30}   className="w-full px-4  p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"/>
             
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
          {product ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default WarehouseForm;
