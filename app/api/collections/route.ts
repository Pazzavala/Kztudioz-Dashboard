// Import the authentication utility from Clerk's Next.js SDK to handle user authentication
// Import Next.js types for handling HTTP requests and responses
// Import the function to connect to MongoDB from the project's library
// Import the Collection model from the project's models directory
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoDB';
import Collection from '@/lib/models/Collection';

// API route to create a new collection using the Collection model
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

      // Parse the incoming request body to extract title, description, and image
      const { title, description, image } = await req.json();

      // Check if a collection with the same title already exists
      const existingCollection = await Collection.findOne({ title });

      // If a collection with the same title exists, return a 400 Bad Request response
      if (existingCollection) {
         return new NextResponse('Collection already exists', {
            status: 400,
         });
      }

      // Ensure that both title and image are provided, otherwise return a 400 Bad Request response
      if (!title || !image) {
         return new NextResponse('Title and image required', {
            status: 400,
         });
      }

      // Create a new collection document with the provided data
      const newCollection = await Collection.create({
         title,
         description,
         image,
      });

      // Save the newly created collection to the database
      await newCollection.save();

      // Return a JSON response with the new collection data and a 200 OK status
      return NextResponse.json(newCollection, { status: 200 });
   } catch (err) {
      // Log any errors that occur during the process
      console.log('[Collection_POST]', err);
      // Return a 500 Internal Server Error response if something goes wrong
      return new NextResponse('Internal Server Error', { status: 500 });
   }
};

export const GET = async (req: NextRequest) => {
   try {
      await connectToDB();

      const collections = await Collection.find().sort({ createdAt: 'desc' });

      return NextResponse.json(collections, { status: 200 });
   } catch (err) {
      console.log('[collections_GET]', err);
      return new NextResponse('Internal Server Error', { status: 500 });
   }
};

export const dynamic = 'force-dynamic';
