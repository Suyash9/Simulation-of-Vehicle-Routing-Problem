// If stops working change connection string from acess keys in storage account.

var azure = require('azure-storage');

module.exports = function (context, req) {
    let vehicle_name = req.query.vehicle_name || req.body.vehicle_name;
    let capacity = req.query.capacity || req.body.capacity;
    
    var tableData = {
        PartitionKey: vehicle_name,
        RowKey: capacity
    };

    let connectionString = "DefaultEndpointsProtocol=https;AccountName=vehicleroutingproblem;AccountKey=8BR0Aye5Zv31W/vNuMKziVgEomNPodbXUXmhAUGjAk7dqJ4kbKmh3/4h4IDn+q4o92t/mi0RYSfAOmNY7vtKsg==;EndpointSuffix=core.windows.net";
    let tableService = azure.createTableService(connectionString);

    tableService.deleteEntity('Vehicles', tableData, (error, response) => {
        let res = {
            statusCode: error ? 400 : 200,
            body: null
        };
        context.done(null, res);
    });
};