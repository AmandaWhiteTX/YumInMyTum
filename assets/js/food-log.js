$('#logDate').datepicker({
   uiLibrary: 'bootstrap'
});



$("#chooseLogDate").on("click", function (event) {
   event.preventDefault();
   $("#foodLogTable > tbody").empty();
   var errorsArray = [];

   if (localStorage.getItem("tokenId") != null && localStorage.getItem("tokenId") != "") {
      if ($('#logDate').val() == "") {
         errorsArray.push("Date field is required.");
         $("#logDate").addClass("is-invalid");
      } else {
         $("#logDate").removeClass("is-invalid");
      }
   } else {
      errorsArray.push("You are not authorized to perform this action.");
   }

   if (errorsArray.length != 0) {
      displayErrorsAlert(errorsArray);
   }
   else {

      database.collection('usersLoginTokens').where('tokenId', '==', localStorage.getItem("tokenId")).get().then(function (querySnapshot) {
         if (querySnapshot.docs.length) {
            return database.collection('usersLoginTokens').doc(querySnapshot.docs[0].id).get().then(function (doc) {
               console.log(doc.data());
               //then will not be executed until the delete returns a response
               var userIdByToken = doc.data().userId;
               console.log(userIdByToken);

               return database.collection('logger').where('userId', '==', userIdByToken).where('creationDate', '==', moment($("#logDate").val(), "MM/DD/YYYY").unix()).orderBy('meType').onSnapshot(function (snapshot) {
                  snapshot.docChanges().forEach(function (change) {
                     if (change.type == "added") {
                        renderRecord(change.doc);
                     }
                  });
               });
            });
         }
      });
   }
});

//child_added event would retrieve a full snapshot from the database
function renderRecord(doc) {
   var trElement = $("<tr>");
   var tdOneElement = $("<td>");
   tdOneElement.text(moment.unix(doc.data().creationDate).format("MM/DD/YYYY"));
   tdOneElement.append(tdOneElement);
   var tdTwoElement = $("<td>");
   tdTwoElement.text(doc.data().itemName);
   tdTwoElement.append(tdTwoElement);
   var mealName = "";
   if (doc.data().meType == "B") {
      mealName = "Breakfast";
   } else if (doc.data().meType == "D") {
      mealName = "Dinner";
   } else if (doc.data().meType == "S") {
      mealName = "Snack";
   } else if (doc.data().meType == "L") {
      mealName = "Lunch";
   }
   var tdThreeElement = $("<td>");
   tdThreeElement.text(mealName);
   tdThreeElement.append(tdThreeElement);
   var tdFourElement = $("<td>");
   tdFourElement.text(doc.data().calCount);
   tdFourElement.append(tdFourElement);
   var tdFiveElement = $("<td>");
   tdFiveElement.text(doc.data().fatCount);
   tdFiveElement.append(tdFiveElement);
   trElement.append(tdOneElement);
   trElement.append(tdTwoElement);
   trElement.append(tdThreeElement);
   trElement.append(tdFourElement);
   trElement.append(tdFiveElement);
   $("tbody").append(trElement);
};