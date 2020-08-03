// If stops working change connection string from acess keys in storage account.

var azure = require('azure-storage');

module.exports = function (context, req) {
    let location_x = req.query.location_x || req.body.location_x;
    let location_y = req.query.location_y || req.body.location_y;
    
    var tableData = {
        PartitionKey: location_x,
        RowKey: location_y
    };

    let connectionString = "DefaultEndpointsProtocol=https;AccountName=vehicleroutingproblem;AccountKey=8BR0Aye5Zv31W/vNuMKziVgEomNPodbXUXmhAUGjAk7dqJ4kbKmh3/4h4IDn+q4o92t/mi0RYSfAOmNY7vtKsg==;EndpointSuffix=core.windows.net";
    let tableService = azure.createTableService(connectionString);

    tableService.deleteEntity('Locations', tableData, (error, response) => {
        let res = {
            statusCode: error ? 400 : 200,
            body: null
        };
        context.done(null, res);
    });
};