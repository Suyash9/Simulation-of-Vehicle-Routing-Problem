module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const inputTable=context.bindings.inputTable;
    var capacity = inputTable[0].RowKey;
    
    context.res = {
        status: 200,
        body: JSON.stringify(capacity)
    };
};