const newEngine = require('@comunica/actor-init-sparql').newEngine;
const engine = newEngine();

// COMUNICA 
const main = async () => {

    const q = `SELECT * WHERE { ?s ?p <http://dbpedia.org/resource/Belgium>. ?s ?p ?o } LIMIT 100`;
    const options = { sources: ['http://fragments.dbpedia.org/2015/en'] };

    try{
        const result = await engine.query(q, options)

        result.bindingsStream.on('data', (data) => {
        
            // Log result
            console.log(data.toObject());
        
        });
        
    }catch(err){
        console.log(err);
    }
    
}

main();