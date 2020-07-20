const fuseki = require('./fuseki');
const sql = require('mssql');
var _ = require('lodash');


// RECEIVE VICO DATA FROM SQL Tables


// (1) Configuration of SQL Access

const config = {
    user: 'alexlogin',
    password: '20Exigo20',
    server: 'exigo-prod.database.windows.net', // OR 'localhost', if stored in own server! You can use 'localhost\\instance' to connect to named instance
    database: 'alex_exicute_vsolsvrblhfxzrfcanguoynzq',
}


    // Define Table Names
    Table1 = 'elements'
    Table2 = '[componentsView]'
    Table3 = '[timeReg]'

    // Define File Names
    const FName1 = "VICO-Data_elements.json"
    const FName2 = "VICO-Data_componentsView.json"
    const FName3 = "VICO-Data_timeReg.json"

// (2) Connect to SQL Server
sql.connect(config, (err) => {

    if (err) console.log(err);
    console.log('Connected!')

        
    // (3) Select Data from different Tables in SQL and write to file
    
    //     (3.1) Select Data from Table dbo.elements
        let sqlRequest1 = new sql.Request();
        let sqlRequest2 = new sql.Request();
        let sqlRequest3 = new sql.Request();

        // Select props:Element_ID (ElementID), props:Revit_GUID (rvtGUID), lbs:hasElementloid (elemloid), lbs:hasTOI (toi), lbs:hasCompLoid (comploid), lbs:hasLocloid (locloid), lbs:hasprojectGUID
        const query1 = `SELECT elemloid, ElemType, ElementID, rvtGUID, toi, comploid, locloid, projectGUID FROM ${Table1}`;

        // Select lbs:hasCompLoid (comploid), lbs:hasTaskLoid (taskLoid), lbs:hasLocloid (locloid), lbs:vicoDescription (description), PRICE??
        const query2 = `SELECT comploid, taskLoid, locloid, description FROM ${Table2}`;

        // lbs:hasTaskLoid (taskLoid), lbs:hasSchedLoid (schedLoid), lbs:hasLocloid (locloid), lbs:hasLocation (locNAme), lbs:taskActualEndDate, lbs:taskActualStartDate, lbs:taskPlannedEndDate, lbs:taskPlannedStartDate, lbs:taskProgressCompletion, lbs:taskProgressDate
        const query3 = `SELECT taskLoid, locloid, locNAme, schedloid, taskActualEndDate, taskActualStartDate, taskPlannedEndDate, taskPlannedStartDate, taskProgressCompletion, taskProgressDate FROM ${Table3}`;
        

            sqlRequest1.query(query1, (err, result) => {
                if (err) console.log(err)

                // console.log(result.recordset)

                data = result.recordset;
                var fs = require('fs');
                fs.writeFile (FName1, JSON.stringify(data), function(err) {
                    if (err) throw err;
                    console.log(`Data extraction from ${Table1} was successful`);
                    }
                );

            sql.close();
            });

            sqlRequest2.query(query2, (err, result) => {
                if (err) console.log(err)

                // console.log(result.recordset)

                data = result.recordset;
                var fs = require('fs');
                fs.writeFile (FName2, JSON.stringify(data), function(err) {
                    if (err) throw err;
                    console.log(`Data extraction from ${Table2} was successful`) ;
                    }
                );

            // Close the connection
            sql.close();
                
            });


            sqlRequest3.query(query3, (err, result) => {
                if (err) console.log(err)

                // console.log(result.recordset)

                data = result.recordset;
                var fs = require('fs');
                fs.writeFile (FName3, JSON.stringify(data), function(err) {
                    if (err) throw err;
                    console.log(`Data extraction from ${Table3} was successful`) ;
                    }
                );

            // Close the connection
            sql.close();
                
            });


}); 


var fs = require('fs');


// (4) Get Data from JSON files
// Combine data from different objects in arrays to one array with one object for each element

setTimeout(async () => {

    let raw1 = fs.readFileSync(FName1);
    let elements = JSON.parse(raw1);
    // console.log(elements)

    let raw2 = fs.readFileSync(FName2);
    let components = JSON.parse(raw2);
    // console.log(components)

    let raw3 = fs.readFileSync(FName3);
    let tasks = JSON.parse(raw3);
    // console.log(tasks)

    // (4.1) Combine elements with components by component-/location-relationship
    // Create comploc to map components to elements
    elements.forEach(element => {
        let comploid = element.comploid ;
        let locloid = element.locloid ;
        comploc = `${comploid}${locloid}` ;
        element.comploc = comploc ;
    });
    // console.log(elements)

    components.forEach(comp => {
        let comploid = comp.comploid ;
        let locloid = comp.locloid ;
        comploc = `${comploid}${locloid}` ;
        comp.comploc = comploc ;
    });
    // console.log(components)

    elements.forEach(element => {
            var comp = {};
            var task = {};
            comp = components.find(item => element.comploc === item.comploc)
            // console.log(comp)
            element.taskloid = comp.taskLoid ;
            element.VicoDesc = comp.description ;


            task = tasks.find(item => element.taskloid === item.taskLoid)
            // console.log(task)
            element.locName = task.locNAme ;
            element.schedloid = task.schedloid ;
            element.taskActualEndDate = task.taskActualEndDate ;
            element.taskActualStartDate = task.taskActualStartDate ;
            element.taskPlannedEndDate = task.taskPlannedEndDate ;
            element.taskPlannedStartDate = task.taskPlannedStartDate ;
            element.taskProgressCompletion = task.taskProgressCompletion ;
            element.taskProgressDate = task.taskProgressDate ;

    });

    console.log(elements)

    // // (5) Write to FUSEKI
    
    // var str= `@prefix props:   <https://w3id.org/props#>.\n`
    // str+= `@prefix product: <https://w3id.org/product#> .\n`
    // str+= `@prefix owl:   <http://www.w3.org/2002/07/owl#> .\n`
    // str+= `@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n`
    // str+= `@prefix bot:   <https://w3id.org/bot#> .\n`
    // str+= `@prefix vicoinst:  <http://test/VICO/> .\n`
    // str+= `@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .\n`
    // str+= `@prefix bot:   <https://w3id.org/bot#> .\n`
    // str+= `@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .\n`
    // str+= `@prefix lbs:   <http://test/lbs/> .\n\n`
    

    // elements.forEach(element => {

    //     const elemloid = element.elemloid ;
    //     const ElementID = element.ElementID ;
    //     const ElemType = element.ElemType ;
    //     const rvtGUID = element.rvtGUID ;
    //     const toi = element.toi ;
    //     const comploid = element.comploid ;
    //     const locloid = element.locloid ;
    //     const locName = element.locName ;
    //     const taskloid = element.taskloid ;
    //     const VicoDesc = element.VicoDesc ;
    //     const schedloid = element.schedloid ;
    //     const taskPlannedStartDate = element.taskPlannedStartDate ;
    //     const taskPlannedEndDate = element.taskPlannedEndDate ;
    //     if (element.taskActualStartDate === null) {
    //         element.taskActualStartDate = ''
    //     }
    //     const taskActualStartDate = element.taskActualStartDate ;
    //     if (element.taskActualEndDate === null) {
    //         element.taskActualEndDate = ''
    //     }
    //     const taskActualEndDate = element.taskActualEndDate ;
    //     const taskProgressCompletion = element.taskProgressCompletion ;
    //     if (element.taskProgressDate === null) {
    //         element.taskProgressDate = ''
    //     }
    //     const taskProgressDate = element.taskProgressDate ;
    //     const projectGUID = element.projectGUID ;

    //     str+= `vicoinst:${elemloid} a lbs:VICOelement.\n`
    //     str+= `vicoinst:${elemloid} lbs:hasElementLoid "${elemloid}".\n`
    //     str+= `vicoinst:${elemloid} lbs:elementType "${ElemType}".\n`
    //     str+= `vicoinst:${elemloid} props:Element_ID "${ElementID}".\n`
    //     str+= `vicoinst:${elemloid} props:Revit_GUID "${rvtGUID}".\n`
    //     str+= `vicoinst:${elemloid} lbs:hastakeOffID "${toi}".\n`
    //     str+= `vicoinst:${elemloid} lbs:hasCompLoid "${comploid}".\n`
    //     str+= `vicoinst:${elemloid} lbs:haslocLoid "${locloid}".\n`
    //     str+= `vicoinst:${elemloid} lbs:hasLocation "${locName}".\n`
    //     str+= `vicoinst:${elemloid} lbs:hastaskLoid "${taskloid}".\n`
    //     str+= `vicoinst:${elemloid} lbs:description "${VicoDesc}".\n`
    //     str+= `vicoinst:${elemloid} lbs:hasschedLoid "${schedloid}".\n`
    //     str+= `vicoinst:${elemloid} lbs:taskPlannedStartDate "${taskPlannedStartDate}"^^xsd:dateTime.\n`
    //     str+= `vicoinst:${elemloid} lbs:taskPlannedEndDate "${taskPlannedEndDate}"^^xsd:dateTime.\n`
    //     str+= `vicoinst:${elemloid} lbs:taskActualStartDate "${taskActualStartDate}"^^xsd:dateTime.\n`
    //     str+= `vicoinst:${elemloid} lbs:taskActualEndDate "${taskActualEndDate}"^^xsd:dateTime.\n`
    //     str+= `vicoinst:${elemloid} lbs:taskProgressCompletion "${taskProgressCompletion}"^^xsd:nonNegativeInteger.\n`
    //     str+= `vicoinst:${elemloid} lbs:taskProgressDate "${taskProgressDate}"^^xsd:dateTime.\n`
    //     str+= `vicoinst:${elemloid} lbs:hasprojectGUID "${projectGUID}".\n`
        
        
    // });
    

    // // console.log(str);

    // // Create HTTP Request to write to Fuseki
    // const http = require('http')

    // const options = {
    //     hostname: 'localhost',
    //     port: 3030,
    //     path: '/TCI-Demo-LBSn/data',
    //     method: 'POST',
    //     headers: {"Content-type": "text/turtle", "Accept": "text/plain"}
    //   }
      
    //   const req = http.request(options, (res) => {
    //     console.log(`statusCode: ${res.statusCode}`)
      
    //     res.on('data', (d) => {
    //       process.stdout.write(d)
    //     })
    //   })
      
    //   req.on('error', (error) => {
    //     console.error(error)
    //   })
    // //   console.log(str);

    //   req.write(str)
    //   req.end()
    


}, 1000)


