import { getVehicles } from "./getVehicles";
import { getAllCapacities } from "./getAllCapacities";

function processDeleteAllVehicles() { 
    alert("All vehicles have been deleted");
    getVehicles();
    getAllCapacities();
    document.getElementById('del_veh').disabled = false;
    document.getElementById("edit_veh").disabled = false;
    document.getElementById("add_vehicle").disabled = false;
    document.getElementById("del_all_veh").disabled = false;
}

export function deleteAllVehicles(e) {
    e.preventDefault();
    var deleteAll = window.confirm("Are you sure you want to delete all vehicles?");
    if (deleteAll){
        document.getElementById('del_veh').disabled = true;
        document.getElementById("edit_veh").disabled = true;
        document.getElementById("add_vehicle").disabled = true;
        document.getElementById("del_all_veh").disabled = true;
        fetch('https://vrpapp.azurewebsites.net/api/DeleteAllVehicles?code=W4gfI1XXDTXvzwWqQlqy7wCB3aPuXSF0RHW5bDTHEoTLgpcdQlzwdw==', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            }
        }).then(processDeleteAllVehicles());
    }
}