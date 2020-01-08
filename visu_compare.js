const visu_compare_id = "#compare_visu";

var graph = d3.select(visu_compare_id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const container = d3.select(visu_compare_id);

// d3.json("data.json").then(data => {
//     console.warn(data);
//     showSimpleConsumption(, graph, data.categories[1].sites[0], data.categories[1])
// });


function showSimpleConsumption(site, category) {
    var svg = graph;
    svg.selectAll("*").remove();
    // console.log("Site:",site);
    // console.log("Average:",category.average);
    // console.log("Svg:", svg);

    var tooltip = container.append('div')
        .attr('class', 'hidden tooltip');

    var color = d3.scaleQuantize()			.range(["#93c3df","#6daed5","#4b97c9","#2f7ebc","#1864aa","#0a4a90","#08306b"])
        .domain([0, Object.keys(site.data).length]);

    var data = [formatData(site), formatData(category.average)];
    // console.log("data", data)
    var max = d3.max([site, category.average], e => e.total);
    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, max]);

    svg.selectAll("g")
        .data(data)
            .enter()
        .append("g")
            .attr("transform", (d,i) => `translate(0, ${(bar.height+bar.margin)*i})`)
            .each((d,i,n) => siteDataStack(n[i], d));


    svg.selectAll("text").data([site, category.average]).join(
        enter => enter.append("text")
                    .attr("transform", (d,i) => `translate(0, ${(bar.height+bar.margin)*i})`)
                    .text(d => `${d.website} (${formatSubtype("Total", d.total)})`)
    );

    function siteDataStack(svgElem, site) {

        var stack = createStack();

        d3.select(svgElem)
            .selectAll("rect")
            .data(site)
            .enter()
            .append("rect")
            .attr("class", "data")
            .attr("height", 100)
            .attr("fill", (d,i) => color(i))
            .attr("width", (d) => {
//           		console.warn(d.val)
//           		console.log("width scaled:", x(d.val))
                return x(d.val);
            })
            .attr("x", (d, i, arr) => {
                return stack(x(d.val))
            })
            .attr("y", 0)
            .on("mouseover", function(d) {
                var elem = d3.select(this);
                elem.style("fill", d3.rgb(elem.style("fill")).darker(0.5));
            })
            .on('mousemove', function(d) {
                // on recupere la position de la souris
                var mousePos = d3.mouse(this);

                var subtypes = Object.keys(d)
                    .filter(e => typeof d[e] === "object" && !Array.isArray(d[e]));
                subtypes = subtypes.map(s => formatSubtype(s, d[s].val));

                if(subtypes.length === 0) subtypes = formatSubtype("total", d.val);

                let transform = d3.select(svgElem).attr("transform").replace("translate(", "").replace(")","").split(",");
                let offsetX = +transform[0], offsetY = +transform[1];

                tooltip.classed('hidden', false)
                    // on positionne le tooltip en fonction de la position de la souris
                    .attr('style', 'left:' + (mousePos[0] + 15 + offsetX) +
                        'px; top:' + (mousePos[1] - 35 + offsetY) + 'px')
                    // on affiche le nom de l'etat et sa valeur (ou un message d'erreur)
                    .html(`${d.type} (${Array.isArray(subtypes) ? subtypes.join(", "): "<i>"+subtypes+"</i>"})`);
            })
            .on('mouseout', function() {
                // on cache le tooltip
                tooltip.classed('hidden', true);
                var elem = d3.select(this);
                elem.style("fill", d3.rgb(elem.style("fill")).brighter(0.5));
            });
    }
}

function createStack() {
    var items = [];
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return function(item) {
        let totalProportion = items.length > 0 ? items.reduce(reducer): 0;
        items.push(item);
        return totalProportion;
    }
}

function formatData(site) {
    return Object.entries(site.data).map(e => {
        e[1]["type"] = e[0];
        return e[1];
    })
}

function formatSubtype(subtype, subtypeSize) {
    let cpt = 0, size = ["o", "Ko", "Mo", "Go"], val = subtypeSize;
    while(cpt < size.length && val > 1e3) {
        val = val/1e3; cpt++;
    }
    return `${subtype}: ${val.toFixed(2)} ${size[cpt]}`;
}


