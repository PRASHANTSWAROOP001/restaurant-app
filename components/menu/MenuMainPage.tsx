"use client";

import { ChefHat } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { getMenuItems } from "@/app/action/MenuActions";
type CategoryDto = {
  id: string;
  name: string;
};

export default function MenuMainClientPage({
  categoryDto,
  intialData,
  intialPages,
}: {
  categoryDto: CategoryDto[];
  intialData: MenuItemDTO[];
  intialPages: number;
}) {
  const [items, setItems] = useState<MenuItemDTO[]>(intialData || []);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItemDTO | null>(null);
  const [totalPages, setTotalPages] = useState<number>(intialPages);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getMenuItems({page:currentPage, limit:5,search:""})

        setItems(res.data || []);
        setTotalPages(res.totalPage || 1)
      } catch (error) {
        console.error("Error fetching paginated data", error);
      }
    }

    fetchData();
  }, [currentPage]);

  function onEdit(item: MenuItemDTO) {
    setEditingItem(item);
    setIsOpen(true);
  }

  async function onDelete(id: string) {
    try {
      const result = await axios.delete(`/api/menu/delete/${id}`);

      if (result.data?.success) {
        toast.success("Data deleted successfully");
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error("Error while deleting menu", {
          description: `${result.data.message} || unknown error`,
        });
      }
    } catch (error) {
      console.error("Error while deleting menu item", error);
    }
  }

  async function onSubmit(updatedData: MenuItemFormData) {
    if (editingItem) {
      try {
        const editResponse = await axios.put("/api/menu", {
          id: editingItem.id,
          ...updatedData,
        });

        if (editResponse.data?.success) {
          toast.success("Data updated successfully", {
            description: `${editResponse.data.message || "Success message"}`,
          });
          setItems((prev) =>
            prev.map((item) => (item.id === editingItem.id ? { ...item, ...updatedData } : item))
          );
        }
      } catch (error) {
        console.error("Error while updating menu item", error);
      }
    } else {
      try {
        const result = await axios.post("/api/menu/", updatedData);

        if (result.status === 200 || result.status === 201) {
          toast.success("Data added successfully");
          setCurrentPage(1); // reset to first page on new item creation
        } else {
          toast.error("Error while adding new menu item", {
            description: `${result.data?.message || "Unknown error"}`,
          });
        }
      } catch (error) {
        console.error("Error happened while adding new data", error);
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

          { totalPages> 1 && (
                      <Pagination className="py-2">
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
          )}

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
