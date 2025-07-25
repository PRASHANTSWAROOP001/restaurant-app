'use client'
import React, { useState, useRef, FormEvent, useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import  { useRouter } from "next/router"

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const {status} = useSession()

    const confirmPasswordRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{

      if(status ==="authenticated"
      ){
        redirect("/")
      }
      
    },[status])

    const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        try {
            
            if(email.length == 0 || password.length == 0){
                toast("missing data for signup")
                return;
            }

            const confirmPasswordVal = confirmPasswordRef.current?.value

            if(confirmPasswordVal != password){
                toast("Password mismatch",{
                    description: `password: ${password}, confirmPassword: ${confirmPasswordVal}`
                })
                return;
            }

            const res = await axios.post("/api/auth/register",{
                email,
                password,
                name,
            })

            if(res.status == 200 || res.status == 201){
                toast("you are registered successfully")
                router.push("/signin")
            }

        } catch (error) {

            console.error("error happend while signin up", error)
            toast("error",{
                description:`error: ${error}`
            })
            
        }
    } 
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* App Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">OrderEase</h1>
          <p className="text-gray-600 mt-2">Start ordering your favorites today</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Create your account</CardTitle>
            <CardDescription className="text-center text-gray-600">Join thousands of happy customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Signup Buttons - At the top as requested */}
            <div className="space-y-3">
             <Link href='/signin'>
              <Button
                variant="outline"
                className="w-full h-11 border-gray-200 hover:bg-gray-50 transition-colors bg-transparent"
                type="button"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>
             </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or sign up with email</span>
              </div>
            </div>

            {/* Email/Password Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                value={email}
                onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>)=>(setPassword(e.target.value))}
                  placeholder="Create a password"
                  className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  ref={confirmPasswordRef}
                  placeholder="Confirm your password"
                  className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                Create account
              </Button>
            </form>

            {/* Login link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/sign" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-orange-600 hover:text-orange-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-orange-600 hover:text-orange-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
