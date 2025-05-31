import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const response = await fetch('http://localhost:8000/cloud-sync/authenticate', {
      method: 'POST',
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
  }
} 