$("#enterWeightButton").on("click", function (event) {
    event.preventDefault();
    var weightEntryVar = $("#enterWeightField").val().trim();
    var creationDate = moment().format("MM/DD/YYYY");
    var errorsArray = [];
    var weightRGEX = /^\d+$/;
    var rGexTestResult = weightRGEX.test(weightEntryVar);

    if (localStorage.getItem("tokenId") != null && localStorage.getItem("tokenId") != "") {
        if (weightEntryVar == "") {
            errorsArray.push("Weight field is required.");
            $("#enterWeightField").addClass("is-invalid");
        } else {
            $("#enterWeightField").removeClass("is-invalid");
        }
        if (!rGexTestResult) {
            errorsArray.push("Weight field should contain numbers only.");
        }
    } else {
        errorsArray.push("You are not authorized to perform this action.");
    }

    if (errorsArray.length != 0) {
        displayErrorsAlert(errorsArray);
    }
    
    else {

        database.collection('usersLoginTokens').where('tokenId', '==', localStorage.getItem("tokenId")).get().then(function (querySnapshot) {
            return database.collection('usersLoginTokens').doc(querySnapshot.docs[0].id).get().then(function (doc) {
                //then will not be executed until the delete returns a response
                var userIdByToken = doc.data().userId;				
				
                return database.collection('users').where('userId', '==', userIdByToken).get().then(function (querySnapshot) {
                    database.collection('userWeight').add({
                        userId: userIdByToken,
                        weightEntry: weightEntryVar,
                        bmi: (parseFloat(weightEntryVar) / Math.pow((parseFloat(querySnapshot.docs[0].data().userHeight) / 100), 2)).toFixed(2),
                        creationDate: moment(creationDate, "MM/DD/YYYY").unix()
                    });
                });
            });
        });

        $("#enterWeightField").val("");
    }

});

//child_added event would retrieve a full snapshot from the database
database.collection('usersLoginTokens').where('tokenId', '==', localStorage.getItem("tokenId")).get().then(function (querySnapshot) {

    if(querySnapshot.docs.length){
    return database.collection('usersLoginTokens').doc(querySnapshot.docs[0].id).get().then(function (doc) {
        console.log(doc.data());
        //then will not be executed until the delete returns a response
        var userIdByToken = doc.data().userId;
        console.log(userIdByToken);

        return database.collection('userWeight').where('userId', '==', userIdByToken).orderBy('creationDate').onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                if (change.type == "added") {
                    renderRecord(change.doc);
                }
            });
        });




    });
	}
});

function renderRecord(doc) {
    var trElement = $("<tr>");

    var tdOneElement = $("<td>");
    tdOneElement.text(moment.unix(doc.data().creationDate).format("MM/DD/YYYY"));
    tdOneElement.append(tdOneElement);

    var tdTwoElement = $("<td>");
    tdTwoElement.text(doc.data().weightEntry);
    tdTwoElement.append(tdTwoElement);

    var tdThreeElement = $("<td>");
    tdThreeElement.text(doc.data().bmi);
    tdThreeElement.append(tdThreeElement);

    trElement.append(tdOneElement);
    trElement.append(tdTwoElement);
    trElement.append(tdThreeElement);

    $("tbody").append(trElement);
};