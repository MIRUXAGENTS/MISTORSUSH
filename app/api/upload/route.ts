import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const token = req.headers.get('Authorization');

    // 1. Authentication Check
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
    if (!ADMIN_TOKEN || token !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. File Size Limit (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // 3. File Type Whitelist
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, and SVG are allowed.' }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Clean filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // 4. Path Traversal Protection
    const safeCategory = category ? category.replace(/[^a-zA-Z0-9]/g, '') : '';
    const uploadDir = safeCategory 
      ? path.join(process.cwd(), 'public', 'img', safeCategory)
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
