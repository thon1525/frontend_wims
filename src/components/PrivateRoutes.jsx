import { Navigate, Outlet } from 'react-router-dom'
import UserAuthStatus from '../hooks/UserAuthStatus'
// import Spinner from './Spinner'

const PrivateRoutes = () => {
    // const loggedIn = false;

    // const { loggedIn, checkStatus } = UserAuthStatus();
    const { loggedIn } = UserAuthStatus();

    // if (checkStatus) {
        // fixme           
    //     // return <Spinner />
    //     return <h1>Loading...</h1>;
    // }

    return (
        <>
            {loggedIn ? <Outlet /> : <Navigate to={'/login'} />}
        </>
    )
}

export default PrivateRoutes