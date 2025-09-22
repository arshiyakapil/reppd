import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  const assignments = await db.collection('assignments').find({}).sort({ dueDate: 1 }).toArray();
  client.close();
  return NextResponse.json({ assignments });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { title, description, dueDate, subject } = await req.json();
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  const assignment = await db.collection('assignments').insertOne({
    title, description, dueDate: new Date(dueDate), subject,
    creatorId: new ObjectId(session.user.id),
    submissions: [],
    createdAt: new Date()
  });
  
  client.close();
  return NextResponse.json({ success: true, assignmentId: assignment.insertedId });
}
