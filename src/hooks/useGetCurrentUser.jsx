import React, { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '@/redux/user.slice'

const useGetCurrentUser = () => {
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fatchUser = async () => {
            try {
                const res = await axiosInstance.get('/api/user/current-user')
                if (res.data?.user) {
                    dispatch(setUserData(res.data.user))
                }

            } catch (error) {
                console.log("error", error.message)

            } finally {
                setLoading(false)  
            }
        }
        fatchUser()

    }, [dispatch])
    return loading

}

export default useGetCurrentUser
