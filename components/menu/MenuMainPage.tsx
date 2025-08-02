"use client";

import { ChefHat } from "lucide-react";
import { useState } from "react";
import { MenuItemDTO } from "@/types/menu";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CategoryDialog from "@/components/menu/CategoryDialog";
import MenuItemFormSheet from "./FormComponents";
import { MenuItemTable } from "./MenuTable"; // ← Import your table component
import { MenuItemFormData } from "./MenuItemForm";
import { toast } from "sonner";

type CategoryDto = {
  id: string;
  name: string;
};

export default function MenuMainClientPage({
  categoryDto,
  intialData,
}: {
  categoryDto: CategoryDto[];
  intialData: MenuItemDTO[];
}) {
  const [items, setItems] = useState<MenuItemDTO[]>(intialData || []);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItemDTO | null>(null);

  function onEdit(item: MenuItemDTO) {
    setEditingItem(item)
    setIsOpen(true);
  }

  async function onDelete(id: string) {
    try {
      
      const result = await axios.delete(`/api/menu/delete/${id}`)

      if(result.data?.success){
        toast.success("data deleted successfully")
      }
      else{
        toast.error("error while deleting menu", {
          description:`${result.data.message} || unknown error`
        })
      }
    } catch (error) {
      console.error("error while deleting menu item", error)
    }
  }

async function onSubmit(updatedData: MenuItemFormData) {
  if (editingItem) {
    try {
      const editResponse = await axios.put("/api/menu",{
      id:editingItem.id,
      name:updatedData.name,
      categoryId:updatedData.categoryId,
      imageUrl:updatedData.imageUrl,
      label:updatedData.label,
      discounted:updatedData.discounted,
      sellPrice:updatedData.sellPrice,
      basePrice:updatedData.basePrice
      })
      

      if(editResponse.data?.success){
        toast.success("data updated successfully", {
          description:  `${editResponse.data.message || "success message"}`
        })
      }

    } catch (error) {

      console.error("error while updating menu item",error)
      
    }

  } else {
    console.log("trying to save data.")
    try {

      const result = await axios.post("/api/menu/", {
      name:updatedData.name,
      categoryId:updatedData.categoryId,
      imageUrl:updatedData.imageUrl,
      label:updatedData.label,
      discounted:updatedData.discounted,
      sellPrice:updatedData.sellPrice,
      basePrice:updatedData.basePrice
      })

      console.log(result)

      if (result.status == 200 || result.status == 201){
        toast.success("data added successfully")
      }
      else{
        toast.error("error while adding new menu item", {
          description:`${result.data?.message || "unknown error"}`
        })
      }
      
    } catch (error) {
      console.error("error happend while adding new data", error)
    }

 
  }

  setIsOpen(false);
  setEditingItem(null);
}




  return (
    <div className="px-6 py-6">
      <Card className="border-orange-200 shadow-lg py-0 ">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 py-4 rounded-t-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <ChefHat className="w-5 h-5 text-orange-600" />
                Menu Items
              </CardTitle>
              <CardDescription>
                Search, filter, and manage your menu
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <CategoryDialog />
              <button
                onClick={() => {
                  setEditingItem(null); // Reset edit
                  setIsOpen(true);
                }}
                className="text-white bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
              >
                + Add Menu Item
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <MenuItemTable items={items} onEdit={onEdit} onDelete={onDelete} />
        </CardContent>

        <CardFooter>
          <h1>Pagination</h1>
        </CardFooter>
      </Card>

      {/* Add/Edit Form Sheet */}
      <MenuItemFormSheet
        onSubmit={onSubmit}
        categories={categoryDto}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        initialData={editingItem ?? undefined}
      />
    </div>
  );
}
