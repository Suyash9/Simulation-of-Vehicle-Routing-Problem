import { getVehicles } from "./getVehicles";
import { getAllCapacities } from "./getAllCapacities";

function processEditVehicle(response) {
    if (response.status === 200) {
        deleteEditVehicle();
        let selected = document.getElementById("veh_list");
        let vehicle_name = selected.options[selected.selectedIndex].text.split(" ")[0];
        alert("Changed " + vehicle_name);
        document.getElementsByClassName("modal_veh")[0].style.display = "none";
        document.getElementsByClassName("modal_veh")[1].style.display = "none";
        getVehicles();
        getAllCapacities();
    } else {
        alert(response.body);
    }
}

export function editVehicle(e) {
    e.preventDefault();

    let selected = document.getElementById("veh_list");

    if(selected.value != ""){
        var edit_name = document.getElementById("edit_veh_name").value;
        var edit_cap = (document.getElementById("edit_veh_cap").value).toString();
        let vehicle_name = selected.options[selected.selectedIndex].text.split(" ")[0];
        
        if (edit_name != "" && edit_cap != ""){
            if (edit_name != vehicle_name){
                fetch('https://vrpapp.azurewebsites.net/api/AddVehicle?code=paLR8e4zEKnIQ4icnPH3inhCeeUIlh8yGWhagv3D92zE95a2qKsGIA==', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        vehicle_name: edit_name,
                        capacity: edit_cap
                    })
                }).then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processEditVehicle(obj));  
            }else if(edit_name == vehicle_name){
                fetch('https://vrpapp.azurewebsites.net/api/EditVehicle?code=ZV9yqdfBw8a6vaqO8QvKpDrTCvxbytfflCak52wJdKzM5XTu8hEGJQ==', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        vehicle_name: edit_name,
                        capacity: edit_cap
                    })
                }).then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processEditVehicle(obj));
            }
        }else if (edit_name == "" && edit_cap == "") {
            alert("Enter new vehicle name and capacity");
        }else if (edit_name == "") {
            alert("Enter new vehicle name");
        }else if ( edit_cap == "") {
            alert("Enter new vehicle capacity");
        }
    }else{
        alert("Please select vehicle to edit");
    }
}

function deleteEditVehicle(){
    let selected = document.getElementById("veh_list");
    let vehicle_string = selected.options[selected.selectedIndex].text.split(" ");
    let vehicle_name = vehicle_string[0];
    let capacity = vehicle_string[1].replace(/[{()}]/g, '');

    fetch('https://vrpapp.azurewebsites.net/api/DeleteVehicle?code=5ePZH6f1sMgxDlDRUOSDtkgA/SxWrw0BWpt6uDGkjd442otBPze3DQ==', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            vehicle_name: vehicle_name,
            capacity: capacity
        })
    })
}