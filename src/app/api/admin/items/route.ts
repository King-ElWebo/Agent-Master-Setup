import { NextResponse } from "next/server";
import { CollectionItemRepository } from "@/lib/repositories/collectionItem";
import { CategoryRepository } from "@/lib/repositories/category";
import { z } from "zod";

const ItemCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  subtitle: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().nonnegative("Price must be a positive number").optional().nullable(),
  badge: z.string().max(50).optional(),
  categoryId: z.string().min(1, "Category ID is required"),
  imageUrl: z.string().max(1000).optional(),
});

export async function GET() {
  try {
    const items = await CollectionItemRepository.getAll();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("GET Items Error:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = ItemCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const category = await CategoryRepository.getById(result.data.categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Target category does not exist" },
        { status: 400 }
      );
    }

    const itemData = {
      ...result.data,
      price: result.data.price ?? undefined,
      imageUrl: result.data.imageUrl || undefined,
    };

    const item = await CollectionItemRepository.create(itemData as {
      title: string;
      slug: string;
      subtitle?: string;
      description?: string;
      price?: number;
      badge?: string;
      categoryId: string;
      imageUrl?: string;
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST Item Error:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
