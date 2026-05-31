import { NextResponse } from "next/server";
import { FaqRepository } from "@/lib/repositories/faq";
import { z } from "zod";

const FaqCreateSchema = z.object({
  question: z.string().min(1, "Question is required").max(500),
  answer: z.string().min(1, "Answer is required").max(2000),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    const faqs = await FaqRepository.getAll();
    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    console.error("GET FAQs Error:", error);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = FaqCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const faq = await FaqRepository.create(result.data as {
      question: string;
      answer: string;
      sortOrder: number;
      isActive: boolean;
    });
    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error("POST FAQ Error:", error);
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
