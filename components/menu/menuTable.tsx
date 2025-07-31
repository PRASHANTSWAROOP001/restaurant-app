"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Edit, Trash2, DollarSign, Tag, ImageIcon, ChefHat } from "lucide-react"
import { MenuItemDTO } from "@/types/menu"
import { Label } from "@prisma/client"

interface MenuItemTableProps {
  items: MenuItemDTO[]
  onEdit: (item: MenuItemDTO) => void
  onDelete: (id: string) => void
}

const getLabelColor = (label?: Label): string => {
  switch (label) {
    case "SPECIAL":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200"
    case "NEW":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "POPULAR":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200"
    case "BEST_VALUE":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "RECOMMENDED":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "MOST_ORDERED":
      return "bg-pink-100 text-pink-800 hover:bg-pink-200"
    default: {
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  }
}


export function MenuItemTable({ items, onEdit, onDelete }: MenuItemTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
        <p className="text-gray-600">Add your first menu item to get started</p>
      </div>
    )
  }

  return (
    <div className="border border-orange-200 rounded-lg overflow-hidden ">
      <Table>
        <TableHeader>
          <TableRow className="bg-orange-50 border-orange-100">
            <TableHead className="font-semibold text-gray-700">Image</TableHead>
            <TableHead className="font-semibold text-gray-700">Name</TableHead>
            <TableHead className="font-semibold text-gray-700">Category</TableHead>
            <TableHead className="font-semibold text-gray-700">Base Price</TableHead>
            <TableHead className="font-semibold text-gray-700">Sell Price</TableHead>
            <TableHead className="font-semibold text-gray-700">Label</TableHead>
            <TableHead className="font-semibold text-gray-700">Status</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-orange-100 hover:bg-orange-50/50">
              <TableCell>
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="border-orange-200 text-orange-700">
                  {item.category}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {item.basePrice.toFixed(2)}
                </div>
              </TableCell>
              <TableCell className="font-medium text-gray-900">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {item.sellPrice.toFixed(2)}
                </div>
              </TableCell>
              <TableCell>
                {item.label && (
                  <Badge variant="secondary" className={getLabelColor(item.label)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {item.label}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={item.discounted ? "default" : "secondary"}
                  className={
                    item.discounted
                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }
                >
                  {item.discounted ? "Discounted" : "Regular"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{item.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
