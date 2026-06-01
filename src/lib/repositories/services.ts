import { prisma } from "@/lib/prisma";
import { kv } from "@vercel/kv";
import { servicesFixtures } from "./fixtures";

export type CustomerService = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price?: number;
  category: string;
  active: boolean;
};

export const ServicesRepository = {
  /**
   * Fetches all customer services, dynamically switching storage layers based on active mode.
   * Defensively handles connection drops or missing database tables by returning static fixtures.
   */
  async getAll(): Promise<CustomerService[]> {
    const isHeadless = process.env.ACTIVE_MODE === "HEADLESS_CMS";

    if (isHeadless) {
      try {
        const services = await kv.get<CustomerService[]>("cms:customer-services");
        return services && services.length > 0 ? services : servicesFixtures;
      } catch (error) {
        console.error(
          "HEADLESS_CMS Mode: Vercel KV failed to retrieve customer services. Gracefully falling back to static fixtures.",
          error
        );
        return servicesFixtures;
      }
    }

    // Default to LOCAL_PRISMA
    try {
      // Cast prisma to any to ensure compilation compatibility if model isn't yet migrated in PostgreSQL/schema
      const dbServices = await (prisma as any).customerService.findMany({
        orderBy: {
          title: "asc",
        },
      });

      return dbServices.map((svc: any) => ({
        id: svc.id,
        title: svc.title,
        description: svc.description,
        imageUrl: svc.imageUrl,
        price: svc.price === null ? undefined : svc.price,
        category: svc.category,
        active: svc.active,
      }));
    } catch (error) {
      console.error(
        "LOCAL_PRISMA Mode: Prisma query failed to retrieve customer services. Gracefully falling back to static fixtures.",
        error
      );
      return servicesFixtures;
    }
  },

  /**
   * Saves all customer services, rewriting the storage layer.
   * Implements atomicity via Prisma $transaction or Vercel KV override.
   */
  async saveAll(services: CustomerService[]): Promise<void> {
    const isHeadless = process.env.ACTIVE_MODE === "HEADLESS_CMS";

    if (isHeadless) {
      try {
        await kv.set("cms:customer-services", services);
        console.log("HEADLESS_CMS Mode: Successfully saved customer services to Vercel KV.");
      } catch (error) {
        console.error("HEADLESS_CMS Mode: Vercel KV failed to save customer services.", error);
      }
      return;
    }

    // Default to LOCAL_PRISMA
    try {
      const dataToCreate = services.map((svc) => ({
        id: svc.id,
        title: svc.title,
        description: svc.description,
        imageUrl: svc.imageUrl,
        price: svc.price ?? null,
        category: svc.category,
        active: svc.active,
      }));

      // Atomically wipe the customer services table and rewrite with new dataset
      await prisma.$transaction([
        (prisma as any).customerService.deleteMany(),
        (prisma as any).customerService.createMany({
          data: dataToCreate,
        }),
      ]);
      console.log("LOCAL_PRISMA Mode: Successfully completed customer services database transaction.");
    } catch (error) {
      console.error("LOCAL_PRISMA Mode: Prisma transaction failed to write customer services.", error);
    }
  },
};
