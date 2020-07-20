const user = "admin";
const pw = "admin";
const auth = `Basic ${Buffer.from(`${user}:${pw}`).toString('base64')}`;
const rp = require('request-promise');

module.exports = {
    // as SELECT QUERY --> used to receive data from a triple store
    getQuery : async (endpoint, q) => {

        const queryResults = await rp({
            method: 'POST',
            uri: endpoint,
            form: {
                query: q
            },
            headers: {
                'Accept': 'application/sparql-results+json',
                'Authorization': auth
            },
            json: true
        });

        return queryResults.results.bindings;
    },

    constructQuery : async (endpoint, q) => {

        return rp({
            method: 'POST',
            uri: endpoint,
            form: {
                query: q
            },
            headers: {
                'Accept': 'application/ld+json', //text/turtle also possible than ld+json
                'Authorization': auth
            },
            json: true
        });
        
    },
    // as INSERT QUERY in SPARQL --> Used to insert query into a dataset
    updateQuery : async (endpoint, q) => {

        return rp({
            method: 'POST',
            uri: endpoint,
            form: {
                update: q
            },
            headers: {
                'Authorization': auth
            }
        })
    }
}