$('#dateFieldSearchFrom').datepicker({
    uiLibrary: 'bootstrap'
});

$('#dateFieldSearchTo').datepicker({
    uiLibrary: 'bootstrap'
});

$("#drawChart").on("click", function () {

    event.preventDefault();
    var bCalCount = 0;
    var bFatCount = 0;
    var lCalCount = 0;
    var lFatCount = 0;
    var dCalCount = 0;
    var dFatCount = 0;
    var sCalCount = 0;
    var sFatCount = 0;
    var meals = ['B', 'D', 'L', 'S'];
    var calCount = [];
    var fatCount = [];
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
                            text: 'Graph'
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
                            data: ['W'] //legend name should match series name
                        },
                        xAxis: {
                            data: datesArray,
                            type: 'category',
                            boundaryGap: false //sets a gap between the first element and the y-axis
                        },
                        yAxis: {},
                        series: [{
                            name: 'W',
                            type: 'line',
                            areaStyle: {},//fill the area under the line
                            stack: '1',
                            data: weightsArray
                        }]
                    };

                    // use configuration item and data specified to show chart
                    myChart.setOption(option);

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
                            text: 'Graph'
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
                            data: ['F'] //legend name should match series name
                        },
                        xAxis: {
                            data: datesArray,
                            type: 'category',
                            boundaryGap: false //sets a gap between the first element and the y-axis
                        },
                        yAxis: {},
                        series: [{
                            name: 'F',
                            type: 'line',
                            areaStyle: {},//fill the area under the line
                            stack: '1',
                            data: fatArray
                        }]
                    };

                    // use configuration item and data specified to show chart
                    myChart.setOption(option);

                });

            }

            //===========================================================================================================================================================

            else if (drawChartSelect == "3") { }

            //===========================================================================================================================================================

            else if (drawChartSelect == "4") { }

            //===========================================================================================================================================================

            else if (drawChartSelect == "5") {
                //console.log("five");

                database.collection('logger').where('userId', '==', userIdByToken).where('creationDate', '==', dateFieldValFrom).get().then(function (doc) {
                    //console.log(doc);


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
                    calCount = [bCalCount.toFixed(2), dCalCount.toFixed(2), lCalCount.toFixed(2), sCalCount.toFixed(2)];
                    fatCount = [bFatCount.toFixed(2), dFatCount.toFixed(2), lFatCount.toFixed(2), sFatCount.toFixed(2)];
                }).then(function () {

                    var myChart = echarts.init(document.getElementById('main'));

                    // specify chart configuration item and data
                    var option = {
                        title: {
                            text: 'Graph'
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
                            data: ['C', 'F'] //legend name should match series name
                        },
                        xAxis: {
                            data: meals,
                            type: 'category',
                            boundaryGap: false //sets a gap between the first element and the y-axis
                        },
                        yAxis: {},
                        series: [{
                            name: 'C',
                            type: 'line',
                            areaStyle: {},//fill the area under the line
                            stack: '1',
                            data: calCount
                        }, {
                            name: 'F',
                            type: 'line',
                            areaStyle: {}/* ,
                            label: { //shows labels above this line
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            } */,
                            stack: '2',
                            data: fatCount
                        }]
                    };

                    // use configuration item and data specified to show chart
                    myChart.setOption(option);

                });

            }

            //===========================================================================================================================================================

        });
    });
});


function arrayDistinctValues(value, index, self) {
    return self.indexOf(value) === index;
};