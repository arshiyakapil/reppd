import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  const announcements = await db.collection('announcements').aggregate([
    { $lookup: { from: 'users', localField: 'authorId', foreignField: '_id', as: 'author' }},
    { $unwind: '$author' },
    { $sort: { priority: -1, createdAt: -1 }}
  ]).toArray();
  
  client.close();
  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { title, content, priority = 1, targetAudience = 'all' } = await req.json();
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  const announcement = await db.collection('announcements').insertOne({
    title, content, priority, targetAudience,
    authorId: new ObjectId(session.user.id),
    createdAt: new Date(),
    views: 0
  });
  
  client.close();
  return NextResponse.json({ success: true, announcementId: announcement.insertedId });
}
