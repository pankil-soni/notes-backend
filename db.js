const mongoose = require('mongoose');

const connectToMongo = async () => {
    mongoose.connect('mongodb://127.0.0.1:27017/EverFloatNotes');
}

module.exports = connectToMongo;