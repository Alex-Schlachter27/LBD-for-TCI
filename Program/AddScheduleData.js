const fuseki = require('./fuseki');

// (1) Get all wall elements in the datagraph and their required parameters
const getWalls = async () => {

    const endpoint = "http://localhost:3030/TCI-Demo-Revit-data/query";

    const q = `
        PREFIX product: <https://w3id.org/product#>
        PREFIX props: <https://w3id.org/props#>

        SELECT *
        WHERE{
        ?s ?p product:Wall ;
            props:Element_ID ?ID;
            props:length ?length
            
        }
        ORDER BY ?ID LIMIT 15`;

return (await fuseki.getQuery(endpoint, q))
            .map(item => {
                const wallinst = item.s.value;
                const ID = item.ID.value;
                const Length = item.length.value;
                return {wallinst, ID, Length};
            })

}
// // (1) Get schedule data based on ElementID of all wall elements
// const getSchedule = async () => {

//     const endpoint = "http://localhost:3030/TCI-Demo-LBS/query";

//     const q = `
//         SELECT *
//         WHERE{
//         ?instVICO ?p ?o
//         };

//     return (await fuseki.getQuery(endpoint, q))
//                 .map(item => {
//                     const name = item.instVICO.value; // Name of Component (wall)
//                     const length = Math.round(Math.random() * 10000); // Length of TCIs (props:length)
//                     return {name, length};
//                 })

// // }

// const main = async () => {

//     const walls = await getWalls();
//     const Sched = await getSchedule();

//     walls.forEach(wall => {
//         const wallID = wall.ID
//         const comploid = Sched.comploid
//         const match = Sched.filter(item => item.ID == wall.ID);
//         console.log(wallID, match)
//     })

    // })
    // console.log(walls, Sched)

} 

main();