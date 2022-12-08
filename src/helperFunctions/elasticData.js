const searchKit = require("@searchkit/sdk");
require("cross-fetch/polyfill");


async function handelElasticData(props) {

    const {
        searchQuery,
        vendorFilter,
        domainFilter,
        categoryFilter,
        sortBy,
    } = props;



    const config = {
        host: "https://hklnu053kl:nzh7zulpaj@paid-3-node-9829273760.us-east-1.bonsaisearch.net",
        connectionOptions: {
            headers: {
                authorization: "Basic aGtsbnUwNTNrbDpuemg3enVscGFq",
            }
        },
        index: "pricesure_v3",
        hits: {
            fields: ["rating", "vendor", "title", "category", "price", "discount", "domain"],
        },

        query: new searchKit.MultiMatchQuery({
            fields: ["title^4"],
        }),

        sortOptions: [
            { id: 'discount-descending', field: { discount: 'desc' }, defaultOption: true },
            { id: 'discount-ascending', field: { discount: 'asc' } },
            { id: 'price-ascending', field: { price: 'asc' } },
            { id: 'price-descending', field: { price: 'desc' } }
        ],

        facets: [
            new searchKit.MultiQueryOptionsFacet({
                field: 'domain',
                identifier: 'domain',
                multipleSelect: true,
                label: "domain",
                options: [
                    { value: "galaxydoreen.com", label: "galaxydoreen.com", },
                    { value: "laam.pk", label: "laam.pk", },
                    { value: "secretstash.pk", label: "secretstash.pk", },
                ]
            }),

            new searchKit.RefinementSelectFacet({
                field: 'vendor',
                identifier: 'vendor',
                label: "vandor",
                multipleSelect: true,
            }),

            new searchKit.RefinementSelectFacet({
                field: 'category',
                identifier: 'category',
                label: "category",
                multipleSelect: true,
            }),
        ]
    };


    let filtersList = [];

    if (vendorFilter) {
        vendorFilter.forEach((filterValue) => {
            filtersList.push({ identifier: "vendor", value: filterValue });
        })
    }

    if (domainFilter) {
        domainFilter.forEach((filterValue) => {
            filtersList.push({ identifier: "domain", value: filterValue });
        })
    }

    if (categoryFilter) {
        categoryFilter.forEach((filterValue) => {
            filtersList.push({ identifier: "category", value: filterValue });
        })
    }

    const request = searchKit.default(config);
    const response = await request
        .query(searchQuery)
        .setFilters(filtersList)
        .setSortBy(sortBy)  // here to set the sort, specifying the id
        .execute({
            facets: true,
            hits: {
                from: 0,
                size: 30,
            },
        });

    // console.log(util.inspect(filtersList, { showHidden: true, depth: null, colors: true }));
    // console.log(util.inspect(response, { showHidden: true, depth: null, colors: true }));
    return response;
}

module.exports = { handelElasticData };

// handelElasticData({
    // categoryFilter: ["rici coin", "smartphones"],
    // categoryFilter: ["smartphones"],
    // vendorFilter: ["EMILY", "H&S Collection"],
    // vendorFilter: ["OPPO", "VIVO", "TECNO", "REALME"],
    // searchQuery: "nokia",
    // sortBy: "price-descending"
// });



