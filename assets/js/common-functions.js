var uuid = function uuidGenerator() {
    var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    var str = "";
    for (var i = 0; i < 16; i++) {
        str = str + numbers[Math.floor(Math.random() * 16)];
    }
    return str;
};

function arrayDistinctValues(value, index, self) {
    return self.indexOf(value) === index;
};

function displayErrorsAlert(message) {
    $(".errorMessageDivClass").remove();
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger errorMessageDivClass");
    alertDiv.attr("role", "alert");
    alertDiv.attr("id", "errorMessageDiv");
    alertDiv.attr("style", "position:absolute; z-index: 99999999; width: 100%;");
    var alertDivStrong = $("<strong>");
    var alertDivHr = $("<hr>")
    var alertDivSpan = $("<span>");
    alertDivStrong.text("Error Message!");
    alertDivSpan.attr("id", "errorMessageField");
    var errorsOl = $("<ol>");
    for (var i = 0; i < message.length; i++) {
        var errorsLi = $("<li>");
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