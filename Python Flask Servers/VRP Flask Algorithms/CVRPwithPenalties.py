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
    route = CVRPwithPens_algorithms(locations, vehicles, vehicle_capacities, demands, depot_location)
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
    solution_str = "Capacitated Vehicle Routing with Penalties Solution<br><br>"

    # Display dropped nodes.
    dropped_nodes = 'Dropped nodes:'
    for node in range(routing.Size()):
        if routing.IsStart(node) or routing.IsEnd(node):
            continue
        if solution.Value(routing.NextVar(node)) == node:
            dropped_nodes += ' {}'.format(manager.IndexToNode(node))
    if (dropped_nodes == 'Dropped nodes:'):
        solution_str += dropped_nodes + " No nodes were dropped" + '<br><br>'
    else:
        solution_str += dropped_nodes + '<br><br>'
    
    route_graph = []

    # Display routes
    total_distance = 0
    total_load = 0
    for vehicle_id in range(vehicles):
        index = routing.Start(vehicle_id)
        plan_output = 'Route for vehicle {}:\n'.format(vehicle_id) + "<br> &nbsp;"
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
        route_graph.append(plan_output.split(":\n<br> &nbsp; ")[1][:-13])
        plan_output += 'Distance of the route: {}m\n'.format(route_distance) + "<br>"
        plan_output += 'Load of the route: {}\n'.format(route_load) + "<br><br>"
        solution_str += plan_output
        total_distance += route_distance
        total_load += route_load
    solution_str += 'Total Distance of all routes: {}m'.format(total_distance) + "<br>"
    solution_str += 'Total Load of all routes: {}'.format(total_load) + "<br><br>"
    solution_str += "The Capacitated VRP has the same parameters. <br>Select and run the Capacitated VRP to see the route obtained from it."
    return(solution_str, getGraphCoords(locations, parseCapacitated(route_graph)))

def CVRPwithPens_algorithms(locations, vehicles, vehicle_capacities, demands, depot_location):
    # Algorithm implemented using Google OR Tools and with help from this link: https://developers.google.com/optimization/routing/penalties
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

    # Allow to drop nodes.
    penalty = 1000
    for node in range(1, len(distance_matrix)):
        routing.AddDisjunction([manager.NodeToIndex(node)], penalty)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)

    solution = routing.SolveWithParameters(search_parameters)

    if solution:
        return generate_solution(locations, solution, routing, manager, vehicles, demands)
    else:
        return "No solution found"+ "<br><br>The Capacitated VRP is a simplified variation of this problem. <br>Select and try running the Capacitated VRP to see if a solution can be obtained from it."

if __name__ == '__main__':
    run_simple('127.0.0.1', 31000, app, use_reloader=True)