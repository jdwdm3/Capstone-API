const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'opioid',
  password: 'mizzou',
  port: 5432,
})

const formatHepCMidwestData = data => {
  let HepCData = [['Year','Missouri','Iowa','Ohio','Nebraska','Indiana','Kansas','Minnesota','South Dakota','North Dakota']]
  let miniList = []
  let Missouri = 0
  let Iowa = 0
  let Ohio = 0
  let Nebraska = 0
  let Indiana = 0
  let Kansas = 0
  let Minnesota = 0
  let SouthDakota = 0
  let NorthDakota = 0
  let year = ''
  let firstRun = true

  for(let i=0; i < data.length; i++) {
    
    if (year != data[i].Year) {
      if(!firstRun){
        //push values onto list in right order
        miniList.push(Missouri)
        miniList.push(Iowa)
        miniList.push(Ohio)
        miniList.push(Nebraska)
        miniList.push(Indiana)
        miniList.push(Kansas)
        miniList.push(Minnesota)
        miniList.push(SouthDakota)
        miniList.push(NorthDakota)


        //reset all values for state
        Missouri = 0
        Iowa = 0
        Ohio = 0
        Nebraska = 0
        Indiana = 0
        Kansas = 0
        Minnesota = 0
        SouthDakota = 0
        NorthDakota = 0

        //Push row onto Main list to be returned
        HepCData.push(miniList)
      }

      //set first run to false so we actually push data
      firstRun = false

      //Strip out year
      year = data[i].Year
     
      //Reset and get ready for next year
      miniList = []
      miniList.push(year)
    }
    
    switch(data[i].State){
      case 'Missouri':
        Missouri = Number(data[i].HCV_Cnt)
        break
      case 'Iowa':
        Iowa = Number(data[i].HCV_Cnt)
        break
      case 'Ohio':
        Ohio = Number(data[i].HCV_Cnt)
        break
      case 'Nebraska':
        Nebraska = Number(data[i].HCV_Cnt)
        break 
      case 'Indiana':
        Indiana = Number(data[i].HCV_Cnt)
        break
      case 'Kansas':
        Kansas = Number(data[i].HCV_Cnt)
        break
      case 'Minnesota':
        Minnesota = Number(data[i].HCV_Cnt)
        break
      case 'South Dakota':
        SouthDakota = Number(data[i].HCV_Cnt)
        break
      case 'North Dakota':
        NorthDakota = Number(data[i].HCV_Cnt)
        break
      default:
        console.log('State is not a midwestern State: ', data[i].State)
        break
    }

  }

  let firstRow = HepCData.shift()
  
  HepCData.sort( (a,b) => {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  })

  HepCData.unshift(firstRow)

  return HepCData
}

const calculatePercentageChange = (data) => {
  let twentyFifteenOd = 0
  let twentyEighteenOd = 0
  let finalData = []

  // Get all unique States
  const unique = [...new Set(data.map(item => item.state))];

  // For each state, capture the 2015, 16, 17, 18 data for OD
  for(let i = 0; i < unique.length; i++){

    // For each row in our data
    for( let j = 0; j < data.length; j++){

      // if the state we are on matches the state in the object, for year 2015
      if( (data[j].state === unique[i]) && data[j].year === '2015'){
        twentyFifteenOd = data[j].od_data
      }

      // 2018
      if( (data[j].state === unique[i]) && data[j].year === '2018'){
        twentyEighteenOd = data[j].od_data
      }
    }

    finalData.push({state: unique[i], TwentyFifteen: twentyFifteenOd, TwentyEighteen: twentyEighteenOd})
    twentyFifteenOd = 0
    twentyEighteenOd = 0
  }

  return finalData
}

const cleanMannysData = (data) => {
  let MannysData = [['OpioidPerscriptions', 'Perscriptions']]
  let miniList = []

  for(let i=0; i < data.length; i++) {
    miniList.push(Number(data[i].NumPrescriptions))
    miniList.push(Number(data[i].NumOpioids))

    MannysData.push(miniList)
    
    miniList = []
  }

  return MannysData
}

const cleanMannysData2 = (data) => {
  let MannysData = [['State', 'Total Prescribers', 'Total Number of Opioid Prescibers']]
  let miniList = []

  for(let i=0; i < data.length; i++) {
    miniList.push(data[i].State)
    miniList.push(Number(data[i].Total_Prescribers))
    miniList.push(Number(data[i].Opiod_Prescribers))

    MannysData.push(miniList)
    
    miniList = []
  }

  return MannysData
}

const cleanMannysData3 = (data) => {
  let MannysData = [['Specialty', 'Department', 'Percent that Prescribed Opioids',]]
  MannysData.push(['Specialty', null, 0,])
  let miniList = []

  for(let i=0; i < data.length; i++) {
    miniList.push(data[i].Specialty)
    miniList.push('Specialty')
    miniList.push(Math.round(Number(data[i].Opiod_Prescribers/Number(data[i].Total_Prescribers)*100)))

    MannysData.push(miniList)
    
    miniList = []
  }

  return MannysData
}

const getMaryJaneData = (request, response) => {
  pool.query('SELECT DISTINCT state, legalized, legal_status, legal_yr FROM "LegalizedMarjiunana_FIFTEEN" WHERE legalized = 1', (error, results) => {
      if (error) {
        response.status(500).json(error)
        throw error
      }
      response.status(200).json(results.rows)
  })
}

const getODDataForKaisMarijuanaLEGAL = (request, response) => {
  pool.query(`SELECT state, od_data, year FROM "LegalizedMarjiunana_FIFTEEN" Where month = 'December' AND legalized = 1
              UNION
              SELECT state, od_data, year FROM "LegalizedMarjiunana_FIFTEEN" Where month = 'August' AND year = 2018 AND legalized = 1;
  `, (error, results) => {
      if (error) {
        response.status(500).json(error)
        throw error
      }
      const percentageChangeResults = calculatePercentageChange(results.rows)
      response.status(200).json(percentageChangeResults)
  })
}

const getODDataForKaisMarijuanaILLEGAL = (request, response) => {
  pool.query(`SELECT state, od_data, year FROM "LegalizedMarjiunana_FIFTEEN" Where month = 'December' AND legalized = 0
              UNION
              SELECT state, od_data, year FROM "LegalizedMarjiunana_FIFTEEN" Where month = 'August' AND year = 2018 AND legalized = 0;
  `, (error, results) => {
      if (error) {
        response.status(500).json(error)
        throw error
      }
      const percentageChangeResults = calculatePercentageChange(results.rows)
      response.status(200).json(percentageChangeResults)
  })
}

const getPerscriberinfo = (request, response) =>{
  pool.query(`SELECT * FROM "OpiodPrescribedVsPrescriptions";`, (error, results) => {
      if (error) {
        response.status(500).json(error)
        throw error
      }
      response.status(200).json(cleanMannysData(results.rows))
  })
}

const getPerscriberinfoByState = (request, response) =>{
  pool.query(`SELECT * FROM "Opioid_Prescribers_by_State";`, (error, results) => {
      if (error) {
        response.status(500).json(error)
        throw error
      }
      response.status(200).json(cleanMannysData2(results.rows))
  })
}

const getPerscriberinfoByProfession = (request, response) => {
  pool.query(`SELECT * FROM "Opioid Prescribers by Specialty (Top 30)";`, (error, results) => {
    if (error) {
      response.status(500).json(error)
      throw error
    }
    response.status(200).json(cleanMannysData3(results.rows))
})
}

const getHepCMidwestDataNegative = (request, response) => {
  pool.query(`SELECT "Year", "HCV_Cnt", "State"  FROM "HepC_op" WHERE "HCV" = 'Negative' AND ("State" = 'Missouri' OR "State" = 'Iowa' OR "State" = 'Ohio' OR
  "State" = 'Nebraska' OR "State" = 'Indiana' OR "State" = 'Kansas' OR "State" = 'Minnesota' OR "State" = 'South Dakota' OR "State" = 'North Dakota');`, (error, results) => {
    if (error) {
      response.status(500).json(error)
      throw error
    }
    response.status(200).json(formatHepCMidwestData(results.rows))
})
}

const getHepCMidwestDataPositive = (request, response) => {
  let query = `SELECT "Year", "HCV_Cnt", "State"  FROM "HepC_op" WHERE "HCV" = 'Positive' AND ("State" = 'Missouri' OR "State" = 'Iowa' OR "State" = 'Ohio' OR
  "State" = 'Nebraska' OR "State" = 'Indiana' OR "State" = 'Kansas' OR "State" = 'Minnesota' OR "State" = 'South Dakota' OR "State" = 'North Dakota');`
    
  pool.query(query, (error, results) => {
    if (error) {
      response.status(500).json(error)
      throw error
    }
    response.status(200).json(formatHepCMidwestData(results.rows))
  })
}

const getMechOfDeath = (request, response) => {
  let query = `SELECT * FROM "Mechamism_op" ORDER BY "Year";`

  pool.query(query, (error, results) => {
    if (error) {
      response.status(500).json(error)
      throw error
    }
    response.status(200).json(formatMechOfDeathData(results.rows))
  })
}

const formatMechOfDeathData = data => {
  
  let row1 =[[ 'Year',
      '995-Gunshot/stabwound(Pre-OTIS)', 'Asphyxiation', 'BluntInjury',
      'Cardiovascular', 'Drowning', 'DrugIntoxication',
      'Electrical', 'GunshotWound',
      'Seizure', 'Sids', 'Stab'
  ]]

  let Gunshot = 0
  let Asphyxiation = 0
  let BluntInjury = 0
  let Cardiovascular = 0
  let Drowning = 0
  let DrugIntoxication = 0
  let Electrical = 0 
  let GunshotWound = 0 
  let Seizure = 0 
  let Sids = 0 
  let Stab = 0
  let year = 1988

  let TravisData = row1
  let miniList = []

  for(let i=0; i < data.length; i++) {

    if(data[i].Year !== year) {
        //Populate row
        miniList.push(String(year))
        miniList.push(Gunshot)
        miniList.push(Asphyxiation)
        miniList.push(BluntInjury)
        miniList.push(Cardiovascular)
        miniList.push(Drowning)
        miniList.push(DrugIntoxication)
        miniList.push(Electrical)
        miniList.push(GunshotWound)
        miniList.push(Seizure)
        miniList.push(Sids)
        miniList.push(Stab)
  
        //Push mini row onto master set
        TravisData.push(miniList)
  
        //Reset
        miniList = []
        Gunshot = 0
        Asphyxiation = 0
        BluntInjury = 0
        Cardiovascular = 0
        Drowning = 0
        DrugIntoxication = 0
        Electrical = 0 
        GunshotWound = 0 
        IntracranialHemorrhage = 0
        Seizure = 0 
        Sids = 0 
        Stab = 0
        year = data[i].Year
    }
    
    switch(data[i].Mechanisms){
      case '995-Gunshot/stabwound(Pre-OTIS)':
          Gunshot = Number(data[i].Count)
        break
      case 'Asphyxiation':
          Asphyxiation = Number(data[i].Count)
        break
      case 'BluntInjury':
          BluntInjury = Number(data[i].Count)
        break
      case 'Cardiovascular':
          Cardiovascular = Number(data[i].Count)
        break
      case 'Drowning':
          Drowning = Number(data[i].Count)
        break
      case 'DrugIntoxication':
          DrugIntoxication = Number(data[i].Count)
        break
      case 'Electrical':
          Electrical = Number(data[i].Count)
        break
      case 'GunshotWound':
          GunshotWound = Number(data[i].Count)
        break
      case 'Seizure':
          Seizure = Number(data[i].Count)
        break
      case 'Sids':
        Sids = Number(data[i].Count)
        break
      case 'Stab':
        Stab = Number(data[i].Count)
        break
      default:
        console.log(data[i])
    }
  }

  return TravisData
}

module.exports ={
  getMaryJaneData,
  getODDataForKaisMarijuanaLEGAL,
  getODDataForKaisMarijuanaILLEGAL,
  getPerscriberinfo,
  getPerscriberinfoByState,
  getPerscriberinfoByProfession,
  getHepCMidwestDataNegative,
  getHepCMidwestDataPositive,
  getMechOfDeath
}