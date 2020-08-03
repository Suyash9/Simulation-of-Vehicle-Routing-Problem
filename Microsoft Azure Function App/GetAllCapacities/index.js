module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const inputTable=context.bindings.inputTable;
    var vehicles = inputTable.map(a => a.RowKey);
    
    if(vehicles.length>0){
        context.res = {
            status: 200,
            body: JSON.stringify(vehicles)
        };
    }else{
        context.res = {
            status: 400,
            body: JSON.stringify("No vehicles")
        };
    }
};