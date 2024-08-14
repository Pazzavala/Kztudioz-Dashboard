import { Product } from '@/lib/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        // Authenticate the user and retrieve the userId
        const { userId } = auth();

        // If there is no authenticated user, return a 403 Unauthorized response
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        // Connect to the MongoDB database
        await connectToDB();

        // Parse the incoming request body to extract title, description, and media, ...
        const {
            title,
            description,
            media,
            category,
            collection,
            tags,
            sizes,
            colors,
            price,
            expense,
        } = await req.json();

        // Check if a collection with the same title already exists

        // If a collection with the same title exists, return a 400 Bad Request response

        // Ensure that both title and image are provided, otherwise return a 400 Bad Request response
        if (
            !title ||
            !description ||
            !media ||
            !category ||
            !price ||
            !expense
        ) {
            return new NextResponse('Not Enough data to create product', {
                status: 400,
            });
        }

        // Create a new collection document with the provided data with schema
        const newProduct = await Product.create({
            title,
            description,
            media,
            category,
            collection,
            tags,
            sizes,
            colors,
            price,
            expense,
        });

        // Save the newly created collection to the database
        await newProduct.save();

        // Return a JSON response with the new collection data and a 200 OK status
        return NextResponse.json(newProduct, { status: 200 });
    } catch (err) {
        // Log any errors that occur during the process
        console.log('[products_POST]', err);
        // Return a 500 Internal Server Error response if something goes wrong
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
    } catch (err) {
        console.log('[collections_GET]', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export const dynamic = 'force-dynamic';
