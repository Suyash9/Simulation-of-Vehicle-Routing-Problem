import { getAlgorithms } from "./getAlgorithms";

function processNewAlgorithm(response) {
    if (response.status === 200) {
        getAlgorithms();
        document.getElementById("modal_addalgo").style.display = "none";
        alert(response.body);
        getAlgorithms();
        document.getElementById('new_algo_form').reset();
    } else {
        alert(response.body);
    }
}

export function addAlgorithm(e) {
    e.preventDefault();

    let algorithm_name = document.getElementById('algo_name').value;
    let parameters = document.getElementById('algo_para').value;
    let algorithm_code = document.getElementById('new_algo').value

    if (algorithm_name == ""){
        alert("Enter algorithm name");
    }else if (parameters == ""){
        alert("Enter parameters");
    }else if (algorithm_code == ""){
        alert("Enter Python algorithm");
    }else if (parameters.split(',').length > 5){
        alert("A maximum of 5 parameters are allowed");
    }else{
        fetch('https://vrpapp.azurewebsites.net/api/AddAlgorithm?code=eevj1taf9lOVcYjeDZ5PkLF9u3GoddkW6TEURSmsxaZjG/I7DlO5Ig==', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                algorithm_name: algorithm_name,
                parameters: parameters,
                algorithm_code: algorithm_code
            })
        })
        .then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processNewAlgorithm(obj));
    } 
}