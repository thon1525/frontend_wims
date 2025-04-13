/* eslint-disable react/prop-types */
import { MdOutlineStarPurple500 } from 'react-icons/md'; // Ensure you have the import for your star icon  

const RatingStar = ({ rating }) => {  
  const totalStars = 5; 

  return (  
    <div className="flex items-center">  
      {Array.from({ length: totalStars }, (_, index) => (  
        <MdOutlineStarPurple500  
          key={index}  
          aria-hidden="true"  
          className={`${  
            index < rating ? 'text-[#FF9500]' : 'text-[#000000] text-opacity-20'  
          } h-5 w-5 flex-shrink-0`}  
        />  
      ))}  
    </div>  
  );  
};  

export default RatingStar;