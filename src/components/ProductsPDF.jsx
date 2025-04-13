// ProductsPDF.jsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";
import PropTypes from "prop-types";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    color: "#4338CA",
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
  },
  tableHeader: {
    backgroundColor: "#4338CA",
    color: "white",
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 8,
    color: "#666666",
  },
});

const ProductsPDF = ({ products }) => {
  const formattedData = products.map(product => ({
    Name: product.name || '',
    SKU: product.sku || '',
    Weight: product.weight ? `${product.weight} kg` : 'N/A',
    Barcode: product.barcode || '',
    Price: product.price ? `$${parseFloat(product.price).toFixed(2)}` : '$0.00',
    Quantity: product.quantity || 0,
    Category: product.category_name || 'Uncategorized',
    Supplier: product.supplier_name || 'N/A',
    Status: product.is_active ? 'Active' : 'Inactive',
    'Created At': product.created_at ? moment(product.created_at).format("LL") : 'N/A'
  }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Products List</Text>
        
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            {Object.keys(formattedData[0] || {}).map((key) => (
              <Text key={key} style={styles.tableCell}>
                {key}
              </Text>
            ))}
          </View>
          
          {/* Data Rows */}
          {formattedData.map((product, index) => (
            <View 
              key={index} 
              style={[
                styles.tableRow,
                index % 2 === 0 && { backgroundColor: "#f2f2f2" }
              ]}
            >
              {Object.values(product).map((value, i) => (
                <Text key={i} style={styles.tableCell}>
                  {value}
                </Text>
              ))}
            </View>
          ))}
        </View>
        
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => 
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
ProductsPDF.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sku: PropTypes.string,
      weight: PropTypes.number,
      barcode: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      quantity: PropTypes.number,
      category_name: PropTypes.string,
      supplier_name: PropTypes.string,
      is_active: PropTypes.bool,
      created_at: PropTypes.string,
    })
  ).isRequired,
};

export default ProductsPDF;
