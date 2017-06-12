var mongoose = require('mongoose');

var UserArticleSchema = new mongoose.Schema({
    userID: {type: String},
    article: {type: String}
});

module.exports = mongoose.model('UserArticle', UserArticleSchema);