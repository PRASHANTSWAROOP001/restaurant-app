import { Label} from "@prisma/client";

export interface MenuItemDTO {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  sellPrice: number;
  imageUrl?: string;
  discounted: boolean;
  label?: Label;
  createdAt: string;
  updatedAt: string;
}

export function transformMenuItem(item: any): MenuItemDTO {
  return {
    id: item.id,
    name: item.name,
    category: item.category.name,
    basePrice: item.basePrice,
    sellPrice: item.sellPrice,
    imageUrl: item.imageUrl ?? undefined,
    discounted: item.discounted,
    label: item.label ?? undefined,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}
