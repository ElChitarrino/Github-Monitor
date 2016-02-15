var express = require('express');
var app = express();

app.all("/api/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
});

console.log("1");
var mongojs = require('mongojs');
var db = mongojs('dbSchema', ['dbSchema']);
var collection = null;
console.log("1");
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());
console.log("1");
app.get('/api/database', function(req, res){
	db.dbSchema.find(function(err, docs){
		console.log(docs);
			res.json(docs);
	});

});
console.log("1");


app.listen(8000);
console.log("Server running on port 8000");
// var dbSchema = new mongoose.Schema({
//   members: [{
//   	name: String,
//   	contributions: Number
//   }],
//   repositories: [{ 
//   	projectID : String,
// 	projectName : String,
// 	projectOwner : String,
// 	currentMeasure : String,
// 	commitActivity : {
// 		commits : [{
// 			date : Date
// 		}],
// 		lastUpdate : Date
// 	},
// 	starActivity : {
// 		stars : [{
// 			date : Date
// 		}],
// 		lastUpdate : Date,
// 		page : Number
// 	},
// 	contributorActivity : {
// 		contributors : [{
// 			name : String,
// 			contributions : Number,
// 			isMember : Boolean
// 		}],
// 		lastUpdate : Date,
// 		page : Number
// 	},
// 	forkActivity : {
// 		forks : [{
// 			date: Date
// 		}],
// 		lastUpdate : Date,
// 		page : Number
// 	},
// 	releaseActivity : {
// 		releases : [{
// 			name : String,
// 			date : Date,
// 			downloads : Number
// 		}],
// 		lastUpdate : Date
// 	},
// 	pullActivity : {
// 		pulls : [{
// 			dateCreated : Date,
// 			dateClosed : Date
// 		}],
// 			// "pullsYearsCreated" : [],// "pullsMonthsCreated" : [],// "pullsWeeksCreated" : [],// "pullsDaysCreated" : [],// "pullsYearsClosed" : [],// "pullsMonthsClosed" : [],
// 			// "pullsWeeksClosed" : [],// "pullsDaysClosed" : [],// "years" : [],// "months" : [],// "weeks" : [],// "days" : [],
// 		lastUpdate : Date,
// 		page : Number
// 	},
// 	issueActivity : {
// 			//Pie Chart to display respective open and closed issues of the week, month, year or overall
// 		issues : [{
// 			dateCreate : Date, 
// 			dateClosed : Date
// 		}],
// 			// "issuesYearsCreated" : [],// "issuesMonthsCreated" : [],// "issuesWeeksCreated" : [],// "issuesDaysCreated" : [],// "issuesYearsClosed" : [],// "issuesMonthsClosed" : [],
// 			// "issuesWeeksClosed" : [],// "issuesDaysClosed" : [],// "years" : [],// "months" : [],// "weeks" : [],// "days" : [],
// 		lastUpdate : Date,
// 		page : Number
// 	}
//   }]
// });

// var Model = mongoose.model('model', dbSchema);
// var repo1 = new Model({
// 	projectID : 'repo0',
// 	projectName : 'openui5',
// 	projectOwner: 'SAP',
// 	currentMeasure : 'commits'
// });

// repo1.save(function(err){
// 	if(err){console.log(err);}
// });