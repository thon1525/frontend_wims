import { useOrders } from "../services/Order";
import { useProducts } from "../services/Product";
import Card from "../ui/Card";
import OrdersTable from "../components/OrdersTable";
import PagesTitle from "../components/PagesTitle";
import ProductStockTable from "../components/ProductStockTable";
import Spinner from "../ui/Spinner";

const Table = () => {
  const { data: orderData, error: orderError, isLoading: orderLoading } = useOrders();
  const { data: productData, error: productError, isLoading: productLoading } = useProducts();

  return (
    <>
      <PagesTitle />

      {
        orderError
          ? <h1>Error fetching orders: {orderError.message}</h1>
          : orderLoading
            ? <div className="mt-20"><Spinner /></div>
            :
            <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundColor: '#fff', display: 'relative', marginTop: '20px' }}>
              <OrdersTable
                header={['id', 'name', 'address', 'date', 'type', 'status']}
                data={orderData}
              />
            </Card>
      }

      {
        productError
          ? <h1>Error fetching products: {productError.message}</h1>
          : productLoading
            ? <div className="mt-20"><Spinner /></div>
            :
            <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundColor: '#fff', display: 'relative', marginTop: '20px' }}>
              <ProductStockTable
                header={['image', 'product name', 'category', 'price', 'piece', 'available color', 'action']}
                data={productData}
              />
            </Card>
      }
    </>
  );
};

export default Table;