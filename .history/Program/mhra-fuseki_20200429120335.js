const newEngine = require('@comunica/actor-init-sparql').newEngine;
const engine = newEngine();

// COMUNICA 
const main = async () => {

    const q = `SELECT * WHERE { <http://web-bim/people/MHRA> ?p ?o } LIMIT 50`;
    const options = { sources: ['http://localhost:3031/PEOPLE/data', 'http://localhost:3031/10401762/data'] };

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