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
    getArticlesFromMatchup: function(userID, matchup1_num, matchup2_num, callback) {
        Matchup.findOne({ 'userID': userID, 'number': matchup1_num }, function(err, matchup1) {
            if (err) {
                throw err;
            }
            Matchup.findOne({ 'userID': userID, 'number': matchup2_num }, function(err, matchup2) {
                return callback({ 'article_1': matchup1["winner"], 'article_2': matchup2["winner"] });
            });
        })
    },
    addArticle: function(userID, article, callback) {
        let newUserArticle = new UserArticle();
        newUserArticle.userID = userID;
        newUserArticle.article = article;
        newUserArticle.save(function(err) {
            if (err)
                throw err;
            return callback(null, newUserArticle);
        });
    },

    createNewMatchup: function(userID, num, callback) {
        let round = Math.floor(Math.log(num) / Math.log(2)) + 1;
        let highestEffectiveNumInRound = Math.pow(2, round) - 2;
        let level = (Number.isInteger(Math.log(num + 1) / Math.log(2))) ? round : round - 1 - Math.floor(Math.log(highestEffectiveNumInRound - num + 1) / Math.log(2));
        if (level == 1) {
            module.exports.getRandomArticle(userID, function(article_1) {
                module.exports.getRandomArticle(userID, function(article_2) {
                    let newMatchup = new Matchup();
                    newMatchup.number = num;
                    newMatchup.userID = userID;
                    newMatchup.level = level;
                    newMatchup.round = round;
                    newMatchup.article_1 = article_1;
                    newMatchup.article_2 = article_2;
                    newMatchup.winner = "N/A";
                    newMatchup.save(function(err) {
                        if (err)
                            throw err;
                        module.exports.addArticle(userID, article_1, function(res) {
                            module.exports.addArticle(userID, article_2, function(res) {
                                return callback(null, newMatchup);
                            });
                        });
                    });
                });
            });
        } else {
            let previous_level = level - 1;
            let matchup1_num;
            if (num > highestEffectiveNumInRound) {
                matchup1_num = num - 2;
            } else {
                let first_num_in_current_level = highestEffectiveNumInRound - (Math.pow(2, (round - level)) - 1) + 1;
                let first_num_in_previous_level = highestEffectiveNumInRound - (Math.pow(2, (round - previous_level)) - 1) + 1;
                matchup1_num = first_num_in_previous_level + ((num - first_num_in_current_level + 1) * 2) - 1;
            }

            let matchup2_num = matchup1_num + 1
            module.exports.getArticlesFromMatchups(userID, matchup1_num, matchup2_num, function(articles) {
                var newMatchup = new Matchup();
                newMatchup.number = num;
                newMatchup.userID = userID;
                newMatchup.level = level;
                newMatchup.round = round;
                newMatchup.article_1 = articles["article_1"];
                newMatchup.article_2 = articles["article_2"];
                newMatchup.winner = "N/A";
                newMatchup.save(function(err) {
                    if (err)
                        throw err;
                    module.exports.addArticle(userID, articles["article_1"], function(res) {
                        module.exports.addArticle(userID, articles["article_2"], function(res) {
                            return callback(null, newMatchup);
                        });
                    });
                });
            })
        }
    },
    authenticateUser: function(profile, token, callback) {

        User.findOne({ 'userID': profile.id }, function(err, user) {
            if (err)
                return callback(err);
            if (user) {
                return callback(null, user);
            } else {
                //Create new user
                let newUser = new User();
                newUser.userID = profile.id;
                newUser.token = token;
                newUser.first_name = profile.name.givenName;
                newUser.last_name = profile.name.familyName;
                newUser.email = profile.emails[0].value;
                newUser.current_matchup_num = 1;
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    module.exports.createNewMatchup(profile.id, 1, function(matchup) {
                        return callback(null, newUser);
                    });
                });
            }
        });

    }
}
