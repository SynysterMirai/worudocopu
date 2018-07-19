'use strict';
var mongoose = require('mongoose');
var TeamInfo = mongoose.model('TeamInfo');
var GameSchedule = mongoose.model('GameSchedule');

//Things
var teamsInfo = mongoose.Schema({
    name: String,
    description: String
});
var Info = mongoose.model('Info', teamsInfo);
//End of things

exports.processRequest = function(req, res) {
if (req.body.result.action == "schedule") {
    //getTeamSchedule(req,res)
    getSimpleResul(res)
  }
  else if (req.body.result.action == "tell.about")
  {
      getTeamInfo(req,res)
      //getSimpleResul(res)
      //exampleRes(req,res)
  }
};

function exampleRes(req,res){
  let keyWord = req.body.result.parameters.teams_name;
  TeamInfo.find({
    name: keyWord
}).exec(function(err, books) {
    if (err)
    {
      return res.json({
          speech: 'Something went wrong!',
          displayText: 'Something went wrong!',
          source: 'team info'
      });
    }
    else {
      console.log(books);
      console.log('El jodido JESON: ' + JSON.stringify(books, undefined, 2));
      var object = JSON.parse(JSON.stringify(books, undefined, 2));

      var calling = function (theObjectParameter) {
       for (var propertyKey in theObjectParameter) {
         return theObjectParameter[propertyKey].description;
            console.log("propertyKey "+propertyKey +
                        " has the Value "+
                        theObjectParameter[propertyKey].name);
       }
    };

    calling(books);
    console.log('El puto pinche perro nombre de mierda: ' + calling(books));

      return res.json({
            speech: calling(books),
            displayText: calling(books),
            source: 'teams info'
      });

    }
    //console.log(books);
});
}

//get simple result
function getSimpleResul(res){
  return res.json({
        speech: 'I dont know why I cant connect to my moongose DB',
        displayText: 'I dont know why I cant connect to my moongose DB',
        source: 'mikes thoughts'
  });
}

//get team info
function getTeamInfo(req,res)
{
let teamToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.teams_name ? req.body.result.parameters.teams_name : 'Unknown';
TeamInfo.findOne({name:teamToSearch},function(err,teamExists)
      {
        if (err)
        {
          return res.json({
              speech: 'Something went wrong!',
              displayText: 'Something went wrong!',
              source: 'team info'
          });
        }
if (teamExists)
        {
          var calling = function (theObjectParameter) {
           for (var propertyKey in theObjectParameter) {
             return theObjectParameter[propertyKey].description;
                console.log("propertyKey "+propertyKey +
                            " has the Value "+
                            theObjectParameter[propertyKey].name);
           }
        };
          return res.json({
                speech: calling(teamExists),
                displayText: calling(teamExists),
                source: 'team info'
            });
        }
        else {
          return res.json({
                speech: 'Currently I am not having information about this team',
                displayText: 'Currently I am not having information about this team',
                source: 'team info'
            });
        }
      });
}

//get game schedule

function getTeamSchedule(req,res)
{
let parameters = req.body.result.parameters;
    if (parameters.teams_name1 == "")
    {
      let game_occurence = parameters.game_occurence;
      let team = parameters.teams_name;
      if (game_occurence == "anterior")
      {
        //previous game
        /***HELlO THERE*/
        GameSchedule.find({opponent:team},function(err,games)
        {
          if (err)
          {
            return res.json({
                speech: 'Something went wrong!',
                displayText: 'Something went wrong!',
                source: 'game schedule'
            });
          }
          if (games)
          {
            var requiredGame;
            for (var i=0; i < games.length; i++)
            {
                var game = games[i];
var convertedCurrentDate = new Date();
                var convertedGameDate = new Date(game.date);
if (convertedGameDate > convertedCurrentDate)
                {
                  if(games.length > 1)
                  {
                    requiredGame = games[i-1];
var winningStatement = "";
                    if (requiredGame.isWinner)
                    {
                        winningStatement = "Real Madrid won this match by "+requiredGame.score;
                    }
                    else {
                      winningStatement = "Real Madrid lost this match by "+requiredGame.score;
                    }
                    return res.json({
                        speech: 'Last game between Real Madrid and '+parameters.teams_name+' was played on '+requiredGame.date+' .'+winningStatement,
                        displayText: 'Last game between Real Madrid and '+parameters.teams_name+' was played on '+requiredGame.date+' .'+winningStatement,
                        source: 'game schedule'
                    });
                    break;
                  }
                  else {
                    return res.json({
                        speech: 'Cant find any previous game played between Real Madrid and '+parameters.teams_name,
                        displayText: 'Cant find any previous game played between Real Madrid and '+parameters.teams_name,
                        source: 'game schedule'
                    });
                  }
                }
            }
}
});
      }
      else {
        return res.json({
            speech: 'Next game schedules will be available soon',
            displayText: 'Next game schedules will be available soon',
            source: 'game schedule'
        });
      }
    }

    //HERE IS WHERE I GOT THE ERROR
    else {
      return res.json({
          speech: 'Cant handle the queries with two teams now. I will update myself',
          displayText: 'Cant handle the queries with two teams now. I will update myself',
          source: 'game schedule'
      });
    }
  }
