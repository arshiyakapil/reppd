import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  const user = await db.collection('users').findOne(
    { _id: new ObjectId(session.user.id) },
    { projection: { password: 0 } }
  );
  
  client.close();
  return NextResponse.json({ user });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const updates = await req.json();
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  await db.collection('users').updateOne(
    { _id: new ObjectId(session.user.id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  
  client.close();
  return NextResponse.json({ success: true });
}

