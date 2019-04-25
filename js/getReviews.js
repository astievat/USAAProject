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


	reviewsArray = [{id : "1",
					review : "This company has great benefits with an amazing holiday budget for employees. I can correct my boss with no worry. I have a good amount of time to launch new projects. I care about my coworkers and we have a great peer relationships. I find this company to be very positive.",
					sentimentScore : "0.56",
					subjectivity : "0.69",
					actionableScore : "0.21",
					positiveCount : "11",
					negativeCount : "1",
					actionableCount : "6",
					wordCount : "29",
					qType : "Management"},
					{id : "2",
					review : "The company is fantastic. I like my team, they are very funny. The scheduling is really good too, because I get a lot of free days. My desk is in a great place too, very close to the water fountains and food. I love the environment of the offices.",
					sentimentScore : "0.48",
					subjectivity : "0.71",
					actionableScore : "0.07",
					positiveCount : "11",
					negativeCount : "1",
					actionableCount : "2",
					wordCount : "30",
					qType : "Company"},
					{id : "3",
					review : "I enjoy the automated systems in the building, such as the coffee machines. However, the culture makes it difficult to advance into management positions. The team building activities are fantastic when we need to bolster morale. But, we should impose limits on smoke breaks.",
					sentimentScore : "0.08",
					subjectivity : "0.72",
					actionableScore : "0.11",
					positiveCount : "3",
					negativeCount : "5",
					actionableCount : "3",
					wordCount : "27",
					qType : "Company"},
					{id : "4",
					review : "The company is okay. Some of my team members are good, and others are bad. While I like the payroll system, I dislike how we have to schedule break days. The food is delicious, but the air conditioner is broken.",
					sentimentScore : "0.22",
					subjectivity : "0.63",
					actionableScore : "0.04",
					positiveCount : "6",
					negativeCount : "4",
					actionableCount : "1",
					wordCount : "25",
					qType : "Management"},
					{id : "5",
					review : "I never want to work here again. I dislike management and can never allocate my time properly. Never want to see these people again. They deliver stupid and bad projects. Never on time and always compete with each other. ",
					sentimentScore : "-0.41",
					subjectivity : "0.54",
					actionableScore : "0.19",
					positiveCount : "2",
					negativeCount : "3",
					actionableCount : "5",
					wordCount : "27",
					qType : "Company"},
					{id : "6",
					review : "This company sucks. It is so stupid and useless. I hate working with everyone here. Everything in the building is broken, and the food is disgusting.",
					sentimentScore : "-0.63",
					subjectivity : "0.63",
					actionableScore : "0.0",
					positiveCount : "1",
					negativeCount : "6",
					actionableCount : "0",
					wordCount : "16",
					qType : "Management"},
					{id : "7",
					review : "Working at this company was a great experience. Work never felt like work because I loved what I did and I loved interacting with the public. The store was always electric, although others may say crazy. I'd say electric because the experience was exhilarating. The managers were all great and they were never above doing what they asked of their employees. The benefits and pay were amazing for a part time job. Working for a company with a brand such as ours and experience to match that brand made me want to stay forever. This is a job I truly miss and I am thankful for the opportunity that I was given!",
					sentimentScore : "0.48",
					subjectivity : "0.71",
					actionableScore : "0.07",
					positiveCount : "11",
					negativeCount : "1",
					actionableCount : "2",
					wordCount : "30",
					qType : "Company"},
					{id : "8",
					review : "I enjoy my job with the company, I work in a specific area and am able to interact with several different engineering areas to learn more about the overall program and it's function. The leads and managers are all very helpful and want to see you succeed, they are always willing to help you get the information that you need even if you are not their direct employee. The people are friendly and range in experience levels, which brings a great mentoring opportunity for younger employees (such as myself) as well as assisting with the seasoned employees to get a fresh perspective.",
					sentimentScore : "0.08",
					subjectivity : "0.72",
					actionableScore : "0.11",
					positiveCount : "3",
					negativeCount : "5",
					actionableCount : "3",
					wordCount : "27",
					qType : "Company"},
					{id : "9",
					review : "The company treats its employees extremely well. My only qualm was with opportunities for advancement. While opportunities were plentiful, it was hard to advance in my particular location and I wasn’t prepared to move. Overall it was wonderful though. The benefits are amazing and they offer paid new parent leave. This latter benefit was surprisingly something I was eligible for when we started foster care and when we later adopted the kids we fostered the company reimbursed us for those expenses too.",
					sentimentScore : "0.56",
					subjectivity : "0.69",
					actionableScore : "0.21",
					positiveCount : "11",
					negativeCount : "1",
					actionableCount : "6",
					wordCount : "29",
					qType : "Company"},
					{id : "10",
					review : "This is a solid company and has been a great place for me to work. I've raised a family with 7 kids on one salary in the Seattle area. I've worked in 6 different areas and have always been blessed with a good Manager. There is good opportunity to work at various jobs in a large number of locations and countries.",
					sentimentScore : "0.22",
					subjectivity : "0.63",
					actionableScore : "0.04",
					positiveCount : "6",
					negativeCount : "4",
					actionableCount : "1",
					wordCount : "25",
					qType : "Management"},
					{id : "11",
					review : "This company will work you to death. Literally. People have died in my side of work at this company because they try to cut out safety to get their numbers higher. This is not a joke. I was working 16 hours a day. Sure the money is decent, but you never have time to spend it. You work every day. No weekends off. Every now and then they give you a Sunday off and they act like they are doing you this huge favor for doing so. There are plenty of other jobs out there that pay the same, if not better than this company. You know when a job is so stressful when they offer free counseling. Do yourselves a favor and find a different company to work for.",
					sentimentScore : "-0.41",
					subjectivity : "0.54",
					actionableScore : "0.19",
					positiveCount : "2",
					negativeCount : "3",
					actionableCount : "5",
					wordCount : "27",
					qType : "Company"},
					{id : "12",
					review : "This is a high-stress environment that doesn't have much going for it. It's extremely hard to advance in the company or get full-time hours, rather they would just prefer that you learn how to cook french fries and then just do that for the rest of the time. A customer's word is law, if you rub someone the wrong way you are finished at this company. This doesn't just apply to regular joes either, two of my former managers have since been fired from this establishment with little cause and no warning. If you are looking to make your career here prepare to spend the rest of your life walking on the razor's edge, because this company doesn't care about you or your family.",
					sentimentScore : "-0.63",
					subjectivity : "0.63",
					actionableScore : "0.0",
					positiveCount : "1",
					negativeCount : "6",
					actionableCount : "0",
					wordCount : "16",
					qType : "Management"},
					{id : "13",
					review : "Working at this company was a great experience. Work never felt like work because I loved what I did and I loved interacting with the public. The store was always electric, although others may say crazy. I'd say electric because the experience was exhilarating. The managers were all great and they were never above doing what they asked of their employees. The benefits and pay were amazing for a part time job. Working for a company with a brand such as ours and experience to match that brand made me want to stay forever. This is a job I truly miss and I am thankful for the opportunity that I was given!",
					sentimentScore : "0.67",
					subjectivity : "0.63",
					actionableScore : "0.13",
					positiveCount : "8",
					negativeCount : "2",
					actionableCount : "5",
					wordCount : "112",
					qType : "Management"},
					{id : "14",
					review : "Poor management, 3 store managers in just over a year, no advancements available, over-worked and under paid for the work to be done, terrible scheduling with no stability, no care for employees health, terrible insurance, etc... I hated that job and could go on with the list. It was nearly my 2 year anniversary there and I was still waiting to receive my 6mo evaluation raise, it took over 3 months to get my first year raise. The company re-enrolled me in their insurance (without asking) after forcing me to sign off my insurance when moving to casual from being a full time employee, and then refused to remove the re-enrolled insurance and continue to bill me for another year until the next open enrollment, with no access to the insurance I was billed for!",
					sentimentScore : "-0.68",
					subjectivity : "0.63",
					actionableScore : "0.01",
					positiveCount : "1",
					negativeCount : "7",
					actionableCount : "2",
					wordCount : "135",
					qType : "Company"},
					{id : "15",
					review : "I really enjoyed the fast paced working environment. Most of the customers were amazing people. The regulars were such a pleasure to service. I really enjoyed traveling to other Grand Openings. The management is really amazing at making promises. That's where is good ends. I had one great DM and once she was gone, the next 2 were absolutely horrible. 20 something year old kids that are given a position of power and they absolutely abuse it. The expectations by a DM are so far fetched. They themselves can't do the work that they are demanding. They are so unappreciative. Never once got a 'good job' or 'pat on the back'. Our store meetings were just a bashing session. The whole time was about what were doing wrong and what we needed to improve on even though we were meeting the expectations from prior week. You can forget about asking for a break. You were made to feel like breaks were a 'waste of time'. They say the pay is competitive with other stores but that was a lie. Although the pay figures were similar, the job tasks and requirements were not. At this company, you are not assigned to a specific task. Everyone did everything. They don't promote from within and no shift manager is full time at that position. Once the 'Grand Opening' stage is done, your hours are cut. You do the tasks of 3 people and get paid for one. I would not recommend this job to anyone. Well at least not the location I worked at.",
					sentimentScore : "-0.22",
					subjectivity : "0.63",
					actionableScore : "0.45",
					positiveCount : "2",
					negativeCount : "12",
					actionableCount : "5",
					wordCount : "20",
					qType : "Management"}
					]




	// $.ajax({
	// 	type: "POST",
	// 	url: webMethod,
	// 	contentType: "application/json; charset=utf-8",
	// 	dataType: "json",
	// 	success: function (msg) {
	// 		if (msg.d.length > 0) {
	// 			//let's put our accounts that we get from the
	// 			//server into our accountsArray variable
	// 			//so we can use them in other functions as well
	// 			reviewsArray = msg.d;

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
							
                                <li onclick="reviewClicked(${obj})";>    <div id = "${reviewsArray[obj].id}Sentiment" class="sentiment square" style="border-radius:3px"></div> <div id="${reviewsArray[obj].id}Action" class="action square" style="border-radius:3px"></div> Review ${reviewsArray[obj].id}            </li> 
                            `
					}
					else{
						types.push(reviewsArray[obj].qType)
                        document.getElementById('myUL').innerHTML +=
                            `<li><span class="caret" id="${reviewsArray[obj].qType}Id" onclick='questionClicked("${reviewsArray[obj].qType}");thing(this.id);';>${reviewsArray[obj].qType}</span>
                                <ul class="nested" id="${reviewsArray[obj].qType}">
                                	<li> <div class="sentiment square" style="border-radius:3px; background-color:transparent; font-size:14pt">S</div> <div class="action square" style="border-radius:3px; background-color:transparent;font-size:14pt ">A</div></li> 
                                    <li onclick="reviewClicked(${obj})">  <div id = "${reviewsArray[obj].id}Sentiment" class="sentiment square" style="border-radius:3px"></div> <div id="${reviewsArray[obj].id}Action" class="action square" style="border-radius:3px"></div>    Review ${reviewsArray[obj].id}           </li> 
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
             			<li id="fav${obj}" onclick="reviewClicked(${obj})";> <div id = "${reviewsArray[obj].id}Sentiment" class="sentiment square" style="background-color: ${document.getElementById(reviewsArray[obj].id + 'Sentiment').style['background-color']}; border-radius:3px;" ></div> <div id="${reviewsArray[obj].id}Action" class="action square" style="background-color:${document.getElementById(reviewsArray[obj].id + 'Action').style['background-color']}; border-radius:3px;" ></div>  Review ${reviewsArray[obj].id}        </li> 
         				`
					}


    			}


				}
// 		},
// 		error: function (e) {
// 			alert("boo...");
// 		}
// 	});
// }




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
    document.getElementById('addBookTitle').innerHTML = "Review " + reviewsArray[id].id
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
             <li id="fav${reviewsArray.indexOf(currentReview)}" onclick="reviewClicked(${reviewsArray.indexOf(currentReview)})";>  <div id = "${currentReview.id}Sentiment" class="sentiment square" style="background-color: ${document.getElementById(currentReview.id + 'Sentiment').style['background-color']}; border-radius:3px;" ></div> <div id="${currentReview.id}Action" class="action square" style="background-color:${document.getElementById(currentReview.id + 'Action').style['background-color']}; border-radius:3px;" ></div>  Review ${currentReview.id}                  </li> 
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