"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { MenuItemFormData, MenuItemForm } from "./MenuItemForm"
import { useState, useEffect } from "react"

type Props = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onSubmit: (data: MenuItemFormData) => void
  initialData?: MenuItemFormData
  categories: {
    id:string,
    name:string,
  }[]
}

export default function MenuItemFormSheet({
  isOpen,
  setIsOpen,
  onSubmit,
  initialData,
  categories,
}: Props) {
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    category: "",
    categoryId:"",
    basePrice: 0,
    sellPrice: 0,
    discounted: false,
    imageUrl: "",
    label: undefined,
  })

useEffect(() => {
  if (isOpen) {
    if (initialData) {
      setFormData(initialData)
    } else {
      reset()
    }
  }
}, [isOpen, initialData])


  const handleCancel = () => {
    reset()
    setIsOpen(false)
    
  }

  function reset(){
    setFormData({
    name: "",
    category: "",
    categoryId:"",
    basePrice: 0,
    sellPrice: 0,
    discounted: false,
    imageUrl: "",
    label: undefined,
  })
  }

  const handleSubmit = () => {
    onSubmit(formData)
    setIsOpen(false)
    reset()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{initialData ? "Edit Menu Item" : "Add Menu Item"}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <MenuItemForm
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={!!initialData}
            categories={categories}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
