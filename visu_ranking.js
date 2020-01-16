
// const svg = d3.select("#ranking_visu")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);
//
// const sites_to_rank = [];

const DEFAULT_IMPACT = 10;

const ranking = (function(){
    var sites = [];
    function get_rank() {
        return sites.sort((a,b) => d3.descending(a.total*getImpact(a), b.total*getImpact(b)));
    }
    get_rank.reset = () => {
        sites = [];
    };
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
    get_rank.getMinOf = (sitesNames) => {
        let catSites = sites.filter(s => sitesNames.includes(s.website));
        return catSites.filter(s => (s.total*getImpact(s)) === d3.min(catSites, e => e.total*getImpact(e))).shift();
    };
    return get_rank;
})();

function getImpact(s) {
    return (typeof s.impact) === "number" ? s.impact: DEFAULT_IMPACT;
}

function displayRanking() {
    var svg = rank_svg;
    let data = ranking();

    let max = d3.max(data, e => e.total*getImpact(e));

    var x = d3.scaleLinear()
        .range([0, width/2])
        .domain([0, max||1]); // Prevent d3 from complaining
    var color = d3.scaleQuantize().range(["#a50026","#a70226","#a90426","#ab0626","#ad0826","#af0926","#b10b26","#b30d26","#b50f26","#b61127","#b81327","#ba1527","#bc1727","#be1927","#c01b27","#c21d28","#c41f28","#c52128","#c72328","#c92529","#cb2729","#cc2929","#ce2b2a","#d02d2a","#d12f2b","#d3312b","#d4332c","#d6352c","#d7382d","#d93a2e","#da3c2e","#dc3e2f","#dd4030","#de4331","#e04532","#e14733","#e24a33","#e34c34","#e44e35","#e55136","#e75337","#e85538","#e95839","#ea5a3a","#eb5d3c","#ec5f3d","#ed613e","#ed643f","#ee6640","#ef6941","#f06b42","#f16e43","#f17044","#f27346","#f37547","#f37848","#f47a49","#f57d4a","#f57f4b","#f6824d","#f6844e","#f7864f","#f78950","#f88b51","#f88e53","#f89054","#f99355","#f99556","#f99858","#fa9a59","#fa9c5a","#fa9f5b","#fba15d","#fba35e","#fba660","#fba861","#fcaa62","#fcad64","#fcaf65","#fcb167","#fcb368","#fcb56a","#fdb86b","#fdba6d","#fdbc6e","#fdbe70","#fdc071","#fdc273","#fdc474","#fdc676","#fdc878","#fdca79","#fecc7b","#fecd7d","#fecf7e","#fed180","#fed382","#fed584","#fed685","#fed887","#feda89","#fedb8b","#fedd8d","#fede8f","#fee090","#fee192","#fee394","#fee496","#fee698","#fee79a","#fee89b","#feea9d","#feeb9f","#feeca0","#feeda2","#feeea3","#fdefa5","#fdf0a6","#fdf1a7","#fdf2a9","#fcf3aa","#fcf4ab","#fcf5ab","#fbf5ac","#fbf6ad","#faf6ad","#faf7ad","#f9f7ae","#f8f7ae","#f7f8ad","#f7f8ad","#f6f8ad","#f5f8ac","#f4f8ab","#f3f8ab","#f1f8aa","#f0f7a9","#eff7a8","#eef7a6","#edf6a5","#ebf6a4","#eaf6a2","#e8f5a1","#e7f59f","#e6f49d","#e4f39c","#e2f39a","#e1f298","#dff297","#def195","#dcf093","#daef92","#d9ef90","#d7ee8e","#d5ed8d","#d3ec8b","#d2ec89","#d0eb88","#ceea86","#cce985","#cae983","#c8e882","#c6e780","#c4e67f","#c2e57e","#c0e47c","#bee47b","#bce37a","#bae279","#b8e178","#b6e076","#b4df75","#b2de74","#b0dd73","#aedc72","#acdb71","#a9da70","#a7d970","#a5d86f","#a3d86e","#a0d76d","#9ed66c","#9cd56c","#99d36b","#97d26b","#95d16a","#92d069","#90cf69","#8ece68","#8bcd68","#89cc67","#86cb67","#84ca66","#81c966","#7fc866","#7cc665","#79c565","#77c464","#74c364","#71c263","#6fc063","#6cbf62","#69be62","#67bd62","#64bc61","#61ba60","#5eb960","#5cb85f","#59b65f","#56b55e","#53b45e","#51b25d","#4eb15c","#4baf5c","#48ae5b","#46ad5a","#43ab5a","#40aa59","#3da858","#3ba757","#38a557","#36a456","#33a255","#31a154","#2e9f54","#2c9d53","#2a9c52","#289a51","#259950","#23974f","#21954f","#1f944e","#1e924d","#1c904c","#1a8f4b","#188d4a","#178b49","#158948","#148747","#128646","#118446","#108245","#0e8044","#0d7e43","#0c7d42","#0b7b41","#0a7940","#08773f","#07753e","#06733d","#05713c","#04703b","#036e3a","#026c39","#016a38","#006837"].reverse())
        .domain([0, max]);

    var ranks = svg.selectAll("rect")
        .data(data, d => d.website)
        .order()
        .join(
            enter =>
                enter.append("rect")
                    .attr("fill", d => color(d.total*getImpact(d)))
                    .attr("x", 0)
                    .attr("y", (d, i) => (cell.height + cell.margin)*i )
                    .attr("height", cell.height)
                    .attr("width", d => x(d.total*getImpact(d)))
                    .attr("cursor", "pointer")
                    .on("mouseover", function(d) {
                        var elem = d3.select(this);
                        elem.style("fill", d3.rgb(elem.style("fill")).brighter(0.5));
                    })
                    .on('mouseout', function() {
                        var elem = d3.select(this);
                        elem.style("fill", d3.rgb(elem.style("fill")).darker(0.5));
                    })
                    .on("click", (d) => callCompareVisu(d)),
//             .call(enter => enter.transition(t)
//               .attr("fill", "black")
//               .attr("width", d => x(d.total))),
            update => update.attr("fill", d => color(d.total*getImpact(d)))
                .call(update => update.transition(t)
                    .attr("y", (d, i) => (cell.height + cell.margin)*i)
                    .attr("width", d => x(d.total*getImpact(d)))),
            exit => exit.transition(t)
                    .attr("x", d => x(d.total*getImpact(d)))
                    .attr("width", 0)
                    .attr("fill", "white")
                    .remove()
        );

    svg.selectAll("text")
        .data(data, d => d.website)
        .order()
        .join(
            enter => enter
                .append("text")
                .attr("x", 0)
                .attr("y", (d, i) => (cell.height + cell.margin)*i )
                .attr("cursor", "pointer") // Make it look like it is clickable
                .attr("height", cell.height)
                .attr("transform", d => `translate(${x(d.total*getImpact(d)) + cell.margin},${cell.height - cell.margin})`)
                .text(d => `${d.website} (${formatSize(d.total*getImpact(d))})`)
                .on("click", (d) => callCompareVisu(d)),
            update => update.text(d => `${d.website} (${formatSize(d.total*getImpact(d))})`)
                .call(update => update.transition(t)
                    .attr("y", (d, i) => (cell.height + cell.margin)*i)
                    .attr("transform", d => `translate(${x(d.total*getImpact(d)) + cell.margin},${cell.height - cell.margin})`))
        );

    d3.select("#ranking_visu > svg").style("height", `${(cell.height + cell.margin)*data.length + margin.top + margin.bottom}px`);

    bestOfEachCategory();
}

function createCategoryMenu(categories, menu) {
    var categoryTemplate = (category) => `
    		<div class="category-header">
    		        <label class="container" for="check-${getCategoryName(category)}">
                        <input type="checkbox" class="category-check" id="check-${getCategoryName(category)}">
                        <span class="checkmark"></span>
                    </label>
                    <label class="pl-4 ml-3">${category.cat_name}</label>
                    <i class="float-right" role="button" data-toggle="collapse" href="#cat-${getCategoryName(category)}">
                        <span class="glyphicon glyphicon-collapse-down"></span>
					</i>

    		</div>
			`;
    var siteTemplate = (site) => `
                <label class="container" for="check-${getSiteName(site)}">${site.website}
                    <input type="checkbox" id="check-${getSiteName(site)}">
                    <span class="checkmark"></span>
                    <span class="badge badge-primary">${DEFAULT_IMPACT}min/jour</span>
                </label>
				<input class="slider" type="range" min="0" max="240" value="${DEFAULT_IMPACT}"/>
			`;

    var tooltip = container.append('div')
        .attr('class', 'hidden tooltip');

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
        .selectAll(".category > .category-header > label > input")
        .on("change", () => {
            d3.select("#compare_visu").classed("d-none", true);
            let domElem = d3.event.target;
            let categoryName = domElem.id.replace("check-", "");
//           console.log(`Update selection of category '${categoryName}'`);
            d3.select(`#cat-${categoryName}`)
                .selectAll(".site > label> input")
                .property("checked", domElem.checked)
                .dispatch("change");
            if(d3.select("#rankAverage").property("checked")) {
                d3.select("#rankAverage").dispatch("change")
            }
        });

    d3.select("#categories")
        .selectAll(".site")
        .select("input[type=checkbox]")
        .property("checked", "checked")
        .on("change", (d) => {
            d3.select("#compare_visu").classed("d-none", true);
            if(d3.event.target.checked && !d3.select("#rankAverage").property("checked")) {
                ranking.push(d);
            } else { ranking.remove(d); }
            displayRanking();
        });

    d3.select("#categories")
        .selectAll(".site")
        .select("input[type=range]")
        .on("change.impact", (d) => {
            d3.select("#compare_visu").classed("d-none", true);
            ranking.changeImpact(d, +d3.event.target.value);
            displayRanking();
            d3.select("#resetSliders").property("checked", false);
        })
        .on("change.tooltip", function(d) {
            d3.select(this.parentNode)
                .select("label")
                .select(".badge")
                    .text(`${getImpact(d)}min/jour`);
        });

    d3.select("#checkAll")
        .on("change", () => {
            d3.select(`#categories`)
                .selectAll("input.category-check")
                .property("checked", d3.event.target.checked)
                .dispatch("change");
            displayRanking();
        });

    d3.select("#resetSliders")
        .on("change", function() {
            if(d3.event.target.checked) {
                d3.select(`#categories`)
                    .selectAll(".site")
                    .select("input[type=range]")
                    .property("value", DEFAULT_IMPACT)
                    .dispatch("change");
                d3.select(this).property("checked", true);
                displayRanking();
            }

        });

    d3.select("#rankAverage")
        .on("change", () => {
            if(d3.event.target.checked) {
                ranking.reset();
                var categories = d3.select("#categories")
                    .selectAll(".category")
                    .nodes()
                    .filter(c => d3.select(c).select(".category-header").select("input").property("checked"))
                    .map(c => c.__data__);
                categories.forEach(c => ranking.push(c.average));
                displayRanking();
            } else {
                ranking.reset();
                d3.select(`#categories`)
                    .selectAll(".site > label> input")
                    // .property("checked", d => console.log(d))
                    .dispatch("change");
            }
        });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}

function getCategoryName(category) {
    return sanitize(category.cat_name);
}

function getSiteName(site) {
    return sanitize(site.website);
}

function sanitize(text) {
    return text.toLowerCase().replace(" ", "-").replace(".","-")
}

function callCompareVisu(site) {
    let category = d3.select(`#check-${getSiteName(site)}`).node().parentNode.parentNode.parentNode.__data__;
    // console.log(category)
    d3.select("#compare_visu").classed("d-none", false);
    showSimpleConsumption(site, category);
}

function bestOfEachCategory() {
    // Get current rank
    var data = ranking();

    // Get all categories currently shown
    var categories = d3.select("#categories")
        .selectAll(".category")
        .nodes()
        .filter(c => d3.select(c).select(".category-header").select("input").property("checked"))
        .map(c => c.__data__);

    // For each category
    var bestSites = [];
    for (let category of categories) {
        // Get best site of current rank
        let min = ranking.getMinOf(category.sites.map(s => s.website));
        if (min) {
            min.category = category;
            bestSites.push(min);
        }
    }

    var selection = d3.select("#best_sites");

    selection.select("p").remove();
    selection.select("ul").remove();

    selection.append("p")
        .text("Compte tenu de vos paramètres actuels, les sites internet les plus respectueux de votre forfait selon chaque catégorie sont :")
    let selec = selection.append("ul")
        .selectAll("li")
        .data(bestSites)
        .enter()
        .append("li")
        .text(d => `${d.website} (pour la catégorie '${d.category.cat_name}')`);
}
