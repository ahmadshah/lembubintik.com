var path = require('path'),
    config = module.exports;

config.env = 'local';
config.port = process.env.PORT || 3000;
config.view = {
    engine: 'jade',
    directory: path.join(__dirname, '../views'),
    static: path.join(__dirname, '../assets')
};
config.blog = {
    contentDirectory: path.join(__dirname, '../_contents')
}
config.routes = [
    './routes/blog'
];
