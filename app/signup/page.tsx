"use client"
import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button";
export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e:React.FormEvent)=>{

        e.preventDefault();


        try {
            if(email.length === 0 || password.length === 0){
                alert("Please fill all fields");
                return;
            }

            console.log("Submitting form with email:", email, "and password:", password)

            const response  = await axios.post("/api/auth/register", {
                email,  
                password
            });

            console.log("Response:", response.data);

            if(response.data.success){
                alert("User registered successfully");
                setEmail("");
                setPassword("");
            }

        } catch (error) {

            console.error("Registration error:", error);
        }
    }

    return (
        <main className="w-full h-screen">

            <div className="flex items-center justify-center h-full">

                <div className=" p-8 rounded shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                    <form onSubmit={handleSubmit} >
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                            <input type="email" id="email" className="w-full p-2 border rounded" value={email} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setEmail(e.currentTarget.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                            <input type="password" id="password" value={password} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)} className="w-full p-2 border rounded" required />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign Up</button>
                    </form>
                    <Button className="w-full py-2 my-2">Signup Via Google</Button>
                </div>

            </div>

        </main>
    )
}