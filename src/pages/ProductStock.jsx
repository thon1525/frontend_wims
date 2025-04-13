/* eslint-disable no-unused-vars */
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useProducts } from "../services/Product";
import SearchBar from '../components/SearchBar'
import Card from "../ui/Card"
import TablePagination from "../components/TablePagination";
import ProductStockTable from "../components/ProductStockTable";
import PagesTitle from "../components/PagesTitle";
import Spinner from "../ui/Spinner";

const productStockData = [
  {
    image: '/src/assets/images/products/product-9.jpg',
    productName: "Apple Watch Series 4",
    category: "digital product",
    price: 690.00,
    piece: 63,
    availableColor: ['#000000', '#9F9F9F', '#E98F8F'],
  },
  {
    image: '/src/assets/images/products/product-6.jpg',
    productName: "Apple Smart Keyboard",
    category: "digital product",
    price: 179.00,
    piece: 16,
    availableColor: ['#000000', '#E98F8F', '#4D88EF', '#E9C157'],
  },
  {
    image: '/src/assets/images/products/product-5.jpg',
    productName: "Canon - EOS 5D Mark IV DSLR Camera",
    category: "digital product",
    price: 3599.00,
    piece: 6,
    availableColor: ['#882853', '#7CB7F5', '#12163C', '#4343EE'],
  },
  {
    image: '/src/assets/images/products/product-17.jpg',
    productName: "Trainer",
    category: "fashion",
    price: 99.00,
    piece: 80,
    availableColor: ['#283988', '#000000', '#A32147'],
  },
  {
    image: '/src/assets/images/products/product-20.jpg',
    productName: "Form Seat",
    category: "furniture",
    price: 300.00,
    piece: 5,
    availableColor: ['#283988', '#000000', '#A32147'],
  },
  {
    image: '/src/assets/images/products/product-16.jpg',
    productName: "Mophler",
    category: "fashion",
    price: 350.00,
    piece: 5,
    availableColor: ['#000000', '#F57C7C', '#4D88EF', '#E9C157'],
  },
  {
    image: '/src/assets/images/products/product-11.jpg',
    productName: "MacBook Pro 13\" Display, i5",
    category: "digital product",
    price: 1199.99,
    piece: 13,
    availableColor: ['#882853', '#7CB7F5', '#12163C', '#4343EE'],
  },
];

const ProductStock = () => {
  const { data, error, isLoading } = useProducts()

  return (
    <>
      <div className="flex items-center justify-between">
        <PagesTitle />
        <SearchBar environment={'product name'} classNames={'w-1/3 bg-[#F5F6FA]'} />
      </div>

      {
        error
          ? <h1>Error fetching data: {error.message}</h1>
          : isLoading
            ?
            <div className="mt-20"><Spinner /></div>
            :
            <>
              <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundColor: '#fff', display: 'relative', marginTop: '20px' }}>
                <ProductStockTable
                  header={['image', 'product name', 'category', 'price', 'piece', 'available color', 'action']}
                  data={data}
                />
              </Card>
              <TablePagination />
            </>
      }
    </>
  )
}

export default ProductStock;