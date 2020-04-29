var sql = require('mssql')


// CONNECT TO MS SQL SERVER

// (1) Configuration of SQL Access

// Username: alexlogin
// Password: 20Exigo20
// Server: exigo-prod.database.windows.net
// Database: exicute_vsolsvrblhfxzrfcanguoynzq
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

// //  (3) Receive data from the database and display it

//     // create a new Request Object
//     let sqlRequest = new sql.Request();

//     // query to the database and get the records/fields in the data Object
//     let sqlQuery='select loid, name from tasks';
//     sqlRequest.query(sqlQuery, (err, data) => {

//         if (err) console.log(err)

//         // Display the data in the console
//         // console.log(data.recordset);
//         console.table(data.recordset);
//         // console.log(data);

//     // Close the connection --> Keep it open if you want to perform more operations!
//     sql.close();

//      });
     

// // (4) CREATE/DROP new Table in SQL server

//     // CREATE TABLE //
//     let sqlCreateT = new sql.Request();
//     let sqlQuery='CREATE TABLE dbo.test2 (column1 int NOT NULL, column2 int NOT NULL);';
//     sqlCreateT.query(sqlQuery, (err) => {

//         if (err) console.log(err)

//     // DROP TABLE //
//         let sqlDrop = new sql.Request();
//         let sqlQuery='DROP TABLE dbo.test2';
//         sqlDrop.query(sqlQuery, (err) => {

//             if (err) console.log(err)

//     // Close the connection --> Keep it open if you want to perform more operations!
//     sql.close();
//     });



// (5) DROP, CREATE new Table and INSERT Data in new Table in SQL server

    // Create new Request Object
    let sqlRequest = new sql.Request();


    const Value1 = '2019-04-04 11:00:00.000'
    const Value2 = ''
    const Value3 = 'NULL'
    const Value4 = '2019-04-04 11:00:00'
    // Query to the database --> DROP, Create Table and INSERT Data
    var str=`DROP TABLE test2;\n`
    str+=`CREATE TABLE test2 (column1 int NOT NULL PRIMARY KEY, column2 datetime NULL);\n`
    // str+=`INSERT INTO test2 VALUES (1, ${JSON.stringify(hello)})\n`
    // str+=`INSERT INTO test2 VALUES (1, CAST((CASE WHEN '${Value1}'='' THEN NULL ELSE '${Value1}' END) AS datetime))\n`
    str+=`INSERT INTO test2 VALUES (3, '${Value1}')\n`
    // str+=`INSERT INTO test2 VALUES (2, CAST(NULLIF('${Value2}','') AS datetime))\n`
    // str+=`INSERT INTO test2 VALUES (3, CAST((CASE WHEN '${Value3}'='' THEN NULL ELSE '${Value3}' END) AS datetime))\n`
    // str+=`INSERT INTO test2 VALUES (3, CAST('${Value3}' AS datetime))\n`
    // str+=`INSERT INTO test2 VALUES (3, '${Value3}')\n`
    str+=`INSERT INTO test2 VALUES (4, CAST((CASE WHEN '${Value4}'='' THEN NULL ELSE '${Value4}' END) AS datetime))\n`

    console.log(str)

    sqlRequest.query(str, (err) => {

        if (err) console.log(err)

    // Close the connection --> Keep it open if you want to perform more operations!
    sql.close();

    });

});







// const sqlConnect = async () => {
//     try {
//         // make sure that any items are correctly URL encoded in the connection string
//         // await sql.connect(`mssql://${username}:${password}@localhost/database?encrypt=true`)
//         await sql.connect(config)
//         const result = await sql.query`select * from mytable where id = ${value}`
//         console.dir(result)
//     } catch (err) {
//         // ... error checks
//     }
// }

