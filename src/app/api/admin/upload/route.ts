import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Validate image format
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.' }, { status: 400 });
    }
    
    // Read file binary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Safe write target directory creation
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Unique filename creation
    const originalExtension = path.extname(file.name) || '.jpg';
    const uniqueName = `${crypto.randomUUID()}${originalExtension}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    await fs.writeFile(filePath, buffer);
    
    return NextResponse.json({ url: `/uploads/${uniqueName}` }, { status: 201 });
  } catch (error) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ error: 'Server error during file write' }, { status: 500 });
  }
}
