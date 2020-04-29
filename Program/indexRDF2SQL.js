const fuseki = require('./fuseki');
const sql = require('mssql')


// RECEIVE OUTPUT DATA FROM FUSEKI


// (1.1) Get all wall elements in the datagraph and their required parameters
const getRvt = async () => {

    const endpoint = 'http://localhost:3030/TCI-Demo/query';

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
                    tci:pciType   ?PCIType ;
                    props:length ?Length ;
                    props:height ?Height ;
                    props:area ?Area ;
                    props:level_simple ?Level
            }
        ORDER BY ?ID`;

    // (1.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.s.value;
                    const ElementID = item.ID.value;
                    const VICOinst = item.VICOinst.value;
                    const PCIType = item.PCIType.value;
                    const Length = item.Length.value;
                    const Height = item.Height.value;
                    const Area = item.Area.value;
                    const Level = item.Level.value;
                    return {ElementID, VICOinst, PCIType, Length, Height, Area, Level};
                });
};


// (2.1) Get tasks based on each individual PCI

const getTasks = async () => {

    const endpoint = 'http://localhost:3030/TCI-Demo/query';

    const q = `
        PREFIX product: <https://w3id.org/product#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX lbs:   <http://test/lbs/>

        SELECT *
        WHERE {
            ?VICOinst a lbs:CompLoid.
            ?VICOinst   props:Element_ID            ?ID;
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
                    }
                ORDER BY ?ID`;

    // (2.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    const CompLoid = item.CompLoid.value;
                    const ElementID = item.ID.value;
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
                    return {CompLoid, taskLoid, ElementID, Location, locLoid, schedLoid, PlannedStartDate, PlannedEndDate, ActualStartDate, ActualEndDate, ProgressDate, ProgressCompletion};
                });
};

// (3.1) Get all default Primary TCI elements in the datagraph and their required parameters
const getdefprimTCIs = async () => {

    const endpoint = 'http://localhost:3030/TCI-Demo/query';

    const q = `
        PREFIX owl:   <http://www.w3.org/2002/07/owl#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX tci:   <http://test/tci/>
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

        SELECT *  
        WHERE{

                ?primTCIinst    a  tci:DefaultPrimTCI ;
                                tci:tciType ?defprimTCI ;
                                tci:supportsPCIType ?PCIType ;
                                tci:isSupportedBy ?secTCI ;
                                props:length ?Length ;
                                props:height ?Height ;
                                props:area ?Area ;
                                props:width ?Width ;
                                props:weight ?Weight ;
                                tci:countedBy ?Countprop ;
            }
        ORDER BY ?defprimTCI`;

    // (3.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.s.value;
                    const defprimTCI = item.defprimTCI.value;
                    const PCIType = item.PCIType.value;
                    const isSupportedBy = item.secTCI.value;
                    const Length = item.Length.value;
                    const Height = item.Height.value;
                    const Area = item.Area.value;
                    const Width = item.Width.value;
                    const Weight = item.Weight.value;
                    const Countprop = item.Countprop.value;
                    return {defprimTCI, PCIType, isSupportedBy, Length, Height, Area, Width, Weight, Countprop};
                });
};

// (4.1) Get all default Secondary TCI elements in the datagraph and their required parameters
const getdefsecTCIs = async () => {

    const endpoint = 'http://localhost:3030/TCI-Demo/query';

    const q = `
        PREFIX owl:   <http://www.w3.org/2002/07/owl#>
        PREFIX props: <https://w3id.org/props#>
        PREFIX tci:   <http://test/tci/>
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

        SELECT *  
        WHERE{

                ?secTCIinst    a  tci:DefaultSecTCI ;
                                tci:tciType ?defsecTCI ;
                                tci:supportsPCIType ?PCIType ;
                                tci:supportsTCI ?primTCI ;
                                props:length ?Length ;
                                props:height ?Height ;
                                props:width ?Width ;
                                props:weight ?Weight ;
                                tci:countedBy ?Countprop ;
            }
        ORDER BY ?defsecTCI`;

    // (4.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.s.value;
                    const defsecTCI = item.defsecTCI.value;
                    const PCIType = item.PCIType.value;
                    const supportsTCI = item.primTCI.value;
                    const Length = item.Length.value;
                    const Height = item.Height.value;
                    const Width = item.Width.value;
                    const Weight = item.Weight.value;
                    const Countprop = item.Countprop.value;
                    return {defsecTCI, PCIType, supportsTCI, Length, Height, Width, Weight, Countprop};
                });
};

// (5.1) Get all wall elements in the datagraph and their required parameters
const getTCIcalc = async () => {

    const endpoint = 'http://localhost:3030/TCI-Demo/query';

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
                    # tci:countDefaultPanel330x30    ?countDefaultPanel330x30 ;
                    # tci:countDefaultPanel330x45    ?countDefaultPanel330x45 ;
                    # tci:countDefaultPanel330x60    ?countDefaultPanel330x60 ;
                    # tci:countDefaultPanel330x90     ?countDefaultPanel330x90 ;
                    tci:countDefaultPanel330x120    ?countDefaultPanel330x120 ;
                    tci:countDefaultPanel330x240    ?countDefaultPanel330x240 ;
                    # tci:countDefaultOutsideCorner330x60    ?countDefaultOutsideCorner330x60 ;
                    # tci:countDefaultInsideCorner330x20    ?countDefaultInsideCorner330x20 ;
                    tci:countDefaultCoupler    ?countDefaultCoupler ;
                    tci:countDefaultPushPullProp    ?countDefaultPushPullProp ;
                    tci:countDefaultTieRod    ?countDefaultTieRod ;
                    tci:countDefaultWingnut    ?countDefaultWingnut ;
                    # tci:countDefaultWaler    ?countDefaultWaler ;
                    tci:countTimberFilling    ?countTimberFilling ;
                    tci:hasTimberFillinglength    ?hasTimberFillinglength ;
            }
        ORDER BY ?ID`;

    // (5.2) Return the wall data as a readable JSON object with key + value
    return (await fuseki.getQuery(endpoint, q))
                .map(item => {
                    // const Revitinst = item.s.value;
                    const ElementID = item.ID.value;
                    const VICOinst = item.VICOinst.value;
                    // const countDefaultPanel330x30 = item.countDefaultPanel330x30.value;
                    // const countDefaultPanel330x45 = item.countDefaultPanel330x45.value;
                    // const countDefaultPanel330x60 = item.countDefaultPanel330x60.value;
                    // const countDefaultPanel330x90 = item.countDefaultPanel330x90.value;
                    const countDefaultPanel330x120 = item.countDefaultPanel330x120.value;
                    const countDefaultPanel330x240 = item.countDefaultPanel330x240.value;
                    // const countDefaultOutsideCorner330x60 = item.countDefaultOutsideCorner330x60.value;
                    // const countDefaultInsideCorner330x20 = item.countDefaultInsideCorner330x20.value;
                    const countDefaultCoupler = item.countDefaultCoupler.value;
                    const countDefaultPushPullProp = item.countDefaultPushPullProp.value;
                    const countDefaultTieRod = item.countDefaultTieRod.value;
                    const countDefaultWingnut = item.countDefaultWingnut.value;
                    // const countDefaultWaler = item.countDefaultWaler.value;
                    const countTimberFilling = item.countTimberFilling.value;
                    const hasTimberFillinglength = item.hasTimberFillinglength.value;
                    // return {ElementID, VICOinst, countDefaultPanel330x30, countDefaultPanel330x45, countDefaultPanel330x60, countDefaultPanel330x90, countDefaultPanel330x120, countDefaultPanel330x240, countDefaultOutsideCorner330x60, countDefaultInsideCorner330x20, countDefaultCoupler, countDefaultPushPullProp, countDefaultTieRod, countDefaultWingnut, countDefaultWaler, countTimberFilling, hasTimberFillinglength};
                    return {ElementID, VICOinst, countDefaultPanel330x120, countDefaultPanel330x240, countDefaultCoupler, countDefaultPushPullProp, countDefaultTieRod, countDefaultWingnut, countTimberFilling, hasTimberFillinglength};
                });
};







// MAIN FUNCTION to receive, process insert the data
const main = async () => {

    const walls = await getRvt();
    const tasks = await getTasks();
    const primtcis = await getdefprimTCIs();
    const sectcis = await getdefsecTCIs();
    const tcicalc = await getTCIcalc();

    // console.log(walls)
    // console.log(tasks)
    // console.log(tcis)
    // console.log(primtcis)
    // console.log(sectcis)
    console.log(tcicalc)


    // CONNECT TO MS SQL SERVER

    // (1) Configuration of SQL Access

    const config = {
        user: 'alexlogin',
        password: '20Exigo20',
        server: 'exigo-prod.database.windows.net', // OR 'localhost', if stored in own server! You can use 'localhost\\instance' to connect to named instance
        database: 'exicute_vsolsvrblhfxzrfcanguoynzq',
    }

    // (2) Connect to SQL Server

    sql.connect(config, (err) => {

        if (err) console.log(err);
        console.log('Connected!')

        // // (3.1) CREATE Table rvtPCIs //

        //     // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

        //     // Create new Request Object
        //     let sqlRequest1 = new sql.Request();

        //     // Define Table Name
        //     const Table1 = 'rvtPCIs'

        //     // Get Variables for Column Names
        //     const ID1 = Object.keys(walls[0])[0]
        //     const VICOinst = Object.keys(walls[0])[1]
        //     const PCIType = Object.keys(walls[0])[2]
        //     const Length = Object.keys(walls[0])[3]
        //     const Height = Object.keys(walls[0])[4]
        //     const Area = Object.keys(walls[0])[5]
        //     const Level = Object.keys(walls[0])[6]

        //     // console.log(ID1, VICOinst, PCIType, Length, Height, Area, Level)

        //     // Query to the database --> DROP, Create Table with columns names
        //     var str=`DROP TABLE ${Table1};\n`
        //     // var str=`CREATE TABLE ${Table1} (ID INT IDENTITY(1,1) NOT NULL, ${ID1} int NOT NULL PRIMARY KEY, ${VICOinst} varchar(80), ${PCIType} TEXT, ${Length} decimal(10,2), ${Height} decimal(10,2), ${Area} decimal(10,2), ${Level} TEXT);\n`;
        //     str+=`CREATE TABLE ${Table1} (ID INT IDENTITY(1,1) NOT NULL, ${ID1} int NOT NULL PRIMARY KEY, ${VICOinst} varchar(80), ${PCIType} varchar(500), ${Length} decimal(10,2), ${Height} decimal(10,2), ${Area} decimal(10,2), ${Level} varchar(500));\n`;

        //     // (2) INSERT Data for each wall instance into Columns

        //     walls.forEach(wall => {

        //         const ID1 = wall.ElementID
        //         const VICOinst = wall.VICOinst.split("/").splice(4,1)[0];
        //         const PCIType = wall.PCIType.split("#").splice(1,1)[0]; // PCIType = Wall
        //         const Length = wall.Length
        //         const Height = wall.Height
        //         const Area = wall.Area
        //         const Level = wall.Level

        //         // INSERT Query
        //         str+=`INSERT INTO ${Table1} VALUES (${ID1}, '${VICOinst}', '${PCIType}', ${Length}, ${Height}, ${Area}, '${Level}');\n`

        //     })
        //     console.log(str)
        
        //     sqlRequest1.query(str, (err) => {

        //         if (err) console.log(err)
        //         console.log(`New Table ${Table1} is created`)

        //     // Close the connection --> Keep it open if you want to perform more operations!
        //     // sql.close();
        //     });



        // // (3.2) CREATE Table tciTasks //

        //     // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

        //     // Create new Request Object
        //     let sqlRequest2 = new sql.Request();

        //     // Define Table Name
        //     const Table2 = 'tciTasks'

        //     // Get Variables for Column Names
        //     const CompLoid = Object.keys(tasks[0])[0]
        //     const taskLoid = Object.keys(tasks[0])[1]
        //     const ID2 = Object.keys(tasks[0])[2]
        //     const Location = Object.keys(tasks[0])[3]
        //     const locLoid = Object.keys(tasks[0])[4]
        //     const schedLoid = Object.keys(tasks[0])[5]
        //     const PlannedStartDate = Object.keys(tasks[0])[6]
        //     const PlannedEndDate = Object.keys(tasks[0])[7]
        //     const ActualStartDate = Object.keys(tasks[0])[8]
        //     const ActualEndDate = Object.keys(tasks[0])[9]
        //     const ProgressDate = Object.keys(tasks[0])[10]
        //     const ProgressCompletion = Object.keys(tasks[0])[11]

        //     // console.log(CompLoid, taskLoid, ID2, Location, locLoid, schedLoid, PlannedStartDate, PlannedEndDate, ActualStartDate, ActualEndDate, ProgressDate, ProgressCompletion)

        //     // Query to the database --> DROP, Create Table with columns names
        //     var str=`DROP TABLE ${Table2};\n`
        //     // var str=`CREATE TABLE ${Table2} (ID INT IDENTITY(1,1) NOT NULL, ${CompLoid} varchar(80) NOT NULL PRIMARY KEY, ${taskLoid} varchar(80), ${ID2} int, ${Location} varchar(500), ${locLoid} varchar(80), ${schedLoid} varchar(80), ${PlannedStartDate} datetime, ${PlannedEndDate} datetime, ${ActualStartDate} datetime NULL, ${ActualEndDate} datetime NULL, ${ProgressDate} datetime NULL, ${ProgressCompletion} decimal(3,2) NULL);\n`;
        //     // str+=`CREATE TABLE ${Table2} (ID INT IDENTITY(1,1) NOT NULL, ${CompLoid} varchar(80) NOT NULL PRIMARY KEY, ${taskLoid} varchar(80), ${ID2} int, ${Location} varchar(500), ${locLoid} varchar(80), ${schedLoid} varchar(80), ${PlannedStartDate} datetime, ${PlannedEndDate} datetime, ${ActualStartDate} datetime NULL, ${ActualEndDate} datetime NULL, ${ProgressDate} datetime NULL, ${ProgressCompletion} decimal(3,2) NULL);\n`;
        //     str+=`CREATE TABLE ${Table2} (ID INT IDENTITY(1,1) NOT NULL, ${CompLoid} varchar(80) NOT NULL PRIMARY KEY, ${taskLoid} varchar(80), ${ID2} int, ${Location} varchar(500), ${locLoid} varchar(80), ${schedLoid} varchar(80), ${PlannedStartDate} datetime, ${PlannedEndDate} datetime, ${ActualStartDate} text NULL, ${ActualEndDate} text NULL, ${ProgressDate} text NULL, ${ProgressCompletion} decimal(3,2) NULL);\n`;

        //     // (2) INSERT Data for each wall instance into Columns

        //     tasks.forEach(task => {

        //         const CompLoid = task.CompLoid
        //         const taskLoid = task.taskLoid
        //         const ID2 = task.ElementID
        //         const Location = task.Location
        //         const locLoid = task.locLoid
        //         const schedLoid = task.schedLoid
        //         const PlannedStartDate = task.PlannedStartDate
        //         const PlannedEndDate = task.PlannedEndDate
        //         const ActualStartDate = task.ActualStartDate
        //         const ActualEndDate = task.ActualEndDate
        //         const ProgressDate = task.ProgressDate
        //         const ProgressCompletion = task.ProgressCompletion

        //         // INSERT Query
        //         // str+=`INSERT INTO ${Table2} VALUES ('${CompLoid}', '${taskLoid}', ${ID2}, '${Location}', '${locLoid}', '${schedLoid}', CAST('${PlannedStartDate}' AS datetime), CAST('${PlannedEndDate}' AS datetime), CAST('${ActualStartDate}' AS datetime), CAST('${ActualEndDate}' AS datetime), CAST('${ProgressDate}' AS datetime), ${ProgressCompletion});\n`;
        //         str+=`INSERT INTO ${Table2} VALUES ('${CompLoid}', '${taskLoid}', ${ID2}, '${Location}', '${locLoid}', '${schedLoid}', '${PlannedStartDate}', '${PlannedEndDate}', '${ActualStartDate}', '${ActualEndDate}', '${ProgressDate}', ${ProgressCompletion});\n`;
        //         // CAST(NULLIF('${ActualStartDate}','') AS datetime),
        //         // CAST((CASE WHEN '${ActualStartDate}'='' THEN NULL ELSE '${ActualStartDate}' END) AS datetime)
        //     })
        //     console.log(str)
        
        //     sqlRequest2.query(str, (err) => {

        //         if (err) console.log(err)
        //         console.log(`New Table ${Table2} is created`)

        // //     // Close the connection --> Keep it open if you want to perform more operations!
        // //     sql.close();
        //     });

        
        
    //     // (3.3) CREATE Table defprimTCIs //

    //         // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

    //         // Create new Request Object
    //         let sqlRequest3 = new sql.Request();

    //         // Define Table Name
    //         const Table3 = 'defprimTCIs'

    //         // Get Variables for Column Names
    //         const defprimTCI = Object.keys(primtcis[0])[0]
    //         const PCIType = Object.keys(primtcis[0])[1]
    //         const isSupportedBy = Object.keys(primtcis[0])[2]
    //         const Length = Object.keys(primtcis[0])[3]
    //         const Height = Object.keys(primtcis[0])[4]
    //         const Area = Object.keys(primtcis[0])[5]
    //         const Width = Object.keys(primtcis[0])[6]
    //         const Weight = Object.keys(primtcis[0])[7]
    //         const Countprop = Object.keys(primtcis[0])[8]

    //         // console.log(defprimTCI, PCIType, isSupportedBy, Length, Height, Area, Width, Weight, Countprop)

    //         // Query to the database --> DROP, Create Table with columns names
    //         var str=`DROP TABLE ${Table3};\n`
    //         str+=`CREATE TABLE ${Table3} (ID INT IDENTITY(1,1) NOT NULL, ${defprimTCI} varchar(500) NOT NULL PRIMARY KEY, ${PCIType} varchar(500), ${isSupportedBy} varchar(500), ${Length} decimal(10,2), ${Height} decimal(10,2), ${Area} decimal(10,2), ${Width} decimal(10,2), ${Weight} decimal(10,2), ${Countprop} varchar(500));\n`;

    //         // (2) INSERT Data for each wall instance into Columns

    //         primtcis.forEach(tci => {

    //             const defprimTCI = tci.defprimTCI.split("/").splice(4,1)[0];
    //             const PCIType = tci.PCIType.split("#").splice(1,1)[0]; // PCIType = Wall
    //             const isSupportedBy = tci.isSupportedBy.split("/").splice(4,1)[0];
    //             const Length = tci.Length
    //             const Height = tci.Height
    //             const Area = tci.Area
    //             const Width = tci.Width
    //             const Weight = tci.Weight
    //             const CountpropPREFIX = tci.Countprop.split("/").splice(3,1)[0];
    //             const CountpropValue = tci.Countprop.split("/").splice(4,1)[0];
    //             const Countprop = CountpropPREFIX + ':' + CountpropValue;

    //             // console.log(Countprop)

    //             // INSERT Query
    //             str+=`INSERT INTO ${Table3} VALUES ('${defprimTCI}', '${PCIType}', '${isSupportedBy}', '${Length}', ${Height}, ${Area}, ${Width}, ${Weight}, '${Countprop}');\n`

    //         })
    //         console.log(str)
        
    //         sqlRequest3.query(str, (err) => {

    //             if (err) console.log(err)
    //             console.log(`New Table ${Table3} is created`)

    //         // Close the connection --> Keep it open if you want to perform more operations!
    //         sql.close();
    //         });



    //     // (3.4) CREATE Table defsecTCIs //

    //         // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

    //         // Create new Request Object
    //         let sqlRequest4 = new sql.Request();

    //         // Define Table Name
    //         const Table4 = 'defsecTCIs'

    //         // Get Variables for Column Names
    //         const defsecTCI = Object.keys(sectcis[0])[0]
    //         const PCIType2 = Object.keys(sectcis[0])[1]
    //         const supportsTCI = Object.keys(sectcis[0])[2]
    //         const Length2 = Object.keys(sectcis[0])[3]
    //         const Height2 = Object.keys(sectcis[0])[4]
    //         const Width2 = Object.keys(sectcis[0])[5]
    //         const Weight2 = Object.keys(sectcis[0])[6]
    //         const Countprop2 = Object.keys(sectcis[0])[7]

    //         // console.log(defsecTCI, PCIType, supportsTCI, Length, Height, Area, Width, Weight, Countprop)

    //         // Query to the database --> DROP, Create Table with columns names
    //         var str=`DROP TABLE ${Table4};\n`
    //         // str+=`CREATE TABLE ${Table4} (ID INT IDENTITY(1,1) NOT NULL, ${defsecTCI} varchar(500) NOT NULL PRIMARY KEY, ${PCIType2} varchar(500), ${supportsTCI} varchar(500),  ${Length2} decimal(10,2) NULL, ${Height2} decimal(10,2) NULL, ${Width2} decimal(10,2) NULL, ${Weight2} decimal(10,2) NULL, ${Countprop2} varchar(500));\n`;
    //         str+=`CREATE TABLE ${Table4} (ID INT IDENTITY(1,1) NOT NULL, ${defsecTCI} varchar(500) NOT NULL PRIMARY KEY, ${PCIType2} varchar(500), ${supportsTCI} varchar(500),  ${Length2} TEXT NULL, ${Height2} TEXT NULL, ${Width2} TEXT NULL, ${Weight2} decimal(10,2) NULL, ${Countprop2} varchar(500));\n`;

    //         // (2) INSERT Data for each wall instance into Columns

    //         sectcis.forEach(tci => {

    //             const defsecTCI = tci.defsecTCI.split("/").splice(4,1)[0];
    //             const PCIType2 = tci.PCIType.split("#").splice(1,1)[0]; // PCIType = Wall
    //             const supportsTCI = tci.supportsTCI.split("/").splice(4,1)[0];
    //             const Length2 = tci.Length
    //             const Height2 = tci.Height
    //             const Width2 = tci.Width
    //             const Weight2 = tci.Weight
    //             const CountpropPREFIX2 = tci.Countprop.split("/").splice(3,1)[0];
    //             const CountpropValue2 = tci.Countprop.split("/").splice(4,1)[0];
    //             const Countprop2 = CountpropPREFIX2 + ':' + CountpropValue2;

    //             // console.log(Countprop2)

    //             // INSERT Query
    //             str+=`INSERT INTO ${Table4} VALUES ('${defsecTCI}', '${PCIType2}', '${supportsTCI}', '${Length2}', '${Height2}', '${Width2}', ${Weight2}, '${Countprop2}');\n`

    //         })
    //         console.log(str)
        
    //         sqlRequest4.query(str, (err) => {

    //             if (err) console.log(err)
    //             console.log(`New Table ${Table4} is created`)

    //         // Close the connection --> Keep it open if you want to perform more operations!
    //         sql.close();
    //         });


         // (3.5) CREATE Table formworkCalc //

            // (1) DROP, CREATE new Table and INSERT Data in new Table in SQL server

            // Create new Request Object
            let sqlRequest5 = new sql.Request();

            // Define Table Name
            const Table5 = 'formworkCalc'

            // Get Variables for Column Names
            const ElementID = Object.keys(tcicalc[0])[0]
            const VICOinst = Object.keys(tcicalc[0])[1]
            // const countDefaultPanel330x30 = Object.keys(tcicalc[0])[2]
            // const countDefaultPanel330x45 = Object.keys(tcicalc[0])[3]
            // const countDefaultPanel330x60 = Object.keys(tcicalc[0])[4]
            // const countDefaultPanel330x90 = Object.keys(tcicalc[0])[5]
            const countDefaultPanel330x120 = Object.keys(tcicalc[0])[2]
            const countDefaultPanel330x240 = Object.keys(tcicalc[0])[3]
            // const countDefaultOutsideCorner330x60 = Object.keys(tcicalc[0])[8]
            // const countDefaultInsideCorner330x20 = Object.keys(tcicalc[0])[9]
            const countDefaultCoupler = Object.keys(tcicalc[0])[4]
            const countDefaultPushPullProp = Object.keys(tcicalc[0])[5]
            const countDefaultTieRod = Object.keys(tcicalc[0])[6]
            const countDefaultWingnut = Object.keys(tcicalc[0])[7]
            // const countDefaultWaler = Object.keys(tcicalc[0])[14]
            const countTimberFilling = Object.keys(tcicalc[0])[8]
            const hasTimberFillinglength = Object.keys(tcicalc[0])[9]

            // console.log(ID1, VICOinst, PCIType, Length, Height, Area, Level)

            // Query to the database --> DROP, Create Table with columns names
            var str=`DROP TABLE ${Table5};\n`
            str+=`CREATE TABLE ${Table5} (ID INT IDENTITY(1,1) NOT NULL, ${ElementID} int NOT NULL PRIMARY KEY, ${VICOinst} varchar(80), ${countDefaultPanel330x120} int, ${countDefaultPanel330x240} int, ${countDefaultCoupler} int, ${countDefaultPushPullProp} int, ${countDefaultTieRod} int, ${countDefaultWingnut} int, ${countTimberFilling} int, ${hasTimberFillinglength} decimal(10,2));\n`;
            // str+=`CREATE TABLE ${Table5} (ID INT IDENTITY(1,1) NOT NULL, ${ElementID} int NOT NULL PRIMARY KEY, ${VICOinst} varchar(80), ${countDefaultPanel330x30} decimal(10,2), ${countDefaultPanel330x45} decimal(10,2), ${countDefaultPanel330x60} decimal(10,2), ${countDefaultPanel330x90} decimal(10,2), ${countDefaultPanel330x120} decimal(10,2), ${countDefaultPanel330x240} decimal(10,2), ${countDefaultOutsideCorner330x60} decimal(10,2), ${countDefaultInsideCorner330x20} decimal(10,2), ${countDefaultCoupler} decimal(10,2), ${countDefaultPushPullProp} decimal(10,2), ${countDefaultTieRod} decimal(10,2), ${countDefaultWingnut} decimal(10,2), ${countDefaultWingnut} decimal(10,2), ${countDefaultWaler} decimal(10,2), ${countTimberFilling} decimal(10,2), ${hasTimberFillinglength} decimal(10,2));\n`;

            // (2) INSERT Data for each wall instance into Columns

            tcicalc.forEach(tci => {

                const ElementID = tci.ElementID
                const VICOinst = tci.VICOinst.split("/").splice(4,1)[0];
                // const countDefaultPanel330x30 = tci.countDefaultPanel330x30 ;
                // const countDefaultPanel330x45 = tci.countDefaultPanel330x45 ;
                // const countDefaultPanel330x60 = tci.countDefaultPanel330x60;
                // const countDefaultPanel330x90 = tci.countDefaultPanel330x90;
                const countDefaultPanel330x120 = tci.countDefaultPanel330x120;
                const countDefaultPanel330x240 = tci.countDefaultPanel330x240;
                // const countDefaultOutsideCorner330x60 = tci.countDefaultOutsideCorner330x60;
                // const countDefaultInsideCorner330x20 = tci.countDefaultInsideCorner330x20;
                const countDefaultCoupler = tci.countDefaultCoupler;
                const countDefaultPushPullProp = tci.countDefaultPushPullProp;
                const countDefaultTieRod = tci.countDefaultTieRod;
                const countDefaultWingnut = tci.countDefaultWingnut;
                // const countDefaultWaler = tci.countDefaultWaler;
                const countTimberFilling = tci.countTimberFilling;
                const hasTimberFillinglength = tci.hasTimberFillinglength;

                // INSERT Query
                // str+=`INSERT INTO ${Table5} VALUES (${ElementID}, '${VICOinst}', ${countDefaultPanel330x30}, ${countDefaultPanel330x45}, ${countDefaultPanel330x60}, ${countDefaultPanel330x90}, ${countDefaultPanel330x120}, ${countDefaultPanel330x240}, ${countDefaultOutsideCorner330x60}, ${countDefaultInsideCorner330x20}, ${countDefaultCoupler}, ${countDefaultPushPullProp}, ${countDefaultTieRod}, ${countDefaultWingnut}, ${countDefaultWaler}, ${countTimberFilling}, ${hasTimberFillinglength});\n`
                str+=`INSERT INTO ${Table5} VALUES (${ElementID}, '${VICOinst}', ${countDefaultPanel330x120}, ${countDefaultPanel330x240}, ${countDefaultCoupler}, ${countDefaultPushPullProp}, ${countDefaultTieRod}, ${countDefaultWingnut}, ${countTimberFilling}, ${hasTimberFillinglength});\n`

            })
            console.log(str)
        
            sqlRequest5.query(str, (err) => {

                if (err) console.log(err)
                console.log(`New Table ${Table5} is created`)

            // Close the connection --> Keep it open if you want to perform more operations!
            sql.close();
            });



    });   
} 

main();