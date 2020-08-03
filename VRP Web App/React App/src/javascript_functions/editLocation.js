import { getLocations } from "./getLocations";

var alert_loc;

function processEditLocation(response) { 
    if (response.status === 200) {
        deleteEditLocation();
        alert("Changed " + alert_loc.toString().split(": ")[1]);
        document.getElementsByClassName("modal_loc")[0].style.display = "none";
        document.getElementsByClassName("modal_loc")[1].style.display = "none";
        getLocations();
    } else {
        alert(response.body);
    }
}

export function editLocation(e) {
    e.preventDefault();
    let selected = document.getElementById("loc_list");
    
    var edit_loc_x = document.getElementById("edit_loc_x").value.toString();
    var edit_loc_y = document.getElementById("edit_loc_y").value.toString();

    if(selected.value != ""){
        if (edit_loc_x != "" && edit_loc_y != ""){
            fetch('https://vrpapp.azurewebsites.net/api/AddLocation?code=36Pn6gW0rrBwpkDlPvY1IrBkEobHYckza3viOIg0SlbUfPfStADxWQ==', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    location_x: edit_loc_x,
                    location_y: edit_loc_y
                })
            })
            .then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processEditLocation(obj));
        }else if (edit_loc_x == "" && edit_loc_y == "") {
            alert("Enter new vehicle name and capacity");
        }else if (edit_loc_x == "") {
            alert("Enter new vehicle name");
        }else if (edit_loc_y == "") {
            alert("Enter new vehicle capacity");
        }
    }else{
        alert("Please select location to edit");
    }
}

function deleteEditLocation(){
    let selected = document.getElementById("loc_list");
    let location = selected.options[selected.selectedIndex].text.split(',');
    alert_loc = location;
    let location_x = location[0].split('(')[1].toString();
    let location_y = location[1].split(')')[0].trim().toString();

    fetch('https://vrpapp.azurewebsites.net/api/DeleteLocation?code=ojabkFFYaK8St3WuBP772U/L2Ub2D7U4ZIUrh65va75hC511zYHA7g==', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            location_x: location_x,
            location_y: location_y
        })
    });
}