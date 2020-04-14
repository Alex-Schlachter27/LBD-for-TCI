const fuseki = require('./fuseki');


// RECEIVE DATA FROM FUSEKI

// (1.1) Get all wall elements in the datagraph and their required parameters
const getWalls = async () => {

    const endpoint = "http://localhost:3030/TCI-Demo/query";

    const q = `
        PREFIX product: <https://w3id.org/product#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX lbs:   <http://test/lbs/>

        SELECT ?Revitinst ?VICOinst ?Element_ID
        WHERE {
            ?Revitinst a product:Wall .
            ?Revitinst props:Element_ID ?Element_ID.
            ?VICOinst a lbs:CompLoid.
            ?VICOinst props:Element_ID ?Element_ID 

            FILTER (?VICOinst != ?Revitinst)
        }`;

// (1.2) Return the wall data as a readable JSON object with key + value
return (await fuseki.getQuery(endpoint, q))
            .map(item => {
                const Revitinst = item.Revitinst.value;
                const ID = item.Element_ID.value;
                const VICOinst = item.VICOinst.value;
                return {Revitinst, VICOinst};
            });

};






// MAIN FUNCTION to receive and process the data
const main = async () => {

    const walls = await getWalls();

    // console.log(walls)

// WRITE BACK TO FUSEKI


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

    // PREFIXES
    var str = `PREFIX ${wallinstPFX}\nPREFIX ${instPFX}\n`
    str+= `PREFIX ${tciPFX}\nPREFIX ${propPFX}\nPREFIX ${rdfPFX}\nPREFIX ${owlPFX}\nPREFIX ${botPFX}\nPREFIX ${rdfsPFX}\nPREFIX ${productPFX}\nPREFIX ${opmPFX}\nPREFIX ${periPFX}\nPREFIX ${lbsPFX}\n\n`
    str+= "INSERT DATA{\n"

    // CLASSES + INSTANCES

    walls.forEach(wall => {

        const insturl1 = wall.Revitinst;
        const Revitinst = insturl1.split("/").splice(4,1)[0];
        const insturl2 = wall.VICOinst;
        const VICOinst = insturl2.split("/").splice(4,1)[0];

        str+= `wallinst:${Revitinst} owl:sameAs inst:${VICOinst}.\n`

    })

    str+= "}";

    console.log(str)


    // (2) Get all wall elements in the datagraph and their required parameters
    const updateWalls = async () => {
        

        const endpoint = "http://localhost:3030/TCI-Demo/update";

        const q = `${str}`;
        console.log(q);


    return (await fuseki.updateQuery(endpoint, q))
        
    };

    updateWalls();

   
} 

main();