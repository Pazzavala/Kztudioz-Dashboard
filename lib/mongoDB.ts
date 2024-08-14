// Importing mongoose library for connecting to and interacting with MongoDB
import mongoose from 'mongoose';

let isConnected: boolean = false; // A flag to track if MongoDB is already connected

// Asynchronous function to connect to the MongoDB database
export const connectToDB = async (): Promise<void> => {
    // Setting Mongoose option to enforce strict querying, which prevents the use of fields not defined in the schema
    mongoose.set('strictQuery', true);

    // If already connected, log a message and exit the function
    if (isConnected) {
        console.log('MongoDB is already connected.');
        return;
    }

    try {
        // Attempt to connect to MongoDB using the connection string from environment variables
        await mongoose.connect(process.env.MONGODB_URL || '', {
            dbName: 'Kztudioz_Admin', // Specifies the name of the database to connect to
        });

        // If the connection is successful, set isConnected to true
        isConnected = true;
        console.log('MongoDB is connected.'); // Log a success message
    } catch (err) {
        // If an error occurs during connection, log the error
        console.log(err);
    }
};
