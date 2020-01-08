// const svg = d3.select("#ranking_visu")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);
//
// const sites_to_rank = [];

const ranking = (function(){
    var sites = [];
    function get_rank() {
        return sites.sort((a,b) => d3.descending(a.total, b.total));
    }
    get_rank.remove = (site) => {
        let idx = sites.findIndex(e => e.website === site.website);
        if(idx !== -1)
            sites.splice(idx, 1);
    };
    get_rank.push = (site) => {
        if(sites.every(e => e.website !== site.website))
            sites.push(site);
    };
    get_rank.changeImpact = (site, impact) => {
        let idx = sites.findIndex(e => e.website === site.website);
        if(idx !== -1) {
            sites[idx].impact = impact
        }
    };
    return get_rank;
})();


function displayRanking() {
    var svg = rank_svg;
    let data = ranking();

    let max = d3.max(data, e => e.total);

//       console.log(`Max is ${max}`, data);

    var x = d3.scaleLinear()
        .range([0, width/2])
        .domain([0, max]);
//       var x = (d) => {
//         let c = xd3(d);
//         console.log(`Checking size of ${d}: ${c}`);
//         return c
//       }

    var ranks = svg.selectAll("rect")
        .data(data, d => d.website)
        .order()
        .join(
            enter =>
                enter.append("rect")
                    .attr("fill", "green")
                    .attr("x", 0)
                    .attr("y", (d, i) => (cell.height + cell.margin)*i )
                    .attr("height", cell.height)
                    .attr("width", d => x(d.total))
                    .on("click", (d) => callCompareVisu(d)),
//             .call(enter => enter.transition(t)
//               .attr("fill", "black")
//               .attr("width", d => x(d.total))),
            update => update.transition(t)
                .attr("y", (d, i) => (cell.height + cell.margin)*i)
                .attr("width", d => x(d.total)),
            exit => exit.attr("fill", "brown")
                .call(exit => exit.transition(t)
                    .attr("x", d => x(d.total))
                    .attr("width", 0)
                    .remove())
        )//.each(d => console.log("Bouhhhh:", d));

    svg.selectAll("text")
        .data(data, d => d.website)
        .order()
        .join(
            enter => enter
                .append("text")
                    .attr("x", 0)
                    .attr("y", (d, i) => (cell.height + cell.margin)*i )
                    .attr("height", cell.height)
                    .attr("transform", d => `translate(${x(d.total) + cell.margin},${cell.height - cell.margin})`)
                    .text(d => d.website)
                    .on("click", (d) => callCompareVisu(d)),
            update => update.transition(t)
                    .attr("y", (d, i) => (cell.height + cell.margin)*i)
                    .attr("transform", d => `translate(${x(d.total) + cell.margin},${cell.height - cell.margin})`)
        )

    d3.select("#ranking_visu > svg").style("height", (cell.height + cell.margin)*data.length + margin.top + margin.bottom)
}

function createCategoryMenu(categories, menu) {
    var categoryTemplate = (category) => `
    		<div class="category-header">
					<input type=checkbox id="check-${getCategoryName(category)}">
					<label for="check-${getCategoryName(category)}">${category.cat_name}</label>
					<a class="btn btn-primary float-right" role="button" data-toggle="collapse" href="#cat-${getCategoryName(category)}">Expand</a>
    		</div>
			`;
    var siteTemplate = (site) => `
				<input type=checkbox id="check-${getSiteName(site)}">
				<label for="check-${getSiteName(site)}">${site.website}</label>
			`;

    category = menu.selectAll(".category")
        .data(categories)
        .enter()
        .append("div")
        .attr("class", "category border-top border-primary mt-2")
        .html(c => categoryTemplate(c))
        .append("div")
        .attr("id", c => `cat-${getCategoryName(c)}`)
        .attr("class", "collapse sites")
        .selectAll(".site")
        .data(c => c.sites)
        .enter()
        .append("div")
        .attr("class", "site ml-3")
        .html(s => siteTemplate(s));

    d3.select("#categories")
        .selectAll(".category > .category-header > input")
        .on("change", () => {
            d3.select("#compare_visu").classed("d-none", true);
            let domElem = d3.event.target;
            let categoryName = domElem.id.replace("check-", "");
//           console.log(`Update selection of category '${categoryName}'`);
            d3.select(`#cat-${categoryName}`)
                .selectAll(".site > input")
                .property("checked", domElem.checked)
                .dispatch("change");
        });

    d3.select("#categories")
        .selectAll(".site")
        .select("input")
        .on("change", (d) => {
            d3.select("#compare_visu").classed("d-none", true);
            if(d3.event.target.checked) { ranking.push(d); }
            else { ranking.remove(d); }
            displayRanking();
        })
}

function getCategoryName(category) {
    return category.cat_name.toLowerCase().replace(" ", "-");
}

function getSiteName(site) {
    return site.website.toLowerCase().replace(" ", "-");
}

function callCompareVisu(site) {
    let category = d3.select(`#check-${getSiteName(site)}`).node().parentNode.parentNode.parentNode.__data__;
    // console.log(category)
    d3.select("#compare_visu").classed("d-none", false);
    showSimpleConsumption(site, category);
}

function bestOfEachCategory() {
    // Get current rank
    // Get all categories currently shown
    // For each category
        // Get best site of current rank
}
