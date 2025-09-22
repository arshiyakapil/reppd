import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  
  if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 });
  
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  
  const searchRegex = new RegExp(query, 'i');
  
  const [users, posts, communities] = await Promise.all([
    db.collection('users').find({ 
      $or: [{ fullName: searchRegex }, { email: searchRegex }] 
    }, { projection: { password: 0 } }).limit(10).toArray(),
    
    db.collection('posts').find({ 
      content: searchRegex 
    }).limit(10).toArray(),
    
    db.collection('communities').find({ 
      $or: [{ name: searchRegex }, { description: searchRegex }] 
    }).limit(10).toArray()
  ]);
  
  client.close();
  return NextResponse.json({ users, posts, communities });
}
