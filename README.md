# Capstone-API

---

##### 1. REDEPLOY ON THE SAME VIRTUAL MACHINE WE WERE ASSIGNED: https://c2019g05.dsa.missouri.edu


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
---

# Steps to Redeploy API
1. Set up the public and private keys on this machine to be able to clone this repository: https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account
2. Clone to repository onto Virtual Machine: `git clone git@github.com:jdwdm3/Capstone-API.git`
3. Navigate inside of the directory `cd Capstone-API`
4. 
