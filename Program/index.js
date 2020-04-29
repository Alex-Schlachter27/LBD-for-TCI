const fuseki = require('./fuseki');
var clone = require('clone');


// RECEIVE DATA FROM FUSEKI

// (1.1) Get all wall elements in the datagraph and their required parameters
const getWalls = async () => {

    const endpoint = "http://localhost:3030/TCI-Demo-Revit-data/query";

    const q = `
        PREFIX product: <https://w3id.org/product#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX tci:   <http://test/tci/>

        SELECT *
        WHERE{
        ?s  tci:pciType product:Wall ;
            props:Element_ID ?ID;
            props:length ?length
            
        }
        ORDER BY ?ID`;

// (1.2) Return the wall data as a readable JSON object with key + value
return (await fuseki.getQuery(endpoint, q))
            .map(item => {
                const wallinst = item.s.value;
                const ID = item.ID.value;
                const length = parseFloat(item.length.value, 10);
                return {wallinst, ID, length};
            });

};
// (2.1) Get all TCI default forms in the datagraph and their required parameters
const getTCIs = async () => {

    const endpoint = "http://localhost:3030/TCI-Demo-TCI/query";

    const q = `
        PREFIX tci: <http://test/tci/>
        PREFIX props: <https://w3id.org/props#>

        SELECT ?TCI ?length ?height ?area ?width ?weight
        WHERE{
        ?TCI ?p tci:DefaultFormwork , tci:Panel;
            props:length ?length;
            props:height ?height;
            props:area ?area;
            props:width ?width;
            props:weight ?weight;

        }`;

// (2.2) Return the TCI data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    const TCIinst = item.TCI.value;  // Name of TCIs (tci Default Primary Formwork)
                    const length = parseFloat(item.length.value, 10); // Length of TCIs (props:length)
                    const height = parseFloat(item.height.value, 10);
                    const area = parseFloat(item.area.value, 10);
                    const width = parseFloat(item.width.value, 10);
                    const weight = parseFloat(item.weight.value, 10);
                    return {TCIinst, length};
                    // return {TCIinst, length, height, area, width, weight};
                });
                // var TCIjson = JSON.parse(TCIs); // Parsing can also be used to access a JSON string in Javascript
};

// (2.1) Get all TCI default forms in the datagraph and their required parameters
const getsecTCIs = async () => {

    const endpoint = "http://localhost:3030/TCI-Demo-TCI/query";

    const q = `
        PREFIX tci: <http://test/tci/>
        PREFIX props: <https://w3id.org/props#>

        SELECT ?secTCI ?weight
        WHERE{
        ?secTCI ?p tci:DefaultFormwork , tci:SecondaryTCI;
            props:weight ?weight .

        }`;

// (2.2) Return the TCI data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    const TCIinst = item.secTCI.value;  // Name of TCIs (tci Default Primary Formwork)
                    const weight = parseFloat(item.weight.value, 10); // Length of TCIs (props:length)
                    return {TCIinst, weight};
                });

};






// MAIN FUNCTION to receive and process the data
const main = async () => {

    const walls = await getWalls();
    const TCIs = await getTCIs();
    const secTCIs = await getsecTCIs();

    // console.log(walls)
    // console.log(TCIs)
    // console.log(secTCIs)

// (3) Specify needed variables and functions for assigning the TCIs from the dataset to each wall element

// Specifies the shortest length in the formwork dataset

    const smallestTCI = TCIs.reduce(
        (acc, tci) =>
            acc.length < tci.length
                ?acc
                : tci
    ); 
    var minLengthOfTCI = smallestTCI.length

// (4) Loop through all walls and take wall length as a variable
    walls.forEach(wall => {
        
        // Create empty TCI object for each wall and for each iteration with a running number where the selected TCI is assigned to
        // Can be done automatically with wall.TCIs.push()
        wall.TCIsIn = [];
        wall.TCIsOut = [];
        wall.secTCIs = [];
        wall.TCIsCount = [];
        wall.TimberFilling = [];
        var count = {};
        var TCIinstarray = [];
            
        var wallLength = wall.length;


        
        // (5) Add biggest form that fits in the wall length to new TCI[i] objects for each wall in the wall list and continue until condition is false

        // Add Instancing number to each added form in order to count the different types per wall
        while (wallLength > minLengthOfTCI) {

            // (7) Find first (=biggest) formwork element in the TCA dataset and if its length is smaller than the wall length, assign it to the TCI array
            var selectedTCI = {};
            selectedTCI = TCIs.find(item => wallLength - item.length > 0.00);
            // console.log(selectedTCI.TCIinst)
            var TCIinstvalue= selectedTCI.TCIinst;
            // var TCIinstarray = [];


            // Count the duplicate TCIs in TCIsIn and give each TCI type a running number to individualize each instance            
            for (i  in wall.TCIsIn) {
                var TCIvalues = Object.values(wall.TCIsIn[i])[0]
                TCIvalues = TCIvalues.split("_").splice(0,1)[0];
                // console.log(TCIvalues)
                TCIinstarray.push(TCIvalues);
                // console.log(TCIinstarray)
                // var count = {};
                // TCIinstarray.forEach(function(i) { count[i] = (count[i]||0) + 1;});  
            }
            var TCIinstcount = 0;
            for (i in TCIinstarray) {
                if (TCIinstvalue == TCIinstarray[i]) {
                    TCIinstcount++;
                    delete TCIinstarray[i];
                }              
            }
            // Count the amount of each TCI type and return as key-value pair
            count[TCIinstvalue]=(TCIinstcount+1)*2;
            // count.TCIclass = TCIinstvalue; // Not working as TCIclass gets overwritten
            // count.Count = TCIinstcount+1;

            TCIinstvalue+= '_'+TCIinstcount;
            selectedTCI.TCIinst = TCIinstvalue;
            // console.log(TCIinstvalue)
            // console.log(selectedTCI.TCIinst)
            // console.log(selectedTCI)
            
            // cloning the variable selected TCI in to not have the numbers add up after each wall iteration
            s = clone(selectedTCI)
            wall.TCIsIn.push(s); 
            // console.log(wall.TCIsIn);
            wall.TCIsOut.push(s);
            
            // Reducing selectedTCI.TCIinst again to the original state
            selectedTCI.TCIinst = selectedTCI.TCIinst.split("_").splice(0,1)[0];


            // (8) Reduce the variable wall length with the legnth of the assigned form --> while loops starts again!

            wallLength -= selectedTCI.length.toFixed(2);
            // console.log(wallLength)
            

            // (9) At the end of the while loop, when wallLength is smaller than smallest available form, the remaining wall length is assigned to timber filling material
            if (wallLength < minLengthOfTCI) {
                const TimberFilling = {
                    TCIinst: 'http://test/tci/TimberFilling', 
                    Length: +parseFloat(wallLength).toFixed(2)
                    };
                wall.TimberFilling.push(TimberFilling)
                wall.TimberFilling.push(TimberFilling)
                count[TimberFilling.TCIinst]=1*2;
            }; 
            // console.log(wall);
            // console.log('END FOR LOOP');
        };

        // (10) Add secondary formwork based on number of panels and wall length

        // Input: Based on length of each array (indicating the number of TCIs) and the total length of the wall,  secondary formwork can be calculated as a rule of thumb
        // Look into PERI product catalogue or Quicksolve to get right numbers!
        // Functions: 

        // Sum of TCI elements per wall (on both side, minus Timber Filling)
            const TCIsum = wall.TCIsIn.length + wall.TCIsOut.length - 2;
            // console.log(TCIsum);

            const bigPanelsIn = wall.TCIsIn.filter((item => item.length > 2.0));
            const bigPanelsOut = wall.TCIsOut.filter((item => item.length > 2.0));
            const bigPanelscount = bigPanelsIn.length + bigPanelsOut.length;
            // console.log(bigPanelscount);

            const smallPanelscount = TCIsum - bigPanelscount;
            // console.log(smallPanelscount);

        
        // Define Secondary TCIs
            var Coupler = secTCIs.find(obj => obj.TCIinst === 'http://test/tci/DefaultCoupler');
            var TieRod = secTCIs.find(obj => obj.TCIinst === 'http://test/tci/DefaultTieRod');
            var Wingnut = secTCIs.find(item => item.TCIinst === 'http://test/tci/DefaultWingnut');
            var PushPullProp = secTCIs.find(item => item.TCIinst === 'http://test/tci/DefaultPushPullProp');
            // var Waler = secTCIs.find(item => item.TCIinst === 'http://test/tci/DefaultWaler');

        // Calculation for both sides of the wall
            const Couplercount = (TCIsum-2)*2;
            const TieRodcount = Wingnutcount = (smallPanelscount*2 + bigPanelscount*4)/2;
            const PushPullPropcount = Math.ceil(wall.length/2)*2
            // console.log(Couplercount);
            // console.log(TieRodcount);
            // console.log(PushPullPropcount);

        // // Create new array and push array to secTCI array
        //     const CouplerArray = Array(Couplercount).fill(Coupler);
        //     const TieRodArray = Array(TieRodcount).fill(TieRod);
        //     const WingnutArray = Array(Wingnutcount).fill(Wingnut);
        //     const PushPullPropArray = Array(PushPullPropcount).fill(PushPullProp);
        //     // console.log(CouplerArray);
        //     // console.log(TieRodArray);

        // wall.secTCIs.push(...CouplerArray, ...TieRodArray, ...WingnutArray, ...PushPullPropArray);
        wall.secTCIs.push(Coupler, TieRod, Wingnut, PushPullProp);
        count[Coupler.TCIinst]=Couplercount;
        count[TieRod.TCIinst]=TieRodcount;
        count[Wingnut.TCIinst]=Wingnutcount;
        count[PushPullProp.TCIinst]=PushPullPropcount;


        // Calculate Waler

    

        // (11) Add Corner, Waler, Concreting Platform, etc.

        // Transform TCIsCount into Array with single objects that specify the TCIinst and count
        TCIsCount = wall.TCIsCount
        const entries = Object.entries(count);

        for (i in entries)
        TCIsCount[i] = {};
        for (i in TCIsCount)
        TCIsCount[i].TCIinst = entries[i][0];
        for (i in TCIsCount)
        TCIsCount[i].Count = entries[i][1]


        });

    // (12) Return new wall list with primary and secondary TCIs for each wall element
    // walls.forEach(wall => {
    //     console.log(wall);
    // //     console.log(wall.secTCIs);
    // });
    //     // console.log(walls[0]);


    // var fs = require("fs");

    // fs.writeFile("./Output.json", JSON.stringify(walls, null, 4), (err) => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     };
    //     console.log("File has been created");
    // });

    // return walls;



// // WRITE BACK TO FUSEKI


    const instPFX = 'wallinst:  <http://test/walls/>'
    const tciPFX = 'tci:   <http://test/tci/>'
    const propPFX = 'props:   <https://w3id.org/props#>'
    const rdfPFX = 'rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'
    const owlPFX = 'owl:     <http://www.w3.org/2002/07/owl#>'
    const botPFX = 'bot:     <https://w3id.org/bot#>'
    const rdfsPFX = 'rdfs:    <http://www.w3.org/2000/01/rdf-schema#>'
    const productPFX = 'product: <https://w3id.org/product#>'
    const opmPFX = 'opm:     <https://w3id.org/opm#>'
    const periPFX = 'peri:    <http://test/peri/>'
    const dtPFX = 'xsd:     <http://www.w3.org/2001/XMLSchema#>'
    const dtdec = 'xsd:decimal'
    const dtint = 'xsd:nonNegativeInteger'
    const hasTCIsIn = 'hasTCIsIn'
    const hasTCIsOut = 'hasTCIsOut'
    const hasTCIs = 'hasTCIs'
    const hassecTCIs = 'hassecTCIs'
    const hasTimberFillinglength = 'hasTimberFillinglength'

    // const TCIprops = Object.keys(walls[0].TCIsIn[0])
    const Lengthprop = Object.keys(walls[0].TCIsIn[0])[1]
    // const Lengthprop = TCIprops[1]
    const secTCIprops = Object.keys(walls[0].secTCIs[0])
    const Weightprop = secTCIprops[1]

    // PREFIXES
    var str = `PREFIX ${instPFX}\n`
    str+= `PREFIX ${tciPFX}\nPREFIX ${propPFX}\nPREFIX ${rdfPFX}\nPREFIX ${owlPFX}\nPREFIX ${botPFX}\nPREFIX ${rdfsPFX}\nPREFIX ${productPFX}\nPREFIX ${opmPFX}\nPREFIX ${periPFX}\n`
    str+= `PREFIX ${dtPFX}\n\n`
    str+= "INSERT DATA{\n"

    // CLASSES + INSTANCES

    walls.forEach(wall => {

        const insturl = wall.wallinst;
        const wallinst = insturl.split("/").splice(4,1)[0];
        const walllength = wall.length;
        // console.log(wallinst)

        str+= `wallinst:${wallinst} props:${Lengthprop} "${walllength}"^^${dtdec}.\n`

        for (i in wall.TCIsIn) {
            const insturl = wall.TCIsIn[i].TCIinst;
            const TCIinst = insturl.split("/").splice(4,1)[0];
            const TCIclass = TCIinst.split("_").splice(0,1)[0];
            const TCIlength = wall.TCIsIn[i].length.toFixed(2);
            // const TCIheight = wall.TCIsIn[i].height;
            // const TCIarea = wall.TCIsIn[i].area;
            // const TCIwidth = wall.TCIsIn[i].width;
            // const TCIweight = wall.TCIsIn[i].weight;
            
            str+= `tci:${TCIclass} props:${Lengthprop} "${TCIlength}"^^${dtdec}.\n`
            str+= `tci:${TCIinst} a tci:${TCIclass}.\n`
            str+= `wallinst:${wallinst} tci:${hasTCIsIn} tci:${TCIinst}.\n`
            str+= `wallinst:${wallinst} tci:${hasTCIs} tci:${TCIclass}.\n`
            // console.log(TCIclass, TCIinst, TCIlength)
        };
        for (i in wall.TCIsOut) {
            const insturl = wall.TCIsOut[i].TCIinst;
            const TCIinst = insturl.split("/").splice(4,1)[0];
            const TCIclass = TCIinst.split("_").splice(0,1)[0];
            const TCIlength = wall.TCIsOut[i].length.toFixed(2);
            // const TCIheight = wall.TCIsOut[i].height;
            // const TCIarea = wall.TCIsOut[i].area;
            // const TCIwidth = wall.TCIsOut[i].width;
            // const TCIweight = wall.TCIsOut[i].weight;

            str+= `tci:${TCIclass} props:${Lengthprop} "${TCIlength}"^^${dtdec}.\n`
            str+= `tci:${TCIinst} a tci:${TCIclass}.\n`
            str+= `wallinst:${wallinst} tci:${hasTCIsOut} tci:${TCIinst}.\n`
            str+= `wallinst:${wallinst} tci:${hasTCIs} tci:${TCIclass}.\n`
            // console.log(TCIclass, TCIinst, TCIlength)
        };
        for (i in wall.TimberFilling) {
            const insturl = wall.TimberFilling[i].TCIinst;
            const TCIclass = insturl.split("/").splice(4,1)[0];
            const TimberFillinglength = wall.TimberFilling[0].Length

            str+= `wallinst:${wallinst} tci:${hasTimberFillinglength} "${TimberFillinglength}"^^${dtdec}.\n`
            str+= `wallinst:${wallinst} tci:${hasTCIs} tci:${TCIclass}.\n`
            // console.log(TCIclass, TimberFillinglength)

        };
        for (i in wall.secTCIs) {
            const insturl = wall.secTCIs[i].TCIinst;
            const secTCIinst = insturl.split("/").splice(4,1)[0];
            const secTCIweight = wall.secTCIs[i].weight;

            str+= `wallinst:${wallinst} tci:${hassecTCIs} tci:${secTCIinst}.\n`
            str+= `tci:${secTCIinst} props:${Weightprop} "${secTCIweight}"^^${dtdec}.\n`
            // console.log(secTCIinst, secTCIweight)
        };
        for (i in wall.TCIsCount) {
            const insturl = wall.TCIsCount[i].TCIinst;
            const TCIclass = insturl.split("/").splice(4,1)[0];
            const TCIsCount = wall.TCIsCount[i].Count;

            str+= `wallinst:${wallinst} tci:count${TCIclass} "${TCIsCount}"^^${dtint}.\n`
            str+= `tci:count${TCIclass} tci:iscounting tci:${TCIclass}.\n`
            // console.log(TCIclass, secTCIweight)
        };

    })

    str+= "}";

    // console.log(str)


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