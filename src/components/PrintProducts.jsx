import { useRef } from "react";
import moment from "moment";
import PropTypes from "prop-types";
// Note: We can't use react-barcode directly in window.print()
// We'll use a simple text representation or generate a canvas if needed

const PrintProducts = ({ products, onError }) => {
  const printRef = useRef(null);

  // Format data for printing
  const formatExportData = (products) => {
    return products.map(product => ({
      Name: product.name || '',
      SKU: product.sku || '',
      Weight: product.weight ? `${product.weight} kg` : 'N/A',
      Barcode: product.barcode || '', // Keep as text for printing
      Price: product.price ? `$${parseFloat(product.price).toFixed(2)}` : '$0.00',
      Quantity: product.quantity || 0,
      Category: product.category_name || 'Uncategorized',
      Supplier: product.supplier_name || 'N/A',
      Status: product.is_active ? 'Active' : 'Inactive',
      'Created At': product.created_at ? moment(product.created_at).format("LL") : 'N/A'
    }));
  };

  const handlePrint = () => {
    try {
      const exportData = formatExportData(products);
      
      // For barcode, we'll just show the barcode number in the print
      // If you need actual barcode images, you'd need a different approach (like generating images)
      const tableHtml = `
        <html>
          <head>
            <title>Products List</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #4338CA; color: white; }
              tr:nth-child(even) { background-color: #f2f2f2; }
              .barcode { font-family: 'Libre Barcode 39', cursive; font-size: 24px; }
              @media print {
                .no-print { display: none; }
              }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet">
          </head>
          <body>
            <h1>Products List</h1>
            <table>
              <thead>
                <tr>
                  ${Object.keys(exportData[0] || {}).map(key => `<th>${key}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${exportData.map(row => `
                  <tr>
                    ${Object.keys(row).map(key => `
                      <td ${key === 'Barcode' ? 'class="barcode"' : ''}>
                        ${row[key]}
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(tableHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch (error) {
      console.error('Print failed:', error);
      if (onError) {
        onError('Failed to print');
      }
    }
  };

  return (
    <button
      ref={printRef}
      onClick={handlePrint}
      className="p-button p-button-outlined p-component"
    >
      <span className="pi pi-print mr-2" />
      Print
    </button>
  );
};

PrintProducts.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sku: PropTypes.string,
      weight: PropTypes.number,
      barcode: PropTypes.string, // Already included and matched
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      quantity: PropTypes.number,
      category_name: PropTypes.string,
      supplier_name: PropTypes.string,
      is_active: PropTypes.bool,
      created_at: PropTypes.string
    })
  ).isRequired,
  onError: PropTypes.func
};

PrintProducts.defaultProps = {
  onError: null
};

export default PrintProducts;