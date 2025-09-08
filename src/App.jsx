import React from 'react'
import { Button } from './components/ui/button'
import Todos from './components/Todos'
import Register from './components/Register'
import Login from './components/Login'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import Loder from './loder/Loder'


const App = () => {

  const loading = useGetCurrentUser()

  const { userData } = useSelector((state) => state.user);

  console.log(userData)

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loder/>
      </div>
    )
  }

  return (

    <Routes>
      <Route path="/register" element={!userData ? <Register /> : <Navigate to={"/"} />} />
      <Route path="/login" element={!userData ? <Login /> : <Navigate to={"/"} />} />
      <Route path="/" element={userData ? <Todos /> : <Navigate to={"/login"} />} />
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  )
}

export default App
