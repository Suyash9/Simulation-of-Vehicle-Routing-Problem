var azure = require('azure-storage');

module.exports = function (context, req) {
    let algorithm_name = req.query.algorithm_name || req.body.algorithm_name;

    const inputTable = context.bindings.inputTable;
    
    var tableData = {
        PartitionKey: algorithm_name,
        RowKey: inputTable[0].RowKey
    };

    let connectionString = "DefaultEndpointsProtocol=https;AccountName=vehicleroutingproblem;AccountKey=8BR0Aye5Zv31W/vNuMKziVgEomNPodbXUXmhAUGjAk7dqJ4kbKmh3/4h4IDn+q4o92t/mi0RYSfAOmNY7vtKsg==;EndpointSuffix=core.windows.net";
    let tableService = azure.createTableService(connectionString);

    tableService.deleteEntity('Algorithms', tableData, (error, response) => {
        let res = {
            statusCode: error ? 400 : 200,
            body: null
        };
        context.done(null, res);
    });
};