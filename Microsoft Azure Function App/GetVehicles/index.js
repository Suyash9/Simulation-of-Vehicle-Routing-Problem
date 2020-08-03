module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const inputTable=context.bindings.inputTable;
    
    if(inputTable.length>0){
        context.res = {
            status: 200,
            body: JSON.stringify(inputTable)
        };
    }
    else {
        context.res = {
            status: 400,
            body: JSON.stringify("No vehicles have been added yet")
        };
    }
};