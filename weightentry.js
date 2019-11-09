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
    var database = firebase.firestore();



$("#enterWeightButton").on("click", function (event) {
    event.preventDefault();
    var weightEntryVar = $("#enterWeightField").val().trim();
    var creationDate = moment().format("MM/DD/YYYY");
    var errorsArray = [];

  if (weightEntryVar == "") {
        console.log("aaaa");
        errorsArray.push("requried field");
        displayErrorsAlert(errorsArray);
    } else {
        console.log("record inseartion block");
        database.collection("userWeight").add({
            weightEntry: weightEntryVar,
            creationDate: creationDate

        })
    }
});

// Display Past Weights in Table

$("#creationDate").val("");
$("#weightEntry").val("");

//child_added event would retrieve a full snapshot from the database
database.collection('yuminmytum').onSnapshot (snapshot =>{
    snapshot.docChanges().forEach{change => {
        if (change.type === "added")
    }}
}

))

  

$("tbody").append("<tr><td>" + sv.creationDate + "</td><td>" + sv.weightEntry + "</td><td>");}

// Handle the errors
}, function (errorObject) {
console.log("Errors handled: " + errorObject.code);
});

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
