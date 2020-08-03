module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const outputTable = context.bindings.outputTable;

    var location_x = req.query.location_x || req.body.location_x
    var location_y = req.query.location_y || req.body.location_y

    var tableData = {
        PartitionKey: location_x,
        RowKey: location_y
    };

    const inputTable = context.bindings.inputTable;

    if (inputTable == undefined){
        context.bindings.outputTable = tableData;
        context.res = {
            status: 200,
            body: JSON.stringify("Added new location " + location_x + ", " + location_y)
        };   
    }else{
        context.res = {
            status: 400,
            body: JSON.stringify("Location has already been added. Please enter a different location.")
        };
    }
};