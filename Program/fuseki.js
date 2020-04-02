const user = "admin";
const pw = "Niras";
const auth = `Basic ${Buffer.from(`${user}:${pw}`).toString('base64')}`;
const rp = require('request-promise');

module.exports = {

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
                'Accept': 'application/ld+json',
                'Authorization': auth
            },
            json: true
        })
    },

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