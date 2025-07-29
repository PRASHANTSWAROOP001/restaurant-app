"use client"

import type React from "react"

import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Edit, Trash2, Users, Mail, Calendar } from "lucide-react"

import {staffOnboardingAction} from "@/app/action/staffOnboarding"


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

import type {StaffProfile} from '../../../types/prismaTypes'

export default function StaffDashboard() {

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [role, setRole] = useState<string>("Cashier")


    async function handleSubmitForm(e:FormEvent){
      e.preventDefault()
        if(name.length == 0 || email.length == 0 || password.length == 0){

            toast("kindly feel all the data")
            return;

        }

        try {
            const newForm = new FormData;
            newForm.append("name", name)
            newForm.append("email", email)
            newForm.append("password", password)
            newForm.append("position", role)

            const result = await staffOnboardingAction(newForm)

            if(result.success){
                toast("data saved successfully", {
                    description:`${result.message}`
                })
            }else{
                toast("error happened", {
                    description:`${result.message}`
                })
            }

        } catch (error) {
            console.error("error happened while staff onboarding", error)
        }
    }


    return(
        <main className="w-full h-screen px-5">
           <div className="py-10">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-600 mt-2">Add new team members and manage existing staff</p>
      </div>

      {/* Add New Staff Form */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <UserPlus className="w-5 h-5 text-orange-600" />
            Add New Staff Member
          </CardTitle>
          <CardDescription>Enter the details for the new team member</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setName(e.target.value)}
                  className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
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
                  placeholder="Create password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role
                </Label>
                <select
                  id="role"
                  defaultValue={"Cashier"}
                  onChange={(e)=>setRole(e.target.value)}
                  className="h-11 w-full border border-gray-200 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="Server">Server</option>
                  <option value="Chef">Chef</option>
                  <option value="Manager">Manager</option>
                  <option value="Cashier">Cashier</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors h-11 px-8"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </form>
        </CardContent>
      </Card>
        </main>
    )
}