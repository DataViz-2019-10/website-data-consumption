function showSimpleConsumption2(svg, site, category) {
    console.log(site)
    var layers = site.array_data;
//       var x = d3.scaleLinear()
//       	.range([0, width/2])
//       	.domain([0, 1000]);
    var x = d3.scaleBand()
        .rangeRound([0, width/2])
        .paddingInner(0.05)
        .align(0.1);
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var names = [site.website, category.average.website]

    var data = [site, category.average];
    console.log(data)
    var keys = [];
    for (key in category.average.data){
        keys.push(key);
    }

    var color = d3.scaleQuantize()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
        .domain([0, site.array_data.length]);
    console.log("array_data length", keys.length)
//       data.forEach(function(d){
//         d.total = 0;
//         keys.forEach(function(k){
//           d.total += d[k];
//         })
//       });

    x.domain(data.map(function(d) {
        return d.website;
    }));
    y.domain([0, site.total]).nice();

    console.log("data", data);
    stack = dataToStackedData(data);
    console.log("stack", stack);

    var stackedData = d3
        .stack()
        .keys(keys)
        (stack); // Note : d3 veut un tableau
    console.log("D3 Stacked data:", stackedData);

    // Based on : https://stackoverflow.com/questions/45941427/d3-stacked-chart-with-json-data

    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) {
            console.log("d",d);
            return color(d.key);
        })
        .selectAll("rect")
        .data(function(d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function(d) {
            console.log(d);
            return x(d.data.website);
        })
        .attr("y", function(d) {
            return y(d[1]);
        })
        .attr("height", function(d) {
            return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth())
        .on("mouseover", function(d) {
            var elem = d3.select(this);
            elem.style("fill", d3.rgb(elem.style("fill")).darker(0.5));
        })
        .on('mouseout', function() {
            // on cache le tooltip
//           tooltip.classed('hidden', true);
            var elem = d3.select(this);
            elem.style("fill", d3.rgb(elem.style("fill")).brighter(0.5));
        });
}

function dataToStackedData(data) {
    var stacked = [];
    data.forEach(site => {
        ob = {};
        ob.website = site.website;
        for([key, d] of Object.entries(site.data)) {
            ob[key] = d.val
        }
        stacked.push(ob);
    });
    return stacked;
}
