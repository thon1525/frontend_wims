import { useEffect, useState } from 'react'
// import { getAuth, onAuthStateChanged } from 'firebase/auth'

const UserAuthStatus = () => {

    // fixme - reverse back to false
    const [loggedIn, setLoggedIn] = useState(true)
    const [checkStatus, setCheckStatus] = useState(true)

    // fixme - use local storage before firebase
    // useEffect(() => {
    //     const auth = getAuth()
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             setLoggedIn(true)
    //         }
    //         setCheckStatus(false)
    //     })

    // }, [])

    return { loggedIn, checkStatus }
}

export default UserAuthStatus