"use strict"
var userId;


function CreateReview(review) {
	var webMethod = "AccountServices.asmx/AddReview";
	var parameters = "{\"review\":\"" + encodeURI(review) + "\"}";
	// alert("creatingbook")
	// alert(isbn)
	$.ajax({
		type: "POST",
		url: webMethod,
		data: parameters,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (msg) {
			alert("Review Added");
			window.location.href = "LendPage.html#name=" + name;

		},
		error: function (e) {
			alert("boo...");
		}
	});
}

function boxesToAddBookVariables()
{
	var addReview = document.getElementById("addBookReviewBox").value;


	if(addReview == "")
	{
		alert("Review is not filled in. Please Complete all fields.");
	}
	else
	{
		// alert("Success!");
	}

	// alert('here');
	CreateBook(addReview)
	
}