am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);
    // Themes end

    var container = am4core.create("chartdiv", am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = "horizontal";


    var chart = container.createChild(am4charts.PieChart);

    // Add data
    chart.data = [{
        "skills": "Amazon Web Services",
        "proficiency": 500,
        "subData": [{ name: "Computing", value: 71 }, { name: "Storage", value: 80 }, { name: "Database", value: 40 }, { name: "Networking & Content Delivery", value: 71 }, { name: "Developer Tools", value: 50 }, { name: "Management & Governance", value: 50 }, { name: "Developer Tools", value: 50 }, { name: "Cost Management", value: 70 }, { name: "Application Integration", value: 40 }, { name: "Security, Identity & Compliance", value: 30 }]
    }, {
        "skills": "Machine Learning Algo",
        "proficiency": 300,
        "subData": [{ name: "XGBoost", value: 100 }, { name: "Reinforcement Learning", value: 50 }, { name: "Forecasting", value: 25 }, { name: "Text Analysis", value: 25 }, { name: "Ensemble Learning", value: 50 }, { name: "Forecasting", Regression: 50 }]
    }, {
        "skills": "Programming Language",
        "proficiency": 200,
        "subData": [{ name: "PySpark", value: 90 }, { name: "SQL", value: 40 }, { name: "Dart", value: 10 }, { name: "HTML", value: 20 }, { name: "CSS", value: 15 }, { name: "Javascript", value: 25 }]
    }, {
        "skills": "Data Analytics Skills",
        "proficiency": 150,
        "subData": [{ name: "Data Visualization", value: 70 }, { name: "Data Cleaning", value: 30 }, { name: "Feature Selection", value: 30 }, { name: "Pandas", value: 20 }]
    }, {
        "skills": "Operating Systems",
        "proficiency": 140,
        "subData": [{ name: "Mac", value: 50 }, { name: "Windows", value: 50 }, { name: "Linux", value: 40 }]
    }];

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "proficiency";
    pieSeries.dataFields.category = "skills";
    pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries.labels.template.text = "{category}\n{value.percent.formatNumber('#.#')}%";

    pieSeries.slices.template.events.on("hit", function(event) {
        selectSlice(event.target.dataItem);
    })

    var chart2 = container.createChild(am4charts.PieChart);
    chart2.width = am4core.percent(30);
    chart2.radius = am4core.percent(80);

    // Add and configure Series
    var pieSeries2 = chart2.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = "value";
    pieSeries2.dataFields.category = "name";
    pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries2.labels.template.radius = am4core.percent(50);
    pieSeries2.labels.template.inside = true;
    //pieSeries2.labels.template.fill = am4core.color("#ffffff");
    pieSeries2.labels.template.disabled = true;
    pieSeries2.ticks.template.disabled = true;
    pieSeries2.alignLabels = false;
    pieSeries2.events.on("positionchanged", updateLines);

    var interfaceColors = new am4core.InterfaceColorSet();

    var line1 = container.createChild(am4core.Line);
    line1.strokeDasharray = "2,2";
    line1.strokeOpacity = 0.5;
    line1.stroke = interfaceColors.getFor("alternativeBackground");
    line1.isMeasured = false;

    var line2 = container.createChild(am4core.Line);
    line2.strokeDasharray = "2,2";
    line2.strokeOpacity = 0.5;
    line2.stroke = interfaceColors.getFor("alternativeBackground");
    line2.isMeasured = false;

    var selectedSlice;

    function selectSlice(dataItem) {

        selectedSlice = dataItem.slice;

        var fill = selectedSlice.fill;

        var count = dataItem.dataContext.subData.length;
        pieSeries2.colors.list = [];
        for (var i = 0; i < count; i++) {
            pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
        }

        chart2.data = dataItem.dataContext.subData;
        pieSeries2.appear();

        var middleAngle = selectedSlice.middleAngle;
        var firstAngle = pieSeries.slices.getIndex(0).startAngle;
        var animation = pieSeries.animate([{ property: "startAngle", to: firstAngle - middleAngle }, { property: "endAngle", to: firstAngle - middleAngle + 360 }], 600, am4core.ease.sinOut);
        animation.events.on("animationprogress", updateLines);

        selectedSlice.events.on("transformed", updateLines);

        //  var animation = chart2.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
        //  animation.events.on("animationprogress", updateLines)
    }


    function updateLines() {
        if (selectedSlice) {
            var p11 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle) };
            var p12 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc) };

            p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
            p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

            var p21 = { x: 0, y: -pieSeries2.pixelRadius };
            var p22 = { x: 0, y: pieSeries2.pixelRadius };

            p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
            p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

            line1.x1 = p11.x;
            line1.x2 = p21.x;
            line1.y1 = p11.y;
            line1.y2 = p21.y;

            line2.x1 = p12.x;
            line2.x2 = p22.x;
            line2.y1 = p12.y;
            line2.y2 = p22.y;
        }
    }

    chart.events.on("datavalidated", function() {
        setTimeout(function() {
            selectSlice(pieSeries.dataItems.getIndex(0));
        }, 1000);
    });


}); // end am4core.ready()