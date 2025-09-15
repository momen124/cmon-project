import { NextResponse } from 'next/server';
import { products } from '../../../data/mockData';

export async function GET() {
  return NextResponse.json(products);
}
