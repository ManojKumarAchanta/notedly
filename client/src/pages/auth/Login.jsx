import { setCredentials } from "@/app/features/authSlice"
import { useLoginMutation } from "@/app/services/authApi"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { NotebookPenIcon } from "lucide-react"
import LeftSide from "./LeftSide"


function Login({ onSwitchToSignup }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async (e) => {
        // console.log('Login Data:', formData)
        e.preventDefault();
        const { email, password } = formData;
        try {
            const response = await login({ email, password }).unwrap();
            // console.log('Login Response:', response);
            dispatch(setCredentials({ token: response.token, user: response.user }));
            toast.success('Login successful!');
            // Redirect or perform any other action after successful login
            navigate('/'); // Assuming you have a navigate function from react-router-dom
        } catch (err) {
            toast.error('Login failed. Please check your credentials.');
            console.error('Login failed:', err);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-background align-center place-content-center text-foreground">
            {/* Left Side */}
            <LeftSide />
            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome back to Notedly</CardTitle>
                        <CardDescription>
                            Please enter your credentials to login.
                        </CardDescription>
                        <div className="pt-2">
                            <span className="text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                            </span>
                            <Link
                                className="p-0 h-auto font-normal text-sm"
                                to="/auth/signup"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <button
                                            type="button"
                                            className="ml-auto text-sm text-primary hover:underline underline-offset-4 bg-transparent border-none"
                                        >
                                            Forgot your password?
                                        </button>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button type="submit" className="w-full">
                                    {!isLoading ? "Login" : <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                </Button>


                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>


    )
}
export default Login;