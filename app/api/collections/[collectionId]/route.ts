import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { connectToDB } from '@/lib/mongoDB';
import Collection from '@/lib/models/Collection';
import Product from '@/lib/models/Product';

export const dynamic = 'force-dynamic';

export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    await connectToDB();

    const collection = await Collection.findById(params.collectionId).populate({
      path: 'products',
      model: Product,
    });

    if (!collection) {
      return new NextResponse('Collection not found', { status: 404 });
    }

    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    console.log('[collectionId_GET]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDB();

    let collection = await Collection.findById(params.collectionId);

    if (!collection) {
      return new NextResponse('Collection not found', { status: 404 });
    }

    const { title, description, media } = await req.json();

    if (!title || !media) {
      return new NextResponse('Title and image are required', {
        status: 400,
      });
    }

    collection = await Collection.findByIdAndUpdate(
      params.collectionId,
      { title, description, media },
      { new: true }
    );

    await collection.save();

    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    console.log('[collectionId_POST]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDB();

    await Collection.findByIdAndDelete(params.collectionId);

    return new NextResponse('Collection is deleted', { status: 200 });
  } catch (err) {
    console.log('[collectionId_DELETE]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
};
