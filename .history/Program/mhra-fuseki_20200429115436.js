const newEngine = require('@comunica/actor-init-sparql').newEngine;
const engine = newEngine();

// COMUNICA 
const main = async () => {

    const q = `SELECT * WHERE { <https://sbi.dk/ontologies/icc#ConferenceRoomsLowSimultaneity> ?p ?o } LIMIT 50`;
    const options = { sources: ['http://localhost:3031/PEOPLE/data'] };

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