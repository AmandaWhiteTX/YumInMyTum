$("#signOutButton").on("click", function (event) {
    event.preventDefault();
    database.collection('usersLoginTokens').where('tokenId', '==', localStorage.getItem("tokenId")).get().then(function (querySnapshot) {
        return database.collection('usersLoginTokens').doc(querySnapshot.docs[0].id).delete().then(function () {
            //then will not be executed until the delete returns a response
            localStorage.removeItem("tokenId");
            window.location.href = "index.html";
        });
    });
});