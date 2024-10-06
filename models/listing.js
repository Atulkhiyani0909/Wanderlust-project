const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true // This is the correct way to make a field required
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        required: true,
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews:[
        {
        type:Schema.Types.ObjectId
        }
    ]
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;