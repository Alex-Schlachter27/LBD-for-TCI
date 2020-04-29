const newEngine = require('@comunica/actor-init-sparql').newEngine;
const engine = newEngine();

// COMUNICA 
const main = async () => {

    const q = `SELECT * WHERE { <http://web-bim/people/MHRA> ?p ?o } LIMIT 50`;
    const options = { sources: ['http://localhost:3031/PEOPLE/data', 'http://localhost:3031/10401762/data'] };

    try{
        const result = await engine.query(q, options);

        const resultArray = [];

        // All results will be streamed here
        result.bindingsStream.on('data', (data) => {

            // Log result
            console.log(data.toObject());
        
            // Write result to array
            resultArray.push(data.toObject());
        
        });

        // This is when the stream finishes
        result.bindingsStream.on('end', (data) => {
        
            // Log the full result array
            console.log("Stream read finished");
            console.log(resultArray);

        });

    }catch(err){
        console.log(err);
    }
    
}

main();