"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, ImageIcon } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import {Label as LabelEnum} from '@prisma/client'
import { MenuItemDTO } from "@/types/menu";

const labels = Object.values(LabelEnum)



export type MenuItemFormData = Omit<MenuItemDTO, "id" | "createdAt" | "updatedAt">;

interface MenuItemFormProps {
  formData: MenuItemFormData;
  onFormDataChange: (data: MenuItemFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}



export function MenuItemForm({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isEditing = false,
}: MenuItemFormProps) {
  
const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(formData.imageUrl || null);
  const [imageUploading, setImageUploading] = useState(false);

  const { isUploading, startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url || res?.[0]?.ufsUrl;
      if (url) {
        setUploadedImage(url);
        onFormDataChange({ ...formData, imageUrl: url });
      }
    },
    onUploadError: (error) => {
      console.error("Upload failed", error);
    },
  });

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPreviewImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const onManualUpload = async () => {
    if (!selectedFile) return;
    setImageUploading(true);
    try {
      await startUpload([selectedFile]);
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setPreviewImage(null);
    setSelectedFile(null);
    onFormDataChange({ ...formData, imageUrl: "" });
  };



  return (
    <div className="space-y-6 px-5 overflow-y-auto max-h-[80vh] ">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Item Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              onFormDataChange({ ...formData, name: e.target.value })
            }
            placeholder="Enter item name"
            className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="text-sm font-medium text-gray-700"
          >
            Category
          </Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) =>
              onFormDataChange({ ...formData, category: e.target.value })
            }
            placeholder="Enter category"
            className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="basePrice"
              className="text-sm font-medium text-gray-700"
            >
              Base Price
            </Label>
            <Input
              id="basePrice"
              type="number"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  basePrice: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="sellPrice"
              className="text-sm font-medium text-gray-700"
            >
              Sell Price
            </Label>
            <Input
              id="sellPrice"
              type="number"
              step="0.01"
              value={formData.sellPrice}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  sellPrice: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

         <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Item Image</Label>
      <div className="space-y-3">
        {uploadedImage || previewImage ? (
          <div className="relative">
            <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200">
              <img
                src={uploadedImage || previewImage || "/placeholder.svg"}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white border-red-200 text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full h-32 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No image uploaded</p>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
          id="image-upload"
        />

        {/* Pick Image Button */}
        <Label htmlFor="image-upload" asChild>
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-transparent"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Image
          </Button>
        </Label>

        {/* Upload Button */}
        <Button
          type="button"
          onClick={onManualUpload}
          disabled={!selectedFile || isUploading || imageUploading}
          className="w-full bg-orange-600 text-white hover:bg-orange-700"
        >
          {imageUploading || isUploading ? "Uploading..." : "Upload Image"}
        </Button>
      </div>
    </div>

  

        <div className="flex items-end justify-between gap-4">
          {/* Left Column: Label Select */}
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="label"
              className="text-sm font-medium text-gray-700"
            >
              Label (Optional)
            </Label>
            <Select
              value={formData.label || "No Label"}
              onValueChange={(value) =>
                onFormDataChange({
                  ...formData,
                  label:
                    value === "No Label" ? undefined : (value as LabelEnum),
                })
              }
            >
              <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Select label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No Label">No Label</SelectItem>
                {labels.map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Right Column: Discount Checkbox */}
          <div className="flex items-end space-x-2 pb-1">
            <Checkbox
              id="discounted"
              checked={formData.discounted}
              onCheckedChange={(checked) =>
                onFormDataChange({
                  ...formData,
                  discounted: checked as boolean,
                })
              }
            />
            <Label
              htmlFor="discounted"
              className="text-sm font-medium text-gray-700"
            >
              Mark as discounted
            </Label>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button
          onClick={onSubmit}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isEditing ? "Update Item" : "Add Item"}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
