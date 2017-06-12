var request = require('request');
var dbConfig = require('./db.js');
var mongoose = require('mongoose');
var User = require('./models/User.js')
var Matchup = require('./models/Matchup.js')
var UserArticle = require('./models/UserArticle.js')

mongoose.connect(dbConfig.url);

module.exports = {
    getUser: function(userID, callback) {
        User.findById(userID, function(err, user) {
            return callback(err, user);
        });
    },
    getRandomArticle: function(userID, callback) {
        request('https://en.wikipedia.org/wiki/Special:Random', function(error, response, body) {
            UserArticle.find({ 'userID': userID, 'article': response.request.uri.href }, function(err, articles) {
                if (err) {
                    throw err;
                }
                if (articles.length > 0) {
                    return module.exports.getRandomArticle(userID, callback);
                }
                return callback(response.request.uri.href);
            });
        });
    },
    addArticle: function(userID, article, callback) {
        var newUserArticle = new UserArticle()
        newUserArticle.userID = userID;
        newUserArticle.article = article;
        newUserArticle.save(function(err) {
            if (err)
                throw err;
            return callback(null, newUserArticle);
        });
    },
    createNewRound: function(num, userID, callback) {
        var round = Math.floor(Math.log(num) / Math.log(2)) + 1;
        var highestEffectiveNumInRound = Math.pow(2, round) - 2;
        var level = (Number.isInteger(Math.log(num + 1) / Math.log(2))) ? round : round - 1 - Math.floor(Math.log(highestEffectiveNumInRound - num + 1) / Math.log(2));
        var newMatchup = new Matchup()
        newMatchup.number = num;
        newMatchup.userID = userID;
        newMatchup.level = level;
        newMatchup.round = round;
        newMatchup.article_1 = x;
        newMatchup.article_2 = x;
        newMatchup.winner = "N/A";
        newMatchup.save(function(err) {
            if (err)
                throw err;
            return callback(null, newMatchup);
        });
    },

    createInitialRound: function(userID, callback) {
        module.exports.getRandomArticle(userID, function(article1) {
            module.exports.getRandomArticle(userID, function(article2) {
                var round = 1;
                var level = 1;
                var newMatchup = new Matchup()
                newMatchup.number = 1;
                newMatchup.userID = userID;
                newMatchup.level = level;
                newMatchup.round = round;
                newMatchup.article_1 = article1;
                newMatchup.article_2 = article2;
                newMatchup.winner = "N/A";
                newMatchup.save(function(err) {
                    if (err)
                        throw err;
                    module.exports.addArticle(userID, article1, function(res) {
                        module.exports.addArticle(userID, article2, function(res) {
                            return callback(null, newMatchup);
                        });
                    });
                });
            });
        });
    },
    authenticateUser: function(profile, token, callback) {

        User.findOne({ 'userID': profile.id }, function(err, user) {
            if (err)
                return callback(err);
            if (user) {
                return callback(null, user);
            } else {

                //Create new user
                var newUser = new User();
                newUser.userID = profile.id;
                newUser.token = token;
                newUser.first_name = profile.name.givenName;
                newUser.last_name = profile.name.familyName;
                newUser.email = profile.emails[0].value;
                newUser.current_matchup_num = 1;
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    module.exports.createInitialRound(profile.id, function(round1) {
                        return callback(null, newUser);
                    });
                });
            }
        });

    }
}
