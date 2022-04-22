import mongoose from 'mongoose';

const filmScheme = new mongoose.Schema({
    show_id: {
        type: String,
        index: true
    },
    type: String,
    title : String
});

export default mongoose.model('Film', filmScheme);
