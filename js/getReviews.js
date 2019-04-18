//when we retrieve accounts, we'll put them here
//so that we can reference them later for admins
//that may want to edit accounts
var currentReview = null;

// get favorites from local storage
if(JSON.parse(localStorage.getItem("favs")) == null){
	var favs = [];
}
else{
	var favs = JSON.parse(localStorage.getItem("favs"));
}


var reviewsArray;

var review;
var reviewWordCount; // total word count of the review

var sentimentScore; // sentiment score from python
var sentimentWordCount; // how many sentiment-related words are in the review
var sentimentPercent; // percentage of sentiment words vs total words in the review

var actionableScore; // actionable score from python
var actionableWordCount // how many actionable-related words are in the review
var actionablePercent; // percentage of actionable words vs total words in the review

var rudeScore; // rude word score from python
var negativeWordCount; // how many rude words are in the review
var rudePercent; // percentage of rude words vs total words in the review

var positiveWordCount;
//this function grabs accounts and loads our account window
function LoadReviews(sort = null) {
	var webMethod = "AccountServices.asmx/GetReviews";
	var types = [];
	$.ajax({
		type: "POST",
		url: webMethod,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (msg) {
			if (msg.d.length > 0) {
				//let's put our accounts that we get from the
				//server into our accountsArray variable
				//so we can use them in other functions as well
				reviewsArray = msg.d;

				for(var obj in reviewsArray){
					reviewsArray[obj].sentimentScore = +reviewsArray[obj].sentimentScore
					reviewsArray[obj].actionableScore = +reviewsArray[obj].actionableScore
				}

				document.getElementById('myUL').innerHTML = `
					<li><span class="caret caret-down" id="FavParentId" onclick="thing(this.id)">Favorites</span>
      					<ul class="nested active" id="FavoritesId">
        					<li> <div class="sentiment square" style="border-radius:3px; background-color:transparent;font-size:14pt ">S</div> <div class="action square" style="border-radius:3px; background-color:transparent;font-size:14pt ">A</div></li>
      					</ul>
    				</li>`

				if(sort=="sDesc"){
					reviewsArray.sort((b, a) => parseFloat(a.sentimentScore) - parseFloat(b.sentimentScore));

				}
				if(sort=="sAsc"){
					reviewsArray.sort((a, b) => parseFloat(a.sentimentScore) - parseFloat(b.sentimentScore));
				}
				if(sort=="aDesc"){
					reviewsArray.sort((b, a) => parseFloat(a.actionableScore) - parseFloat(b.actionableScore));
				}
				if(sort=="aAsc"){
					reviewsArray.sort((a, b) => parseFloat(a.actionableScore) - parseFloat(b.actionableScore));
				}
				//this clears out the div that will hold our account info



				// Add reports
				for(var obj in reviewsArray){
					if(types.includes(reviewsArray[obj].qType)){
						document.getElementById(reviewsArray[obj].qType).innerHTML += `
							
                                <li onclick="reviewClicked(${obj})";>    <div id = "${reviewsArray[obj].id}Sentiment" class="sentiment square" style="border-radius:3px"></div> <div id="${reviewsArray[obj].id}Action" class="action square" style="border-radius:3px"></div> Report ${reviewsArray[obj].id}            </li> 
                            `
					}
					else{
						types.push(reviewsArray[obj].qType)
                        document.getElementById('myUL').innerHTML +=
                            `<li><span class="caret" id="${reviewsArray[obj].qType}Id" onclick='questionClicked("${reviewsArray[obj].qType}");thing(this.id);';>${reviewsArray[obj].qType}</span>
                                <ul class="nested" id="${reviewsArray[obj].qType}">
                                	<li> <div class="sentiment square" style="border-radius:3px; background-color:transparent; font-size:14pt">S</div> <div class="action square" style="border-radius:3px; background-color:transparent;font-size:14pt ">A</div></li> 
                                    <li onclick="reviewClicked(${obj})">  <div id = "${reviewsArray[obj].id}Sentiment" class="sentiment square" style="border-radius:3px"></div> <div id="${reviewsArray[obj].id}Action" class="action square" style="border-radius:3px"></div>    Report ${reviewsArray[obj].id}           </li> 
                                </ul>
                            </li>`
					}

					

				}

				

				// color boxes
				for (var obj in reviewsArray) {

        			
					


        			var boxWordCount = Number(reviewsArray[obj].wordCount);
        			var boxSentimentScore = Number(reviewsArray[obj].sentimentScore);
        			var boxActionableScore = Number(reviewsArray[obj].actionableScore);
        			var boxActionableWordCount = Number(reviewsArray[obj].actionableCount);
        			var boxNegativeCount = Number(reviewsArray[obj].negativeCount);
        			var boxPositiveCount = Number(reviewsArray[obj].positiveCount);
    				var boxActionablePercent = (boxActionableWordCount / boxWordCount) * 100;

    				if(boxSentimentScore <= -.33){
    					document.getElementById(reviewsArray[obj].id + "Sentiment").style["background-color"] = "red";
    				} else if (boxSentimentScore < .33){
    					document.getElementById(reviewsArray[obj].id + "Sentiment").style["background-color"] = "yellow";
    				} else{
    					document.getElementById(reviewsArray[obj].id + "Sentiment").style["background-color"] = "green";
    				}

    				if(boxActionablePercent < 5){
    					document.getElementById(reviewsArray[obj].id + "Action").style["background-color"] = "red";
    				} else if (boxActionablePercent <= 10){
    					document.getElementById(reviewsArray[obj].id + "Action").style["background-color"] = "yellow";
    				} else{
    					document.getElementById(reviewsArray[obj].id + "Action").style["background-color"] = "green";
    				}



    				if(favs.includes(reviewsArray[obj].id)){
						document.getElementById('FavoritesId').innerHTML += `	
             			<li id="fav${obj}" onclick="reviewClicked(${obj})";> <div id = "${reviewsArray[obj].id}Sentiment" class="sentiment square" style="background-color: ${document.getElementById(reviewsArray[obj].id + 'Sentiment').style['background-color']}; border-radius:3px;" ></div> <div id="${reviewsArray[obj].id}Action" class="action square" style="background-color:${document.getElementById(reviewsArray[obj].id + 'Action').style['background-color']}; border-radius:3px;" ></div>  Report ${reviewsArray[obj].id}        </li> 
         				`
					}


    			}


				}
		},
		error: function (e) {
			alert("boo...");
		}
	});
}




function questionClicked(q) // Function for when the question is clicked. This function should take all the stats from all reviews under the question and combine them
{

var numberOfReviews = 0;
var questionWordCount = 0; // total word count of all the reviews under the question

var questionSentimentScore = 0; // sentiment score average of all the reviews

var questionSentimentPercent = 0; // percentage of sentiment words vs total words

var questionActionableScore = 0; // actionable score average of all the reviews
var questionActionableWordCount = 0 // how many actionable-related words are in all the reviews
var questionActionablePercent = 0; // percentage of actionable words vs total words

var questionNegativeCount = 0;
var questionPositiveCount = 0;


    for (var obj in reviewsArray) {
        if (reviewsArray[obj].qType == q) {
            questionWordCount += Number(reviewsArray[obj].wordCount);
            questionSentimentScore += Number(reviewsArray[obj].sentimentScore);
            questionActionableScore += Number(reviewsArray[obj].actionableScore);
            questionActionableWordCount += Number(reviewsArray[obj].actionableCount);
            questionNegativeCount += Number(reviewsArray[obj].negativeCount);
            questionPositiveCount += Number(reviewsArray[obj].positiveCount);
            numberOfReviews += 1;
        }
        
    }
    questionCalculations();



    document.getElementById("reviewParagraph").innerHTML = ""
    document.getElementById("sentimentScoreLabel").innerHTML = "Sentiment Score: " + questionSentimentScore.toFixed(2)
    document.getElementById("positiveWordCountLabel").innerHTML = "Positive Word Count: " + questionPositiveCount
    document.getElementById("negativeWordCountLabel").innerHTML = "Negative Word Count: " + questionNegativeCount
    // document.getElementById("sentimentPercentageLabel").innerHTML = "Percentage: " + questionSentimentPercent.toFixed(2) + "%"
    document.getElementById("actionableScoreLabel").innerHTML = "Actionable Score: " + questionActionableScore.toFixed(2)
    document.getElementById("actionableWordCountLabel").innerHTML = "Actionable Word Count: " + questionActionableWordCount.toFixed(2)
    // document.getElementById("actionablePercentageLabel").innerHTML = "Percentage: " + questionActionablePercent.toFixed(2) + "%"
   	
   	var arr = {'actionableCount':questionActionableWordCount,'positiveCount':questionPositiveCount,'negativeCount':questionNegativeCount,'wordCount':questionWordCount};
   	

   	drawChart(arr)
    document.getElementById('favDiv').style.visibility = 'hidden';
    console.log(obj)
    console.log(document.getElementById('addBoodTitle'))
    document.getElementById('addBookTitle').innerHTML = q + " Report"
   	currentReview = null

    function questionCalculations()
    {

		// here, calculations for all the above variables should occur
        questionActionableScore = questionActionableScore / numberOfReviews
        questionSentimentScore = questionSentimentScore / numberOfReviews
        questionSentimentPercent = (questionPositiveCount + questionNegativeCount) / questionWordCount;
        questionActionablePercent = (questionActionableWordCount / questionWordCount) * 100;

    }


}

function reviewClicked(id) // function for when a specific review is clicked
{

	// here, the variables are populated with information from the database that was passed on
	reviewWordCount = reviewsArray[id].wordCount; 
    sentimentScore = reviewsArray[id].sentimentScore;
    actionableScore = reviewsArray[id].actionableScore;
    actionableWordCount = reviewsArray[id].actionableCount;
    negativeCount = reviewsArray[id].negativeCount;
    positiveWordCount = reviewsArray[id].positiveCount;
    review = reviewsArray[id].review;


	// the 3 functions for the divs are called, where percentages are calculated and labels/text is set
	sentimentCalculations(reviewsArray[id].sentimentScore);
	actionableCalculations();
    //rudeCalculations();

    //alert(reviewWordCount)
    //alert(sentimentScore)
    //alert(actionableScore)
    //alert(actionableWordCount)
    //alert(negativeCount)
    //alert(positiveWordCount)
    //alert(sentimentPercent)
    document.getElementById("reviewParagraph").innerHTML = review
    document.getElementById("sentimentScoreLabel").innerHTML = "Sentiment Score: " + sentimentScore
    document.getElementById("positiveWordCountLabel").innerHTML = "Positive Word Count: " + positiveWordCount
    document.getElementById("negativeWordCountLabel").innerHTML = "Negative Word Count: " + negativeCount
    // document.getElementById("sentimentPercentageLabel").innerHTML = "Percentage: " + sentimentPercent.toFixed(2) + "%"
    document.getElementById("actionableScoreLabel").innerHTML = "Actionable Score: " + actionableScore
    document.getElementById("actionableWordCountLabel").innerHTML = "Actionable Word Count: " + actionableWordCount
    // document.getElementById("actionablePercentageLabel").innerHTML = "Percentage: " + actionablePercent.toFixed(2) + "%"
    drawChart(reviewsArray[id])

    if(favs.includes(reviewsArray[id].id)){
    	document.getElementById('favId').checked = true
	}
	else{
		document.getElementById('favId').checked = false
	}
    document.getElementById('favDiv').style.visibility='visible';

    currentReview = reviewsArray[id]
    document.getElementById('addBookTitle').innerHTML = "Report " + reviewsArray[id].id
}


function sentimentCalculations(sentimentScore)
{
    sentimentScore = (sentimentScore * 10);
    sentimentPercent = ((positiveWordCount + negativeCount) / reviewWordCount)*10;
	// next code would be here, to set values of labels in the sentiment Div to fit the variables/calculations we have here.

}

function actionableCalculations()
{
	actionablePercent = (actionableWordCount / reviewWordCount) * 100;

	// next code would be here, to set values of labels in the actionable Div to fit the variables/calculations we have here.

}

//function rudeCalculations()
//{
//	rudePercent = (rudeWordCount / reviewWordCount) * 100;

//	// next code would be here, to set values of labels in the rude word Div to fit the variables/calculations we have here.

//}


function favorite(x)
{
	
	if(x.checked){
		favs.push(currentReview.id)
		document.getElementById('FavoritesId').innerHTML += `	
             <li id="fav${reviewsArray.indexOf(currentReview)}" onclick="reviewClicked(${reviewsArray.indexOf(currentReview)})";>  <div id = "${currentReview.id}Sentiment" class="sentiment square" style="background-color: ${document.getElementById(currentReview.id + 'Sentiment').style['background-color']}; border-radius:3px;" ></div> <div id="${currentReview.id}Action" class="action square" style="background-color:${document.getElementById(currentReview.id + 'Action').style['background-color']}; border-radius:3px;" ></div>  Report ${currentReview.id}                  </li> 
         `
	}
	else{
		position = favs.indexOf(currentReview.id);

		if(~position){
			favs.splice(position,1);
		}

		document.getElementById(`fav${reviewsArray.indexOf(currentReview)}`).parentNode.removeChild(document.getElementById(`fav${reviewsArray.indexOf(currentReview)}`))
		
	}

	localStorage.setItem("favs",JSON.stringify(favs));
}