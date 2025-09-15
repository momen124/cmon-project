import { NextResponse } from 'next/server';
import { products } from '../../../../data/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const product = products.find((p) => p.id === id);

  if (product) {
    return NextResponse.json(product);
  } else {
    return new NextResponse('Product not found', { status: 404 });
  }
}
