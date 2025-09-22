import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { MongoClient, ObjectId } from 'mongodb';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const data = await req.formData();
    const file = data.get('file') as File;
    
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'reppd/profiles', transformation: { width: 300, height: 300, crop: 'fill' } },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(buffer);
    });
    
    // Update user profile with new image URL
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { profilePicture: result.secure_url, updatedAt: new Date() } }
    );
    
    client.close();
    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
