import $ from 'jquery';
import { getVehicles } from './getVehicles';
import { getLocations } from './getLocations';
import { getAllCapacities } from './getAllCapacities';
import { getCurrentAlgo } from './getParameters';

var parameters = [];
var locations = [];
var capacities = [];
var num_vehicles;

export function runAlgorithm(){
    document.getElementById('graph').style.backgroundColor = "#EEC4CB";
    getVehicles();
    getLocations();
    getAllCapacities();

    let selected = document.getElementById("algo_list");
    let algorithm = selected.options[selected.selectedIndex].text;
    
    if (locations.length<2){
        alert("Please enter at least 2 locations to compute a route")
    }else if (num_vehicles==0){
        alert("Please enter at least 1 vehicle to compute a route")
    }else if (checkSimilarAlgo(getCurrentAlgo(), algorithm)){
        runPythonAlgorithm(algorithm);
    }else if (getCurrentAlgo() != algorithm){
        setParameters([]);
        runPythonAlgorithm(algorithm);
    }else{
        runPythonAlgorithm(algorithm);
    }
}

export function checkSimilarAlgo(currentAlgo, algo){
    if (currentAlgo == "Capacitated VRP" && algo == "CVRP with Penalties")
        return true;
    else if (currentAlgo == "CVRP with Penalties" && algo == "Capacitated VRP")
        return true;
    else if (currentAlgo == "Open VRP" && algo == "Basic VRP")
        return true;
    else if (currentAlgo == "Basic VRP" && algo == "Open VRP")
        return true;
    return false;
}

function runPythonAlgorithm(algorithm){
    if (algorithm=="Select Algorithm"){
        alert("Please select an algorithm to run")
    }else if (algorithm=="Basic VRP"){
        var depot_location = 0;
        if (parameters.length>0)
            depot_location = Number(parameters[0].para0.split(','));

        if (depot_location >= locations.length){
            alert("Please enter a depot location less than " + locations.length.toString());
        }else{
            var server = "http://127.0.0.1:11000/vrp";
            var send_para = {'locations':locations, 'vehicles':num_vehicles, 'depot_location': depot_location};
            sendPython(server, send_para);
        }
    }else if (algorithm=="Capacitated VRP"){
        if (checkParameters()){
            var depot_location = 0;
            if (parameters[1].para1 != undefined)
                depot_location = Number(parameters[1].para1.split(','));

            if (depot_location >= locations.length){
                alert("Please enter a depot location less than " + locations.length.toString());
            }else{
                var demands = parameters[0].para0.split(',').map(Number);
                if (demands.length != locations.length){
                    alert("Please enter 1 demand for each location");
                }else{
                    var server = "http://127.0.0.1:21000/vrp";
                    var send_para = {'locations':locations, 'vehicles':num_vehicles, 'vehicle_capacities':capacities, 'demands': demands, 'depot_location': depot_location};
                    sendPython(server, send_para);
                }
            }
        }
    }else if(algorithm=="CVRP with Penalties"){
        if (checkParameters()){
            var depot_location = 0;
            if (parameters[1].para1 != undefined)
                depot_location = Number(parameters[1].para1.split(','));
            
            if (depot_location >= locations.length){
                alert("Please enter a depot location less than " + locations.length.toString());
            }else{
                var demands = parameters[0].para0.split(',').map(Number);
                if (demands.length != locations.length){
                    alert("Please enter 1 demand for each location")
                }else{
                    var server = "http://127.0.0.1:31000/vrp";
                    var send_para = {'locations':locations, 'vehicles':num_vehicles, 'vehicle_capacities':capacities, 'demands': demands, 'depot_location': depot_location};
                    sendPython(server, send_para);
                }
            }
        }
    }else if(algorithm=="Open VRP"){
        var depot_location = 0;
        if (parameters.length>0)
            depot_location = Number(parameters[0].para0.split(','));

        if (depot_location >= locations.length){
            alert("Please enter a depot location less than " + locations.length.toString());
        }else{
            var server = "http://127.0.0.1:41000/vrp";
            var send_para = {'locations':locations, 'vehicles':num_vehicles, 'depot_location': depot_location};
            sendPython(server, send_para);
        }
    }else if(algorithm=="Pickups and Deliveries VRP"){
        if (checkParameters()){
            var depot_location = 0;
            if (parameters[1].para1 != undefined)
                depot_location = Number(parameters[1].para1.split(','));

            if (depot_location >= locations.length){
                alert("Please enter a depot location less than " + locations.length.toString());
            }else{
                var pickups_deliveries = parseParaLocations(parameters[0].para0.split(';'));
                if (pickups_deliveries == "Incorrect"){
                    alert("Please enter the input as specified on the help page");
                }else if (pickups_deliveries.length==0){
                    alert("Please enter pickup and deliveries locations less than " + locations.length);
                }else if(!checkInputLength(pickups_deliveries)){
                    alert("Please enter pairs of locations")
                }else{
                    var server = "http://127.0.0.1:51000/vrp";
                    var send_para = {'locations':locations, 'vehicles':num_vehicles, 'pickups_deliveries':pickups_deliveries, 'depot_location': depot_location};
                    sendPython(server, send_para);
                }
            }
        }
    }else if(algorithm=="VRP with Initial Routes"){
        if (checkParameters()){
            var depot_location = 0;
            if (parameters[1].para1 != undefined)
                depot_location = Number(parameters[1].para1.split(','));

            if (depot_location >= locations.length){
                alert("Please enter a depot location less than " + locations.length.toString());
            }else{
                var initial_routes = parseParaLocations(parameters[0].para0.split(';'));
                if (initial_routes == "Incorrect"){
                    alert("Please enter the input as specified on the help page");
                }else if (initial_routes.length==0){
                    alert("Please enter initial routes with locations less than " + locations.length.toString());
                }else if (initial_routes.length > num_vehicles){
                    alert("Please enter a maximum of " + num_vehicles + " initial routes");
                }else{
                    var server = "http://127.0.0.1:61000/vrp";
                    var send_para = {'locations':locations, 'vehicles':num_vehicles, 'initial_routes':initial_routes, 'depot_location': depot_location};
                    sendPython(server, send_para);
                }
            }
        };
    }else if(algorithm=="VRP with Starts and Ends"){
        if (checkParameters()){
            var depot_location = 0;
            if (parameters[2].para2 != undefined)
                depot_location = Number(parameters[2].para2.split(','));

            if (depot_location >= locations.length){
                alert("Please enter a depot location less than " + locations.length.toString());
            }else{
                var starts = parameters[0].para0.split(',').map(Number);
                var ends = parameters[1].para1.split(',').map(Number);
                if(starts.length != num_vehicles && ends.length != num_vehicles){
                    alert("Please enter 1 start and end location for each vehicle");
                }else if (starts.length != num_vehicles){
                    alert("Please enter 1 start location for each vehicle");
                }else if (ends.length != num_vehicles){
                    alert("Please enter 1 end location for each vehicle");
                }else if (!checkLocations(starts)){
                    alert("Please enter start locations less than " + locations.length);
                }else if(!checkLocations(ends)){
                    alert("Please enter end locations less than " + locations.length);
                }else{
                    var server = "http://127.0.0.1:11100/vrp";
                    var send_para = {'locations':locations, 'vehicles':num_vehicles, 'starts':starts, 'ends':ends, 'depot_location': depot_location};
                    sendPython(server, send_para);
                }
            }
        }
    }else if(algorithm=="VRP with Time Windows"){
        if (checkParameters()){
            var depot_location = 0;
            if (parameters[2].para2 != undefined)
                depot_location = Number(parameters[2].para2.split(','));

            if (depot_location >= locations.length){
                alert("Please enter a depot location less than " + locations.length.toString());
            }else{
                var time_windows = parseTimeWindows(parameters[0].para0.split(';'));
                if (time_windows == "Incorrect"){
                    alert("Please enter the input as specified on the help page");
                }else if(time_windows.length != locations.length){
                    alert("Please enter 1 time window for each location")
                }else if (!checkInputLength(time_windows)){
                    alert("Please enter pairs as time windows")
                }else{
                    var avg_speed = Number(parameters[1].para1);
                    var server = "http://127.0.0.1:21100/vrp";
                    var send_para = {'locations':locations, 'vehicles':num_vehicles, 'time_windows':time_windows, 'avg_speed':avg_speed, 'depot_location': depot_location};
                    sendPython(server, send_para);
                }
            }
        }
    }else if(algorithm=="VRPTW with Resource Constraints"){
        if (checkParameters()){
            var depot_location = 0;
            if (parameters[5].para5 != undefined)
                depot_location = Number(parameters[5].para5.split(','));

            if (depot_location >= locations.length){
                alert("Please enter a depot location less than " + locations.length.toString());
            }else{
                var time_windows = parseTimeWindows(parameters[0].para0.split(';'));
                if (time_windows == "Incorrect"){
                    alert("Please enter the input as specified on the help page");
                }else if(time_windows.length != locations.length){
                    alert("Please enter 1 time window for each location")
                }else if (!checkInputLength(time_windows)){
                    alert("Please enter pairs as time windows")
                }else{
                    var avg_speed = Number(parameters[1].para1)
                    var vehicle_load_time = Number(parameters[2].para2)
                    var vehicle_unload_time = Number(parameters[3].para3)
                    var depot_capacity = Number(parameters[4].para4)
                    var server = "http://127.0.0.1:31100/vrp";
                    var send_para = {'locations':locations, 'vehicles':num_vehicles, 'time_windows':time_windows, 'avg_speed':avg_speed,
                                    'vehicle_load':vehicle_load_time, 'vehicle_unload':vehicle_unload_time, 'depot_capacity':depot_capacity, 'depot_location': depot_location};
                    sendPython(server, send_para);
                }
            }
        }
    }else{
        alert("This algorithm is yet to be implemented");
    }
}

export function setParameters(paras){
    parameters = []
    parameters = [...paras];
}

export function getParameterValues(){
    return parameters;
}

export function setLocations(locs){
    locations = []
    for (var i = 0; i < locs.length; i++) {
        var l = []
        l.push(Number(locs[i].PartitionKey));
        l.push(Number(locs[i].RowKey));
        locations.push(l)
    }
    locations = Array.from(new Set(locations.map(JSON.stringify)), JSON.parse);
}

function checkParameters(){
    if (parameters.length==0){
        alert("Please enter all parameters");
        return false;
    }else
        return true;
}

function checkLocations(list){
    const num_locations = locations.length;
    let result = list.every(function (loc) {
        return loc < num_locations;
    });
    return result;
}

function checkInputLength(list){
    var check = true;
    list.forEach(function (l) {
        if (l.length>2)
            check = false;
    });
    return check;
}

function parseParaLocations(locs){
    var parameter_locations = []
    var num_locations = locations.length;
    for (var i =0; i < locs.length; i++){
        if (locs[i].indexOf(",")>-1 && locs[i].indexOf("(")>-1 && locs[i].indexOf(")")>-1){
            var p = []
            var pair = (locs[i].trim()).split(",");
            for (var j=0; j < pair.length; j++){
                var int = (Number(pair[j].replace(/[{()}]/g, '')))
                if (int >= num_locations)
                    return []
                else
                    p.push(int)
            }
            parameter_locations.push(p)
        }else{
            return "Incorrect"
        }
    }
    return parameter_locations;
}

function parseTimeWindows(tws){
    var time_windows = []
    for (var i =0; i < tws.length; i++){
        var tw = []
        if (tws[i].indexOf(",")>-1 && tws[i].indexOf("(")>-1 && tws[i].indexOf(")")>-1){
            var pair = (tws[i].trim()).split(",");
            for (var j=0; j < pair.length; j++){
                var int = (Number(pair[j].replace(/[{()}]/g, '')))
                tw.push(int);
            }
            time_windows.push(tw)
        }else{
            return "Incorrect"
        }
    }
    return time_windows;
}

function sendPython(server, send_para){
    document.getElementById("run_algo").disabled = true;
    document.getElementById("para_btn").disabled = true;
    document.getElementById("reset_para").disabled = true;
    document.getElementById("graph").innerHTML = `<div style="text-align:center;padding-top:22.5%; font-size:large"> Graph is being generated.</div>`;
    document.getElementById("route").innerHTML = `<div style="text-align:center;padding-top:17.5%; font-size:large"> Route is being generated. </div>`;
    $.ajax({
        type: "POST",
        url:server,
        data: JSON.stringify(send_para),
    }).done(function(data) {
        document.getElementById('route').innerHTML = data['route'];
        document.getElementById('graph').style.backgroundColor = "white";
        document.getElementById('graph').innerHTML = `<img src=${data['graph_link']}/>`;
        document.getElementById("run_algo").disabled = false;
        document.getElementById("para_btn").disabled = false;
        document.getElementById("reset_para").disabled = false;
    }).fail(function(){
        document.getElementById('graph').innerHTML = `<div style="text-align:center;padding-top:22.5%; font-size:large">The server is currently offline. <br>Vehicles, Locations and Algorithms can still be added.</div>`
        document.getElementById('route').innerHTML = `<div style="text-align:center;padding-top:17.5%; font-size:large">The server is currently offline. <br>Vehicles, Locations and Algorithms can still be added.</div>`
        document.getElementById("run_algo").disabled = false;
        document.getElementById("para_btn").disabled = false;
        document.getElementById("reset_para").disabled = false;
    });
}

export function setNumVehicles(num){
    num_vehicles = Number((' ' + num).slice(1));
}

export function setCapacities(caps){
    capacities = []
    capacities = [...caps];
    capacities = capacities.map(Number);
}

