import { getAlgorithms } from "./getAlgorithms";

function processDeleteAlgorithm(algorithm_name ) { 
    alert("Deleted " + algorithm_name );
    getAlgorithms();
}

export function deleteAlgorithm(e) {
    e.preventDefault();

    let inbuilt_algorithms = ["Basic VRP", "Capacitated VRP", "CVRP with Penalties", "Open VRP", "Pickups and Deliveries VRP", 
    "VRP with Time Windows", "VRPTW with Resource Constraints", "VRP with Initial Routes", "VRP with Starts and Ends"];
    let selected = document.getElementById("algo_list");
    let algorithm = selected.options[selected.selectedIndex];

    if(selected.value != "" && algorithm.text != undefined && !inbuilt_algorithms.includes(algorithm.text) && selected.value != "none"){
        var algorithm_name = algorithm.text;
        fetch('https://vrpapp.azurewebsites.net/api/DeleteAlgorithm?code=7A96ZT2Ns07zXE5yRlLemx1YA/n5L4hYw1EBhHzwhuKum0OpFVMNLA==', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                algorithm_name : algorithm_name 
            })
        })
        .then(processDeleteAlgorithm(algorithm_name));
    }else{
        alert("Please select a valid algorithm to delete. The 9 inbuilt algorithms cannot be deleted.");
    }
}