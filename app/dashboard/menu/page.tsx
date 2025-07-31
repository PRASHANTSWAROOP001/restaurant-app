"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Plus, ChefHat } from "lucide-react"
import { MenuItemForm, type MenuItem, type MenuItemFormData } from "@/components/menu/MenuItemForm"
import { MenuFilters } from "@/components/menu/MenuFilters"
import { MenuItemTable } from "@/components/menu/menuTable"
import axios  from "axios"
import { toast } from "sonner"

const categories = ["All"]

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState<"name" | "price" | "category" | "createdAt">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Form state for new/edit item
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    category: "",
    basePrice: 0,
    sellPrice: 0,
    imageUrl: "",
    discounted: false,
    label: undefined,
  })

  // Get unique categories from menu items
  const availableCategories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(menuItems.map((item) => item.category).filter(Boolean)))
    return ["All", ...uniqueCategories]
  }, [menuItems])

  // Filtered and sorted menu items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case "price":
          aValue = a.sellPrice
          bValue = b.sellPrice
          break
        case "category":
          aValue = a.category
          bValue = b.category
          break
        case "createdAt":
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        default:
          aValue = a.name
          bValue = b.name
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [menuItems, searchTerm, selectedCategory, sortBy, sortOrder])

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      basePrice: 0,
      sellPrice: 0,
      imageUrl: "",
      discounted: false,
      label: undefined,
    })
  }
  // passed as a prop to MenuItemForm to add things to database.

  const handleAddItem = async () => {
    // const newItem: MenuItem = {
    //   ...formData,
    //   id: Date.now().toString(),
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // }

    // console.log("Adding new item:", newItem)
    // setMenuItems([...menuItems, newItem])

    const newItem = {...formData}

    console.log("form data: ", formData)

    try {

      const result = await axios.post("/api/menu", formData)

      if(result.status == 200 || result.status === 201){
        toast.success("Menu item added successfully!", {
          description:`${result.data.message}`,
        })
        resetForm()
        setIsAddSheetOpen(false)
      }
      else{
        toast.error("Failed to add menu item", {
          description: result.data.message || "Something went wrong",
        })
      }
      
    } catch (error) {
      console.error("Error adding menu item:", error)
    }
    
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      basePrice: item.basePrice,
      sellPrice: item.sellPrice,
      imageUrl: item.imageUrl || "",
      discounted: item.discounted,
      label: item.label,
    })
    setIsEditSheetOpen(true)
  }

  const handleUpdateItem = () => {
    if (editingItem) {
      const updatedItem: MenuItem = {
        ...editingItem,
        ...formData,
        updatedAt: new Date().toISOString(),
      }
      setMenuItems(menuItems.map((item) => (item.id === editingItem.id ? updatedItem : item)))
      setIsEditSheetOpen(false)
      setEditingItem(null)
      resetForm()
    }
  }

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-")
    setSortBy(field as typeof sortBy)
    setSortOrder(order as typeof sortOrder)
  }

  const handleCancelAdd = () => {
    resetForm()
    setIsAddSheetOpen(false)
  }

  const handleCancelEdit = () => {
    resetForm()
    setIsEditSheetOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="space-y-8 px-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <p className="text-gray-600 mt-2">Manage your restaurant menu items, prices, and categories</p>
      </div>

      {/* Controls Section */}
      <Card className="border-orange-200 shadow-lg py-0">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 rounded-t-xl py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <ChefHat className="w-5 h-5 text-orange-600" />
                Menu Items
              </CardTitle>
              <CardDescription>Search, filter, and manage your menu</CardDescription>
            </div>
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Add New Menu Item</SheetTitle>
                  <SheetDescription>Create a new item for your menu</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <MenuItemForm
                    formData={formData}
                    onFormDataChange={setFormData}
                    onSubmit={handleAddItem}
                    onCancel={handleCancelAdd}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Search and Filter Controls */}
          <div className="mb-6">
            <MenuFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              categories={availableCategories}
            />
          </div>

          {/* Menu Items Table */}
          <MenuItemTable items={filteredAndSortedItems} onEdit={handleEditItem} onDelete={handleDeleteItem} />
        </CardContent>
      </Card>

      {/* Edit Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Edit Menu Item</SheetTitle>
            <SheetDescription>Make changes to the menu item</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <MenuItemForm
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={handleUpdateItem}
              onCancel={handleCancelEdit}
              isEditing={true}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
