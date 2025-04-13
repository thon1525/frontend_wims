import { useOrders } from "../services/Order"
import Card from "../ui/Card"
import Filter from "../components/Filter";
import TablePagination from "../components/TablePagination";
import OrdersTable from "../components/OrdersTable";
import PagesTitle from "../components/PagesTitle";
import Spinner from '../ui/Spinner'

const OrderLists = () => {

  const { data, isLoading, error } = useOrders();

  return (
    <>
      <PagesTitle />

      <div className="mt-5"><Filter /></div>

      {
        error
          ? <h1>Error fetching data: {error.message}</h1>
          : isLoading
            ? <div className="mt-20"><Spinner /></div>
            :
            <>
              <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundColor: '#fff', display: 'relative', marginTop: '20px' }}>
                <OrdersTable
                  header={['id', 'name', 'address', 'date', 'type', 'status']}
                  data={data}
                />
              </Card>
              <TablePagination />
            </>
      }

    </>
  )
}

export default OrderLists