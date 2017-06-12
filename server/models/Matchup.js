var mongoose = require('mongoose');

var MatchupSchema = new mongoose.Schema({
    number: {type: Number, unique: true, index: true},
    userID: {type: String},
    level: {type: Number},
    round: {type: Number},
    article_1: {type: String},
    article_2: {type: String},
    winner: {type: String}
});

module.exports = mongoose.model('Matchup', MatchupSchema);
