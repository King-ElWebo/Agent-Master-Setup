import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

export const CategoryRepository = {
  async getAll(): Promise<Category[]> {
    return await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  async create(data: { name: string; slug: string; description?: string }): Promise<Category> {
    return await prisma.category.create({
      data,
    });
  },

  async getById(id: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { id },
    });
  },

  async getBySlug(slug: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { slug },
    });
  },

  async update(id: string, data: { name?: string; slug?: string; description?: string }): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Category> {
    return await prisma.category.delete({
      where: { id },
    });
  },
};
