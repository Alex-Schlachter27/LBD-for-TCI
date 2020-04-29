const newEngine = require('@comunica/actor-init-sparql').newEngine;
const engine = newEngine();

// COMUNICA 
const main = async () => {

    const q = `SELECT * WHERE { ?s ?p ?o } LIMIT 50`;

    const sources = ['http://localhost:3030/TCI-Demo-test1/data', 'http://localhost:3030/TCI-Demo-test2/data'];

    const result = await engine.query('SELECT * WHERE { ?s ?p http://localhost:3030/TCI-Demo-test1/data. ?s ?p ?o } LIMIT 50', sources);

    result.bindingsStream.on('data', (data) => {
        
        // Log result
        console.log(data.toObject())
    
    });

}

main();