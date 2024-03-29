const newEngine = require('@comunica/actor-init-sparql').newEngine;
const engine = newEngine();

// COMUNICA 
const main = async () => {

    const q = `SELECT * WHERE { ?s ?p ?o } LIMIT 50`;

    const sources = ['http://localhost:3031/TCI-Demo-test1/query', 'http://localhost:3031/TCI-Demo-test2/query'];

    try{
        const result = await engine.query(q, sources);

        result.bindingsStream.on('data', (data) => {
        
            // Log result
            console.log(data.toObject())
        
        });

    }catch(err){
        console.log(err);
    }
    
}

main();