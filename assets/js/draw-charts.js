$('#dateFieldSearchFrom').datepicker({
    uiLibrary: 'bootstrap'
});

$('#dateFieldSearchTo').datepicker({
    uiLibrary: 'bootstrap'
});

$("#drawChartSelect").on("click", function () {
    $("#dateFieldSearchFrom").removeClass("is-invalid");
    $("#dateFieldSearchTo").removeClass("is-invalid");
    if ($("#drawChartSelect").val() == "1") {
        $("#dateFieldSearchTo").removeAttr("disabled");
        $("#dateFieldSearchTo").attr("enabled", "enabled");
    } else if ($("#drawChartSelect").val() == "2") {
        $("#dateFieldSearchTo").removeAttr("disabled");
        $("#dateFieldSearchTo").attr("enabled", "enabled");
    } else if ($("#drawChartSelect").val() == "3") {
        $("#dateFieldSearchTo").removeAttr("disabled");
        $("#dateFieldSearchTo").attr("enabled", "enabled");
    } else if ($("#drawChartSelect").val() == "4") {
        $("#dateFieldSearchTo").removeAttr("disabled");
        $("#dateFieldSearchTo").attr("enabled", "enabled");
    } else if ($("#drawChartSelect").val() == "5") {
        $("#dateFieldSearchTo").removeAttr("enabled");
        $("#dateFieldSearchTo").attr("disabled", "disabled");
    } else if ($("#drawChartSelect").val() == "6") {
        $("#dateFieldSearchTo").removeAttr("disabled");
        $("#dateFieldSearchTo").attr("enabled", "enabled");
    }
});

$("#drawChart").on("click", function () {

    event.preventDefault();
    var errorsArray = [];

    if (localStorage.getItem("tokenId") != null && localStorage.getItem("tokenId") != "") {
        if ($("#dateFieldSearchFrom").val() == "") {
            errorsArray.push("From date field is required.");
            $("#dateFieldSearchFrom").addClass("is-invalid");
        } else {
            $("#dateFieldSearchFrom").removeClass("is-invalid");
        }
        if ($("#dateFieldSearchTo").val() == "" && ($("#dateFieldSearchTo").attr("enabled") == "enabled" || ($("#dateFieldSearchTo").attr("enabled") == null && $("#dateFieldSearchTo").attr("disabled") == null))) {
            errorsArray.push("To date field is required.");
            $("#dateFieldSearchTo").addClass("is-invalid");
        } else {
            $("#dateFieldSearchTo").removeClass("is-invalid");
        }
    } else {
        errorsArray.push("You are not authorized to perform this action.");
    }

    if (errorsArray.length != 0) {
        displayErrorsAlert(errorsArray);
    }
    else {
        var dateFieldValFrom = $("#dateFieldSearchFrom").val().trim();
        var dateFieldValTo = $("#dateFieldSearchTo").val().trim();

        database.collection('usersLoginTokens').where('tokenId', '==', localStorage.getItem("tokenId")).get().then(function (querySnapshot) {
            return database.collection('usersLoginTokens').doc(querySnapshot.docs[0].id).get().then(function (snapshot) {
                //then will not be executed until the delete returns a response
                var userIdByToken = snapshot.data().userId;
                console.log(userIdByToken);
                console.log($("#drawChartSelect").val());

                var drawChartSelect = $("#drawChartSelect").val();

                //===========================================================================================================================================================

                if (drawChartSelect == "1") {
                    //console.log("one");
                    var datesArray = [];
                    var weightsArray = [];
                    //console.log(userIdByToken);
                    //console.log(dateFieldValFrom);
                    //console.log(dateFieldValTo);
                    database.collection('userWeight').where('userId', '==', userIdByToken).where('creationDate', '>=', moment(dateFieldValFrom, "MM/DD/YYYY").unix()).where('creationDate', '<=', moment(dateFieldValTo, "MM/DD/YYYY").unix()).orderBy('creationDate').get().then(function (doc) {
                        //console.log(doc);

                        for (var i = 0; i < doc.docs.length; i++) {
                            datesArray.push(moment.unix(doc.docs[i].data().creationDate).format("MM/DD/YYYY"));
                            weightsArray.push(doc.docs[i].data().weightEntry);
                        }

                        //calCount = [bCalCount.toFixed(2), dCalCount.toFixed(2), lCalCount.toFixed(2), sCalCount.toFixed(2)];
                        //fatCount = [bFatCount.toFixed(2), dFatCount.toFixed(2), lFatCount.toFixed(2), sFatCount.toFixed(2)];

                    }).then(function () {


                        var myChart = echarts.init(document.getElementById('main'));



                        // specify chart configuration item and data
                        var option = {
                            title: {
                                text: 'Weight Progress Chart'
                            },
                            tooltip: {
                                trigger: 'axis'/* ,
                                axisPointer: {
                                    type: 'cross',
                                    label: {
                                        backgroundColor: '#6a7985'
                                    }
                                } */
                            },
                            legend: {
                                data: ['Weight'] //legend name should match series name
                            },
                            xAxis: {
                                data: datesArray,
                                type: 'category',
                                boundaryGap: false //sets a gap between the first element and the y-axis
                            },
                            yAxis: {},
                            series: [{
                                name: 'Weight',
                                type: 'line',
                                areaStyle: {},//fill the area under the line
                                data: weightsArray
                            }]
                        };

                        // use configuration item and data specified to show chart
                        myChart.setOption(option, true);

                    });

                }

                //===========================================================================================================================================================

                else if (drawChartSelect == "2") {
                    //console.log("one");
                    var datesArray = [];
                    var fatArray = [];
                    var totalFat = 0;
                    //console.log(userIdByToken);
                    //console.log(dateFieldValFrom);
                    //console.log(dateFieldValTo);
                    database.collection('logger').where('userId', '==', userIdByToken).where('creationDate', '>=', moment(dateFieldValFrom, "MM/DD/YYYY").unix()).where('creationDate', '<=', moment(dateFieldValTo, "MM/DD/YYYY").unix()).orderBy('creationDate').get().then(function (doc) {
                        //console.log(doc);
                        var docsDataArray = [];
                        //console.log(docsDataArray);
                        for (var i = 0; i < doc.docs.length; i++) {
                            docsDataArray.push({ date: moment.unix(doc.docs[i].data().creationDate).format("MM/DD/YYYY"), fat: doc.docs[i].data().fatCount });
                            datesArray.push(moment.unix(doc.docs[i].data().creationDate).format("MM/DD/YYYY"));
                        }

                        datesArray = datesArray.filter(arrayDistinctValues);
                        //console.log(datesArray.length);

                        //console.log("=" + docsDataArray);

                        for (var j = 0; j < datesArray.length; j++) {
                            for (var k = 0; k < docsDataArray.length; k++) {
                                if (docsDataArray[k].date == datesArray[j]) {
                                    //console.log(docsDataArray[k].date);
                                    totalFat = totalFat + parseFloat(docsDataArray[k].fat);
                                }
                            }
                            fatArray.push(totalFat.toFixed(2));
                            totalFat = 0;
                        }

                        //console.log("lllllll" + datesArray);
                        //console.log("lllllll" + fatArray); 

                    }).then(function () {

                        var myChart = echarts.init(document.getElementById('main'));

                        // specify chart configuration item and data
                        var option = {
                            title: {
                                text: 'Fat Consumption Chart'
                            },
                            tooltip: {
                                trigger: 'axis'/* ,
                                axisPointer: {
                                    type: 'cross',
                                    label: {
                                        backgroundColor: '#6a7985'
                                    }
                                } */
                            },
                            legend: {
                                data: ['Fat'] //legend name should match series name
                            },
                            xAxis: {
                                data: datesArray,
                                type: 'category',
                                boundaryGap: false //sets a gap between the first element and the y-axis
                            },
                            yAxis: {},
                            series: [{
                                name: 'Fat',
                                type: 'line',
                                areaStyle: {},//fill the area under the line
                                data: fatArray
                            }]
                        };

                        // use configuration item and data specified to show chart
                        myChart.setOption(option, true);

                    });

                }

                //===========================================================================================================================================================

                else if (drawChartSelect == "3") {

                    //console.log("one");
                    var datesArray = [];
                    var calArray = [];
                    var totalCal = 0;
                    //console.log(userIdByToken);
                    //console.log(dateFieldValFrom);
                    //console.log(dateFieldValTo);
                    database.collection('logger').where('userId', '==', userIdByToken).where('creationDate', '>=', moment(dateFieldValFrom, "MM/DD/YYYY").unix()).where('creationDate', '<=', moment(dateFieldValTo, "MM/DD/YYYY").unix()).orderBy('creationDate').get().then(function (doc) {
                        //console.log(doc);
                        var docsDataArray = [];
                        //console.log(docsDataArray);
                        for (var i = 0; i < doc.docs.length; i++) {
                            docsDataArray.push({ date: moment.unix(doc.docs[i].data().creationDate).format("MM/DD/YYYY"), cal: doc.docs[i].data().calCount });
                            datesArray.push(moment.unix(doc.docs[i].data().creationDate).format("MM/DD/YYYY"));
                        }

                        datesArray = datesArray.filter(arrayDistinctValues);
                        //console.log(datesArray.length);

                        //console.log("=" + docsDataArray);

                        for (var j = 0; j < datesArray.length; j++) {
                            for (var k = 0; k < docsDataArray.length; k++) {
                                if (docsDataArray[k].date == datesArray[j]) {
                                    //console.log(docsDataArray[k].date);
                                    totalCal = totalCal + parseFloat(docsDataArray[k].cal);
                                }
                            }
                            calArray.push(totalCal.toFixed(2));
                            totalCal = 0;
                        }

                        //console.log("lllllll" + datesArray);
                        //console.log("lllllll" + fatArray); 

                    }).then(function () {

                        var myChart = echarts.init(document.getElementById('main'));

                        // specify chart configuration item and data
                        var option = {
                            title: {
                                text: 'Calories Intake Chart'
                            },
                            tooltip: {
                                trigger: 'axis'/* ,
                                axisPointer: {
                                    type: 'cross',
                                    label: {
                                        backgroundColor: '#6a7985'
                                    }
                                } */
                            },
                            legend: {
                                data: ['Calories'] //legend name should match series name
                            },
                            xAxis: {
                                data: datesArray,
                                type: 'category',
                                boundaryGap: false //sets a gap between the first element and the y-axis
                            },
                            yAxis: {},
                            series: [{
                                name: 'Calories',
                                type: 'line',
                                areaStyle: {},//fill the area under the line
                                data: calArray
                            }]
                        };

                        // use configuration item and data specified to show chart
                        myChart.setOption(option, true);

                    });


                }

                //===========================================================================================================================================================

                else if (drawChartSelect == "4") {


                    var datesArray = [];
                    var weightsArray = [];
                    var fatArray = [];
                    var totalFat = 0;
                    var calArray = [];
                    var totalCal = 0;
                    var bmiArray = [];
                    var fatDocsDataArray = [];
                    var calDocsDataArray = [];

                    database.collection('userWeight').where('userId', '==', userIdByToken).where('creationDate', '>=', moment(dateFieldValFrom, "MM/DD/YYYY").unix()).where('creationDate', '<=', moment(dateFieldValTo, "MM/DD/YYYY").unix()).orderBy('creationDate').get().then(function (doc) {
                        console.log(doc.docs.length);
                        console.log(moment(dateFieldValFrom, "MM/DD/YYYY").unix());
                        console.log(moment(dateFieldValTo, "MM/DD/YYYY").unix());
                        for (var i = 0; i < doc.docs.length; i++) {
                            datesArray.push(moment.unix(doc.docs[i].data().creationDate).format("MM/DD/YYYY"));
                            weightsArray.push(doc.docs[i].data().weightEntry);
                            bmiArray.push(doc.docs[i].data().bmi);
                        }
                    }).then(function () {


                        return database.collection('logger').where('userId', '==', userIdByToken).where('creationDate', '>=', moment(dateFieldValFrom, "MM/DD/YYYY").unix()).where('creationDate', '<=', moment(dateFieldValTo, "MM/DD/YYYY").unix()).orderBy('creationDate').get().then(function (doc) {

                            for (var i = 0; i < doc.docs.length; i++) {
                                fatDocsDataArray.push({ date: moment.unix(doc.docs[i].data().creationDate).format("MM/DD/YYYY"), fat: doc.docs[i].data().fatCount });
                                calDocsDataArray.push({ date: moment.unix(doc.docs[i].data().creationDate).format("MM/DD/YYYY"), cal: doc.docs[i].data().calCount });
                            }


                            datesArray = datesArray.filter(arrayDistinctValues);

                            for (var j = 0; j < datesArray.length; j++) {
                                for (var k = 0; k < fatDocsDataArray.length; k++) {
                                    if (fatDocsDataArray[k].date == datesArray[j]) {
                                        totalFat = totalFat + parseFloat(fatDocsDataArray[k].fat);
                                    }
                                }
                                fatArray.push(totalFat.toFixed(2));
                                totalFat = 0;
                            }

                            for (var j = 0; j < datesArray.length; j++) {
                                for (var k = 0; k < calDocsDataArray.length; k++) {
                                    if (calDocsDataArray[k].date == datesArray[j]) {
                                        totalCal = totalCal + parseFloat(calDocsDataArray[k].cal);
                                    }
                                }
                                calArray.push(totalCal.toFixed(2));
                                totalCal = 0;
                            }

                        });



                    }).then(function () {
                        console.log(datesArray);
                        console.log(fatArray);
                        console.log(calArray);
                        console.log(weightsArray);
                        console.log(bmiArray);

                        var myChart = echarts.init(document.getElementById('main'));

                        // specify chart configuration item and data
                        var option = {
                            title: {
                                text: 'Progress Chart'
                            },
                            tooltip: {
                                trigger: 'axis'/* ,
                                                axisPointer: {
                                                    type: 'cross',
                                                    label: {
                                                        backgroundColor: '#6a7985'
                                                    }
                                                } */
                            },
                            legend: {
                                data: ['Weight', 'BMI', 'Fat', 'Calories'] //legend name should match series name
                            },
                            xAxis: {
                                data: datesArray,
                                type: 'category',
                                boundaryGap: false //sets a gap between the first element and the y-axis
                            },
                            yAxis: {},
                            series: [{
                                name: 'Weight',
                                type: 'line',
                                //areaStyle: {},//fill the area under the line
                                data: weightsArray
                            }, {
                                name: 'BMI',
                                type: 'line',
                                //areaStyle: {},//fill the area under the line
                                data: bmiArray
                            }, {
                                name: 'Fat',
                                type: 'line',
                                //areaStyle: {},//fill the area under the line
                                data: fatArray
                            }, {
                                name: 'Calories',
                                type: 'line',
                                //areaStyle: {},//fill the area under the line
                                data: calArray
                            }]
                        };

                        // use configuration item and data specified to show chart
                        myChart.setOption(option, true);

                    });

                }

                //===========================================================================================================================================================

                else if (drawChartSelect == "5") {
                    //console.log("five");

                    var bCalCount = 0;
                    var bFatCount = 0;
                    var lCalCount = 0;
                    var lFatCount = 0;
                    var dCalCount = 0;
                    var dFatCount = 0;
                    var sCalCount = 0;
                    var sFatCount = 0;
                    var meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
                    var calCount = [];
                    var fatCount = [];

                    database.collection('logger').where('userId', '==', userIdByToken).where('creationDate', '==', moment(dateFieldValFrom, "MM/DD/YYYY").unix()).get().then(function (doc) {
                        console.log(doc);

                        for (var i = 0; i < doc.docs.length; i++) {
                            if (doc.docs[i].data().meType == "B") {
                                bCalCount += parseFloat(doc.docs[i].data().calCount);
                                bFatCount += parseFloat(doc.docs[i].data().fatCount);
                            } else if (doc.docs[i].data().meType == "L") {
                                lCalCount += parseFloat(doc.docs[i].data().calCount);
                                lFatCount += parseFloat(doc.docs[i].data().fatCount);
                            } else if (doc.docs[i].data().meType == "D") {
                                dCalCount += parseFloat(doc.docs[i].data().calCount);
                                dFatCount += parseFloat(doc.docs[i].data().fatCount);
                            } else if (doc.docs[i].data().meType == "S") {
                                sCalCount += parseFloat(doc.docs[i].data().calCount);
                                sFatCount += parseFloat(doc.docs[i].data().fatCount);
                            }
                        }
                        calCount = [bCalCount.toFixed(2), lCalCount.toFixed(2), dCalCount.toFixed(2), sCalCount.toFixed(2)];
                        fatCount = [bFatCount.toFixed(2), lFatCount.toFixed(2), dFatCount.toFixed(2), sFatCount.toFixed(2)];

                        console.log(calCount);
                        console.log(fatCount);

                    }).then(function () {

                        var myChart = echarts.init(document.getElementById('main'));

                        // specify chart configuration item and data
                        var option = {
                            title: {
                                text: 'Calories/Fat Per Day Chart'
                            },
                            tooltip: {
                                trigger: 'axis'/* ,
                                axisPointer: {
                                    type: 'cross',
                                    label: {
                                        backgroundColor: '#6a7985'
                                    }
                                } */
                            },
                            legend: {
                                data: ['Calories', 'Fat'] //legend name should match series name
                            },
                            xAxis: {
                                data: meals,
                                type: 'category',
                                boundaryGap: true //sets a gap between the first element and the y-axis
                            },
                            yAxis: {},
                            series: [{
                                name: 'Calories',
                                type: 'bar',
                                areaStyle: {},//fill the area under the line
                                data: calCount
                            }, {
                                name: 'Fat',
                                type: 'bar',
                                areaStyle: {}/* ,
                                label: { //shows labels above this line
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                } */,
                                data: fatCount
                            }]
                        };

                        // use configuration item and data specified to show chart
                        myChart.setOption(option, true);

                    });

                }

                //===========================================================================================================================================================

                else if (drawChartSelect == "6") {
                    //console.log("one");
                    var datesArray = [];
                    var bmiArray = [];
                    //console.log(userIdByToken);
                    //console.log(dateFieldValFrom);
                    //console.log(dateFieldValTo);
                    database.collection('userWeight').where('userId', '==', userIdByToken).where('creationDate', '>=', moment(dateFieldValFrom, "MM/DD/YYYY").unix()).where('creationDate', '<=', moment(dateFieldValTo, "MM/DD/YYYY").unix()).orderBy('creationDate').get().then(function (doc) {
                        //console.log(doc);

                        for (var i = 0; i < doc.docs.length; i++) {
                            datesArray.push(moment.unix(doc.docs[i].data().creationDate).format("MM/DD/YYYY"));
                            bmiArray.push(doc.docs[i].data().bmi);
                        }

                        //calCount = [bCalCount.toFixed(2), dCalCount.toFixed(2), lCalCount.toFixed(2), sCalCount.toFixed(2)];
                        //fatCount = [bFatCount.toFixed(2), dFatCount.toFixed(2), lFatCount.toFixed(2), sFatCount.toFixed(2)];

                    }).then(function () {

                        var myChart = echarts.init(document.getElementById('main'));

                        // specify chart configuration item and data
                        var option = {
                            title: {
                                text: 'BMI Progress Chart'
                            },
                            tooltip: {
                                trigger: 'axis'/* ,
                                axisPointer: {
                                    type: 'cross',
                                    label: {
                                        backgroundColor: '#6a7985'
                                    }
                                } */
                            },
                            legend: {
                                data: ['BMI'] //legend name should match series name
                            },
                            xAxis: {
                                data: datesArray,
                                type: 'category',
                                boundaryGap: false //sets a gap between the first element and the y-axis
                            },
                            yAxis: {},
                            series: [{
                                name: 'BMI',
                                type: 'line',
                                areaStyle: {},//fill the area under the line
                                data: bmiArray
                            }]
                        };

                        // use configuration item and data specified to show chart
                        myChart.setOption(option, true);

                    });

                }


                //===========================================================================================================================================================

            });
        });
    }

});


