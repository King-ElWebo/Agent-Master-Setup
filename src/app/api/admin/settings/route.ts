import { NextResponse } from "next/server";
import { SiteSettingRepository } from "@/lib/repositories/siteSetting";
import { z } from "zod";

const SettingsUpsertSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string().min(1, "Key is required").max(100),
      value: z.string().max(5000),
      description: z.string().max(500).optional(),
    })
  ),
});

export async function GET() {
  try {
    const settings = await SiteSettingRepository.getAll();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("GET Settings Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = SettingsUpsertSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const validatedSettings = result.data.settings.map((s) => ({
      key: s.key,
      value: s.value,
      description: s.description,
    }));

    const updated = await SiteSettingRepository.upsertMany(validatedSettings);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("POST Settings Error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
