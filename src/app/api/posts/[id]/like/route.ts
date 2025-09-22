import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  const userId = new ObjectId(session.user.id);
  const postId = new ObjectId(params.id);
  
  const post = await db.collection('posts').findOne({ _id: postId });
  const hasLiked = post.likes.some(id => id.toString() === userId.toString());
  
  if (hasLiked) {
    await db.collection('posts').updateOne({ _id: postId }, { $pull: { likes: userId } });
  } else {
    await db.collection('posts').updateOne({ _id: postId }, { $push: { likes: userId } });
  }
  
  client.close();
  return NextResponse.json({ success: true, liked: !hasLiked });
}
