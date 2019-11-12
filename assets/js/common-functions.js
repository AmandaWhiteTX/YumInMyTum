var uuid = function uuidGenerator() {
    var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    var str = "";
    for (var i = 0; i < 16; i++) {
        str = str + numbers[Math.floor(Math.random() * 16)];
    }
    return str;
};