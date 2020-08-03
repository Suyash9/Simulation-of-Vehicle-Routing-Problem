module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const outputTable = context.bindings.outputTable;

    var vehicle_name = req.query.vehicle_name || req.body.vehicle_name
    var capacity = req.query.capacity || req.body.capacity

    var tableData = {
        PartitionKey: vehicle_name,
        RowKey: capacity
    };

    const inputTable = context.bindings.inputTable;

    if (inputTable.length == 0){
        context.bindings.outputTable = tableData;
        context.res = {
            status: 200,
            body: JSON.stringify("Added new vehicle " + vehicle_name + " with capacity " + capacity)
        };   
    }else{
        context.res = {
            status: 400,
            body: JSON.stringify("Vehicle with this name already exists. Please enter a different name.")
        };
    }
};