var queries = require('../queries')

/*

  The functionality of this REST Api lies here;

  All routes represent a different visulization that is on the UI

  They are all GET routes, since the data was supposed to be stored in a way that
  made it easy to quickly query, and pass off to the Ui

*/

var appRouter = function (app) {
  app.get("/LegalMaryJane", function(request, response) {
    queries.getMaryJaneData(request, response)
  });

  app.get("/OverDoseByStateByYearMaryLegal", function(request, response) {
    queries.getODDataForKaisMarijuanaLEGAL(request, response)
  });

  app.get("/OverDoseByStateByYearMaryIllegal", function(request, response) {
    queries.getODDataForKaisMarijuanaILLEGAL(request, response)
  });

  app.get("/getPerscriberInfo", function(request, response) {
    queries.getPerscriberinfo(request, response)
  });

  app.get("/getPerscriberInfoByState", function(request, response) {
    queries.getPerscriberinfoByState(request, response)
  });

  app.get("/getPerscriberInfoByProfession", function(request, response) {
    queries.getPerscriberinfoByProfession(request, response)
  });

  app.get("/getHepCMidwestDataNegative", function(request, response) {
    queries.getHepCMidwestDataNegative(request, response)
  });

  app.get("/getHepCMidwestDataPositive", function(request, response) {
    queries.getHepCMidwestDataPositive(request, response)
  });

  app.get("/getMechOfDeath", function(request, response) {
    queries.getMechOfDeath(request, response)
  });

}

module.exports = appRouter;
