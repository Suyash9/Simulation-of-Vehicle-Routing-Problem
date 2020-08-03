module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const locations = context.bindings.inputTable;
    
    if(locations.length>0){
        context.res = {
            status: 200,
            body: JSON.stringify(locations)
        };
    }
    else {
        context.res = {
            status: 400,
            body: JSON.stringify("No locations have been added yet")
        };
    }
};