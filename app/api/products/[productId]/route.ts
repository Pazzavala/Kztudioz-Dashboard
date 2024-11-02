import { NextRequest, NextResponse } from 'next/server';
import Collection from '@/lib/models/Collection';
import Product from '@/lib/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export const GET = async (
   req: NextRequest,
   { params }: { params: { productId: string } }
) => {
   try {
      await connectToDB();

      const product = await Product.findById(params.productId).populate({
         path: 'collections',
         model: Collection,
      });

      if (!product) {
         return new NextResponse(JSON.stringify({ message: 'Product not found' }), {
            status: 404,
         });
      }
      return new NextResponse(JSON.stringify(product), {
         status: 200,
         headers: {
            'Access-Control-Allow-Origin': `${process.env.NEXT_PUBLIC_API_STORE_URL}`,
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
         },
      });
   } catch (err) {
      console.log('[productId_GET]', err);
      return new NextResponse('Internal error', { status: 500 });
   }
};

export const POST = async (
   req: NextRequest,
   { params }: { params: { productId: string } }
) => {
   try {
      const { userId } = auth();

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 });
      }

      await connectToDB();

      const product = await Product.findById(params.productId);

      if (!product) {
         return new NextResponse('Product not found', { status: 404 });
      }

      const { title, description, media, collections, tags, price, expense } =
         await req.json();

      if (!title || !description || !media || !price || !expense) {
         return new NextResponse('Not enough data to create a new product', {
            status: 400,
         });
      }

      // Convert existing collections to strings for comparison
      const existingCollectionIds = product.collections.map((id: any) =>
         id.toString()
      );

      const newCollectionIds = collections.map((id: any) => id.toString());

      const addedCollections = newCollectionIds.filter(
         (collectionId: any) => !existingCollectionIds.includes(collectionId)
      );

      const removedCollections = existingCollectionIds.filter(
         (collectionId: any) => !newCollectionIds.includes(collectionId)
      );

      // Update collections
      await Promise.all([
         // Update added collections with this product
         ...addedCollections.map((collectionId: string) =>
            Collection.findByIdAndUpdate(collectionId, {
               $push: { products: product._id },
            })
         ),

         // Update removed collections without this product
         ...removedCollections.map((collectionId: string) =>
            Collection.findByIdAndUpdate(collectionId, {
               $pull: { products: product._id },
            })
         ),
      ]);

      // Update product
      const updatedProduct = await Product.findByIdAndUpdate(
         product._id,
         {
            title,
            description,
            media,
            collections: newCollectionIds, // Use the string versions of IDs
            tags,
            price,
            expense,
         },
         { new: true }
      ).populate({ path: 'collections', model: Collection });

      await updatedProduct.save();

      return NextResponse.json(updatedProduct, { status: 200 });
   } catch (err) {
      console.log('[productId_POST]', err);
      return new NextResponse('Internal error', { status: 500 });
   }
};

export const DELETE = async (
   req: NextRequest,
   { params }: { params: { productId: string } }
) => {
   try {
      const { userId } = auth();

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 });
      }

      await connectToDB();

      const product = await Product.findById(params.productId);

      if (!product) {
         return new NextResponse(JSON.stringify({ message: 'Product not found' }), {
            status: 404,
         });
      }

      await Product.findByIdAndDelete(product._id);

      // Update collections
      await Promise.all(
         product.collections.map((collectionId: string) =>
            Collection.findByIdAndUpdate(collectionId, {
               $pull: { products: product._id },
            })
         )
      );

      return new NextResponse(JSON.stringify({ message: 'Product deleted' }), {
         status: 200,
      });
   } catch (err) {
      console.log('[productId_DELETE]', err);
      return new NextResponse('Internal error', { status: 500 });
   }
};
