import { RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  
import router from './routes/AppRoutes';
// import './App.css'   //fixme - uncomment

function App() {

  const queryClient = new QueryClient();  

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
