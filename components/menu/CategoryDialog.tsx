"use client";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/app/action/MenuActions";
import { toast } from "sonner";

export default function CategoryDialog() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>("");

  async function handleCategory() {
    if (!category.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }

    try {
      const result = await createCategory(category);

      if (result.success) {
        toast.success("Category created!", {
          description: result.message,
        });
        setCategory("");
        setOpen(false);
      } else {
        toast.error("Couldn't create category", {
          description: result.message || "Unknown error occurred.",
        });
      }
    } catch (error) {
      console.error("Error while creating the category:", error);
      toast.error("Unexpected error occurred.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
              <Button size={"lg"}
          variant="outline"
          className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-transparent"
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] rounded-xl border border-orange-100 bg-[#fffdfc] shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-800">
            Create New Category
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new category for your menu items.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right text-muted-foreground">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Beverages"
              className="col-span-3 bg-[#fff] border border-orange-200 focus:ring-orange-500 focus:border-orange-500 rounded-md"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCategory}
            disabled={category.trim().length === 0}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
