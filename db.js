const mongoose = require('mongoose');

const connectToMongo = async () => {
    mongoose.connect('mongodb+srv://pmsoni2016:4525panks@cluster0.dz6kkmh.mongodb.net/?retryWrites=true&w=majority');
}

module.exports = connectToMongo;