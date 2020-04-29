const newEngine = require('@comunica/actor-init-sparql-file').newEngine;
const engine = newEngine();
const path = require('path');

// COMUNICA 
const main = async () => {

    const q = `SELECT * WHERE { ?s ?p ?o } LIMIT 50`;

    const fileFolder = path.join(__dirname, '../3.0_Data Graphs RDF');  // Path to folder with files (__dirname is current directory)
    
    // List of file paths
    const filePaths = [
        path.join(fileFolder, 'Revit Data-Graph.ttl'),
        path.join(fileFolder, 'RevitLBS Data-Graph.ttl')
    ];

    try{
        const result = await engine.query(q, { sources: filePaths });
        console.log(result);

        // result.bindingsStream.on('data', (data) => {
        
        //     // Log result
        //     console.log(data.toObject());
        
        // });

    }catch(err){
        console.log(err);
    }
    
}

main();