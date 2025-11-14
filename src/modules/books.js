import mongoose from "mongoose";


const booksSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    author: {
        type: String, 
        required: true
    },
    year: {
        type: String, 
        required: true
    },
    gender: {
        type: String, 
        required: true
    },
    stock: {
        type: Number, 
        required: true
    },
});    

export default mongoose.model("Book", booksSchema);