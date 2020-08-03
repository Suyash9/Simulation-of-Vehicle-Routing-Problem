from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import VRP_module
from flask import Flask, request, jsonify
import json
from flask.wrappers import Response
from werkzeug.serving import run_simple
from VRP_module import createEmptyGraph, createGraph, getGraphCoords
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
        starts = data_dic['starts']
        ends = data_dic['ends']
        depot_location = data_dic['depot_location']
    route= VRPwithStartEndLocations(locations, vehicles, starts, ends, depot_location)
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

def generate_solution(locations, solution, vehicles, routing, manager):
    # Create route solution string and gather data for the graph
    route_graph = []
    solution_str = "Vehicle Routing with Starts and Ends Solution<br><br>"
    max_route_distance = 0
    for vehicle_id in range(vehicles):
        index = routing.Start(vehicle_id)
        plan_output = 'Route for vehicle {}:\n'.format(vehicle_id) + "<br>" + "&nbsp;"
        route_distance = 0
        while not routing.IsEnd(index):
            plan_output += ' {} -> '.format(manager.IndexToNode(index))
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)
        plan_output += '{}<br>'.format(manager.IndexToNode(index))
        route_graph.append(plan_output.split("\n<br>&nbsp; ")[1][:-4])
        plan_output += 'Distance of the route: {}m<br>'.format(route_distance)
        solution_str += plan_output + '<br>'
        max_route_distance = max(route_distance, max_route_distance)
    solution_str += 'Maximum of the route distances: {}m'.format(max_route_distance)
    return(solution_str, getGraphCoords(locations, route_graph))

def VRPwithStartEndLocations(locations, vehicles, starts, ends, depot_location):
    # Algorithm implemented using Google OR Tools and with help from this link: https://developers.google.com/optimization/routing/routing_tasks
    distance_matrix = VRP_module.getDistanceMatrix(locations)
    manager = pywrapcp.RoutingIndexManager(len(distance_matrix), vehicles, starts, ends)
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return distance_matrix[from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    dimension_name = 'Distance'
    routing.AddDimension(
        transit_callback_index,
        0,
        2000,
        True,
        dimension_name)
    distance_dimension = routing.GetDimensionOrDie(dimension_name)
    distance_dimension.SetGlobalSpanCostCoefficient(100)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
    solution = routing.SolveWithParameters(search_parameters)

    if solution:
        return generate_solution(locations, solution, vehicles, routing, manager)
    else:
        return "No solution found"

if __name__ == '__main__':
    run_simple('127.0.0.1', 11100, app, use_reloader=True)