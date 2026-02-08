import { NextResponse } from 'next/server';

let globalEvents = [
  { id: 1, title: "ETH to flip BTC in 2024", pool: "500 ETH", type: "Betting", date: "2024-12-31" },
  { id: 2, title: "Super Bowl LIX Winner", pool: "1.2M USDC", type: "Prediction", date: "2025-02-09" },
];

export async function GET() {
  return NextResponse.json(globalEvents);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newEvent = {
    id: Date.now(),
    ...body,
    date: new Date().toISOString().split('T')[0], // Today's date
  };
  
  globalEvents.unshift(newEvent);
  
  return NextResponse.json(newEvent);
}