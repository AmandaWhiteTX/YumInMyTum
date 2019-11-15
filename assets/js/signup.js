$("#signUpLink").on("click", function (event) {
    event.preventDefault();
    $("#signupEmailInput").removeClass("is-invalid");
    $("#signUpPasswordInput").removeClass("is-invalid");
    $("#signUpHeightInput").removeClass("is-invalid");

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ajayakv-rest-countries-v1.p.rapidapi.com/rest/v1/all",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "ajayakv-rest-countries-v1.p.rapidapi.com",
            "x-rapidapi-key": "d8bcc0693fmsh5ee10f682031db1p184a8ejsn8311d672f81d"
        }
    }

    $.ajax(settings).done(function (response) {
        //$("#ddlList").append(response.);
        for (let i = 0; i < response.length; i++) {
            $("#ddlList").append(`<li><a class="dropdown-item" href="#">${response[i].name}</a></li>`);
        }
    });

    $("body").on("click", ".dropdown-item", function () {
        console.log($(this).text());
    });

});


//display selected item on the drop down list
$(document).on("click", '.dropdown-menu a', function () {
    console.log("inside countries DDL " + $(this).text());
    $('#selected').text($(this).text());
});




// signup function //

$("#signUpButton").on("click", function (event) {
    event.preventDefault();
    var signUpEmailVar = $("#signupEmailInput").val().trim();
    var signUpPasswordVar = $("#signUpPasswordInput").val().trim();
    var signUpHeightVar = $("#signUpHeightInput").val().trim();
    var errorsArray = [];

    if (signUpEmailVar == "") {
        errorsArray.push("Email is required");
        $("#signupEmailInput").addClass("is-invalid");
    } /* else if(signUpEmailVar != ""){
        var urlExpression = signUpEmailVar;
        urlExpression = urlExpression.replace('@', '%40');
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://regulus-email-validation.p.rapidapi.com/v1/validation/email/" + urlExpression,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "regulus-email-validation.p.rapidapi.com",
                "x-rapidapi-key": "5aae5d0399mshdedf5a1c0e88874p1a723cjsna32e355bd5ad"
            }
        };
        $.ajax(settings).done(function (response) {
            console.log(response);
            if(!response.format_valid){
                console.log("great");
                $("#signupEmailInput").addClass("is-invalid");
                errorsArray.push("Invalid email format");
            }
        });



    } */

    if (signUpPasswordVar == "") {
        errorsArray.push("Password is required");
        $("#signUpPasswordInput").addClass("is-invalid");
    }

    if (signUpHeightVar == "") {
        errorsArray.push("Height is required");
        $("#signUpHeightInput").addClass("is-invalid");
    }

    if (errorsArray.length != 0) {
        displayErrorsAlert(errorsArray);
    } else {

        database.collection('users').where('userId', '==', signUpEmailVar).get().then(function (querySnapshot) {
            //console.log(querySnapshot);
            if(querySnapshot.docs.length > 0){
                errorsArray.push("User with the same email address already exists!");
                displayErrorsAlert(errorsArray);
            } else{
                return database.collection('users').add({
                    userId: signUpEmailVar,
                    password: signUpPasswordVar,
                    userHeight: signUpHeightVar,
                    country: $('#selected').text(),
                    creationDate: moment().format("MM/DD/YYYY")
                }).then(function () {
                    $("#signupEmailInput").val("");
                    $("#signUpPasswordInput").val("");
                    $("#signUpHeightInput").val("");
                    $('#signupmodal').modal('hide');
                });
            }
        });

    }

});