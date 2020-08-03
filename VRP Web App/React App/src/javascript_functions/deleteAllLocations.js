import { getLocations } from "./getLocations";

function processDeleteAllLocations() { 
    alert("All locations have been deleted");
    getLocations();
    document.getElementById('add_loc').disabled = false;
    document.getElementById("edit_loc_btn").disabled = false;
    document.getElementById("del_loc").disabled = false;
    document.getElementById("del_all_loc").disabled = false;
}

export function deleteAllLocations(e) {
    e.preventDefault();
    var deleteAll = window.confirm("Are you sure you want to delete all locations?");
    if (deleteAll){
        document.getElementById('add_loc').disabled = true;
        document.getElementById("edit_loc_btn").disabled = true;
        document.getElementById("del_loc").disabled = true;
        document.getElementById("del_all_loc").disabled = true;
        fetch('https://vrpapp.azurewebsites.net/api/DeleteAllLocations?code=z1YDoavqMzs8PXzm5zFu6nTJp3Ra0HnzmKhyKWaZlSnirJ/iesiAZg==', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            }
        }).then(processDeleteAllLocations());
    }
}