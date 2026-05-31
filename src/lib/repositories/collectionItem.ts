import { prisma } from "@/lib/prisma";
import { CollectionItem, CollectionItemImage, Category } from "@prisma/client";

export type CollectionItemWithRelations = CollectionItem & {
  images: CollectionItemImage[];
  category: Category;
};

export const CollectionItemRepository = {
  async getAll(): Promise<CollectionItemWithRelations[]> {
    return await prisma.collectionItem.findMany({
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getById(id: string): Promise<CollectionItemWithRelations | null> {
    return await prisma.collectionItem.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
      },
    });
  },

  async create(data: {
    title: string;
    slug: string;
    subtitle?: string;
    description?: string;
    price?: number;
    badge?: string;
    categoryId: string;
    imageUrl?: string;
  }): Promise<CollectionItemWithRelations> {
    const { imageUrl, ...itemData } = data;

    return await prisma.collectionItem.create({
      data: {
        ...itemData,
        images: imageUrl
          ? {
              create: {
                url: imageUrl,
                isCover: true,
                alt: itemData.title,
              },
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      slug?: string;
      subtitle?: string;
      description?: string;
      price?: number;
      badge?: string;
      categoryId?: string;
      imageUrl?: string;
    }
  ): Promise<CollectionItemWithRelations> {
    const { imageUrl, ...itemData } = data;

    if (imageUrl !== undefined) {
      // Delete old images and create a new cover image
      await prisma.collectionItemImage.deleteMany({
        where: { collectionItemId: id },
      });

      return await prisma.collectionItem.update({
        where: { id },
        data: {
          ...itemData,
          images: imageUrl
            ? {
                create: {
                  url: imageUrl,
                  isCover: true,
                  alt: itemData.title || undefined,
                },
              }
            : undefined,
        },
        include: {
          images: true,
          category: true,
        },
      });
    }

    return await prisma.collectionItem.update({
      where: { id },
      data: itemData,
      include: {
        images: true,
        category: true,
      },
    });
  },

  async delete(id: string): Promise<CollectionItem> {
    return await prisma.collectionItem.delete({
      where: { id },
    });
  },
};
