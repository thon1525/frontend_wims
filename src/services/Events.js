import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';

const fetchEvents = async () => {
  // fixme - set timeout to slow data fetching
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    // const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));  

    const data = querySnapshot.docs.map(doc => {
      const eventData = doc.data();
      return {
        id: doc.id,
        ...eventData,
        // date: orderData.date ? orderData.date.toDate().toLocaleDateString() : '', // Convert Firestore Timestamp to date  
        // date: eventData.date ? eventData.date.toDate().toLocaleDateString('en-GB', {
        //   day: '2-digit',
        //   month: 'long',
        //   year: 'numeric'
        // }) : '', // Format the date inline  
      };
    });

    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};

export const useEvents = () => {
  return useQuery({ // Use the object form  
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
}