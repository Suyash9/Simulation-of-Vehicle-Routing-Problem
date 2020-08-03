import { getVehicles } from "./getVehicles";
import { getAllCapacities } from "./getAllCapacities";

function processNewVehicle(response) {
    if (response.status === 200) {
        getVehicles();
        getAllCapacities();
        alert(response.body);
        getVehicles();
        getAllCapacities();
        document.getElementById('add_vehicle_box').reset();
    } else {
        alert(response.body);
    }
}

export function addVehicle(e) {
    e.preventDefault();

    let vehicle_name = document.getElementById('new_veh_name').value;
    let capacity = document.getElementById('new_veh_cap').value;

    if (vehicle_name == "" && capacity == ""){
        alert("Enter vehicle name and capacity");
    }else if (vehicle_name == ""){
        alert("Enter vehicle name");
    }else if (capacity == ""){
        alert("Enter vehicle capacity")
    }else{
        fetch('https://vrpapp.azurewebsites.net/api/AddVehicle?code=paLR8e4zEKnIQ4icnPH3inhCeeUIlh8yGWhagv3D92zE95a2qKsGIA==', {
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
        .then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processNewVehicle(obj));
    }
}