module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const inputTable = context.bindings.inputTable;
    var algorithms = inputTable.map(a => a.PartitionKey);
    
    if(algorithms.length>0){
        context.res = {
            status: 200,
            body: JSON.stringify(algorithms)
        };
    }
};