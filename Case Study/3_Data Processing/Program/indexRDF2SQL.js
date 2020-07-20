const fuseki = require('./fuseki');
const sql = require('mssql')
var _ = require('lodash');


// RECEIVE OUTPUT DATA FROM FUSEKI


// (1.1) Get all wall elements in the datagraph and their required parameters
const getRvt = async () => {

    const endpoint = 'http://localhost:3030/TCI-CaseStudy/query';

    const q = `
        PREFIX owl:   <http://www.w3.org/2002/07/owl#>
        PREFIX product: <https://w3id.org/product#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX tci:   <http://test/tci/>

        SELECT *  
        WHERE{
                ?s  tci:pciType         product:Wall ;
                    props:Element_ID    ?ID ;
                    owl:sameAs          ?VICOinst ;
                    tci:pciType         ?PCIType ;
                    props:wallType      ?wallType ;
                    props:length        ?Length ;
                    props:height        ?Height ;
                    props:area          ?Area ;
                    props:level_simple  ?Level ;
                    tci:adjacentWall1   ?adjacentWall1 ;
                    tci:adjacentWall2   ?adjacentWall2 ;
                    tci:connectionType1 ?connectionType1 ;
                    tci:connectionType2 ?connectionType2 ;
                    tci:cornerAngle1    ?cornerAngle1 ;
                    tci:cornerAngle2    ?cornerAngle2 ;
                    
            }
        ORDER BY ?ID`;

    // (1.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.s.value;
                    const ElementID = item.ID.value;
                    const VICOinst = item.VICOinst.value;
                    const PCIType = item.PCIType.value;
                    const wallType = item.wallType.value;
                    const Length = item.Length.value;
                    const Height = item.Height.value;
                    const Area = item.Area.value;
                    const Level = item.Level.value;
                    const adjacentWall1 = item.adjacentWall1.value;
                    const adjacentWall2 = item.adjacentWall2.value;
                    const connectionType1 = item.connectionType1.value;
                    const connectionType2 = item.connectionType2.value;
                    const cornerAngle1 = item.cornerAngle1.value;
                    const cornerAngle2 = item.cornerAngle2.value;
                    return {ElementID, VICOinst, PCIType, wallType, Length, Height, Area, Level, adjacentWall1, adjacentWall2, connectionType1, connectionType2, cornerAngle1, cornerAngle2};
                    // return {ElementID, PCIType, wallType, Length, Height, Area, Level, adjacentWall1, adjacentWall2, connectionType1, connectionType2, cornerAngle1, cornerAngle2};
                });
};


// (2.1) Get tasks based on each individual PCI

const getTasks = async () => {

    const endpoint = 'http://localhost:3030/TCI-CaseStudy/query';

    const q = `
    PREFIX product: <https://w3id.org/product#>
    PREFIX props: <https://w3id.org/props#>
    PREFIX lbs:   <http://test/lbs/>

    
    SELECT ?Element_ID ?VICOinst ?ElementLoid ?Description ?ElementType ?CompLoid ?takeOffID ?Location ?locLoid ?Level ?schedLoid ?taskName ?taskLoid ?PlannedStartDate ?PlannedEndDate ?ActualStartDate ?ActualEndDate ?ProgressDate ?ProgressCompletion ?projectGUID

    WHERE {
        ?Revitinst a product:Wall ;
            props:Element_ID ?Element_ID ;
            props:level_simple ?Level .
            
        ?VICOinst a lbs:VICOelement.
        ?VICOinst   props:Element_ID            ?Element_ID;
                    lbs:hasElementLoid          ?ElementLoid ;
                    lbs:description             ?Description ;
                    lbs:elementType             ?ElementType ;
                    lbs:hasCompLoid             ?CompLoid ;
                    lbs:hastakeOffID            ?takeOffID ;
                    lbs:hasLocation             ?Location ;
                    lbs:haslocLoid              ?locLoid ;
                    lbs:hasschedLoid            ?schedLoid ;
                    lbs:hastaskName             ?taskName ;
                    lbs:hastaskLoid             ?taskLoid ;
                    lbs:taskActualEndDate       ?ActualEndDate ;
                    lbs:taskActualStartDate     ?ActualStartDate ;
                    lbs:taskPlannedEndDate      ?PlannedEndDate ;
                    lbs:taskPlannedStartDate    ?PlannedStartDate ;
                    lbs:taskProgressCompletion  ?ProgressCompletion  ;
                    lbs:taskProgressDate        ?ProgressDate ;
                    lbs:hasprojectGUID          ?projectGUID .

                    FILTER (?VICOinst != ?Revitinst)               
                }
            ORDER BY ?ID`;

    // (2.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    const ElementLoid = item.ElementLoid.value;
                    const ElementID = item.Element_ID.value;
                    const Description = item.Description.value;
                    const ElementType = item.ElementType.value;
                    const CompLoid = item.CompLoid.value;
                    const takeOffID = item.takeOffID.value;
                    const Level = item.Level.value
                    const Location = item.Location.value;
                    const locLoid = item.locLoid.value;
                    const schedLoid = item.schedLoid.value;
                    const taskName = item.taskName.value ;
                    const taskLoid = item.taskLoid.value;
                    const ActualEndDate = item.ActualEndDate.value;
                    const ActualStartDate = item.ActualStartDate.value;
                    const PlannedEndDate = item.PlannedEndDate.value;
                    const PlannedStartDate = item.PlannedStartDate.value;
                    const ProgressCompletion = item.ProgressCompletion.value;
                    const ProgressDate = item.ProgressDate.value;
                    const projectGUID = item.projectGUID.value
                    return {ElementLoid, ElementID, Description, ElementType, CompLoid, takeOffID, taskLoid, Location, locLoid, Level, schedLoid, taskName, PlannedStartDate, PlannedEndDate, ActualStartDate, ActualEndDate, ProgressDate, ProgressCompletion, projectGUID};
                });
};

// (3.1) Get all default Primary TCI elements in the datagraph and their required parameters
const getdefTCIs = async () => {

    const endpoint = 'http://localhost:3030/TCI-CaseStudy/query';

    const q = `
        PREFIX owl:   <http://www.w3.org/2002/07/owl#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX tci:   <http://test/tci/>
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

        SELECT *  
        WHERE{

                {?TCIs    a  tci:DefaultPrimTCI ;
                                tci:tciType ?TCIType ;
                                tci:supportsPCIType ?PCIType ;
                                props:length ?Length ;
                                props:height ?Height ;
                                props:area ?Area ;
                                props:width ?Width ;
                                props:weight ?Weight ;
                                tci:countedBy ?Countprop ;
                                tci:hasSRF ?SRF ;
                                tci:hasMonthlyRent ?MRent ;
                                tci:hasProductState ?ProductState }
                UNION
                {?TCIs    a  tci:DefaultSecTCI ;
                    tci:tciType ?TCIType ;
                    tci:supportsPCIType ?PCIType ;
                    props:length ?Length ;
                    props:height ?Height ;
                    props:area ?Area ;
                    props:width ?Width ;
                    props:weight ?Weight ;
                    tci:countedBy ?Countprop ;
                    tci:hasSRF ?SRF ;
                    tci:hasMonthlyRent ?MRent ;
                    tci:hasProductState ?ProductState }
            }
        ORDER BY ?TCIs`;

    // (3.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.s.value;
                    const TCIs = item.TCIs.value;
                    const TCIType = item.TCIType.value;
                    const PCIType = item.PCIType.value;
                    const Length = item.Length.value;
                    const Height = item.Height.value;
                    const Area = item.Area.value;
                    const Width = item.Width.value;
                    const Weight = item.Weight.value;
                    const Countprop = item.Countprop.value;
                    const SRF = item.SRF.value;
                    const MRent = item.MRent.value;
                    const ProductState = item.ProductState.value;
                    return {TCIs, ProductState, TCIType, PCIType, Length, Height, Area, Width, Weight, Countprop, SRF, MRent};
                });
};


// (5.1) Get all Primary PERI TCIs in the datagraph and their required parameters
const getprimMX15 = async () => {

    const endpoint = 'http://localhost:3030/TCI-CaseStudy/query';

    const q = `
        PREFIX owl:   <http://www.w3.org/2002/07/owl#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX tci:   <http://test/tci/>
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX peri:  <http://test/peri/>

        SELECT *  
        WHERE{
                ?PeriPrimTCI     a  tci:PeriPrimTCI;
                            tci:hasArtNo ?ArtNo ;
                            tci:supportsPCIType ?PCIType ;
                            tci:isSupportedBy ?secTCI ;
                            props:length ?Length ;
                            props:height ?Height ;
                            props:area ?Area ;
                            props:width ?Width ;
                            props:weight ?Weight ;
                            tci:hasSRF ?SRF ;
                            tci:hasMonthlyRent ?MRent ;
                            tci:hasProductState ?ProductState ;
            }
        ORDER BY ?PeriPrimTCI`;

    // (5.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.s.value;
                    const PeriPrimTCI = item.PeriPrimTCI.value;
                    const PCIType = item.PCIType.value;
                    const isSupportedBy = item.secTCI.value;
                    const Length = item.Length.value;
                    const Height = item.Height.value;
                    const Area = item.Area.value;
                    const Width = item.Width.value;
                    const Weight = item.Weight.value;
                    const ArtNo = item.ArtNo.value;
                    const SRF = item.SRF.value;
                    const MRent = item.MRent.value;
                    const ProductState = item.ProductState.value;
                    return {PeriPrimTCI, ProductState, ArtNo, PCIType, isSupportedBy, Length, Height, Area, Width, Weight, SRF, MRent};
                });
};

// (6.1) Get all secondary PERI TCIs in the datagraph and their required parameters
const getsecMX15 = async () => {

    const endpoint = 'http://localhost:3030/TCI-CaseStudy/query';

    const q = `
        PREFIX owl:   <http://www.w3.org/2002/07/owl#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX tci:   <http://test/tci/>
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX peri:  <http://test/peri/>

        SELECT *  
        WHERE{
                ?PeriSecTCI     a  tci:PeriSecTCI;
                            tci:hasArtNo ?ArtNo ;
                            tci:supportsPCIType ?PCIType ;
                            tci:supportsTCI ?primTCI ;
                            props:length ?Length ;
                            props:height ?Height ;
                            props:width ?Width ;
                            props:weight ?Weight ;
                            tci:hasSRF ?SRF ;
                            tci:hasProductState ?ProductState ;
            }
        ORDER BY ?PeriSecTCI`;

    // (6.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.s.value;
                    const PeriSecTCI = item.PeriSecTCI.value;
                    const PCIType = item.PCIType.value;
                    const supportsTCI = item.primTCI.value;
                    const Length = item.Length.value;
                    const Height = item.Height.value;
                    const Width = item.Width.value;
                    const Weight = item.Weight.value;
                    const ArtNo = item.ArtNo.value;
                    const SRF = item.SRF.value;
                    const ProductState = item.ProductState.value;
                    return {PeriSecTCI, ProductState, ArtNo, PCIType, supportsTCI, Length, Height, Width, Weight, SRF};
                });
};


// (7.1) Get all wall elements in the datagraph and their required parameters
const getTCIcalc = async () => {

    const endpoint = 'http://localhost:3030/TCI-CaseStudy/query';

    const q = `
        PREFIX owl:   <http://www.w3.org/2002/07/owl#>
        PREFIX product: <https://w3id.org/product#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX tci:   <http://test/tci/>

        SELECT *  
        WHERE{
                ?s  tci:pciType   product:Wall ;
                    props:Element_ID ?ID ;
                    owl:sameAs ?VICOinst ;
                    tci:countDefaultPanel270x45    ?countDefaultPanel270x45 ;
                    tci:countDefaultPanel270x60    ?countDefaultPanel270x60 ;
                    tci:countDefaultPanel270x90     ?countDefaultPanel270x90 ;
                    tci:countDefaultPanel270x120    ?countDefaultPanel270x120 ;
                    tci:countDefaultPanel270x240    ?countDefaultPanel270x240 ;
                    tci:countDefaultOutsideCorner270x55    ?countDefaultOutsideCorner270x55 ;
                    tci:countDefaultInsideCorner270x20    ?countDefaultInsideCorner270x20 ;
                    tci:countDefaultCoupler    ?countDefaultCoupler ;
                    tci:countDefaultPushPullProp    ?countDefaultPushPullProp ;
                    tci:countDefaultTieRod    ?countDefaultTieRod ;
                    tci:countDefaultWingnut    ?countDefaultWingnut ;
                    tci:countDefaultWaler    ?countDefaultWaler ;
                    tci:countTimberFilling    ?countTimberFilling ;
                    tci:hasTimberFillinglength    ?hasTimberFillinglength ;
                    tci:hasMonthlyTCIRent    ?hasMonthlyTCIRent
            }
        ORDER BY ?ID`;

    // (7.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.s.value;
                    const ElementID = item.ID.value;
                    const VICOinst = item.VICOinst.value;
                    const countDefaultPanel270x45 = item.countDefaultPanel270x45.value;
                    const countDefaultPanel270x60 = item.countDefaultPanel270x60.value;
                    const countDefaultPanel270x90 = item.countDefaultPanel270x90.value;
                    const countDefaultPanel270x120 = item.countDefaultPanel270x120.value;
                    const countDefaultPanel270x240 = item.countDefaultPanel270x240.value;
                    const countDefaultOutsideCorner270x55 = item.countDefaultOutsideCorner270x55.value;
                    const countDefaultInsideCorner270x20 = item.countDefaultInsideCorner270x20.value;
                    const countDefaultCoupler = item.countDefaultCoupler.value;
                    const countDefaultPushPullProp = item.countDefaultPushPullProp.value;
                    const countDefaultTieRod = item.countDefaultTieRod.value;
                    const countDefaultWingnut = item.countDefaultWingnut.value;
                    const countDefaultWaler = item.countDefaultWaler.value;
                    const countTimberFilling = item.countTimberFilling.value;
                    const hasTimberFillinglength = item.hasTimberFillinglength.value;
                    const hasMonthlyTCIRent = item.hasMonthlyTCIRent.value;
                    return {ElementID, VICOinst, countDefaultPanel270x45, countDefaultPanel270x60, countDefaultPanel270x90, countDefaultPanel270x120, countDefaultPanel270x240, countDefaultOutsideCorner270x55, countDefaultInsideCorner270x20, countDefaultCoupler, countDefaultPushPullProp, countDefaultTieRod, countDefaultWingnut, countDefaultWaler, countTimberFilling, hasTimberFillinglength, hasMonthlyTCIRent};
                    // return {ElementID, countDefaultPanel270x45, countDefaultPanel270x60, countDefaultPanel270x90, countDefaultPanel270x120, countDefaultPanel270x240, countDefaultOutsideCorner270x55, countDefaultInsideCorner270x20, countDefaultCoupler, countDefaultPushPullProp, countDefaultTieRod, countDefaultWingnut, countDefaultWaler, countTimberFilling, hasTimberFillinglength, hasMonthlyTCIRent};
                });
};

// (8.1) Get all wall elements in the datagraph and their required parameters
const getTCITime = async () => {

    const endpoint = 'http://localhost:3030/TCI-CaseStudy/query';

    const q = `
            PREFIX product: <https://w3id.org/product#>
            PREFIX props: <https://w3id.org/props#>
            PREFIX lbs:   <http://test/lbs/>
            PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>	
            PREFIX ont:  <http://test/ontology/>
            PREFIX tci:   <http://test/tci/>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    

        SELECT ?Element_ID ?VICOinst ?PCIType ?taskLoid ?PlannedStartDate ?PlannedEndDate ?ActualStartDate ?ActualEndDate ?ProgressDate ?ProgressCompletion ?installationTimeTCI_h ?strippingTimeTCI_h ?dismantlingTimeTCI_h

        WHERE {
        ?Revitinst a product:Wall ;
            props:Element_ID ?Element_ID ;
            tci:pciType ?PCIType ;
            tci:installationTimeTCI_h ?installationTimeTCI_h ;
            tci:strippingTimeTCI_h ?strippingTimeTCI_h ;
            tci:dismantlingTimeTCI_h ?dismantlingTimeTCI_h .
                
        ?VICOinst a lbs:VICOelement ;
            props:Element_ID ?Element_ID ;
            lbs:hastaskLoid   ?taskLoid;
            lbs:taskPlannedStartDate ?PlannedStartDate;
            lbs:taskPlannedEndDate ?PlannedEndDate;
            lbs:taskActualStartDate ?ActualStartDate;
            lbs:taskActualEndDate ?ActualEndDate;
            lbs:taskProgressDate ?ProgressDate ;
            lbs:taskProgressCompletion ?ProgressCompletion .
            
        FILTER (?VICOinst != ?Revitinst)
        }
        ORDER BY ?Element_ID`;

    // (8.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.Revitinst.value;
                    const ElementID = item.Element_ID.value;
                    const VICOinst = item.VICOinst.value;
                    const PCIType = item.PCIType.value;
                    const taskLoid = item.taskLoid.value;
                    const ActualEndDate = item.ActualEndDate.value;
                    const ActualStartDate = item.ActualStartDate.value;
                    const PlannedEndDate = item.PlannedEndDate.value;
                    const PlannedStartDate = item.PlannedStartDate.value;
                    const ProgressCompletion = item.ProgressCompletion.value;
                    const ProgressDate = item.ProgressDate.value;
                    const installationTimeTCI_h = item.installationTimeTCI_h.value;
                    const strippingTimeTCI_h = item.strippingTimeTCI_h.value;
                    const dismantlingTimeTCI_h = item.dismantlingTimeTCI_h.value;
                    return {ElementID, VICOinst, PCIType, taskLoid, PlannedStartDate, PlannedEndDate, ActualStartDate, ActualEndDate, ProgressDate, ProgressCompletion, installationTimeTCI_h, strippingTimeTCI_h, dismantlingTimeTCI_h};
                });
};


// (9.1) Get all wall elements in the datagraph and their required parameters
const getTCILoc = async () => {

    const endpoint = 'http://localhost:3030/TCI-CaseStudy/query';

    const q = `
    PREFIX product: <https://w3id.org/product#>
    PREFIX props: <https://w3id.org/props#>
    PREFIX lbs:   <http://test/lbs/>
    PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>	
    PREFIX ont:  <http://test/ontology/>
    PREFIX tci:   <http://test/tci/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    
    SELECT ?locLoid ?Location ?countDefaultPanel270x45 ?countDefaultPanel270x60 ?countDefaultPanel270x90 ?countDefaultPanel270x120 ?countDefaultPanel270x240 ?countDefaultOutsideCorner270x55 ?countDefaultInsideCorner270x20 ?countDefaultCoupler ?countDefaultPushPullProp ?countDefaultTieRod ?countDefaultWingnut ?countDefaultWaler ?countTimberFilling ?hasTimberFillinglength
            WHERE {
      
                ?VICOinst lbs:haslocLoid   ?locLoid;
                          lbs:hasLocation   ?Location .
      
                ?Revitinst  owl:sameAs ?VICOinst ;
                            # tci:pciType product:Wall ;
                            tci:countDefaultPanel270x45    ?countDefaultPanel270x45 ;
                            tci:countDefaultPanel270x60    ?countDefaultPanel270x60 ;
                            tci:countDefaultPanel270x90     ?countDefaultPanel270x90 ;
                            tci:countDefaultPanel270x120    ?countDefaultPanel270x120 ;
                            tci:countDefaultPanel270x240    ?countDefaultPanel270x240 ;
                            tci:countDefaultOutsideCorner270x55    ?countDefaultOutsideCorner270x55 ;
                            tci:countDefaultInsideCorner270x20    ?countDefaultInsideCorner270x20 ;
                            tci:countDefaultCoupler    ?countDefaultCoupler ;
                            tci:countDefaultPushPullProp    ?countDefaultPushPullProp ;
                            tci:countDefaultTieRod    ?countDefaultTieRod ;
                            tci:countDefaultWingnut    ?countDefaultWingnut ;
                            tci:countDefaultWaler    ?countDefaultWaler ;
                            tci:countTimberFilling    ?countTimberFilling ; 
                            tci:hasTimberFillinglength    ?hasTimberFillinglength .
                    
                FILTER (?VICOinst != ?Revitinst)
                }
                ORDER BY ?locLoid`;
        

    // (9.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.s.value;
                    const locLoid = item.locLoid.value;
                    const Location = item.Location.value;
                    const countDefaultPanel270x45 = parseFloat(item.countDefaultPanel270x45.value, 10);
                    const countDefaultPanel270x60 = parseFloat(item.countDefaultPanel270x60.value, 10);
                    const countDefaultPanel270x90 = parseFloat(item.countDefaultPanel270x90.value, 10);
                    const countDefaultPanel270x120 = parseFloat(item.countDefaultPanel270x120.value, 10);
                    const countDefaultPanel270x240 = parseFloat(item.countDefaultPanel270x240.value, 10);
                    const countDefaultOutsideCorner270x55 = parseFloat(item.countDefaultOutsideCorner270x55.value, 10);
                    const countDefaultInsideCorner270x20 = parseFloat(item.countDefaultInsideCorner270x20.value, 10);
                    const countDefaultCoupler = parseFloat(item.countDefaultCoupler.value, 10);
                    const countDefaultPushPullProp = parseFloat(item.countDefaultPushPullProp.value, 10);
                    const countDefaultTieRod = parseFloat(item.countDefaultTieRod.value, 10);
                    const countDefaultWingnut = parseFloat(item.countDefaultWingnut.value, 10);
                    const countDefaultWaler = parseFloat(item.countDefaultWaler.value, 10);
                    const countTimberFilling = parseFloat(item.countTimberFilling.value, 10);
                    const hasTimberFillinglength = parseFloat(item.hasTimberFillinglength.value, 10);
                    return {locLoid, Location, countDefaultPanel270x45, countDefaultPanel270x60, countDefaultPanel270x90, countDefaultPanel270x120, countDefaultPanel270x240, countDefaultOutsideCorner270x55, countDefaultInsideCorner270x20, countDefaultCoupler, countDefaultPushPullProp, countDefaultTieRod, countDefaultWingnut, countDefaultWaler, countTimberFilling, hasTimberFillinglength};
                });
};




// MAIN FUNCTION to receive, process insert the data
const main = async () => {

    const walls = await getRvt();
    const tasks = await getTasks();
    const tcis = await getdefTCIs();
    const tcicalc = await getTCIcalc();
    const primMX15 = await getprimMX15();
    const secMX15 = await getsecMX15();
    const tciTime = await getTCITime();
    const tciLoc = await getTCILoc();

    // console.log(walls)
    // console.log(tasks)
    // console.log(tcis)
    // console.log(tcicalc)
    // console.log(primMX15)
    // console.log(secMX15)
    // console.log(tciTime)
    // console.log(tciLoc)

    const projectGUID = tasks[0]['projectGUID']
    // console.log(projectGUID)


    // CONNECT TO MS SQL SERVER

    // (1) Configuration of SQL Access

    const config = {
        user: 'exicute_rmlvkojaqpacysgercjpmyxrp',
        password: 'Q8Neh*ikRnsVEu6WtA5L',
        server: 'exigo-prod.database.windows.net', // OR 'localhost', if stored in own server! You can use 'localhost\\instance' to connect to named instance
        database: 'exicute_rmlvkojaqpacysgercjpmyxrp',
    }

   // (2) Connect to SQL Server

   sql.connect(config, (err) => {

    if (err) console.log(err);
    console.log('Connected!')

    // (3.1) CREATE Table rvtPCIs //

        // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

        // Create new Request Object
        let sqlRequest1 = new sql.Request();

        // Define Table Name
        const Table1 = 'rvtPCIs'

        // Get Variables for Column Names
        const ID1 = Object.keys(walls[0])[0]
        const VICOinst = Object.keys(walls[0])[1]
        const PCIType = Object.keys(walls[0])[2]
        const wallType = Object.keys(walls[0])[3]
        const Length = Object.keys(walls[0])[4]
        const Height = Object.keys(walls[0])[5]
        const Area = Object.keys(walls[0])[6]
        const Level = Object.keys(walls[0])[7]
        const adjacentWall1 = Object.keys(walls[0])[8]
        const adjacentWall2 = Object.keys(walls[0])[9]
        const connectionType1 = Object.keys(walls[0])[10]
        const connectionType2 = Object.keys(walls[0])[11]
        const cornerAngle1 = Object.keys(walls[0])[12]
        const cornerAngle2 = Object.keys(walls[0])[13]

        // console.log(ID1, VICOinst, PCIType, Length, Height, Area, Level, adjacentWall1, adjacentWall2, connectionType1, connectionType2, cornerAngle1, cornerAngle2)

        // Query to the database --> DROP, Create Table with columns names
        var str=`DROP TABLE ${Table1};\n`
        // var str=`CREATE TABLE ${Table1} (ID INT IDENTITY(1,1) NOT NULL, ${ID1} int NOT NULL PRIMARY KEY, ${VICOinst} varchar(80), ${PCIType} TEXT, ${Length} decimal(10,2), ${Height} decimal(10,2), ${Area} decimal(10,2), ${Level} TEXT);\n`;
        str+=`CREATE TABLE ${Table1} (ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY, ${ID1} int NOT NULL, ${VICOinst} varchar(80), ${PCIType} varchar(500), ${wallType} varchar(500), ${Length} decimal(10,2), ${Height} decimal(10,2), ${Area} decimal(10,2), ${Level} varchar(500), ${adjacentWall1} varchar(500), ${adjacentWall2} varchar(500), ${connectionType1} varchar(500), ${connectionType2} varchar(500), ${cornerAngle1} int, ${cornerAngle2} int, projectGUID varchar(200));\n`;
        // str+=`CREATE TABLE ${Table1} (ID INT IDENTITY(1,1) NOT NULL, ${ID1} int NOT NULL PRIMARY KEY, ${VICOinst} varchar(80));\n`;


        // (2) INSERT Data for each wall instance into Columns

        walls.forEach(wall => {

            const ID1 = wall.ElementID
            const VICOinst = wall.VICOinst.split("/").splice(4,1)[0];
            const PCIType = wall.PCIType.split("#").splice(1,1)[0]; // PCIType = Wall
            const wallType = wall.wallType.split("/").splice(4,1)[0];
            const Length = wall.Length
            const Height = wall.Height
            const Area = wall.Area
            const Level = wall.Level
            const adjacentWall1 = wall.adjacentWall1.split("/").splice(4,1)[0]
            const adjacentWall2 = wall.adjacentWall2.split("/").splice(4,1)[0]
            const connectionType1 = wall.connectionType1
            const connectionType2 = wall.connectionType2
            const cornerAngle1 = wall.cornerAngle1
            const cornerAngle2 = wall.cornerAngle2

            // INSERT Query
            str+=`INSERT INTO ${Table1} VALUES (${ID1}, '${VICOinst}', '${PCIType}', '${wallType}', ${Length}, ${Height}, ${Area}, '${Level}', '${adjacentWall1}', '${adjacentWall2}', '${connectionType1}', '${connectionType2}', ${cornerAngle1}, ${cornerAngle2}, '${projectGUID}');\n`
            // str+=`INSERT INTO ${Table1} VALUES (${ID1}, "${VICOinst}");\n`


        })
        // console.log(str)
    
        sqlRequest1.query(str, (err) => {

            if (err) console.log(err)
            console.log(`New Table ${Table1} is created`)

        // Close the connection --> Keep it open if you want to perform more operations!
        sql.close();
        });




    // (3.2) CREATE Table tciTasks //

        // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

        // Create new Request Object
        let sqlRequest2 = new sql.Request();

        // Define Table Name
        const Table2 = 'tciTasks'

        // Get Variables for Column Names
        const ElementLoid = Object.keys(tasks[0])[0]
        const ID2 = Object.keys(tasks[0])[1]
        const Description = Object.keys(tasks[0])[2]
        const ElementType = Object.keys(tasks[0])[3]
        const CompLoid = Object.keys(tasks[0])[4]
        const takeOffID = Object.keys(tasks[0])[5]
        const taskLoid = Object.keys(tasks[0])[6]
        const Location = Object.keys(tasks[0])[7]
        const locLoid = Object.keys(tasks[0])[8]
        const Level2 = Object.keys(tasks[0])[9]
        const schedLoid = Object.keys(tasks[0])[10]
        const taskName = Object.keys(tasks[0])[11]
        const PlannedStartDate = Object.keys(tasks[0])[12]
        const PlannedEndDate = Object.keys(tasks[0])[13]
        const ActualStartDate = Object.keys(tasks[0])[14]
        const ActualEndDate = Object.keys(tasks[0])[15]
        const ProgressDate = Object.keys(tasks[0])[16]
        const ProgressCompletion = Object.keys(tasks[0])[17]

        // console.log(CompLoid, taskLoid, ID2, Location, locLoid, schedLoid, PlannedStartDate, PlannedEndDate, ActualStartDate, ActualEndDate, ProgressDate, ProgressCompletion)

        // Query to the database --> DROP, Create Table with columns names
        var str=`DROP TABLE ${Table2};\n`
        // var str=`CREATE TABLE ${Table2} (ID INT IDENTITY(1,1) NOT NULL, ${CompLoid} varchar(80) NOT NULL PRIMARY KEY, ${taskLoid} varchar(80), ${ID2} int, ${Location} varchar(500), ${locLoid} varchar(80), ${schedLoid} varchar(80), ${PlannedStartDate} datetime, ${PlannedEndDate} datetime, ${ActualStartDate} datetime NULL, ${ActualEndDate} datetime NULL, ${ProgressDate} datetime NULL, ${ProgressCompletion} decimal(3,2) NULL);\n`;
        // str+=`CREATE TABLE ${Table2} (ID INT IDENTITY(1,1) NOT NULL, ${CompLoid} varchar(80) NOT NULL PRIMARY KEY, ${taskLoid} varchar(80), ${ID2} int, ${Location} varchar(500), ${locLoid} varchar(80), ${schedLoid} varchar(80), ${PlannedStartDate} datetime, ${PlannedEndDate} datetime, ${ActualStartDate} datetime NULL, ${ActualEndDate} datetime NULL, ${ProgressDate} datetime NULL, ${ProgressCompletion} decimal(3,2) NULL);\n`;
        str+=`CREATE TABLE ${Table2} (ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY, ${ElementLoid} varchar(80) NOT NULL, ${ID2} int, ${Description} text, ${ElementType} varchar(80), ${CompLoid} varchar(80), ${takeOffID} varchar(80), ${taskLoid} varchar(80), ${Location} varchar(500), Building varchar(500), ${locLoid} varchar(80), ${Level2} varchar(80), ${schedLoid} varchar(80), ${taskName} varchar(500), ${PlannedStartDate} datetime, ${PlannedEndDate} datetime, ${ActualStartDate} text NULL, ${ActualEndDate} text NULL, ${ProgressDate} text NULL, ${ProgressCompletion} decimal(3,2) NULL, projectGUID varchar(200));\n`;

        // (2) INSERT Data for each wall instance into Columns

        tasks.forEach(task => {

            const ElementLoid = task.ElementLoid ; 
            const ID2 = task.ElementID ;
            const Description = task.Description ;
            const ElementType = task.ElementType ;
            const CompLoid = task.CompLoid ;
            const takeOffID = task.takeOffID ;
            const taskLoid = task.taskLoid
            const Building = task.Location.slice(0,4)
            const Location = task.Location
            const locLoid = task.locLoid
            const Level2 = task.Level
            const schedLoid = task.schedLoid
            const taskName = task.taskName
            const PlannedStartDate = task.PlannedStartDate
            const PlannedEndDate = task.PlannedEndDate
            const ActualStartDate = task.ActualStartDate
            const ActualEndDate = task.ActualEndDate
            const ProgressDate = task.ProgressDate
            const ProgressCompletion = task.ProgressCompletion

            // INSERT Query
            // str+=`INSERT INTO ${Table2} VALUES ('${CompLoid}', '${taskLoid}', ${ID2}, '${Location}', '${locLoid}', '${schedLoid}', CAST('${PlannedStartDate}' AS datetime), CAST('${PlannedEndDate}' AS datetime), CAST('${ActualStartDate}' AS datetime), CAST('${ActualEndDate}' AS datetime), CAST('${ProgressDate}' AS datetime), ${ProgressCompletion});\n`;
            str+=`INSERT INTO ${Table2} VALUES ('${ElementLoid}', ${ID2}, '${Description}', '${ElementType}', '${CompLoid}', '${takeOffID}', '${taskLoid}', '${Location}', '${Building}', '${locLoid}', '${Level2}', '${schedLoid}', '${taskName}', '${PlannedStartDate}', '${PlannedEndDate}', '${ActualStartDate}', '${ActualEndDate}', '${ProgressDate}', ${ProgressCompletion}, '${projectGUID}');\n`;
            // CAST(NULLIF('${ActualStartDate}','') AS datetime),
            // CAST((CASE WHEN '${ActualStartDate}'='' THEN NULL ELSE '${ActualStartDate}' END) AS datetime)
        })
        console.log(str)
    
        sqlRequest2.query(str, (err) => {

            if (err) console.log(err)
            console.log(`New Table ${Table2} is created`)

    //     // Close the connection --> Keep it open if you want to perform more operations!
        sql.close();
        });

    
    
    // (3.3) CREATE Table TCIs //

        // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

        // Create new Request Object
        let sqlRequest3 = new sql.Request();

        // Define Table Name
        const Table3 = 'TCIs'

        // Get Variables for Column Names
        const TCIs = Object.keys(tcis[0])[0]
        const ProductState3 = Object.keys(tcis[0])[1]
        const TCIType3 = Object.keys(tcis[0])[2]
        const PCIType3 = Object.keys(tcis[0])[3]
        const Length3 = Object.keys(tcis[0])[4]
        const Height3 = Object.keys(tcis[0])[5]
        const Area3 = Object.keys(tcis[0])[6]
        const Width3 = Object.keys(tcis[0])[7]
        const Weight3 = Object.keys(tcis[0])[8]
        const Countprop3 = Object.keys(tcis[0])[9]
        const SRF3 = Object.keys(tcis[0])[10]
        const MRent3 = Object.keys(tcis[0])[11]
        

        // console.log(defprimTCI, ProductState3, PCIType3, isSupportedBy3, Length3, Height3, Area3, Width3, Weight3, Countprop3, SRF3, MRent3)

        // Query to the database --> DROP, Create Table with columns names
        var str=`DROP TABLE ${Table3};\n`
        str+=`CREATE TABLE ${Table3} (ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY, ${TCIs} varchar(500) NOT NULL, ${ProductState3} varchar(80), ${TCIType3} varchar(500), ${PCIType3} varchar(500), ${Length3} TEXT NULL, ${Height3} TEXT NULL, ${Area3} TEXT NULL, ${Width3} TEXT NULL, ${Weight3} decimal(10,2), ${Countprop3} varchar(500), ${SRF3} varchar(500), ${MRent3} decimal(10,2), projectGUID varchar(200));\n`;

        // (2) INSERT Data for each wall instance into Columns

        tcis.forEach(tci => {

            const TCIs = tci.TCIs.split("/").splice(4,1)[0];
            const ProductState = tci.ProductState.split("#").splice(1,1)[0];
            const TCIType = tci.TCIType.split("/").splice(4,1)[0];
            const PCIType = tci.PCIType.split("#").splice(1,1)[0]; // PCIType = Wall
            const Length = tci.Length
            const Height = tci.Height
            const Area = tci.Area
            const Width = tci.Width
            const Weight = tci.Weight
            const CountpropPREFIX = tci.Countprop.split("/").splice(3,1)[0];
            const CountpropValue = tci.Countprop.split("/").splice(4,1)[0];
            const Countprop = CountpropPREFIX + ':' + CountpropValue;
            const SRF = tci.SRF
            const MRent = tci.MRent

            // console.log(Countprop)

            // INSERT Query
            str+=`INSERT INTO ${Table3} VALUES ('${TCIs}', '${ProductState}', '${TCIType}', '${PCIType}', '${Length}', '${Height}', '${Area}', '${Width}', '${Weight}', '${Countprop}', '${SRF}', ${MRent}, '${projectGUID}');\n`

        })
        console.log(str)
    
        sqlRequest3.query(str, (err) => {

            if (err) console.log(err)
            console.log(`New Table ${Table3} is created`)

        // Close the connection --> Keep it open if you want to perform more operations!
        sql.close();
        });

        
    // (3.5) CREATE Table periprimTCIs //

        // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

        // Create new Request Object
        let sqlRequest5 = new sql.Request();

        // Define Table Name
        const Table5 = 'periprimTCIs'

        // Get Variables for Column Names
        const PeriPrimTCI = Object.keys(primMX15[0])[0]
        const ProductState5 = Object.keys(primMX15[0])[1]
        const ArtNo5 = Object.keys(primMX15[0])[2]
        const PCIType5 = Object.keys(primMX15[0])[3]
        const isSupportedBy5 = Object.keys(primMX15[0])[4]
        const Length5 = Object.keys(primMX15[0])[5]
        const Height5 = Object.keys(primMX15[0])[6]
        const Area5 = Object.keys(primMX15[0])[7]
        const Width5 = Object.keys(primMX15[0])[8]
        const Weight5 = Object.keys(primMX15[0])[9]
        const SRF5 = Object.keys(primMX15[0])[10]
        const MRent5 = Object.keys(primMX15[0])[11]
        
        // Query to the database --> DROP, Create Table with columns names
        var str=`DROP TABLE ${Table5};\n`
        str+=`CREATE TABLE ${Table5} (ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY, ${PeriPrimTCI} varchar(500) NOT NULL, ${ProductState5} varchar(80), ${ArtNo5} int, ${PCIType5} varchar(500), ${isSupportedBy5} varchar(500), ${Length5} decimal(10,2), ${Height5} decimal(10,2), ${Area5} decimal(10,2), ${Width5} decimal(10,2), ${Weight5} decimal(10,2), ${SRF5} varchar(500), ${MRent5} decimal(10,2), projectGUID varchar(200));\n`;

        // (2) INSERT Data for each wall instance into Columns

        primMX15.forEach(tci => {

            const PeriPrimTCI = tci.PeriPrimTCI.split("/").splice(4,1)[0];
            const ProductState = tci.ProductState.split("#").splice(1,1)[0];
            const ArtNo = tci.ArtNo
            const PCIType = tci.PCIType.split("#").splice(1,1)[0]; // PCIType = Wall
            const isSupportedBy = tci.isSupportedBy.split("/").splice(4,1)[0];
            const Length = tci.Length
            const Height = tci.Height
            const Area = tci.Area
            const Width = tci.Width
            const Weight = tci.Weight
            const SRF = tci.SRF
            const MRent = tci.MRent

            // console.log(Countprop)

            // INSERT Query
            str+=`INSERT INTO ${Table5} VALUES ('${PeriPrimTCI}', '${ProductState}', ${ArtNo}, '${PCIType}', '${isSupportedBy}', '${Length}', ${Height}, ${Area}, ${Width}, ${Weight}, '${SRF}', ${MRent}, '${projectGUID}');\n`

        })
        console.log(str)
    
        sqlRequest5.query(str, (err) => {

            if (err) console.log(err)
            console.log(`New Table ${Table5} is created`)

        // Close the connection --> Keep it open if you want to perform more operations!
        sql.close();
        });

// (3.5) CREATE Table perisecTCIs //

        // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

        // Create new Request Object
        let sqlRequest6 = new sql.Request();

        // Define Table Name
        const Table6 = 'perisecTCIs'

        // Get Variables for Column Names
        const PeriSecTCI = Object.keys(secMX15[0])[0]
        const ProductState6 = Object.keys(secMX15[0])[1]
        const ArtNo6 = Object.keys(secMX15[0])[2]
        const PCIType6 = Object.keys(secMX15[0])[3]
        const supportsTCI6 = Object.keys(secMX15[0])[4]
        const Length6 = Object.keys(secMX15[0])[5]
        const Height6 = Object.keys(secMX15[0])[6]
        const Width6 = Object.keys(secMX15[0])[7]
        const Weight6 = Object.keys(secMX15[0])[8]
        const SRF6 = Object.keys(secMX15[0])[9]
        
        // Query to the database --> DROP, Create Table with columns names
        var str=`DROP TABLE ${Table6};\n`
        str+=`CREATE TABLE ${Table6} (ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY, ${PeriSecTCI} varchar(500) NOT NULL, ${ProductState6} varchar(80), ${ArtNo6} int, ${PCIType6} varchar(500), ${supportsTCI6} varchar(500), ${Length6} TEXT NULL, ${Height6} TEXT NULL, ${Width6} TEXT NULL, ${Weight6} decimal(10,2), ${SRF6} varchar(500), projectGUID varchar(200));\n`;

        // (2) INSERT Data for each wall instance into Columns

        secMX15.forEach(tci => {

            const PeriSecTCI = tci.PeriSecTCI.split("/").splice(4,1)[0];
            const ProductState = tci.ProductState.split("#").splice(1,1)[0];
            const ArtNo = tci.ArtNo
            const PCIType = tci.PCIType.split("#").splice(1,1)[0]; // PCIType = Wall
            const supportsTCI = tci.supportsTCI.split("/").splice(4,1)[0];
            const Length = tci.Length
            const Height = tci.Height
            const Width = tci.Width
            const Weight = tci.Weight
            const SRF = tci.SRF

            // console.log(Countprop)

            // INSERT Query
            str+=`INSERT INTO ${Table6} VALUES ('${PeriSecTCI}', '${ProductState}', ${ArtNo}, '${PCIType}', '${supportsTCI}', '${Length}', '${Height}', '${Width}', ${Weight}, '${SRF}', '${projectGUID}');\n`

        })
        console.log(str)
    
        sqlRequest6.query(str, (err) => {

            if (err) console.log(err)
            console.log(`New Table ${Table6} is created`)

        // Close the connection --> Keep it open if you want to perform more operations!
        sql.close();
        });



     // (3.7) CREATE Table formworkCalc //

        // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

        // Create new Request Object
        let sqlRequest7 = new sql.Request();

        // Define Table Name
        const Table7 = 'formworkCalc'

        // Get Variables for Column Names
        const ElementID = Object.keys(tcicalc[0])[0]
        const VICOinst5 = Object.keys(tcicalc[0])[1]
        const countDefaultPanel270x45 = Object.keys(tcicalc[0])[2]
        const countDefaultPanel270x60 = Object.keys(tcicalc[0])[3]
        const countDefaultPanel270x90 = Object.keys(tcicalc[0])[4]
        const countDefaultPanel270x120 = Object.keys(tcicalc[0])[5]
        const countDefaultPanel270x240 = Object.keys(tcicalc[0])[6]
        const countDefaultOutsideCorner270x55 = Object.keys(tcicalc[0])[7]
        const countDefaultInsideCorner270x20 = Object.keys(tcicalc[0])[8]
        const countDefaultCoupler = Object.keys(tcicalc[0])[9]
        const countDefaultPushPullProp = Object.keys(tcicalc[0])[10]
        const countDefaultTieRod = Object.keys(tcicalc[0])[11]
        const countDefaultWingnut = Object.keys(tcicalc[0])[12]
        const countDefaultWaler = Object.keys(tcicalc[0])[13]
        const countTimberFilling = Object.keys(tcicalc[0])[14]
        const hasTimberFillinglength = Object.keys(tcicalc[0])[15]
        const hasMonthlyTCIRent = Object.keys(tcicalc[0])[16]

        // console.log(ID1, VICOinst, PCIType, Length, Height, Area, Level)

        // Query to the database --> DROP, Create Table with columns names
        var str=`DROP TABLE ${Table7};\n`
        // str+=`CREATE TABLE ${Table5} (ID INT IDENTITY(1,1) NOT NULL, ${ElementID} int NOT NULL PRIMARY KEY, ${VICOinst} varchar(80), ${countDefaultPanel270x120} int, ${countDefaultPanel270x240} int, ${countDefaultCoupler} int, ${countDefaultPushPullProp} int, ${countDefaultTieRod} int, ${countDefaultWingnut} int, ${countTimberFilling} int, ${hasTimberFillinglength} decimal(10,2));\n`;
        str+=`CREATE TABLE ${Table7} (ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY, ${ElementID} int NOT NULL, ${VICOinst5} varchar(80), ${countDefaultPanel270x45} int, ${countDefaultPanel270x60} int, ${countDefaultPanel270x90} int, ${countDefaultPanel270x120} int, ${countDefaultPanel270x240} int, ${countDefaultOutsideCorner270x55} int, ${countDefaultInsideCorner270x20} int, ${countDefaultCoupler} int, ${countDefaultPushPullProp} int, ${countDefaultTieRod} int, ${countDefaultWingnut} int, ${countDefaultWaler} int, ${countTimberFilling} int, ${hasTimberFillinglength} decimal(10,2), ${hasMonthlyTCIRent} decimal(10,2), projectGUID varchar(200));\n`;

        // (2) INSERT Data for each wall instance into Columns

        tcicalc.forEach(tci => {

            const ElementID = tci.ElementID
            const VICOinst = tci.VICOinst.split("/").splice(4,1)[0];
            const countDefaultPanel270x45 = tci.countDefaultPanel270x45 ;
            const countDefaultPanel270x60 = tci.countDefaultPanel270x60;
            const countDefaultPanel270x90 = tci.countDefaultPanel270x90;
            const countDefaultPanel270x120 = tci.countDefaultPanel270x120;
            const countDefaultPanel270x240 = tci.countDefaultPanel270x240;
            const countDefaultOutsideCorner270x55 = tci.countDefaultOutsideCorner270x55;
            const countDefaultInsideCorner270x20 = tci.countDefaultInsideCorner270x20;
            const countDefaultCoupler = tci.countDefaultCoupler;
            const countDefaultPushPullProp = tci.countDefaultPushPullProp;
            const countDefaultTieRod = tci.countDefaultTieRod;
            const countDefaultWingnut = tci.countDefaultWingnut;
            const countDefaultWaler = tci.countDefaultWaler;
            const countTimberFilling = tci.countTimberFilling;
            const hasTimberFillinglength = tci.hasTimberFillinglength;
            const hasMonthlyTCIRent = tci.hasMonthlyTCIRent;

            // INSERT Query
            str+=`INSERT INTO ${Table7} VALUES (${ElementID}, '${VICOinst}', ${countDefaultPanel270x45}, ${countDefaultPanel270x60}, ${countDefaultPanel270x90}, ${countDefaultPanel270x120}, ${countDefaultPanel270x240}, ${countDefaultOutsideCorner270x55}, ${countDefaultInsideCorner270x20}, ${countDefaultCoupler}, ${countDefaultPushPullProp}, ${countDefaultTieRod}, ${countDefaultWingnut}, ${countDefaultWaler}, ${countTimberFilling}, ${hasTimberFillinglength}, ${hasMonthlyTCIRent}, '${projectGUID}');\n`
            // str+=`INSERT INTO ${Table7} VALUES (${ElementID}, '${VICOinst}', ${countDefaultPanel270x120}, ${countDefaultPanel270x240}, ${countDefaultCoupler}, ${countDefaultPushPullProp}, ${countDefaultTieRod}, ${countDefaultWingnut}, ${countTimberFilling}, ${hasTimberFillinglength});\n`

        })
        console.log(str)
    
        sqlRequest7.query(str, (err) => {

            if (err) console.log(err)
            console.log(`New Table ${Table7} is created`)

        // Close the connection --> Keep it open if you want to perform more operations!
        sql.close();
        });



    // (3.8) CREATE Table formworkTime //

        // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

        // Create new Request Object
        let sqlRequest8 = new sql.Request();

        // Define Table Name
        const Table8 = 'formworkTime'

        // Get Variables for Column Names
        const ElementID8 = Object.keys(tciTime[0])[0]
        const VICOinst8 = Object.keys(tciTime[0])[1]
        const PCIType8 = Object.keys(tciTime[0])[2]
        const taskLoid8 = Object.keys(tciTime[0])[3]
        const PlannedStartDate8 = Object.keys(tciTime[0])[4]
        const PlannedEndDate8 = Object.keys(tciTime[0])[5]
        const ActualStartDate8 = Object.keys(tciTime[0])[6]
        const ActualEndDate8 = Object.keys(tciTime[0])[7]
        const ProgressDate8 = Object.keys(tciTime[0])[8]
        const ProgressCompletion8 = Object.keys(tciTime[0])[9]
        const installationTimeTCI_h = Object.keys(tciTime[0])[10]
        const strippingTimeTCI_h = Object.keys(tciTime[0])[11]
        const dismantlingTimeTCI_h = Object.keys(tciTime[0])[12]
                

        // Query to the database --> DROP, Create Table with columns names
        var str=`DROP TABLE ${Table8};\n`
        str+=`CREATE TABLE ${Table8} (ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY, ${ElementID8} int NOT NULL, ${VICOinst8} varchar(80), ${PCIType8} varchar(80), ${taskLoid8} varchar(80), ${PlannedStartDate8} datetime, ${PlannedEndDate8} datetime, ${ActualStartDate8} text NULL, ${ActualEndDate8} text NULL, ${ProgressDate8} text NULL, ${ProgressCompletion8} decimal(3,2) NULL, ${installationTimeTCI_h} decimal(10,2) NULL, ${strippingTimeTCI_h} decimal(10,2) NULL, ${dismantlingTimeTCI_h} decimal(10,2) NULL, projectGUID varchar(200));\n`;

        // (2) INSERT Data for each wall instance into Columns

        tciTime.forEach(task => {

            const ElementID = task.ElementID
            const VICOinst = task.VICOinst.split("/").splice(4,1)[0];
            const PCIType = task.PCIType.split("#").splice(1,1)[0]; 
            const taskLoid = task.taskLoid
            const PlannedStartDate = task.PlannedStartDate
            const PlannedEndDate = task.PlannedEndDate
            const ActualStartDate = task.ActualStartDate
            const ActualEndDate = task.ActualEndDate
            const ProgressDate = task.ProgressDate
            const ProgressCompletion = task.ProgressCompletion
            const installationTimeTCI_h = task.installationTimeTCI_h
            const strippingTimeTCI_h = task.strippingTimeTCI_h
            const dismantlingTimeTCI_h = task.dismantlingTimeTCI_h


            // INSERT Query
            str+=`INSERT INTO ${Table8} VALUES (${ElementID}, '${VICOinst}', '${PCIType}', '${taskLoid}', '${PlannedStartDate}', '${PlannedEndDate}', '${ActualStartDate}', '${ActualEndDate}', '${ProgressDate}', ${ProgressCompletion}, ${installationTimeTCI_h}, ${strippingTimeTCI_h}, ${dismantlingTimeTCI_h}, '${projectGUID}');\n`;
        })
        console.log(str)
    
        sqlRequest8.query(str, (err) => {

            if (err) console.log(err)
            console.log(`New Table ${Table8} is created`)

    //     // Close the connection --> Keep it open if you want to perform more operations!
        sql.close();
        });


    // (3.9) Modify Data (sum counts per location) and Create Table formworkLoc //

Locations = [];

tciLoc.forEach(obj =>
Locations.push(obj.locLoid)
)
Locations = _.uniq(Locations)
// console.log(Locations)

var mergedObjects = []

for (i in Locations) {
arrloc = tciLoc.filter(obj => 
    Locations[i] === obj.locLoid);
// console.log(arrloc)

var result = arrloc.reduce(function(acc, val){
    var o = acc.filter(function(obj){
        return obj.locLoid==val.locLoid;
    }).pop() || {locLoid:val.locLoid, Location:val.Location, countDefaultPanel270x45:0, countDefaultPanel270x60:0, countDefaultPanel270x90:0, countDefaultPanel270x120:0, countDefaultPanel270x240:0, countDefaultOutsideCorner270x55:0, countDefaultInsideCorner270x20:0, countDefaultCoupler:0, countDefaultPushPullProp:0, countDefaultTieRod:0, countDefaultWingnut:0, countDefaultWaler:0, countTimberFilling:0, hasTimberFillinglength:0};
    
    o.countDefaultPanel270x45 += val.countDefaultPanel270x45;
    o.countDefaultPanel270x60 += val.countDefaultPanel270x60;
    o.countDefaultPanel270x90 += val.countDefaultPanel270x90;
    o.countDefaultPanel270x120 += val.countDefaultPanel270x120;
    o.countDefaultPanel270x240 += val.countDefaultPanel270x240;
    o.countDefaultOutsideCorner270x55 += val.countDefaultOutsideCorner270x55;
    o.countDefaultInsideCorner270x20 += val.countDefaultInsideCorner270x20;
    o.countDefaultCoupler += val.countDefaultCoupler;
    o.countDefaultPushPullProp += val.countDefaultPushPullProp;
    o.countDefaultTieRod += val.countDefaultTieRod;
    o.countDefaultWingnut += val.countDefaultWingnut;
    o.countDefaultWaler += val.countDefaultWaler;
    o.countTimberFilling += val.countTimberFilling;
    o.hasTimberFillinglength += val.hasTimberFillinglength*2;

    acc.push(o);
    return acc;
},[]);
// console.log(result);

var finalresult = result.filter(function(itm, i, a) {
    return i == a.indexOf(itm);
});
// console.log(finalresult);

mergedObjects.push(finalresult[0])
}
// console.log(mergedObjects)


    // (3.9) CREATE Table formworkLoc //

    //      (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

    // Create new Request Object
    let sqlRequest9 = new sql.Request();

    // Define Table Name
    const Table9 = 'formworkLoc'

    // Get Variables for Column Names
    const locLoid9 = Object.keys(mergedObjects[0])[0]
    const Location9 = Object.keys(mergedObjects[0])[1]
    const countDefaultPanel270x459 = Object.keys(mergedObjects[0])[2]
    const countDefaultPanel270x609 = Object.keys(mergedObjects[0])[3]
    const countDefaultPanel270x909 = Object.keys(mergedObjects[0])[4]
    const countDefaultPanel270x1209 = Object.keys(mergedObjects[0])[5]
    const countDefaultPanel270x2409 = Object.keys(mergedObjects[0])[6]
    const countDefaultOutsideCorner270x559 = Object.keys(mergedObjects[0])[7]
    const countDefaultInsideCorner270x209 = Object.keys(mergedObjects[0])[8]
    const countDefaultCoupler9 = Object.keys(mergedObjects[0])[9]
    const countDefaultPushPullProp9 = Object.keys(mergedObjects[0])[10]
    const countDefaultTieRod9 = Object.keys(mergedObjects[0])[11]
    const countDefaultWingnut9 = Object.keys(mergedObjects[0])[12]
    const countDefaultWaler9 = Object.keys(mergedObjects[0])[13]
    const countTimberFilling9 = Object.keys(mergedObjects[0])[14]
    const hasTimberFillinglength9 = Object.keys(mergedObjects[0])[15]

    // Query to the database --> DROP, Create Table with columns names
    var str=`DROP TABLE ${Table9};\n`
    // str+=`CREATE TABLE ${Table5} (ID INT IDENTITY(1,1) NOT NULL, ${ElementID} int NOT NULL PRIMARY KEY, ${VICOinst} varchar(80), ${countDefaultPanel270x120} int, ${countDefaultPanel270x240} int, ${countDefaultCoupler} int, ${countDefaultPushPullProp} int, ${countDefaultTieRod} int, ${countDefaultWingnut} int, ${countTimberFilling} int, ${hasTimberFillinglength} decimal(10,2));\n`;
    str+=`CREATE TABLE ${Table9} (ID INT IDENTITY(1,1) NOT NULL, ${locLoid9} varchar(80) NOT NULL PRIMARY KEY, ${Location9} varchar(80), Building varchar(80), ${countDefaultPanel270x459} int, ${countDefaultPanel270x609} int, ${countDefaultPanel270x909} int, ${countDefaultPanel270x1209} int, ${countDefaultPanel270x2409} int, ${countDefaultOutsideCorner270x559} int, ${countDefaultInsideCorner270x209} int, ${countDefaultCoupler9} int, ${countDefaultPushPullProp9} int, ${countDefaultTieRod9} int, ${countDefaultWingnut9} int, ${countDefaultWaler9} int, ${countTimberFilling9} int, ${hasTimberFillinglength9} decimal(10,2), projectGUID varchar(200));\n`;

    // (2) INSERT Data for each wall instance into Columns

    mergedObjects.forEach(loc => {

        const locLoid = loc.locLoid;
        const Location = loc.Location;
        const Building = loc.Location.slice(0,4)
        const countDefaultPanel270x45 = loc.countDefaultPanel270x45 ;
        const countDefaultPanel270x60 = loc.countDefaultPanel270x60;
        const countDefaultPanel270x90 = loc.countDefaultPanel270x90;
        const countDefaultPanel270x120 = loc.countDefaultPanel270x120;
        const countDefaultPanel270x240 = loc.countDefaultPanel270x240;
        const countDefaultOutsideCorner270x55 = loc.countDefaultOutsideCorner270x55;
        const countDefaultInsideCorner270x20 = loc.countDefaultInsideCorner270x20;
        const countDefaultCoupler = loc.countDefaultCoupler;
        const countDefaultPushPullProp = loc.countDefaultPushPullProp;
        const countDefaultTieRod = loc.countDefaultTieRod;
        const countDefaultWingnut = loc.countDefaultWingnut;
        const countDefaultWaler = loc.countDefaultWaler;
        const countTimberFilling = loc.countTimberFilling;
        const hasTimberFillinglength = loc.hasTimberFillinglength;

        // INSERT Query
        str+=`INSERT INTO ${Table9} VALUES ('${locLoid}', '${Location}', '${Building}', ${countDefaultPanel270x45}, ${countDefaultPanel270x60}, ${countDefaultPanel270x90}, ${countDefaultPanel270x120}, ${countDefaultPanel270x240}, ${countDefaultOutsideCorner270x55}, ${countDefaultInsideCorner270x20}, ${countDefaultCoupler}, ${countDefaultPushPullProp}, ${countDefaultTieRod}, ${countDefaultWingnut}, ${countDefaultWaler}, ${countTimberFilling}, ${hasTimberFillinglength}, '${projectGUID}');\n`;

    })
    console.log(str)

    sqlRequest9.query(str, (err) => {

        if (err) console.log(err)
        console.log(`New Table ${Table9} is created`)

    // Close the connection --> Keep it open if you want to perform more operations!
    sql.close();
    });


});   
} 

main();