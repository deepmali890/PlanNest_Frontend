import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { User, Mail, Lock, Eye, EyeClosed } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'
import { setUserData } from '@/redux/user.slice'
import { useDispatch } from 'react-redux'

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)


    const navigate = useNavigate()
    const dispatch = useDispatch()




    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await axiosInstance.post("/api/auth/login", formData)
            if (res.data?.success) {
                toast.success(res.data?.message || "Login successful!")
                dispatch(setUserData(res.data.user))
                navigate("/")
            } else {
                toast.error(res.data?.message || "Login failed!")
            }
        } catch (error) {
            console.error("Login error:", error)
            toast.error(error.response?.data?.message || "Something went wrong!")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-xl rounded-2xl border-0">
                    <CardHeader className="text-center space-y-2">
                        <img src="/logo.png" alt="logo" className="w-20 h-20 mx-auto" />
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            PlanNest
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Welcome back! Sign in to continue your planning ✨
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail size={16} /> Email Address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="focus:outline-none focus:ring-0 focus-visible:ring-0"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2 relative">
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock size={16} /> Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="focus:outline-none focus:ring-0 focus-visible:ring-0 pr-10"
                                />

                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 cursor-pointer text-gray-600"
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                                </span>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#113d6a] hover:bg-[#112c6a] cursor-pointer text-white rounded-xl shadow-md"
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </Button>
                        </form>

                        {/* Signup Link */}
                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Don’t have an account?{" "}
                            <Link
                                to="/register"
                                className="text-[#113d6a] hover:underline font-medium"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default Login
