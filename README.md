# Capstone-API

---

### 1. REDEPLOY ON THE SAME VIRTUAL MACHINE WE WERE ASSIGNED: https://c2019g05.dsa.missouri.edu

__*Our Postgres instance is running locally on our CentOS VM, we will not need to take any action with this method to stand up a new database, this is strictly for the ability to redeploy the API source code and run it so it functions. If we were not to make this assumption (that this will be redeployed to same enviorment), we would have to create a dump file of the Postgres Database to capture the current state it is in.  I had every team member upload their own dataframes to the database when they felt their data was limited to what they were trying to visualize.  Those dataframes/CSV files that each member used are scattered around where each team member saved them. I gave members the ability to upload their dataframes using the following:*__

#### Transform Dataframes Directly to Postgres Tables
```
# Where `scott` is replaced with our username, and `tiger` is replaced with our password

from sqlalchemy import create_engine
engine = create_engine('postgresql://scott:tiger@localhost:5432/opioid')
df.to_sql('table_name', engine)
```

#### Transform Tables Directly to Dataframes

```
# Where `con` is the connection objection to your postgres instance

import sql  # the patched version (file is named sql.py)
sql.write_frame(df, 'table_name', con, flavor='postgresql')
```

__*Since each member did not upload their raw CSV files to represent tables, I would have to go through all of their notebooks seperately, break out their data cleaning up to the point they are uploading their data frames, and re-write smaller scripts that would accomplish this.  I think the most reasonable way to redeploy this would be assuming the database is in place, with all team members data already in the database... OR that we have the database backed up in the correct state using a `sql_dump`. I fought with trying to create this backup, but ran into the process running for a extreme amount of time. IF a sql dump was able to be obtained, you can then spin up a new postgres instance on ANY machine, and recreate the database from the `sql_dump`, allowing you to redeploy this API anywhere.*__

---

# Steps to Redeploy API
1. Set up the public and private keys on this machine to be able to clone this repository: https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account
2. Clone to repository onto Virtual Machine: `git clone git@github.com:jdwdm3/Capstone-API.git`
3. Navigate inside of the directory `cd Capstone-API`
4. This API was built using node, you can observe the dependencies we need inside of __package.json__:
![alt text](https://raw.githubusercontent.com/jdwdm3/Capstone-API/master/Images/dependencies.png)
5. run `npm install`: This will utilize node package manager to read your dependencies, and download them into your `node_modules/` 
6. Once all node Modules have been succussfully installed, to deploy the API, you need to run `node app.js`
7. If port is in use, `fuser -k 3000/tcp` to kill current process using it
8. You should see a text printed to standard output that lets you know the API is `listening on port 3000`

Now that the API is running, and I have configured the VM to allow for HTTP requests.  I ran into CORS issues at first, and was able to figure out how to get past them.  To allow `Cross Origin Requests` (CORS), I had to white list two hosts in the header of the response:
![alt text](https://raw.githubusercontent.com/jdwdm3/Capstone-API/master/Images/CORS.png)

#### Leave this API running to allow data to be served to the User Interface

---

## API Code Organization

1. App.js
- The `app.js` file does all of the heavy lifting.  This file reads the requests and makes decisions on how to handle them, and determines how to populate the response via `routes`


2. Routes
The following routes were set up to deliver necassary data to our User Interface:
 - LegalMaryJane
 - OverDoseByStateByYearMaryLegal
 - OverDoseByStateByYearMaryIllegal
 - getPerscriberInfo
 - getPerscriberInfoByState
 - getPerscriberInfoByProfession
 - getHepCMidwestDataNegative
 - getHepCMidwestDataPositive
 - getMechOfDeath

It should be noted that the only endpoints that were added to this RESTful API are all `GET` endpoints.  Reason being, my teamates were supposed to have modified their data to such a point, the only thing living in our database was data that was ready to be used, no additions, or modifications were supposed to be necassary. However, a lot of modifcations were still needed in order to put data in the proper shape to be consumed by Google-React-Charts.  Majority of the cleaning happened on the API with a various amounts of custom cleaning functions I wrote:

3. Data Cleansing
 - formatMechOfDeath
 - formatHepCMidwestData
 - calculatePercentageChange
 - cleanMannysData
 - cleanMannysData2
 - cleanMannysData3

The naming could have been better of these functions, but each of these helper functions are associated with one of the `get` endpoints above.  If a someone wants to know what the helpers are doing, they can easily trace it to find the route its associated with it.  The naming of the routes was done carefully, since those are the exposed endpoints for anyone to use. The individual cleaning was mostly just reformatting arrays of JSON obejcts, to lists of lists (For some reason, google's charts wanted lists of lists, and not object formmated data, which seems strange to me)

