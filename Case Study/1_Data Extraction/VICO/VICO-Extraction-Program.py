import json
import requests
import pyodbc 

# Open all required data files Cost-Plan, Takeoff-System and CAD-Model-System
# COST PLAN
with open(r'C:\Users\alex\OneDrive - Danmarks Tekniske Universitet\3.4_MSc Thesis\4.5_Results\Case Study_SDU\2.2_VICO-Export-Data\TCI-CS_VICO-Cost-Plan.json') as f:
    # returns a dictionary 
    CPLANdict = json.load(f)
    # CPLANjson = json.dumps(CPLANdict)

# TAKEOFF SYSTEM
with open(r'C:\Users\alex\OneDrive - Danmarks Tekniske Universitet\3.4_MSc Thesis\4.5_Results\Case Study_SDU\2.2_VICO-Export-Data\TCI-CS_VICO-TakeOff-System.json') as f:
    # returns a dictionary 
    TOFFdict = json.load(f)

# CAD MODEL SYSTEM
with open(r'C:\Users\alex\OneDrive - Danmarks Tekniske Universitet\3.4_MSc Thesis\4.5_Results\Case Study_SDU\2.2_VICO-Export-Data\TCI-CS_VICO-CAD-Model-System.json') as f:
    # returns a dictionary 
    CADdict = json.load(f)


# Get All Elements by element ID from the Revit Data graph 
from SPARQLWrapper import SPARQLWrapper, JSON

ElemIDs = []

sparql = SPARQLWrapper("http://localhost:3030/TCI-CaseStudy-Revit/query")
sparql.setQuery("""
    PREFIX props: <https://w3id.org/props#>
    PREFIX tci:   <http://test/tci/>
    PREFIX product: <https://w3id.org/product#>
    SELECT *
    WHERE {
        ?s  tci:pciType product:Wall ;
        props:Element_ID ?ID .
        }
    """)
sparql.setReturnFormat(JSON)
results = sparql.query().convert()

for result in results["results"]["bindings"]:
    ElemIDs.append(result["ID"]["value"])


# print(ElemIDs)



# (1) Connect to SQL Database
server = 'exigo-prod.database.windows.net' 
database = 'exicute_rmlvkojaqpacysgercjpmyxrp' 
username = 'exicute_rmlvkojaqpacysgercjpmyxrp' 
password = 'Q8Neh*ikRnsVEu6WtA5L' 
# cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password, timeout=180)
cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()

# Get List of Components with TOIs and Element-Information
CPlan_list = CPLANdict['views'][0]['records']
TOff_list = TOFFdict['views'][0]['records']
CAD_list = CADdict['views'][0]['records']

projectGUID = CADdict['header']['projectDbName']


# print(temp) 
list1 = ['properties']
CADprops = [k for k in CAD_list if 'properties' in k]

elemloid_filtered = [d['loid'] for d in CADprops if d['properties'][1]['value'] in ElemIDs]
# print(elemloid_filtered)

filteredCAD = list(filter(lambda d: d['loid'] in elemloid_filtered, CAD_list))
# print(filteredCAD)

comploids_lev5 = []
lev_list = ['5']
comp_type_list = ['COMPONENT']
comploid_list = list(filter(lambda d: d['type'] in comp_type_list, CPlan_list))
complist_lev5 = list(filter(lambda d: d['properties'][6]['value'] in lev_list, comploid_list))
for row in complist_lev5:
    comploids_lev5.append(row['loid'])
    row['properties'] = []


Elements = []
# print(filteredCAD[0]['properties'][1]['value'])
filteredCAD1 = [k for k in filteredCAD if 'properties' in k]
for row in filteredCAD1:
    elemloid = row['loid']
    ElemType = row['type']
    ElementID = row['properties'][1]['value']
    rvtGUID = row['properties'][0]['value']
    elemloidlist = [elemloid]

    # Get all Elementloids that are grouped as one Takeoff item (Element-Type) 
    ElemList = list(filter(lambda d: d['loid'] in elemloidlist, TOff_list))
    for row in ElemList:
        if not 'ELEMENT' in row.values(): continue
        elem_prid = row['prid']
        elemloid = row['loid']
        elemloidl = [elemloid]
        elem_pridlist = [elem_prid]
        TOIlist = list(filter(lambda d: d['rid'] in elem_pridlist, TOff_list))

        elem_loclist = list(filter(lambda d: d['loid'] in elemloidl, TOff_list))
        # print(elem_loclist)
        for row in elem_loclist:
            if not 'LOCATIONHEADER'in row.values(): continue
            loc_prid = row['rid']
            loc_prid_list = [loc_prid]
            loclist = list(filter(lambda d: d['prid'] in loc_prid_list, TOff_list))
            # print(loclist)
            locloid = loclist[0]['loid']
            # print(locloid)


        # Get all TOI that are grouped as one Component (Cost Element) 
        for row in TOIlist:
            if not 'ELEMENTHEADER' in row.values(): continue
            TOI = row['loid']
            TOI_list = [TOI]
            # print(TOI_list)
            
            CPlan_list_ploid = [k for k in CPlan_list if 'ploid' in k]
            comp_toi = list(filter(lambda d: d['ploid'] in TOI_list, CPlan_list_ploid))

            for row in comp_toi:
                toi_prid = row['prid']
                comp_rid = str(int(toi_prid)+1)
                rid_list = [comp_rid]
                Complist = list(filter(lambda d: d['rid'] in rid_list, CPlan_list))
                comploid = Complist[0]['loid']
                if comploid in comploids_lev5:
                    Elements.append({'elemloid': elemloid, 'ElemType': ElemType, 'ElementID': ElementID , 'rvtGUID': rvtGUID, 'locloid': locloid, 'toi':TOI, 'comploid': comploid, 'comp_lev': '5'})

# print(Elements)

# Write to List of components with ElementIDs to SQL database
Table1 = 'elements'

# Get Variables for Column Names
elemloid = list(Elements[0].keys())[0]
ElemType = list(Elements[0].keys())[1]
ElementID = list(Elements[0].keys())[2]
rvtGUID  = list(Elements[0].keys())[3]
locloid = list(Elements[0].keys())[4]
toi = list(Elements[0].keys())[5]
comploid = list(Elements[0].keys())[6]
comp_lev = list(Elements[0].keys())[7]

query= f'DROP TABLE {Table1};\n'
query+= f'CREATE TABLE {Table1} (ID INT IDENTITY(1,1) NOT NULL PRIMARY KEY, {elemloid} varchar(200), {ElemType} varchar(200), {ElementID} varchar(200), {rvtGUID} varchar(200), {locloid} varchar(200), {toi} varchar(200), {comploid} varchar(200), {comp_lev} varchar(200), projectGUID varchar(200));\n'

for item in Elements:
        elemloid = item['elemloid']
        ElemType = item['ElemType']
        ElementID = item['ElementID']
        rvtGUID  = item['rvtGUID']
        locloid = item['locloid']
        toi = item['toi']
        comploid = item['comploid']
        comp_lev = item['comp_lev']

        projectGUID = projectGUID

        query+= f"INSERT INTO {Table1} VALUES ('{elemloid}', '{ElemType}', '{ElementID}', '{rvtGUID}', '{locloid}', '{toi}', '{comploid}', '{comp_lev}', '{projectGUID}');\n"
    
    
print(query)

cursor.execute(query)
cnxn.commit()
cursor.close()
cnxn.close()




