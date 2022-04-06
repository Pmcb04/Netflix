import mongoose from 'mongoose';

const filmScheme = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    show_id: String,
    type: String,
    title : String,
    director : String,
    cast : String,
    date_added : String,
    release_year : String,
    rating : String,
    duration : String,
    listen_in : String,
    description : String, 
});

export default mongoose.model('Film', filmScheme);
