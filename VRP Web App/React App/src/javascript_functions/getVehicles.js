import { setNumVehicles } from "./runAlgorithm";

function processVehicles(response) { 
    if (response.status === 200) {
        document.getElementById('vehicles').innerHTML = (createVehiclesList(response.body));
        setNumVehicles(response.body.length.toString());
    } else {
        let output =
        `
        <select id="veh_list" class="select_empty" size=${2}>
            <option value="0" disabled>${response.body}</option>
        </select>
        `;
        document.getElementById('vehicles').innerHTML = output;
        setNumVehicles("0");
    }
}

export function getVehicles(e) {
  fetch('https://vrpapp.azurewebsites.net/api/GetVehicles?code=PMbxp29fv46nRfzB8G/aa3nQJb7CIr0SsB7rtM9drIzFRncZ0GaaCw==', {
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json'
    }
  })
  .then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processVehicles(obj));
}

function createVehiclesList(arr){
    let output = `<select id="veh_list" class="select" size=${arr.length+1}>`;
    for (let i = 0; i < arr.length; i++) {
      output += `<option value="${i}">${arr[i].PartitionKey} (${arr[i].RowKey} unit)</option>`;
    }
    output+= `</select>`;
    return output;
}