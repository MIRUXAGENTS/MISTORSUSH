import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Clean filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Set target directory
    const uploadDir = category 
      ? path.join(process.cwd(), 'public', 'img', category)
      : path.join(process.cwd(), 'public', 'img');

    // Create dir if doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, cleanFileName);
    fs.writeFileSync(filePath, buffer);

    const publicPath = category 
      ? `/img/${category}/${cleanFileName}`
      : `/img/${cleanFileName}`;

    return NextResponse.json({ path: publicPath });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
