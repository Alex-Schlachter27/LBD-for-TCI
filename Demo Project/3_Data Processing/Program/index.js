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
        PREFIX bot:  <https://w3id.org/bot#>

        SELECT *
        WHERE{
        ?s  tci:pciType product:Wall ;
            props:level_simple ?Level ;
            props:Element_ID ?ID;
            props:length ?length ;
            props:angle ?angle .
            OPTIONAL { ?s bot:adjacentElement ?adjacentElements }
            FILTER (?Level = "Level1" || ?Level = "Level2" )
        }
        ORDER BY ?ID`;

// (1.2) Return the wall data as a readable JSON object with key + value
return (await fuseki.getQuery(endpoint, q))
            .map(item => {
                const wallinst = item.s.value;
                const ID = item.ID.value;
                const length = parseFloat(item.length.value, 10);
                const angle = parseFloat(item.angle.value, 10);
                const adjacentElements = item.adjacentElements.value;
                return {wallinst, ID, length, angle, adjacentElements};
            });

};
// (2.1) Get all TCI default panel forms in the datagraph and their required parameters
const getTCIs = async () => {

    const endpoint = "http://localhost:3030/TCI-Demo-TCI/query";

    const q = `
        PREFIX tci: <http://test/tci/>
        PREFIX props: <https://w3id.org/props#>

        SELECT ?TCI ?length ?height ?area ?width ?weight
        WHERE{
        ?TCI ?p tci:DefaultFormwork , tci:Panel ;
            props:length ?length;
            props:height ?height;
            props:area ?area;
            props:width ?width;
            props:weight ?weight .

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
// (3.1) Get all TCI default corner forms in the datagraph and their required parameters
const getCorTCIs = async () => {

    const endpoint = "http://localhost:3030/TCI-Demo-TCI/query";

    const q = `
        PREFIX tci: <http://test/tci/>
        PREFIX props: <https://w3id.org/props#>

        SELECT ?Corner ?length ?height ?area ?width ?weight
        WHERE{

        ?Corner ?p tci:DefaultFormwork, tci:CornerPanel ;
                props:length ?length ;
                props:height ?height;
                props:area ?area;
                props:width ?width;
                props:weight ?weight .

        }`;

    
// (3.2) Return the TCI data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    const TCIinst = item.Corner.value
                    const length = parseFloat(item.length.value, 10);
                    const height = parseFloat(item.height.value, 10);
                    const area = parseFloat(item.area.value, 10);
                    const width = parseFloat(item.width.value, 10);
                    const weight = parseFloat(item.weight.value, 10);
                    return {TCIinst, length};
                    // return {TCIinst, length, height, area, width, weight};
                });
};

// (4.1) Get all secondary TCI default forms in the datagraph and their required parameters
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

// (4.2) Return the TCI data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    const TCIinst = item.secTCI.value;  // Name of TCIs (tci Default Primary Formwork)
                    const weight = parseFloat(item.weight.value, 10); // Length of TCIs (props:length)
                    return {TCIinst, weight};
                });

};

// (5.1) Get all default Primary TCI elements in the datagraph and their required parameters
const getdefprimTCIs = async () => {

    const endpoint = 'http://localhost:3030/TCI-Demo-TCI/query';

    const q = `
        PREFIX owl:   <http://www.w3.org/2002/07/owl#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX tci:   <http://test/tci/>
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

        SELECT *  
        WHERE{

                ?defprimTCI    a  tci:DefaultPrimTCI ;
                                tci:countedBy ?Countprop ;
                                tci:hasMonthlyRent ?MRent ;
            }
        ORDER BY ?defprimTCI`;

    // (3.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    const defprimTCI = item.defprimTCI.value;
                    const Countprop = item.Countprop.value;
                    const MRent = parseFloat(item.MRent.value, 10);
                    return {defprimTCI, Countprop, MRent};
                });
};




// MAIN FUNCTION to receive and process the data
const main = async () => {

    const wallsRaw = await getWalls();
    const TCIs = await getTCIs();
    const CorTCIs = await getCorTCIs();
    const secTCIs = await getsecTCIs();
    const rentTCIs = await getdefprimTCIs();
    // console.log(wallsRaw)

    var TCIs2 = JSON.parse(JSON.stringify( TCIs ));
    var CorTCIs2 = JSON.parse(JSON.stringify( CorTCIs ));
    var secTCIs2 = JSON.parse(JSON.stringify( secTCIs ));

    const TCIsAll = [];
    Array.prototype.push.apply(TCIsAll, TCIs2)
    Array.prototype.push.apply(TCIsAll, CorTCIs2)
    Array.prototype.push.apply(TCIsAll, secTCIs2)
    for (i in TCIsAll) {
        delete TCIsAll[i].length ;
        delete TCIsAll[i].weight ;
        TCIsAll[i].Count = 0;
    }
    // console.log(TCIsAll)
    // console.log(TCIs)
    // console.log(CorTCIs)
    // console.log(secTCIs)
    // console.log(rentTCIs)

    // WALL preparation
    var walls = [];

    wallsRaw.forEach(function(item) {
    var existing = walls.filter(function(v, i) {
        return v.wallinst == item.wallinst;
    });

    if (existing.length) {
        var existingIndex = walls.indexOf(existing[0]);
        walls[existingIndex].adjacentElements = walls[existingIndex].adjacentElements.concat(item.adjacentElements);
    } else {
        if (typeof item.adjacentElements == 'string')
        item.adjacentElements = [item.adjacentElements];
        walls.push(item);
    }
    });

    // console.dir(walls);

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
        // console.log(wallLength);

        // CORNER CALCULATION
        wall.Connections = [];
        var Connection1 = {};
        var Connection2 = {};
    
        var adjacentWall1 = wall.adjacentElements[0]
        var adjacentWall2 = wall.adjacentElements[1]
        // console.log(adjacentWall1, adjacentWall2)


        var ajdWallinst1 = walls.find(item => adjacentWall1 === item.wallinst);
        var adjWallOrientation1 = ajdWallinst1.angle
        var ajdWallinst2 = walls.find(item => adjacentWall2 === item.wallinst);
        var adjWallOrientation2 = ajdWallinst2.angle
        var adjacentWall1 = {'wallinst': adjacentWall1, 'orientation': adjWallOrientation1}
        var adjacentWall2 = {'wallinst': adjacentWall2, 'orientation': adjWallOrientation2}
        var adjacentWalls = [adjacentWall1, adjacentWall2]
        // console.log(adjacentWalls)
        for (i in adjacentWalls) {
            if (wall.angle == adjacentWalls[i].orientation || Math.abs(wall.angle - adjacentWalls[i].orientation) == 180) {
                wall.Connections.push({'wallinst': adjacentWalls[i].wallinst, 'ConnectionType': 'horizontal', 'angle': 0})
                // Connection1.angle = 0;
                // Connection1.ConnectionType = 'horizontal' 
            } else {
                    wall.Connections.push({'wallinst': adjacentWalls[i].wallinst, 'ConnectionType': 'corner_90', 'angle': 90})
                    // Connection1.angle = 90;
                    // Connection1.ConnectionType = 'corner_90' 
            }}    
        // wall.Connections.push(Connection1, Connection2)
        // console.log(wall)
             
        // REDUCING WALL LENGTH IF CORNER CONNECTION
        var InsideCorner = CorTCIs.find(obj => obj.TCIinst === 'http://test/tci/DefaultInsideCorner330x20');
        var OutsideCorner = CorTCIs.find(obj => obj.TCIinst === 'http://test/tci/DefaultOutsideCorner330x60');

        const Cornercount = wall.Connections.reduce((accum,item) => accum + item.angle, 0);
        Iv = Object.values(InsideCorner)[1];
        Ov = Object.values(OutsideCorner)[1];

        if (Cornercount == 90) {
            wallLength -= (0.20+0.20);
            InsideCorner1 = {'TCIinst': InsideCorner.TCIinst + '_0', 'length': Iv};
            OutsideCorner1 = {'TCIinst': OutsideCorner.TCIinst + '_0', 'length': Ov};
            wall.TCIsIn.push(InsideCorner1);
            wall.TCIsOut.push(OutsideCorner1);
            count[InsideCorner.TCIinst]=0.5;
            count[OutsideCorner.TCIinst]=0.5;
        } else if (Cornercount == 180) {
            wallLength -= 2*(0.20+0.20);
            InsideCorner1 = {'TCIinst': InsideCorner.TCIinst + '_0', 'length': Iv};
            InsideCorner2 = {'TCIinst': InsideCorner.TCIinst + '_1', 'length': Iv};
            OutsideCorner1 = {'TCIinst': OutsideCorner.TCIinst + '_0', 'length': Ov};
            OutsideCorner2 = {'TCIinst': OutsideCorner.TCIinst + '_1', 'length': Ov};
            wall.TCIsIn.push(InsideCorner1, InsideCorner2);
            wall.TCIsOut.push(OutsideCorner1, OutsideCorner2);
            count[InsideCorner.TCIinst]=0.5*2;
            count[OutsideCorner.TCIinst]=0.5*2;
        }
        // console.log(wall)

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
                // console.log(TCIvalues)
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
                if (TimberFilling.Length > 0) {
                    count[TimberFilling.TCIinst]=1*2 }
                else {
                    count[TimberFilling.TCIinst]=0 }; 
            };
            // console.log(wall);
            // console.log('END FOR LOOP');
        };

        // (10) Add secondary formwork based on number of panels and wall length

        // Input: Based on length of each array (indicating the number of TCIs) and the total length of the wall,  secondary formwork can be calculated as a rule of thumb
        // Look into PERI product catalogue or Quicksolve to get right numbers!
        // Functions: 

        // Sum of TCI elements per wall (on both side)
            const TCIsum = wall.TCIsIn.length + wall.TCIsOut.length;
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
            const Couplercount = (TCIsum)*2;
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

        // console.log(count)
    
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

        // Add TCIs which are not selected with count=0 from array TCIsAll
        var ids = new Set(TCIsCount.map(d => d.TCIinst));
        wall.TCIsCount = [...TCIsCount, ...TCIsAll.filter(d => !ids.has(d.TCIinst))];
        // console.log(wall.TCIsCount);

        // Add monthly TCI Rent to each wall
        var MonthlyRent = 0

        for (i in rentTCIs) {
        const defprimTCI0 = rentTCIs[i].defprimTCI.split("/").splice(4,1)[0];
        const MRent0 = rentTCIs[i].MRent

        selectedTCI = wall.TCIsCount.filter(item => item.TCIinst.split("/").splice(4,1)[0] === defprimTCI0)
        MonthlyRent += MRent0*selectedTCI[0].Count
        }
        wall.MonthlyRent = MonthlyRent.toFixed(2)


        // ADD TIME INFORMATION TO WALLS

            var installationTimeTCI_h = wall.length*0.5 ;
            var strippingTimeTCI_h = 12.0 ;
            var dismantlingTimeTCI_h = wall.length*0.5 ;

            wall.installationTimeTCI_h = installationTimeTCI_h.toFixed(2)
            wall.strippingTimeTCI_h = strippingTimeTCI_h.toFixed(2)
            wall.dismantlingTimeTCI_h = dismantlingTimeTCI_h.toFixed(2)

    });

    // (12) Return new wall list with primary and secondary TCIs for each wall element
    // walls.forEach(wall => {
    //     console.log(wall);
    // //     console.log(wall.secTCIs);

    // });


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
        const installationTimeTCI_h = wall.installationTimeTCI_h ;
        const strippingTimeTCI_h = wall.strippingTimeTCI_h ;
        const dismantlingTimeTCI_h = wall.dismantlingTimeTCI_h ;
        const MonthlyRent = wall.MonthlyRent

        // console.log(wallinst)

        str+= `wallinst:${wallinst} props:${Lengthprop} "${walllength}"^^${dtdec}.\n`
        str+= `wallinst:${wallinst} tci:hasMonthlyTCIRent "${MonthlyRent}"^^${dtdec}.\n`
        str+= `wallinst:${wallinst} tci:installationTimeTCI_h "${installationTimeTCI_h}"^^${dtdec}.\n`
        str+= `wallinst:${wallinst} tci:strippingTimeTCI_h "${strippingTimeTCI_h}"^^${dtdec}.\n`
        str+= `wallinst:${wallinst} tci:dismantlingTimeTCI_h "${dismantlingTimeTCI_h}"^^${dtdec}.\n`

        
        const insturl1 = wall.Connections[0].wallinst;
        const insturl2 = wall.Connections[1].wallinst;
        const adjacentWall1 = insturl1.split("/").splice(4,1)[0];
        const ConnectionType1 = wall.Connections[0].ConnectionType;
        const angle1 = wall.Connections[0].angle;
        const adjacentWall2 = insturl2.split("/").splice(4,1)[0];
        const ConnectionType2 = wall.Connections[1].ConnectionType;
        const angle2 = wall.Connections[1].angle;

        str+= `wallinst:${wallinst} tci:adjacentWall1 wallinst:${adjacentWall1}.\n`
        str+= `wallinst:${wallinst} tci:connectionType1 "${ConnectionType1}".\n`
        str+= `wallinst:${wallinst} tci:cornerAngle1 "${angle1}"^^xsd:int.\n`
        str+= `wallinst:${wallinst} tci:adjacentWall2 wallinst:${adjacentWall2}.\n`
        str+= `wallinst:${wallinst} tci:connectionType2 "${ConnectionType2}".\n`
        str+= `wallinst:${wallinst} tci:cornerAngle2 "${angle2}"^^xsd:int.\n`
        
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
        

        const endpoint = "http://localhost:3030/TCI-Demo-Revit+TCIn/update";

        const q = `${str}`;
        console.log(q);


    return (await fuseki.updateQuery(endpoint, q))
        
    };

    updateWalls();

   
} 

main();