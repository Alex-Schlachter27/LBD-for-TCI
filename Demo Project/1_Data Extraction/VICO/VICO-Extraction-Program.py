import json
import requests
import pyodbc 

# Open all required data files Cost-Plan, Takeoff-System and CAD-Model-System
# COST PLAN
with open(r'C:\Users\alex\OneDrive - Danmarks Tekniske Universitet\3.4_MSc Thesis\4.5_Results\Demo\2_VICO\TCI-Demo_VICO-Cost-Plan.json') as f:
    # returns a dictionary 
    CPLANdict = json.load(f)
    # CPLANjson = json.dumps(CPLANdict)

    # # Write json object to file for better visualization
    # with open(r'C:\Users\alex\OneDrive - Danmarks Tekniske Universitet\3.4_MSc Thesis\4.5_Results\Demo\3.2_VICO Export-Data\TCI-Demo_VICO-Cost-Plan_mod.json','w') as write_file:
    #     json.dump(CPLANdict, write_file, indent=4)

# TAKEOFF SYSTEM
with open(r'C:\Users\alex\OneDrive - Danmarks Tekniske Universitet\3.4_MSc Thesis\4.5_Results\Demo\2_VICO\TCI-Demo_VICO-TakeOff-System.json') as f:
    # returns a dictionary 
    TOFFdict = json.load(f)

    # # Write json object to file for better visualization
    # with open(r'C:\Users\alex\OneDrive - Danmarks Tekniske Universitet\3.4_MSc Thesis\4.5_Results\Demo\3.2_VICO Export-Data\TCI-Demo_VICO-TakeOff-System_mod.json','w') as write_file:
    #     json.dump(TOFFdict, write_file, indent=4)

# CAD MODEL SYSTEM
with open(r'C:\Users\alex\OneDrive - Danmarks Tekniske Universitet\3.4_MSc Thesis\4.5_Results\Demo\2_VICO\TCI-Demo_VICO-CAD-Model-System+ElementID.json') as f:
    # returns a dictionary 
    CADdict = json.load(f)

    # # Write json object to file for better visualization
    # with open(r'C:\Users\alex\OneDrive - Danmarks Tekniske Universitet\3.4_MSc Thesis\4.5_Results\Demo\3.2_VICO Export-Data\TCI-Demo_VICO-CAD-Model-System_mod.json','w') as write_file:
    #     json.dump(CADdict, write_file, indent=4)

    # (1) Connect to SQL Database
    server = 'exigo-prod.database.windows.net' 
    database = 'alex_exicute_vsolsvrblhfxzrfcanguoynzq' 
    username = 'alexlogin' 
    password = '20Exigo20' 
    cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
    cursor = cnxn.cursor()

# Get List of Components with TOIs and Element-Information
    CPlan_list = CPLANdict['views'][0]['records']
    TOff_list = TOFFdict['views'][0]['records']
    CAD_list = CADdict['views'][0]['records']

    projectGUID = CADdict['header']['projectDbName']
    
    # (2) TOQ: Get from CostPlan
    # Loop through CostPlan to find comploid from complist and append TOQid, Elementloids and ElementIDs to complist

    complist = []
    for row in CPlan_list:
        # if not row['type'] = 'COMPONENT': continue
        if not 'TAGHEADER' in row.values() : continue #Tagheader contains the comploid in 1-1 relation to the componentloid
        comploid = row['loid']
        tagh_rid = row['rid']

        # in CPlan_list, filter all prid with = tagh_rid-1 and get ploid as TOI --> append all TOIs to matched comploids
        TOQ_prid = str(int(tagh_rid)-1)
        TOQ_prid_list = [TOQ_prid]
        # print(TOQ_prid_list)
        TOIlist = list(filter(lambda d: d['prid'] in TOQ_prid_list, CPlan_list)) # returns a list of dictionaries with each dictionary representing on Takeoff-Item
        # print(TOIlist)

        # Get all TOIs that are assigned to the reviewed component as a list that will be added as a value to the complist
        comp_TOIs = []
        for TOQ in TOIlist:
            TOI = TOQ['ploid']
            comp_TOIs.append(TOI)
        # print(comp_TOIs)

        # Get all Elementloids that are grouped as one Takeoff item (Element-Type) 
        comp_TOI_elems = []
        for TOQ in comp_TOIs:
            TOQ_list = [TOQ]
            TOIlist = list(filter(lambda d: d['loid'] in TOQ_list, TOff_list))
            # print(TOIlist)
            for row in TOIlist:
                if not 'ELEMENTHEADER' in row.values(): continue
                elemh_rid = row['rid']
                # print(elemh_rid)
                elem_prid_list = [elemh_rid]
                elemlist = list(filter(lambda d: d['prid'] in elem_prid_list, TOff_list)) # returns a list of dictionaries with each dictionary representing on Takeoff-Item

                toi_elements = []
                for elem in elemlist:
                    elemloid = elem['loid']
                    toi_elements.append(elemloid)

                
                # Go through toi_elements and add Location from TakeOff and ElementID as well as RevitGUID from CAD-System as new values
                elems_id = []
                for elem in toi_elements:
                    
                    elem_list = [elem]
                    elem_loclist = list(filter(lambda d: d['loid'] in elem_list, TOff_list))
                    # print(elem_loclist)
                    for row in elem_loclist:
                        if not 'LOCATIONHEADER'in row.values(): continue
                        loc_prid = row['rid']
                        loc_prid_list = [loc_prid]
                        loclist = list(filter(lambda d: d['prid'] in loc_prid_list, TOff_list))
                        # print(loclist)
                        locloid = loclist[0]['loid']
                        # print(locloid)

                    elemlist = list(filter(lambda d: d['loid'] in elem_list, CAD_list))
                    # print(elemlist)

                    # for row in elemlist:
                    #     if 'ELEMENT' in row.values():
                    #         rvtGUID = row['properties'][0]['value']
                    #         ElementID = row['properties'][1]['value']
                    #     elif 'DERIVEDELEMENT' in row.values():
                    #         rvtGUID = row['properties'][0]['value']
                    #         ElementID = row['properties'][1]['value']
                    #     else: continue
                    #     elems_id.append({elem:{'ElementID': ElementID, 'rvtGUID': rvtGUID, 'locloid': locloid}})
                    #     # print(elem)
                    #     # print(locloid)

                    for row in elemlist:
                        if 'ELEMENT' in row.values():
                            rvtGUID = row['properties'][0]['value']
                            ElementID = row['properties'][1]['value'].replace(' ', '')
                            elems_id.append({elem:{'ElemType': 'Element', 'ElementID': ElementID, 'rvtGUID': rvtGUID, 'locloid': locloid}})
                            
                        if 'DERIVEDELEMENT' in row.values():
                            rvtGUID = row['properties'][0]['value']
                            ElementID = row['properties'][1]['value'].replace(' ', '')
                            elems_id.append({elem:{'ElemType': 'DerivedElement', 'ElementID': ElementID, 'rvtGUID': rvtGUID, 'locloid': locloid}})
                #         # print(elem)
                #         # print(locloid)

                # print(elems_id)
            TOI_elems = {TOQ: elems_id}
            comp_TOI_elems.append(TOI_elems)
        
        # print(comp_TOI_elems)
        # complist.append({'comploid': comploid, 'TOIs': comp_TOIs})
        complist.append({comploid: comp_TOI_elems})
    # print(complist)

    Elements = []
    for row in complist:
        key = row.keys()
        comploid = list(row)[0]
        toilist = row[comploid]
        # print(toilist)
        for row in toilist:
            toi = list(row)[0]
            elemlist = row[toi]
            # print(elemlist)
            for row in elemlist:
                elemloid = list(row)[0]
                ElemType = row[elemloid]['ElemType']
                ElementID = row[elemloid]['ElementID']
                rvtGUID = row[elemloid]['rvtGUID'].replace('{','').replace('}','')
                locloid = row[elemloid]['locloid']
                # print(ElementID)

                Elements.append({'elemloid': elemloid, 'ElemType': ElemType, 'ElementID': ElementID , 'rvtGUID': rvtGUID, 'locloid': locloid, 'toi':toi, 'comploid': comploid})

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

    # cursor.execute('SELECT loid FROM {} WHERE level=3'.format(Table1)) # Only Level 3 components
    query= f'DROP TABLE {Table1};\n'
    query+= f'CREATE TABLE {Table1} (ID INT IDENTITY(1,1) NOT NULL, {elemloid} varchar(200) PRIMARY KEY, {ElemType} varchar(200), {ElementID} varchar(200), {rvtGUID} varchar(200), {locloid} varchar(200), {toi} varchar(200), {comploid} varchar(200), projectGUID varchar(200));\n'
    
    for item in Elements:
        elemloid = item['elemloid']
        ElemType = item['ElemType']
        ElementID = item['ElementID']
        rvtGUID  = item['rvtGUID']
        locloid = item['locloid']
        toi = item['toi']
        comploid = item['comploid']
        projectGUID = projectGUID

        query+= f"INSERT INTO {Table1} VALUES ('{elemloid}', '{ElemType}', '{ElementID}', '{rvtGUID}', '{locloid}', '{toi}', '{comploid}', '{projectGUID}');\n"
    
    
    print(query)
    cursor.execute(query)

    cnxn.commit()
    cursor.close()
    cnxn.close()


    

