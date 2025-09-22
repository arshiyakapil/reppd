import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { content } = await req.json();
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  const comment = {
    _id: new ObjectId(),
    content,
    authorId: new ObjectId(session.user.id),
    createdAt: new Date()
  };
  
  await db.collection('posts').updateOne(
    { _id: new ObjectId(params.id) },
    { $push: { comments: comment } }
  );
  
  client.close();
  return NextResponse.json({ success: true, comment });
}
