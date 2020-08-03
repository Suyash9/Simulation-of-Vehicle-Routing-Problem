import { getLocations } from "./getLocations";

function processNewLocation(response) {
    if (response.status === 200) {
        getLocations();
        alert(response.body);
        getLocations();
        document.getElementById('add_loc_box').reset();
    } else {
        alert(response.body);
    }
}

export function addLocation(e) {
    e.preventDefault();

    let location_x = document.getElementById('new_loc_x').value;
    let location_y = document.getElementById('new_loc_y').value;

    if (location_x == "" && location_y == ""){
        alert("Enter x and y coordinates of location");
    }else if (location_x == ""){
        alert("Enter x coordinate of location");
    }else if (location_y == ""){
        alert("Enter y coordinate of location");
    }else{
        fetch('https://vrpapp.azurewebsites.net/api/AddLocation?code=36Pn6gW0rrBwpkDlPvY1IrBkEobHYckza3viOIg0SlbUfPfStADxWQ==', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                location_x: location_x,
                location_y: location_y
            })
        })
        .then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processNewLocation(obj));
    }
}