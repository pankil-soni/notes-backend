const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Notes = mongoose.model('notes', noteSchema);
Notes.createIndexes();

module.exports = Notes;