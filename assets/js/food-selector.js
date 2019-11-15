$("#searchButton").on("click", function () {
    event.preventDefault();
    var errorsArray = [];

    if (localStorage.getItem("tokenId") != null && localStorage.getItem("tokenId") != "") {
        if ($("#searchBarInput").val() == "") {
            errorsArray.push("Food field is required.");
            $("#searchBarInput").addClass("is-invalid");
        } else {
            $("#searchBarInput").removeClass("is-invalid");
        }
    } else {
        errorsArray.push("You are not authorized to perform this action.");
    }

    if (errorsArray.length != 0) {
        displayErrorsAlert(errorsArray);
    }
    else {

        var searchBarInputVar = $("#searchBarInput").val().trim();
        searchBarInputVar = searchBarInputVar.replace(" ", "%20");
        $("tbody").empty();
        /* var url = "https://nutritionix-api.p.rapidapi.com/v1_1/search/" + searchBarInputVar + "?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat"; */
        //connect to the api and display the result
        /*        var settings = {
           "async": true,
           "crossDomain": true,
           "url": url,
           "method": "GET",
           "headers": {
               "x-rapidapi-host": "nutritionix-api.p.rapidapi.com",
               "x-rapidapi-key": "5aae5d0399mshdedf5a1c0e88874p1a723cjsna32e355bd5ad"
           }
       } */


        var appId = "19449d59";
        var appKey = "82f30745c0156ab7903a78cceec1ccf2";
        var url = "https://api.nutritionix.com/v1_1/search/" + searchBarInputVar + "?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id%2Cnf_calories%2Cnf_total_fat&appId=" + appId + "&appKey=" + appKey;

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "content-type": "application / json",
                "accept": "application / json",
                "x-app-id": appId,
                "x-app-key": appKey,
            }
        }

        $.ajax(settings).done(function (response) {
            $("#ddlMenu").empty();
            var barDataArray = [];
            var xDataArray = [];
            for (let i = 0; i < response.hits.length; i++) {
                xDataArray.push(response.hits[i].fields.item_name);
                barDataArray.push(response.hits[i].fields.nf_calories);
                renderRecord(response.hits[i].fields.item_name, response.hits[i].fields.nf_calories, response.hits[i].fields.nf_total_fat);
            }
        });
    }
});



function renderRecord(x, y, z) {
    var trElement = $("<tr>");
    var tdOneElement = $("<td>");
    tdOneElement.text(x);
    tdOneElement.append(tdOneElement);

    var tdTwoElement = $("<td>");
    tdTwoElement.text(y);
    tdTwoElement.append(tdTwoElement);

    var tdThreeElement = $("<td>");
    tdThreeElement.text(z);
    tdThreeElement.append(tdThreeElement);

    var tdFourElement = $("<td>");

    var selectElement = $("<select>");
    var selectOptionOne = $("<option>");
    selectOptionOne.text("Breakfast");
    selectOptionOne.attr("value", "B");
    var selectOptionTwo = $("<option>");
    selectOptionTwo.text("Lunch");
    selectOptionTwo.attr("value", "L");
    var selectOptionThree = $("<option>");
    selectOptionThree.text("Dinner");
    selectOptionThree.attr("value", "D");
    var selectOptionFour = $("<option>");
    selectOptionFour.text("Snack");
    selectOptionFour.attr("value", "S");
    selectElement.attr("style", "width:150px;");
    selectElement.addClass("btn btn-success add-buttons mr-2 form-control");
    selectElement.attr("id", "addButton" + uuid());
    selectElement.append(selectOptionOne, selectOptionTwo, selectOptionThree, selectOptionFour);
    tdFourElement.append(selectElement);

    trElement.append(tdOneElement);
    trElement.append(tdTwoElement);
    trElement.append(tdThreeElement);
    trElement.append(tdFourElement);

    $("tbody").append(trElement);
};


$("body").on("focusout", ".add-buttons", function (event) {

    var itemName = $(this).closest("tr").find("td:eq(0)").text();
    var calCount = $(this).closest("tr").find("td:nth-child(2)").text();
    var fatCount = $(this).closest("tr").find("td:nth-child(3)").text();
    var creationDate = moment().format("MM/DD/YYYY");
    var selectValue = $(this).closest("tr").find("td:nth-child(4)").find("option:selected").val();

    console.log(itemName);
    console.log(calCount);
    console.log(fatCount);
    console.log(selectValue);
    $(this).attr("disabled", "disabled");



    database.collection('usersLoginTokens').where('tokenId', '==', localStorage.getItem("tokenId")).get().then(function (querySnapshot) {
        return database.collection('usersLoginTokens').doc(querySnapshot.docs[0].id).get().then(function (doc) {
            console.log(doc.data());
            //then will not be executed until the delete returns a response
            var userIdByToken = doc.data().userId;
            console.log(userIdByToken);
            database.collection('logger').add({
                userId: userIdByToken,
                itemName: itemName,
                calCount: calCount,
                fatCount: fatCount,
                meType: selectValue,
                creationDate: moment(creationDate, "MM/DD/YYYY").unix()
            });
        });
    });
});
