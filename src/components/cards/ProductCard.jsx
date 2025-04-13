/* eslint-disable react/prop-types */
import { useState } from "react"
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5"
import { capitalizeWords } from "../../utils/capitalize"
import { useFavoriteMutation } from "../../services/Product"
import Card from "../../ui/Card"
import RatingStar from "../../ui/RatingStar"
import Button from "../../ui/Button"

const ProductCard = ({ product }) => {
    const [favorite, setFavorite] = useState(product.isFavorite);
    const favoriteMutation = useFavoriteMutation();

    const handleFavorite = (e) => {
        e.preventDefault();

        const newFavoriteStatus = !favorite;
        setFavorite(newFavoriteStatus);

        favoriteMutation.mutate({
            id: product.id,
            isFavorite: newFavoriteStatus,
        });
    };

    return (
        <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundColor: '#fff', display: 'relative' }}>
            <span className="relative">
                <img src={product.image} alt="Product Image" className="m-auto h-40" />
                <span className="absolute top-1/2 left-0 right-0 flex items-center justify-between transform -translate-y-1/2">
                    <IoChevronBackOutline className="bg-[rgba(226,234,248,0.8)] text-[#626262] rounded-full p-2 h-8 w-8 flex items-center justify-center cursor-pointer" />
                    <IoChevronForwardOutline className="bg-[rgba(226,234,248,0.8)] text-[#626262] rounded-full p-2 h-8 w-8 flex items-center justify-center cursor-pointer" />
                </span>
            </span>
            {/* //fixme - flex out as in col */}
            <span className="flex flex-col justify-between">
                <span className="flex items-start justify-between gap-5">
                    <p className="text-brand-primary-black text-[1.125rem] font-medium">{capitalizeWords(product.name)}</p>
                    <Button className={'p-2 w-9 h-9 rounded-full shadow-none'} onClick={handleFavorite}>
                        {
                            favorite ?
                                <IoMdHeart className="w-4 h-4 text-red-500" /> :
                                <IoMdHeartEmpty className={`w-4 h-4 hover:text-brand-primary-blue`} />
                        }
                    </Button>
                </span>
                <span>
                    <p className="text-brand-primary-blue text-[.75rem] mt-2">${product.price}</p>
                    <span className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                            {
                                <RatingStar rating={product.rating} />
                            }
                        </div>
                        <span className="text-[#000000] text-opacity-40"> ({product.review})</span>
                    </span>
                    <Button classNames={'bg-[#E2EAF8] mt-5 text-brand-primary-black hover:bg-brand-primary-blue hover:text-white'} >Edit Product</Button>
                </span>
            </span>
        </Card>
    )
}

export default ProductCard