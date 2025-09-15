import { NextResponse } from 'next/server';
import { categories } from '../../../data/mockData';

export async function GET() {
  return NextResponse.json(categories);
}
