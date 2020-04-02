const fuseki = require('./fuseki');


const getWalls = async () => {

    const endpoint = "http://localhost:3031/PEOPLE/query";

    const q = `
        PREFIX nir: <https://www.bim.niras.com/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX schema: <http://schema.org/>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        
        SELECT *
        WHERE{
        ?stg a nir:WebBIMSession ;
            prov:startedAtTime ?t
        } ORDER BY ?t
        LIMIT 10`;

    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    const name = item.stg.value;
                    const length = Math.round(Math.random() * 10000);
                    return {name, length};
                })

}

const getTCIs = async () => {

    const endpoint = "http://localhost:3031/PEOPLE/query";

    const q = `
        PREFIX nir: <https://www.bim.niras.com/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX schema: <http://schema.org/>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        
        SELECT *
        WHERE{
        ?stg a nir:WebBIMSession ;
            prov:startedAtTime ?t
        } ORDER BY ?t`;

    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    const name = item.stg.value;
                    const length = Math.round(Math.random() * 10000);
                    return {name, length};
                })

}

const main = async () => {

    const walls = await getWalls();
    const TCIs = await getTCIs();

    walls.forEach(wall => {
        const wallLength = wall.length;
        const match = TCIs.filter(item => item.length > wallLength);
        console.log(match)
    })

}

main();