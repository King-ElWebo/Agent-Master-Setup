import { prisma } from "@/lib/prisma";
import { Faq } from "@prisma/client";

export const FaqRepository = {
  async getAll(): Promise<Faq[]> {
    return await prisma.faq.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });
  },

  async getById(id: string): Promise<Faq | null> {
    return await prisma.faq.findUnique({
      where: { id },
    });
  },

  async create(data: {
    question: string;
    answer: string;
    sortOrder: number;
    isActive: boolean;
  }): Promise<Faq> {
    return await prisma.faq.create({
      data,
    });
  },

  async update(
    id: string,
    data: {
      question?: string;
      answer?: string;
      sortOrder?: number;
      isActive?: boolean;
    }
  ): Promise<Faq> {
    return await prisma.faq.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Faq> {
    return await prisma.faq.delete({
      where: { id },
    });
  },
};
