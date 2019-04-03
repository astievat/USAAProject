//when we retrieve accounts, we'll put them here
//so that we can reference them later for admins
//that may want to edit accounts
var reviewsArray;

//this function grabs accounts and loads our account window
function LoadReviews() {
	var webMethod = "AccountServices.asmx/GetReviews";
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
				//this clears out the div that will hold our account info
				console.log(reviewsArray)
				}
		},
		error: function (e) {
			alert("boo...");
		}
	});
}