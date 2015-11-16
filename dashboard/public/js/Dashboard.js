queue()
    .defer(d3.json, "/api/data")
    .await(makeGraphs);

function makeGraphs(error, apiData) {
	
//Start Transformations
	var dataSet = apiData;
	var dateFormat = d3.time.format("%m/%d/%Y");
	dataSet.forEach(function(d) {
		d.date = dateFormat.parse(d.date);
		d.retweets = +d.retweets;
        d.favorites = +d.favorites;
        d.polarity = +d.polarity;
        d.subjectivity = +d.subjectivity;
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(dataSet);

	//Define Dimensions
	var date = ndx.dimension(function(d) { return d.date; });
	var topic = ndx.dimension(function(d) { return d.topic; });
    var reporter = ndx.dimension(function(d) { return d.reporter; });
    var polarityGroup = ndx.dimension(function(d) { return d.polarity_group; });
    var subjectivityGroup = ndx.dimension(function(d) { return d.subjectivity_group; });
    var polarity = ndx.dimension(function(d) { return d.polarity; });
    var subjectivity = ndx.dimension(function(d) { return d.subjectivity; });
    var retweets = ndx.dimension(function(d) { return d.retweets; });
    var favorites = ndx.dimension(function(d) { return d.favorites; });
    var team = ndx.dimension(function(d) { return d.team; });

    function remove_empty_bins(source_group) {
        return {
            all:function () {
                return source_group.all().filter(function(d) {
                    return d.value != 0;
                });
            }
        };
    }

	//Calculate metrics
	var tweetByDate = date.group();
    var tweetByReporter = reporter.group().reduceCount();
	var tweetByTopic = topic.group().reduceCount();
	var tweetByPolarityGroup = polarityGroup.group();
	var tweetBySubjectivityGroup = subjectivityGroup.group();
	var teamGroup = team.group();
    var filteredReporter = remove_empty_bins(tweetByReporter)
    var filteredTopic = remove_empty_bins(tweetByTopic)
    
	var all = ndx.groupAll();

	//Calculate Groups
	var netTotalRetweets = ndx.groupAll().reduceSum(function(d) {
        return d.retweets;
    });

    var netTotalFavorites = ndx.groupAll().reduceSum(function(d) {
        return d.favorites;
    });

	//Define threshold values for data
	var minDate = date.bottom(1)[0].date;
	var maxDate = date.top(1)[0].date;

console.log(minDate);
console.log(maxDate);

    //Charts
	var dateChart = dc.lineChart("#date-chart");
	var reporterChart = dc.rowChart("#reporter-chart");
	var topicChart = dc.rowChart("#topic-chart");
	var polarityChart = dc.pieChart("#polarity-chart");
    var subjectivityChart = dc.barChart("#subjectivity-chart");
	var totalTweets = dc.numberDisplay("#total-tweets");
	var netRetweets = dc.numberDisplay("#net-retweets");
    var netFavorites = dc.numberDisplay("#net-favorites")
    ;


  selectField = dc.selectMenu('#menuselect')
        .dimension(team)
        .group(teamGroup); 

       dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);


	totalTweets
		.formatNumber(d3.format(","))
		.valueAccessor(function(d){return d; })
		.group(all);

	netRetweets
		.formatNumber(d3.format(","))
		.valueAccessor(function(d){return d; })
		.group(netTotalRetweets)

    netFavorites
        .formatNumber(d3.format(","))
        .valueAccessor(function(d){return d; })
        .group(netTotalFavorites)

	dateChart
		//.width(600)
		.height(220)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(date)
		.group(tweetByDate)
		.renderArea(true)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Day")
		.yAxis().ticks(6);

	reporterChart
        //.width(300)
        .height(220)
        .dimension(reporter)
        .group(filteredReporter)
        .elasticX(true)
        .xAxis().ticks(4);

	topicChart
		//.width(300)
		.height(220)
        .dimension(topic)
        .group(filteredTopic)
        .elasticX(true)
        .xAxis().ticks(4);

    polarityChart
        .height(220)
        //.width(350)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1000)
        .dimension(polarityGroup)
        .group(tweetByPolarityGroup);

    subjectivityChart
    	//.width(800)
        .height(220)
        .transitionDuration(1000)
        .dimension(subjectivityGroup)
        .group(tweetBySubjectivityGroup)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .centerBar(false)
        .gap(5)
        .elasticY(true)
        .x(d3.scale.ordinal().domain(subjectivityGroup))
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .ordering(function(d){return d.value;})
        .yAxis().ticks(4);;

    dc.renderAll();

};