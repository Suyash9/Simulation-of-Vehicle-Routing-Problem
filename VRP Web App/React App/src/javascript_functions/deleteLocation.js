import { getLocations } from "./getLocations";

function processDeleteLocation(location) { 
    alert("Deleted " + location);
    getLocations();
}

export function deleteLocation(e) {
    e.preventDefault();

    if(document.getElementById("loc_list").value != ""){
        let selected = document.getElementById("loc_list");
        let location = selected.options[selected.selectedIndex].text.split(',');
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
        })
        .then(processDeleteLocation(location));
    }else{
        alert("Please select location to delete");
    }
}