const searchKit = require("@searchkit/sdk");
require("cross-fetch/polyfill");


async function handelElasticData(props) {

    const {
        searchQuery, // string value 
        vendorFilter, // array of strings
        domainFilter, // array of strings
        categoryFilter, // array of strings
        discountFilter, // array of strings 
        sortBy, // string value
        hitsSize, // number value
        from, // number value
        hits, //array of strings
    } = props;


    //  user: hklnu053kl
    //  pass: nzh7zulpaj
    
    const config = {
        host: `https://${process.env.ELASTIC_USER}:${process.env.ELASTIC_PASSWORD}@paid-3-node-9829273760.us-east-1.bonsaisearch.net`,
        // host: `https://elastic-search-url.vercel.app/`,
        // host: "https://paid-3-node-9829273760.us-east-1.bonsaisearch.net",
        // connectionOptions: {
        //     headers: {
        //         Authorization: "Basic aGtsbnUwNTNrbDpuemg3enVscGFq",
        //     }
        // },
        index: "pricesure_v3",
        hits: {
            // fields: ["rating", "vendor", "title", "category", "price", "discount", "domain"],
            fields: hits,
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
            // new searchKit.MultiQueryOptionsFacet({
            //     field: 'domain',
            //     identifier: 'domain',
            //     multipleSelect: true,
            //     label: "domain",
            //     options: [
            //         { value: "galaxydoreen.com", label: "galaxydoreen.com", },
            //         { value: "laam.pk", label: "laam.pk", },
            //         { value: "secretstash.pk", label: "secretstash.pk", },
            //     ]
            // }),

            new searchKit.RefinementSelectFacet({
                field: 'domain',
                identifier: 'domain',
                multipleSelect: true,
                label: "domain",
                size: 10000
            }),

            new searchKit.RefinementSelectFacet({
                field: 'vendor',
                identifier: 'vendor',
                multipleSelect: true,
                label: "vendor",
                size: 10000
            }),

            new searchKit.RefinementSelectFacet({
                field: 'category',
                identifier: 'category',
                label: "category",
                multipleSelect: true,
                size: 10000
            }),
        ],

        filters: [
            new searchKit.Filter({
                identifier: "discount",
                field: "discount",
                label: "discount"
            })
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

    if (discountFilter) {
        filtersList.push({ identifier: "discount", min: discountFilter.minDiscount, max: discountFilter.maxDiscount })
    }

    const request = searchKit.default(config);
    const response = await request
        .query(searchQuery)
        .setFilters(filtersList)
        .setSortBy(sortBy)  // here to set the sort, specifying the id
        .execute({
            facets: true,
            hits: {
                from: from ? from : 0,
                size: hitsSize ? hitsSize : 50,
            },
        });

    return response;
}

module.exports = { handelElasticData };

// handelElasticData({
    // categoryFilter: ["rici coin", "smartphones"],
    // categoryFilter: ["smartphones"],
    // vendorFilter: ["EMILY", "H&S Collection"],
    // vendorFilter: ["OPPO", "VIVO", "TECNO", "REALME"],
    // searchQuery: "nokia",
    // sortBy: "price-descending",
    // discountFilter: {minDiscount: 5 , maxDiscount: 70}
    // hitsSize: 40,
// });



