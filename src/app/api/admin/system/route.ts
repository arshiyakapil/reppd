import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);
    
    const stats = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('posts').countDocuments(),
      db.collection('communities').countDocuments(),
      db.collection('assignments').countDocuments()
    ]);
    
    const systemStats = {
      totalUsers: stats[0],
      totalPosts: stats[1],
      totalCommunities: stats[2],
      totalAssignments: stats[3],
      uptime: process.uptime(),
      timestamp: new Date()
    };
    
    client.close();
    return NextResponse.json({ stats: systemStats });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
