import mongoose from 'mongoose';

const filmScheme = new mongoose.Schema({
    show_id: {
        type: String,
        index: true
    },
    type: String,
    title : String,
    director: String,
    country: String,
    date_added: String,
    release_year: String,
    rating: String,
    duration: String,
    listen_in: String,
    description: String
});

export default mongoose.model('Film', filmScheme);
