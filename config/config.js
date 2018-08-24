const env = process.env.NODE_ENV || 'development';
console.log('env************', env);

if (env === 'development') {
    process.env.PORT = 4400;
    process.env.MONGO = 'mongodb://localhost:27017/VidjotApp';
}