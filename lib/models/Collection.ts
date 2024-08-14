// Importing the mongoose library to work with MongoDB
import mongoose from 'mongoose';

// Defining our Schema - Outline of our model
// The schema defines the structure of documents in the 'Collection' collection in MongoDB
const collectionSchema = new mongoose.Schema({
    // 'title' field is of type String, required, and must be unique
    title: {
        type: String,
        require: true, // This field must have a value (required)
        unique: true, // Ensures that no two documents can have the same 'title'
    },
    // 'description' field is of type String and is optional
    description: String,
    // 'image' field is of type String and is required
    image: {
        type: String,
        require: true, // This field must have a value (required)
    },
    // 'products' is an array of ObjectIds that reference the 'Product' model
    products: [
        {
            type: mongoose.Schema.Types.ObjectId, // Specifies the type as an ObjectId
            ref: 'Product', // References the 'Product' model
        },
    ],
    // 'createdAt' field stores the date and time when the document is created
    createdAt: {
        type: Date, // Specifies the type as Date
        default: Date.now, // Sets the default value to the current date and time
    },
    // 'updatedAt' field stores the date and time when the document is last updated
    updatedAt: {
        type: Date, // Specifies the type as Date
        default: Date.now, // Sets the default value to the current date and time
    },
});

// Exporting the Collection model
// If a model named 'Collection' already exists, we reuse it; otherwise, we create a new model using the 'collectionSchema'
export const Collection =
    mongoose.models.Collection || // Checks if the model already exists
    mongoose.model('Collection', collectionSchema); // Creates a new model if it doesn't exist
