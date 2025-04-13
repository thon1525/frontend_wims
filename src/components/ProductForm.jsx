import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import Barcode from "react-barcode";
import Button from "../ui/Button";
import { Checkbox } from "primereact/checkbox";
const ProductForm = ({
  product,
  categories,
  suppliers,
  onSave,
  onCancel,
  unitChoices,
  error,
}) => {
  const initialFormData = {
    name: "",
    sku: "",
    barcode: "",
    price: 0,
    weight: 0,
    quantity: 0,
    unit_type: "",
    image: null,
    category: null,
    supplier: null,
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        category: product.category,
        supplier: product.supplier,
        image: null,
      });
      setImagePreview(product.image || null);
    } else {
      setFormData({
        ...initialFormData,
        category: categories[0]?.id || null,
        supplier: suppliers[0]?.id || null,
      });
      setImagePreview(null);
    }
  }, [product, categories, suppliers]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target?.value ?? e.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, is_active: e.checked }));
  };
  const handleSubmit = () => {
    const requiredFields = ["name", "sku", "barcode", "category", "supplier"];
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
      <div className="flex flex-col sm:flex-row sm:justify-between  gap-6 sm:gap-4 ">
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
          <label htmlFor="sku" className="font-semibold text-gray-700">
            SKU *
          </label>
          <InputText
            id="sku"
            value={formData.sku}
            onChange={handleChange("sku")}
            placeholder="Enter SKU"
            required
            className="w-full px-4 p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between  gap-6 sm:gap-4 ">
        <div className="field">
          <label htmlFor="price" className="font-semibold text-gray-700">
            Price
          </label>
          <InputNumber
            id="price"
            value={formData.price}
            onValueChange={handleChange("price")}
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={2}
            className="w-full px-4  p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
          />
        </div>
        <div className="field">
          <label htmlFor="quantity" className="font-semibold text-gray-700">
            Quantity
          </label>
          <InputNumber
            id="quantity"
            value={formData.quantity}
            onValueChange={handleChange("quantity")}
            className="w-full px-4  p-[5px] rounded-md border-gray-300 border-2"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-6 sm:gap-4">
        <div className="flex flex-col w-full sm:w-1/2 gap-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-700"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="category"
            value={formData.category}
            options={categories}
            onChange={handleChange("category")}
            optionLabel="name_category"
            optionValue="id"
            placeholder="Select a category"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-col w-full sm:w-1/2 gap-2">
          <label
            htmlFor="supplier"
            className="text-sm font-medium text-gray-700"
          >
            Supplier <span className="text-red-500">*</span>
          </label>
          <Dropdown
            id="supplier"
            value={formData.supplier}
            options={suppliers}
            onChange={handleChange("supplier")}
            optionLabel="name_company"
            optionValue="id"
            placeholder="Select a supplier"
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="weight" className="font-semibold text-gray-700">
          Weight *
        </label>
        <InputText
          id="weight"
          value={formData.weight}
          onChange={handleChange("weight")}
          placeholder="Enter weight"
          required
          className="w-full px-4 p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
        />
      </div>
      <div className="flex flex-col w-full sm:w-1/2 gap-2">
        <label htmlFor="unitType" className="text-sm font-medium text-gray-700">
          Unit Type <span className="text-red-500">*</span>
        </label>
        <Dropdown
          id="unitType"
          value={formData.unit_type}
          options={unitChoices} // Use unitChoices prop instead of UNIT_CHOICES
          onChange={handleChange("unit_type")}
          optionLabel="label"
          optionValue="value"
          placeholder="Select a unit type"
          required
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
        />
      </div>
      <div className="field">
        <label htmlFor="barcode" className="font-semibold text-gray-700">
          Barcode *
        </label>
        <InputText
          id="barcode"
          value={formData.barcode}
          onChange={handleChange("barcode")}
          placeholder="Enter barcode"
          required
          className="w-full px-4  p-[5px] rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border-2"
        />
        {formData.barcode && (
          <div className="mt-3">
            <Barcode
              value={formData.barcode}
              width={1.5}
              height={50}
              displayValue
              fontSize={14}
            />
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="image" className="font-semibold text-gray-700">
          Product Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 mt-1 border rounded-md"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 w-40 h-40 object-cover rounded-lg"
          />
        )}
      </div>

      <div className="field flex items-center gap-2">
        <Checkbox
          inputId="is_active"
          checked={formData.is_active}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="is_active" className="font-semibold text-gray-700">
          Active
        </label>
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

export default ProductForm;
