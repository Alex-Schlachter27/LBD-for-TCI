const newEngine = require('@comunica/actor-init-sparql').newEngine;
const engine = newEngine();

// COMUNICA 
const main = async () => {

    const q = `SELECT * WHERE { <https://sbi.dk/ontologies/icc#ConferenceRoomsLowSimultaneity> ?p ?o } LIMIT 50`;

    const dataSources = ['http://localhost:3031/LIBRARY/data'];

    try{
        // const result = await engine.query(q, { sources: dataSources });

        // result.bindingsStream.on('data', (data) => {
        
        //     // Log result
        //     console.log(data);
        //     console.log(data.toObject());
        
        // });
        
        const result = await engine.query('SELECT * WHERE { ?s ?p <http://dbpedia.org/resource/Belgium>. ?s ?p ?o } LIMIT 100',
        { sources: ['/path/to/my/file.ttl'] })
      result.bindingsStream.on('data', (data) => console.log(data.toObject()));


    }catch(err){
        console.log(err);
    }
    
}

main();