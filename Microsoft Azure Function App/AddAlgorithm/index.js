module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const outputTable = context.bindings.outputTable;

    var algorithm_name = req.query.algorithm_name || req.body.algorithm_name;
    var parameters = req.query.parameters || req.body.parameters;
    var algorithm_code = req.query.algorithm_code || req.body.algorithm_code;

    var tableData = {
        PartitionKey: algorithm_name,
        RowKey: parameters,
        Code: algorithm_code
    };

    const inputTable = context.bindings.inputTable;

    if (inputTable.length == 0){
        context.bindings.outputTable = tableData;
        context.res = {
            status: 200,
            body: JSON.stringify("Added new algorithm " + algorithm_name + " with parameters " + parameters)
        };   
    }else{
        context.res = {
            status: 400,
            body: JSON.stringify("Algorithm with this name already exists. Please enter a different name.")
        };
    }
};