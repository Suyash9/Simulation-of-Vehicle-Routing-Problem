from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import VRP_module
from flask import Flask, request, jsonify
import json
from flask.wrappers import Response
from werkzeug.serving import run_simple
from VRP_module import createEmptyGraph, createGraph, getGraphCoords, parseCapacitated
from GraphUploadScripts.UploadGraph import upload_image

app = Flask(__name__)

@app.route('/vrp', methods=['POST'])
def run_vrp():
    # Send and receive data between the frontend and backend
    rf=request.form
    for key in rf.keys():
        data_dic=json.loads(key)
        locations = [tuple(l) for l in data_dic['locations']]
        vehicles = data_dic['vehicles']
        vehicle_capacities = data_dic['vehicle_capacities']
        demands = data_dic['demands']
        depot_location = data_dic['depot_location']
    route = capacitatedVRP_algorithm(locations, vehicles, vehicle_capacities, demands, depot_location)
    if isinstance(route, str):
        send_route = route
        createEmptyGraph()
        link = upload_image()
    else:
        send_route = route[0]
        graph_coords = route[1][0]
        index_label = route[1][1]
        createGraph(graph_coords, index_label)
        link = upload_image()
    resp_dic={'route':send_route, 'graph_link':link}
    resp = jsonify(resp_dic)
    resp.headers['Access-Control-Allow-Origin']='*'
    return resp

def generate_solution(locations, solution, routing, manager, vehicles, demands):
    # Create route solution string and gather data for the graph
    route_graph = []
    total_distance = 0
    total_load = 0
    solution_str = "Capacitated Vehicle Routing Solution<br><br>"
    for vehicle_id in range(vehicles):
        index = routing.Start(vehicle_id)
        plan_output = 'Route for vehicle {}:\n'.format(vehicle_id) + "<br>" + "&nbsp;"
        route_distance = 0
        route_load = 0
        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            route_load += demands[node_index]
            plan_output += ' {0} Load({1}) -> '.format(node_index, route_load)
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(
                previous_index, index, vehicle_id)
        plan_output += ' {0} Load({1})\n'.format(manager.IndexToNode(index), route_load) + "<br>"
        route_graph.append(plan_output.split(":\n<br>&nbsp; ")[1][:-13])
        plan_output += 'Distance of the route: {}m\n'.format(route_distance) + "<br>"
        plan_output += 'Load of the route: {}\n'.format(route_load) + "<br>"
        solution_str += plan_output + "<br>"
        total_distance += route_distance
        total_load += route_load
    solution_str += 'Total distance of all routes: {}m'.format(total_distance) + "<br>"
    solution_str += 'Total load of all routes: {}'.format(total_load) + "<br><br>"
    solution_str += "The Capacitated VRP with Penalties has the same parameters. <br>Select and run the CVRP with Penalties to see the route obtained from it."
    return(solution_str, getGraphCoords(locations, parseCapacitated(route_graph)))

def capacitatedVRP_algorithm(locations, vehicles, vehicle_capacities, demands, depot_location):
    # Algorithm implemented using Google OR Tools and with help from this link: https://developers.google.com/optimization/routing/cvrp
    distance_matrix = VRP_module.getDistanceMatrix(locations)
    manager = pywrapcp.RoutingIndexManager(len(distance_matrix), vehicles, depot_location)
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return distance_matrix[from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    def demand_callback(from_index):
        from_node = manager.IndexToNode(from_index)
        return demands[from_node]

    demand_callback_index = routing.RegisterUnaryTransitCallback(
        demand_callback)
    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0,
        vehicle_capacities,
        True,
        'Capacity')

    
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)

    solution = routing.SolveWithParameters(search_parameters)

    if solution:
        return generate_solution(locations, solution, routing, manager, vehicles, demands)
    else:
        return "No solution found"

if __name__ == '__main__':
    run_simple('127.0.0.1', 21000, app, use_reloader=True)