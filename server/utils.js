var dbConfig = require('./db.js');
var mongoose = require('mongoose');
var User = require('./models/User.js')
var Matchup = require('./models/Matchup.js')

mongoose.connect(dbConfig.url);

module.exports = {
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
        var round = 1;
        var level = 1;
        var newMatchup = new Matchup()
        newMatchup.number = 1;
        newMatchup.userID = userID;
        newMatchup.level = level;
        newMatchup.round = round;
        newMatchup.article_1 = "art1";
        newMatchup.article_2 = "art2";
        newMatchup.winner = "N/A";
        newMatchup.save(function(err) {
            if (err)
                throw err;
            return callback(null, newMatchup);
        });
    },
    getUser: function(id, callback) {
        User.findById(id, function(err, user) {
            return callback(err, user);
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
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return callback(null, newUser);
                });
            }
        });

    },
    getRandomArticle: function(user, callback) {
    	return;
    }
}
