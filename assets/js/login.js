var firebaseConfig = {
   apiKey: "AIzaSyD8D96eRHqq7vqvZy76jspJPPVIvjbMY_0",
   authDomain: "yuminmytum-fb9b9.firebaseapp.com",
   databaseURL: "https://yuminmytum-fb9b9.firebaseio.com",
   projectId: "yuminmytum-fb9b9",
   storageBucket: "yuminmytum-fb9b9.appspot.com",
   messagingSenderId: "170412031845",
   appId: "1:170412031845:web:3ca950d6602795d4b3eb8c"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);



 $("#loginLink").on("click",function(event){
    $("#loginEmailInput").removeClass("is-invalid");
    $("#loginPasswordInput").removeClass("is-invalid");
 });

 $("#signUpLink").on("click",function(event){
    $("#signupEmailInput").removeClass("is-invalid");
    $("#signUpPasswordInput").removeClass("is-invalid");
    $("#signUpGenderInput").removeClass("is-invalid");
    $("#signUpWeightInput").removeClass("is-invalid");
    $("#signUpHeightInput").removeClass("is-invalid");

 });

 // login function //

$("#loginButton").on("click",function(event){
event.preventDefault();
var loginEmailVar = $("#loginEmailInput").val().trim();
var loginPasswordVar = $("#loginPasswordInput").val().trim(); 
var errorsArray = [];
if (loginEmailVar == "") {
    errorsArray.push("Email is required");
    $("#loginEmailInput").addClass("is-invalid");

}

if (loginPasswordVar == "") {
    errorsArray.push("Password is required");
    $("#loginPasswordInput").addClass("is-invalid");
}

if (errorsArray.length != 0){
    displayErrorsAlert(errorsArray);
}

});

// signup function //

$("#signUpButton").on("click",function(event){
    event.preventDefault();
    var signUpEmailVar = $("#signupEmailInput").val().trim();
    var signUpPasswordVar = $("#signUpPasswordInput").val().trim(); 
    var signUpGenderVar = $("#signUpGenderInput").val().trim(); 
    var signUpWeightVar = $("#signUpWeightInput").val().trim(); 
    var signUpHeightVar = $("#signUpHeightInput").val().trim(); 
    var errorsArray = [];

    if (signUpEmailVar == "") {
        errorsArray.push("Email is required");
        $("#signupEmailInput").addClass("is-invalid");
    }
    
    if (signUpPasswordVar == "") {
        errorsArray.push("Password is required");
        $("#signUpPasswordInput").addClass("is-invalid");
    }

    if (signUpGenderVar == "") {
    errorsArray.push("Gender is required");
    $("#signUpGenderInput").addClass("is-invalid");
    } 

    if (signUpWeightVar == "") {
        errorsArray.push("Weight is required");
        $("#signUpWeightInput").addClass("is-invalid");
    }
    if (signUpHeightVar == "") {
        errorsArray.push("Height is required");
        $("#signUpHeightInput").addClass("is-invalid");
    }

    if (errorsArray.length != 0){
        displayErrorsAlert(errorsArray);
    }
    
    });



// error message function 

function displayErrorsAlert(message) {
   let alertDiv = $("<div>");
   alertDiv.addClass("alert alert-danger errorMessageDivClass");
   alertDiv.attr("role", "alert");
   alertDiv.attr("id", "errorMessageDiv");
   alertDiv.attr("style", "position:absolute; z-index: 1; width: 100%;");
   let alertDivStrong = $("<strong>");
   let alertDivHr = $("<hr>")
   let alertDivSpan = $("<span>");
   alertDivStrong.text("Error Message!");
   alertDivSpan.attr("id", "errorMessageField");
   let errorsOl = $("<ol>");
   for (let i = 0; i < message.length; i++) {
       let errorsLi = $("<li>");
       errorsLi.text(message[i]);
       errorsOl.append(errorsLi);
   }
   alertDivSpan.append(errorsOl);
   alertDiv.append(alertDivStrong);
   alertDiv.append("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>");
   alertDiv.append(alertDivHr);
   alertDiv.append(alertDivSpan);
   $("body").prepend(alertDiv);
};

