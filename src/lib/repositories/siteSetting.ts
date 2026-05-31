import { prisma } from "@/lib/prisma";
import { SiteSetting } from "@prisma/client";

export const SiteSettingRepository = {
  async getAll(): Promise<SiteSetting[]> {
    return await prisma.siteSetting.findMany({
      orderBy: {
        key: "asc",
      },
    });
  },

  async getByKey(key: string): Promise<SiteSetting | null> {
    return await prisma.siteSetting.findUnique({
      where: { key },
    });
  },

  async upsertMany(
    settings: Array<{ key: string; value: string; description?: string }>
  ): Promise<SiteSetting[]> {
    return await prisma.$transaction(
      settings.map((s) =>
        prisma.siteSetting.upsert({
          where: { key: s.key },
          update: { value: s.value, description: s.description },
          create: { key: s.key, value: s.value, description: s.description },
        })
      )
    );
  },
};
