import { NextResponse } from "next/server";
import { CollectionItemRepository } from "@/lib/repositories/collectionItem";
import { CategoryRepository } from "@/lib/repositories/category";
import { z } from "zod";

const ItemUpdateSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character").max(200).optional(),
  slug: z
    .string()
    .min(1, "Slug must be at least 1 character")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only")
    .optional(),
  subtitle: z.string().max(200).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  price: z.number().nonnegative("Price must be a positive number").optional().nullable(),
  badge: z.string().max(50).optional().nullable(),
  categoryId: z.string().min(1, "Category ID cannot be empty").optional(),
  imageUrl: z.string().max(1000).optional().nullable(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;
    const body = await request.json();
    const result = ItemUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existingItem = await CollectionItemRepository.getById(id);
    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (result.data.categoryId) {
      const category = await CategoryRepository.getById(result.data.categoryId);
      if (!category) {
        return NextResponse.json(
          { error: "Target category does not exist" },
          { status: 400 }
        );
      }
    }

    const updateData = {
      ...result.data,
      subtitle: result.data.subtitle === null ? undefined : result.data.subtitle,
      description: result.data.description === null ? undefined : result.data.description,
      price: result.data.price === null ? undefined : result.data.price,
      badge: result.data.badge === null ? undefined : result.data.badge,
      imageUrl: result.data.imageUrl === null ? "" : result.data.imageUrl || undefined,
    };

    const item = await CollectionItemRepository.update(id, updateData);
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("PUT Item Error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;

    const existingItem = await CollectionItemRepository.getById(id);
    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await CollectionItemRepository.delete(id);
    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Item Error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
