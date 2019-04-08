var reviewWordCount; // total word count of the review

var sentimentScore; // sentiment score from python
var sentimentWordCount; // how many sentiment-related words are in the review
var sentimentPercent; // percentage of sentiment words vs total words in the review

var actionableScore; // actionable score from python
var actionableWordCount // how many actionable-related words are in the review
var actionablePercent; // percentage of actionable words vs total words in the review

var rudeScore; // rude word score from python
var rudeWordCount; // how many rude words are in the review
var rudePercent; // percentage of rude words vs total words in the review

function questionClicked() // Function for when the question is clicked. This function should take all the stats from all reviews under the question and combine them
{
var questionWordCount; // total word count of all the reviews under the question

var questionSentimentScore; // sentiment score average of all the reviews
var questionSentimentWordCount; // total sentiment words in all the reviews
var questionSentimentPercent; // percentage of sentiment words vs total words

var questionActionableScore; // actionable score average of all the reviews
var questionActionableWordCount // how many actionable-related words are in all the reviews
var questionActionablePercent; // percentage of actionable words vs total words

var questionRudeScore; // rude word score average from all the reviews
var questionRudeWordCount; // how many rude words are in all the reviews
var questionRudePercent; // percentage of rude words vs total words

	function questionCalculations()
	{
		// here, calculations for all the above variables should occur
	}
}

function reviewClicked() // function for when a specific review is clicked
{
	// here, the variables are populated with information from the database that was passed on
	reviewWordCount = ; 
	sentimentScore = ;
	sentimentWordCount = ;
	actionableScore = ;
	actionableWordCount = ;
	rudeScore = ;
	rudeWordCount = ;


	// the 3 functions for the divs are called, where percentages are calculated and labels/text is set
	sentimentCalculations();
	actionableCalculations();
	rudeCalculations();
}


function sentimentCalculations()
{
	sentimentPercent = (sentimentWordCount / reviewWordCount) * 100;

	// next code would be here, to set values of labels in the sentiment Div to fit the variables/calculations we have here.

}

function actionableCalculations()
{
	actionablePercent = (actionableWordCount / reviewWordCount) * 100;

	// next code would be here, to set values of labels in the actionable Div to fit the variables/calculations we have here.

}

function rudeCalculations()
{
	rudePercent = (rudeWordCount / reviewWordCount) * 100;

	// next code would be here, to set values of labels in the rude word Div to fit the variables/calculations we have here.

}