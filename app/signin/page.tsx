"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Github, Mail, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"


export default function SigninPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {status} = useSession()

    console.log(status)

    useEffect(()=>{
      toast("Kindly Signout to login again")
      if(status === "authenticated"){
        // Redirect to home page if user is authenticated
        redirect("/");
      }
    },[status])


    async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            
          if(email.length == 0 || password.length == 0){
            toast("missing auth details")
            return;
        }

        const res = await signIn("credentials",{
            redirect:true,
            email,
            password,
            callbackUrl:"/"
        })


        } catch (error) {
            console.error("error happend while logging", error)
            toast("error at login",{
                description: `error: ${error}`
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
          <p className="text-gray-600 mt-2">Your favorite orders, delivered fast</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign in to your account to continue ordering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
              onClick={()=>signIn("google")}
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
                Continue with Google
              </Button>

              <Button
              onClick={()=>signIn("github")}
                variant="outline"
                className="w-full h-11 border-gray-200 hover:bg-gray-50 transition-colors bg-transparent"
                type="button"
              >
                <Github className="w-5 h-5 mr-3" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-orange-600 hover:text-orange-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Sign in
              </Button>
            </form>

            {/* Sign up link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Link href="/signup" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            By signing in, you agree to our{" "}
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
