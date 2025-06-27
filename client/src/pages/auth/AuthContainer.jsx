import { setCredentials } from "@/app/features/authSlice"
import { useLoginMutation, useSignupMutation } from "@/app/services/authApi"
import { Button } from "@/components/ui/button"
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
import { NotebookIcon } from "lucide-react"
import { PenIcon } from "lucide-react"
import { NotebookPenIcon } from "lucide-react"

const LeftSide = () => (
    <div className="flex items-center hidden my-auto md:block justify-center px-10 py-16 text-foreground">
        <h1 className="text-4xl font-semibold flex items-center gap-2 text-primary mb-4">
            Notedly
            <NotebookPenIcon className="w-8 h-8 text-primary" />
        </h1>
        <h2 className="text-3xl font-semibold mb-2">Organize your thoughts.</h2>
        <p className="text-base text-muted-foreground mb-6 leading-relaxed">
            Notedly lets you capture ideas, manage tasks, and reflect freely — all in one place.
            Whether it’s a quick to-do or a rich research note, your content is saved securely and
            accessible anytime, anywhere.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Rich-text editing with tags, colors, and attachments</li>
            <li>Cloud sync across all your devices</li>
            <li>Privacy-first — your notes stay yours</li>
        </ul>
    </div>
);
function Login({ onSwitchToSignup }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const dispatch = useDispatch();
    const [login, { isLoading, error }] = useLoginMutation();

    const handleSubmit = async (e) => {
        console.log('Login Data:', formData)
        e.preventDefault();
        const { email, password } = formData;
        try {
            const response = await login({ email, password }).unwrap();
            console.log('Login Response:', response);
            dispatch(setCredentials({ token: response.token, user: response.user }));
            toast.success('Login successful!');
            // Redirect or perform any other action after successful login
            navigate('/'); // Assuming you have a navigate function from react-router-dom
        } catch (err) {
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
                            <Button
                                variant="link"
                                className="p-0 h-auto font-normal text-sm"
                                onClick={onSwitchToSignup}
                            >
                                Sign Up
                            </Button>
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

function Signup({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [signup, { isLoading, error }] = useSignupMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!")
            return
        }
        const sanitizedData = {
            email: formData.email,
            password: formData.password,
            username: formData.username
        }

        try {
            await signup(sanitizedData).unwrap();
            toast.success('Signup successful! Please login to continue.');
            onSwitchToLogin(); // Switch to login after successful signup
        } catch (err) {
            toast.error('Signup failed. Please try again.');
            // Optionally log the error for debugging
            console.error('Signup failed:', err);
        }
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-background flex item-center text-foreground">
            {/* Left Side */}

            <LeftSide />
            <div className="flex items-center justify-center w-full min-h-screen p-4">
                <Card className="w-full max-w-md ">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome to Notedly</CardTitle>
                        <CardDescription>
                            Create your account to get started.
                        </CardDescription>
                        <div className="pt-2">
                            <span className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                            </span>
                            <Button
                                variant="link"
                                className="p-0 h-auto font-normal text-sm"
                                onClick={onSwitchToLogin}
                            >
                                Login
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="johndoe"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        name="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button onClick={handleSubmit} className="w-full">
                                    {!isLoading ? "Create Account" : <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}

// Main component to switch between Login and Signup
export default function AuthContainer() {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <>
            {isLogin ? (
                <Login onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
                <Signup onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </>
    )
}