// const svg = d3.select("#ranking_visu")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);
//
// const sites_to_rank = []; // FIXME


function displayRanking(data) {
    console.log("Displaying rank for", data);
    svg.selectAll("text")
        .data(data.sort(d3.descending))
        .order()
        .join(
            enter => enter.append("text")
                .attr("fill", "green")
                .attr("x", -30)
                .text(d => d.website)
                .call(enter => enter.transition(t)
                    .attr("x", 0)),
            update => update.attr("fill", "black"),
            exit => exit.attr("fill", "brown")
                .call(exit => exit.transition(t)
                    .attr("x", 30)
                    .remove())
        )
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
        .attr("class", "category border-top border-primary")
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
            console.log(`${d3.event.target.checked? "C": "Unc"}hecked '${d.website}'`);
            if(d3.event.target.checked) { sites_to_rank.push(d); }
            else { sites_to_rank = sites_to_rank.filter(e => e.website !== d.website); }
            displayRanking(sites_to_rank);
        })
}

function getCategoryName(category) {
    return category.cat_name.toLowerCase().replace(" ", "-");
}

function getSiteName(site) {
    return site.website.toLowerCase().replace(" ", "-");
}
