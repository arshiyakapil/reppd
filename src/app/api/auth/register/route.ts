import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, regNumber } = await req.json();
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);
    
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      client.close();
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.collection('users').insertOne({
      email, password: hashedPassword, fullName, regNumber,
      verified: false, createdAt: new Date(), role: 'student'
    });
    
    client.close();
    return NextResponse.json({ success: true, userId: user.insertedId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

