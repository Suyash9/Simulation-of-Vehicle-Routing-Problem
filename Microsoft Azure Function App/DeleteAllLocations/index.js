var azure = require('azure-storage');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const inputTable=context.bindings.inputTable;

    let connectionString = "DefaultEndpointsProtocol=https;AccountName=vehicleroutingproblem;AccountKey=8BR0Aye5Zv31W/vNuMKziVgEomNPodbXUXmhAUGjAk7dqJ4kbKmh3/4h4IDn+q4o92t/mi0RYSfAOmNY7vtKsg==;EndpointSuffix=core.windows.net";
    let tableService = azure.createTableService(connectionString);
    
    inputTable.forEach(function(location) {
        context.log(location)
        tableService.deleteEntity('Locations', location, (error, response) => {
        let res = {
                statusCode: error ? 400 : 200,
                body: null
            };
            context.done(null, res);
        });
    });
};