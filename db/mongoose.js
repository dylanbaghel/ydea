const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO, { useNewUrlParser: true }).then(() => console.log('Mongo Connected')).catch((e) => console.log('mongo err', e));

module.exports = { mongoose };