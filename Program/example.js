// var fruits = ["Banana", "Orange", "Apple", "Mango"];
// console.log(fruits.length);

// var TCIex =  [
//     { TCIinst: 'http://test/tci/DefaultPanel330x240', Length: 2.4 },
//     { TCIinst: 'http://test/tci/DefaultPanel330x240', Length: 2.4 },
//     { TCIinst: 'http://test/tci/DefaultPanel330x120', Length: 1.2 },
//     { TCIinst: 'http://test/tci/Timber_Filling', Length: 0.2 },
//     { TCIinst: 'http://test/tci/DefaultPanel330x240', Length: 2.4 },
//     { TCIinst: 'http://test/tci/DefaultPanel330x240', Length: 2.4 },
//     { TCIinst: 'http://test/tci/DefaultPanel330x120', Length: 1.2 },
//     { TCIinst: 'http://test/tci/Timber_Filling', Length: 0.2 }
//   ];
//   console.log(TCIex.length);



// var tcis = [
//     { TCIinst: 'http://test/tci/DefaultPanel330x240', Length: 2.4 },
//     { TCIinst: 'http://test/tci/DefaultPanel330x240', Length: 2.4 },
//     { TCIinst: 'http://test/tci/DefaultPanel330x120', Length: 1.2 },
//     { TCIinst: 'http://test/tci/Timber_Filling', Length: 0.2 },
//     { TCIinst: 'http://test/tci/DefaultPanel330x240', Length: 2.4 },
//     { TCIinst: 'http://test/tci/DefaultPanel330x240', Length: 2.4 },
//     { TCIinst: 'http://test/tci/DefaultPanel330x120', Length: 1.2 },
//     { TCIinst: 'http://test/tci/Timber_Filling', Length: 0.2 }
//     ];

// console.log(tcis.length);

// //   tcis.forEach(tci => {

// //     console.log(tci.length);

// //   });

// const jsObjects = [
//     {a: 'hello', b: 2}, 
//     {a: 'my', b: 4}, 
//     {a: 'name', b: 6}, 
//     {a: 'is', b: 8}
//   ]
  
//   let result1 = jsObjects.find(obj => {
//     return obj.a === 'hello'})
//   let result2 = jsObjects.find(obj => {
//     return obj.a === 'name'})
  
// console.log(jsObjects)
//   console.log(result1, result2)




// var url = 'http://test/tci/DefaultPanel330x240'
// // var lastPart = url.split("/").pop();
// var tci = url.split("/").splice(3,1)[0];
// var label = url.split("/").splice(4,1)[0];

// console.group(tci, label)





// let walls = [
//   {
//       wallinst: 'http://test/walls/40cab1d1-1d6f-47a3-9afb-bd8c6300ff7e-0009c7fb',
//       ID: '641019',
//       length: 8.4,
//       TCIsIn: [
//         { TCIinst: 'http://test/tci/DefaultPanel330x240', length: 2.4 },
//         { TCIinst: 'http://test/tci/DefaultPanel330x240', length: 2.4 },
//         { TCIinst: 'http://test/tci/DefaultPanel330x240', length: 2.4 },
//         { TCIinst: 'http://test/tci/DefaultPanel330x120', length: 1.2 },
//         { TCIinst: 'http://test/tci/Timber_Filling', length: 0.0 }
//       ],
//       TCIsOut: [
//         { TCIinst: 'http://test/tci/DefaultPanel330x240', length: 2.4 },
//         { TCIinst: 'http://test/tci/DefaultPanel330x240', length: 2.4 },
//         { TCIinst: 'http://test/tci/DefaultPanel330x240', length: 2.4 },
//         { TCIinst: 'http://test/tci/DefaultPanel330x120', length: 1.2 },
//         { TCIinst: 'http://test/tci/Timber_Filling', length: 0.0 }
//       ],
//       secTCIs: [
//         { secTCIinst: 'http://test/tci/DefaultCoupler', weight: 4.58 },
//         { secTCIinst: 'http://test/tci/DefaultCoupler', weight: 4.58 }
//       ]
//     },
//     {
//       wallinst: 'http://test/walls/c1037085-1aff-4644-8770-66dc41edbf0b-0009d7e4',
//       ID: '645092',
//       length: 6.2,
//       TCIsIn: [
//         { TCIinst: 'http://test/tci/DefaultPanel330x240', length: 2.4 },
//         { TCIinst: 'http://test/tci/DefaultPanel330x240', length: 2.4 },
//         { TCIinst: 'http://test/tci/DefaultPanel330x120', length: 1.2 },
//         { TCIinst: 'http://test/tci/Timber_Filling', length: 0.2 }
//       ],
//       TCIsOut: [
//         { TCIinst: 'http://test/tci/DefaultPanel330x240', length: 2.4 },
//         { TCIinst: 'http://test/tci/DefaultPanel330x240', length: 2.4 },
//         { TCIinst: 'http://test/tci/DefaultPanel330x120', length: 1.2 },
//         { TCIinst: 'http://test/tci/Timber_Filling', length: 0.2 }
//       ],
//       secTCIs: [
//         { secTCIinst: 'http://test/tci/DefaultCoupler', weight: 4.58 },
//         { secTCIinst: 'http://test/tci/DefaultCoupler', weight: 4.58 }
//       ]
//     }
//   ];
 
// walls.forEach(wall => {
        
//   var TCIinstarray = [];

//   for (i  in wall.TCIsIn) { // in insdex.js, use wall.TCIsIn
//   var TCIvalues = Object.values(wall.TCIsIn[i])[0]
//   TCIinstarray.push(TCIvalues);

//   var count = {};
//   TCIinstarray.forEach(function(i) { count[i] = (count[i]||0) + 1;});
//   // console.log(count);
//   };
//   console.log(count);
//   console.log(TCIinstarray);
  
//   // for (var i = 0; i < count; i++) {
  

//   TCIinstvalue = 'http://test/tci/DefaultPanel330x240';
//   // console.log(TCIinstvalue);
//   // var TCIinscount = count.find(item => TCIinstvalue = item);
//   var TCIinscount = count[TCIinstvalue];
//   TCIinstvalue+= '_'+TCIinscount;

//   // console.log(TCIinstvalue);
  
// })


// TCIinstarray.forEach(function(i) { count[i] = (count[i]||0) + 1;});
// console.log(count);

// console.log(count);

// const fuseki = require('./fuseki');

// // Use ${text} to add information into the INSERT DATA Query + PREFIXES
// const updateWalls = async () => {

//     const endpoint = "http://localhost:3030/TCI-Demo/update";

//     const q = `
//         PREFIX tci:     <http://test/tci/>
//         PREFIX props:   <https://w3id.org/props#>
        
//         INSERT DATA{ 
        
//         tci:DefaultPanel330x120 props:length  "1.20";
//                                 props:height  "3.30" .


//         }`;
// return (await fuseki.updateQuery(endpoint, q))

// };

// updateWalls();


Count =
  {
    'http://test/tci/DefaultPanel330x240': 2,
    'http://test/tci/DefaultPanel330x120': 1,
    'http://test/tci/DefaultCoupler': 8,
    'http://test/tci/DefaultTieRod': 10,
    'http://test/tci/DefaultWingnut': 10,
    'http://test/tci/DefaultPushPullProp': 8
  }

TCIsCount = []

// const keys = Object.keys(Count);
// const values = Object.values(Count);
const entries = Object.entries(Count);
console.log(entries)

for (i in entries)
  TCIsCount[i] = {};
for (i in TCIsCount)
TCIsCount[i].TCIinst = entries[i][0];
for (i in TCIsCount)
TCIsCount[i].Count = entries[i][1]

  console.log(TCIsCount)
// for (i in TCIsCount)
//   TCIsCount[i].TCIsinst = keys[0];
//   TCIsCount[i].Count = values[0];
// // }
//   )
// TCIsCount.TCIsinst = keys
// keys.forEach(keys)
// Count.map(item => {
//   const TCIinst = keys;  // Name of TCIs (tci Default Primary Formwork)
//   return [TCIinst]
// });
// console.log(TCIinst)
// const obj = yourArray.reduce((o, key) => ({ ...o, [key]: whatever}), {})

// const convertArrayToObject = (array, key) => {
//   const initialValue = {};
//   return array.reduce((obj, item) => {
//     return {
//       ...obj,
//       [item[key]]: item,
//     };
//   }, initialValue);
// };


// convertArrayToObject([keys],);

