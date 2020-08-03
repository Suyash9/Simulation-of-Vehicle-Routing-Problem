import { setLocations } from "./runAlgorithm";

function processLocations(response) {
    if (response.status === 200) {
      document.getElementById('locations').innerHTML = (createLocationsList(response.body));
      setLocations(response.body);
    } else {
        let output =
        `
        <select id="loc_list" class="select_empty" size=${2}>
            <option value="0" disabled>${response.body}</option>
        </select>
        `;
        document.getElementById('locations').innerHTML = output;
        setLocations([]);
    }
}


export function getLocations(e) {
  fetch('https://vrpapp.azurewebsites.net/api/GetLocations?code=BaQdoT2/kGRjFNOPmSj3gvn72RhpqUD6lAaYRq4T69yKj7GGZ5LBTw==', {
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json'
    }
  })
  .then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processLocations(obj));
}

function createLocationsList(arr){
    let output = `<select id="loc_list" class="select" size=${arr.length+1}>`;
    for (let i = 0; i < arr.length; i++) {
      output += `<option value="${i}">${i}: (${arr[i].PartitionKey}, ${arr[i].RowKey})</option>`;
    }
    output+= `</select>`;
    return output;
}