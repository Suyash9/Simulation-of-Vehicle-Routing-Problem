import { getParameterValues, checkSimilarAlgo } from './runAlgorithm';

var num_parameters = 0;
var current_algo;

function processParameters(response) {
    var modal_para = document.getElementById("modal_para");
    if (response.body != "None"){
        num_parameters = response.body.length;
        modal_para.style.display = "block";
        document.getElementById('para_modal_form').innerHTML = (createParametersList(response.body));

        var selected = document.getElementById("algo_list");
        var algorithm = selected.options[selected.selectedIndex].text;

        if (current_algo == algorithm || checkSimilarAlgo(current_algo, algorithm)){
            const getByKey = (arr,key) => (arr.find(x => Object.keys(x)[0] === key) || {})[key]
            let parameters = getParameterValues();
            for (let i = 0; i < num_parameters; i++) {
                var id = "para" + i.toString();
                var para_value = getByKey(parameters, id);
                if (para_value != undefined)
                    document.getElementById(id).value = para_value;
            }
        }
    }
}

export function getParameters(e) {
    e.preventDefault();
    
    var selected = document.getElementById("algo_list");
    var algorithm = selected.options[selected.selectedIndex];

    if (selected.value != "none" && algorithm != undefined){
        var algorithm_name = algorithm.text;
        fetch('https://vrpapp.azurewebsites.net/api/GetParameters?code=hw3Ilnd/9eDcZjeEy3g7uVDWofaL2/XPUCAl2WnPsjcAVWew3bm8Mw==', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                algorithm: algorithm_name
            })
        })
        .then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processParameters(obj));
    }
}

function createParametersList(arr){
    let output = `<h1>Parameters</h1>`;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].trim()=="Depot Location"){
            output += `<label><b>Depot Location</b></label>`
            output += `<input type="number" id="para${i}" value=0 autocomplete="off">`            
        }else{
            output += `<label><b>${arr[i].trim()}</b></label>`
            output += `<input type="text" id="para${i}" placeholder="Enter ${arr[i].trim()} as specified on the help page" autocomplete="off"/>`
        }
    }
    return output;
}

export function getCurrentAlgo(){
    return current_algo;
}

export function getNumParameters(){
    return num_parameters;
}

export function setCurrentAlgo(algo){
    current_algo = (' ' + algo).slice(1);
}

export function setAlgorithm(algo){
    current_algo = (' ' + algo).slice(1);
}