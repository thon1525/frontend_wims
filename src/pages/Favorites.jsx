/* eslint-disable no-unused-vars */
import { useProducts } from "../services/Product"
import Spinner from '../ui/Spinner'
import PagesTitle from "../components/PagesTitle";
import ProductCard from "../components/cards/ProductCard";
import image1 from '../assets/images/products/product-6.jpg'
import image2 from '../assets/images/products/product-5.jpg'
import image3 from '../assets/images/products/product-11.jpg'
import image4 from '../assets/images/products/product-1.jpg'
import image5 from '../assets/images/products/product-9.jpg'
import image6 from '../assets/images/products/product-3.jpg'
import image7 from '../assets/images/products/product-7.jpg'
import image8 from '../assets/images/products/product-8.jpg'
import image9 from '../assets/images/products/product-14.jpg'

const products = [
  {
    image: image1,
    name: 'Apple Smart Keyboard',
    price: '179.99',
    rating: 4,
    reviewCount: 10
  },
  {
    image: image2,
    name: 'Canon - EOS 5D Mark IV DSLR Camera',
    price: '3599.99',
    rating: 4,
    reviewCount: 15
  },
  {
    image: image3,
    name: 'MacBook Pro 13" Display, i5',
    price: '1199.99',
    rating: 3,
    reviewCount: 6
  },
  {
    image: image4,
    name: 'GoPro - HERO7 Black HD Waterproof Action',
    price: '349.99',
    rating: 3,
    reviewCount: 2
  },
  {
    image: image5,
    name: 'Apple Watch Series 4 Gold Aluminum Case',
    price: '499.99',
    rating: 4,
    reviewCount: 4
  },
  {
    image: image6,
    name: 'Lenovo - 330-15IKBR 15.6"',
    price: '339.99',
    rating: 3,
    reviewCount: 2
  },
  {
    image: image7,
    name: 'Bose - SoundSport  wireless headphones',
    price: '199.99',
    rating: 3,
    reviewCount: 4
  },
  {
    image: image8,
    name: 'Microsoft - Refurbish Xbox One S 500GB',
    price: '279.99',
    rating: 3,
    reviewCount: 6
  },
  {
    image: image9,
    name: 'GoPro - HERO7 Black HD Waterproof Action',
    price: '35.41',
    rating: 3,
    reviewCount: 10
  },
]

const Favorites = () => {
  const { data, error, isLoading } = useProducts()
  const favoriteProducts = data?.filter(product => product.isFavorite);

  return (
    <>
      <PagesTitle />

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {
          error
            ? <h1>Error fetching data: {error.message}</h1>
            : isLoading
              ? <div className="mt-20 w-full"><Spinner /></div>
              :
              favoriteProducts?.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))
        }
      </div>
    </>
  )
}

export default Favorites