import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  const notes = await db.collection('notes').aggregate([
    { $lookup: { from: 'users', localField: 'uploaderId', foreignField: '_id', as: 'uploader' }},
    { $unwind: '$uploader' },
    { $sort: { createdAt: -1 }}
  ]).toArray();
  
  client.close();
  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { title, subject, fileUrl, description } = await req.json();
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  const note = await db.collection('notes').insertOne({
    title, subject, fileUrl, description,
    uploaderId: new ObjectId(session.user.id),
    downloads: 0,
    createdAt: new Date()
  });
  
  client.close();
  return NextResponse.json({ success: true, noteId: note.insertedId });
}
