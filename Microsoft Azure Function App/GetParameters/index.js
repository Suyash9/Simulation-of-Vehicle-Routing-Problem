module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const inputTable = context.bindings.inputTable;
    var parameters = inputTable[0].RowKey;

    if (parameters.includes(",")){
        parameters = parameters.split(",");
    }else{
        parameters = [parameters];
    }
    
    context.res = {
        status: 200,
        body: JSON.stringify(parameters)
    };
};