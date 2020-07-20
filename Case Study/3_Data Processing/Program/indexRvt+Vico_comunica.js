const fuseki = require('./fuseki');

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const engine = newEngine();

// COMUNICA 
const main = async () => {

const result = await engine.query('SELECT * WHERE { ?s ?p http://localhost:3030/TCI-Demo-test1/data. ?s ?p ?o } LIMIT 50',
  { sources: ['http://localhost:3030/TCI-Demo-test2/data'] })
result.bindingsStream.on('data', (data) => console.log(data.toObject()));

main();


// RECEIVE DATA FROM FUSEKI

// (1.1) Get all wall elements in the datagraph and their required parameters
const getRvt = async () => {

    const endpoint = "http://localhost:3030/TCI-Demo-Revit-data/query";

    const q = `
        PREFIX product: <https://w3id.org/product#>
        PREFIX props: <https://w3id.org/props#>

        SELECT *
        WHERE{
        ?s ?p product:Wall ;
            props:Element_ID ?ID
            
        }
        ORDER BY ?ID`;

// (1.2) Return the wall data as a readable JSON object with key + value
return (await fuseki.getQuery(endpoint, q))
            .map(item => {
                const Revitinst = item.s.value;
                const ID = item.ID.value;
                return {Revitinst, ID};
            });

};


const getVico = async () => {

    const endpoint = "http://localhost:3030/TCI-Demo/query";

    const q = `
        PREFIX product: <https://w3id.org/product#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX lbs:   <http://test/lbs/>

        SELECT *
        WHERE {
            ?VICOinst a lbs:CompLoid.
            ?VICOinst   props:Element_ID            ?Element_ID;
                        lbs:hasCompLoid             ?CompLoid ;
                        lbs:hasLocation             ?Location ;
                        lbs:haslocLoid              ?locLoid ;
                        lbs:hasschedLoid            ?schedLoid ;
                        lbs:hastaskLoid             ?taskLoid ;
                        lbs:taskActualEndDate       ?ActualEndDate ;
                        lbs:taskActualStartDate     ?ActualStartDate ;
                        lbs:taskPlannedEndDate      ?PlannedEndDate ;
                        lbs:taskPlannedStartDate    ?PlannedStartDate ;
                        lbs:taskProgressCompletion  ?ProgressCompletion  ;
                        lbs:taskProgressDate        ?ProgressDate

        }`;

// (1.2) Return the wall data as a readable JSON object with key + value
return (await fuseki.getQuery(endpoint, q))
            .map(item => {
                const VICOinst = item.VICOinst.value;
                const ID = item.Element_ID.value;
                const CompLoid = item.CompLoid.value;
                const Location = item.Location.value;
                const locLoid = item.locLoid.value;
                const schedLoid = item.schedLoid.value;
                const taskLoid = item.taskLoid.value;
                const ActualEndDate = item.ActualEndDate.value;
                const ActualStartDate = item.ActualStartDate.value;
                const PlannedEndDate = item.PlannedEndDate.value;
                const PlannedStartDate = item.PlannedStartDate.value;
                const ProgressCompletion = item.ProgressCompletion.value;
                const ProgressDate = item.ProgressDate.value;
                return {VICOinst, ID, CompLoid, Location, locLoid, schedLoid, taskLoid, PlannedStartDate, PlannedEndDate, ActualStartDate, ActualEndDate, ProgressDate, ProgressCompletion};
            });
};



// MAIN FUNCTION to receive and process the data
const main = async () => {

    const walls = await getRvt();
    const sched = await getVico();

    console.log(walls)
    console.log(sched)


// // WRITE BACK TO FUSEKI


    const wallinstPFX = 'wallinst:  <http://test/walls/>'
    const instPFX = 'inst:  <http://test/VICO/>'
    const tciPFX = 'tci:   <http://test/tci/>'
    const propPFX = 'props:   <https://w3id.org/props#>'
    const rdfPFX = 'rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'
    const owlPFX = 'owl:     <http://www.w3.org/2002/07/owl#>'
    const botPFX = 'bot:     <https://w3id.org/bot#>'
    const rdfsPFX = 'rdfs:    <http://www.w3.org/2000/01/rdf-schema#>'
    const productPFX = 'product: <https://w3id.org/product#>'
    const opmPFX = 'opm:     <https://w3id.org/opm#>'
    const periPFX = 'peri:    <http://test/peri/>'
    const lbsPFX = 'lbs:   <http://test/lbs/>'

    sched.forEach(inst => {
        const 

    })
    

//     // PREFIXES
    var str = `PREFIX ${wallinstPFX}\nPREFIX ${instPFX}\n`
    str+= `PREFIX ${tciPFX}\nPREFIX ${propPFX}\nPREFIX ${rdfPFX}\nPREFIX ${owlPFX}\nPREFIX ${botPFX}\nPREFIX ${rdfsPFX}\nPREFIX ${productPFX}\nPREFIX ${opmPFX}\nPREFIX ${periPFX}\nPREFIX ${lbsPFX}\n\n`
    str+= "INSERT DATA{\n"

//     // CLASSES + INSTANCES

    walls.forEach(wall => {

        const insturl1 = wall.Revitinst;
        const Revitinst = insturl1.split("/").splice(4,1)[0];
        const insturl2 = wall.VICOinst;
        const VICOinst = insturl2.split("/").splice(4,1)[0];

        str+= `wallinst:${Revitinst} owl:sameAs inst:${VICOinst}.\n`

    })

    str+= "}";

    console.log(str)

   
} 

main();