import { getVehicles } from "./getVehicles";
import { getAllCapacities } from "./getAllCapacities";

function processDeleteVehicle(vehicle_name) { 
    alert("Deleted " + vehicle_name);
    getVehicles();
    getAllCapacities();
}

export function deleteVehicle(e) {
    e.preventDefault();

    if(document.getElementById("veh_list").value != ""){
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
        .then(processDeleteVehicle(vehicle_name));
    }else{
        alert("Please select vehicle to delete");
    }
}