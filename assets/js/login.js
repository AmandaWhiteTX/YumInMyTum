$("#loginLink").on("click", function (event) {
    event.preventDefault();
    $("#loginEmailInput").removeClass("is-invalid");
    $("#loginPasswordInput").removeClass("is-invalid");
});

// login function //

$("#loginButton").on("click", function (event) {
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

    if (errorsArray.length != 0) {
        displayErrorsAlert(errorsArray);
    } else {
        console.log("in");
        database.collection('users').where('userId', '==', loginEmailVar).get().then(function (doc) {
            console.log(doc);
            //console.log(doc.docs[0].data().password);
            console.log(doc.docs.length);
            if (doc.docs.length == 1) {
                if (loginPasswordVar == doc.docs[0].data().password) {
                    console.log("user exists. good password!");
                    //localStorage.setItem("username", loginEmailVar);
                    localStorage.setItem("tokenId", uuid());


                    database.collection('usersLoginTokens').where('userId', '==', loginEmailVar).get().then(function (doc) {
                        if (doc.docs.length == 0) {
                            database.collection('usersLoginTokens').add({
                                userId: loginEmailVar,
                                tokenId: localStorage.getItem("tokenId")
                            });
                        } else {

                            //database.collection('usersLoginTokens').doc(doc.docs[0].id).delete();

                            database.collection('usersLoginTokens').add({
                                userId: loginEmailVar,
                                tokenId: localStorage.getItem("tokenId"),
                                creationDate: moment().format("MM/DD/YYYY HH:mm:ss")
                            }).then(function () {
                                $('#signInModal').modal('hide');
                                window.location.href = "food_selector_page.html";
                            }).catch(function (error) {
                                console.error("Error!", error);
                            });
                        }
                    });

                } else {
                    console.log("user exists. wrong password!");
                }
            } else {
                console.log("user doesnt exist popover. signup!");
            }

        });
    }

});