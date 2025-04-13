import * as XLSX from 'xlsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button as PrimeButton } from 'primereact/button';

const ExportExcel = ({ products, onError }) => {
  const exportToExcel = () => {
    try {
      const cleanedProducts = products.map(product => ({
        Image: product.image,
        Name: product.name,
        SKU: product.sku,
        Weight: product.weight || 0.0,  // Replace N/A with 0.0
        Barcode: product.barcode,
        Price: parseFloat(product.price),  // Remove $
        Quantity: product.quantity,
        Category: product.category_name,
        Supplier: product.supplier_name,
        Status: product.is_active ? "Active" : "Inactive",
        "Created At": product.created_at ? moment(product.created_at).format("LL") : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(cleanedProducts);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Products");
      XLSX.writeFile(wb, `Products_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      onError(`Failed to export Excel: ${err.message}`);
    }
  };

  return (
    <PrimeButton
      label="Export Excel"
      icon="pi pi-file-excel"
      className="p-button-outlined p-button-success"
      onClick={exportToExcel}
    />
  );
};


ExportExcel.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      
      name: PropTypes.string,
      sku: PropTypes.string,
      weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      barcode: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      quantity: PropTypes.number,
      category_name: PropTypes.string,
      supplier_name: PropTypes.string,
      is_active: PropTypes.bool,
      created_at: PropTypes.string,
    })
  ).isRequired,
  onError: PropTypes.func,
};

export default ExportExcel;
