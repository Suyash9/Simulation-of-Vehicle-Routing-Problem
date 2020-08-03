from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import VRP_module
from flask import Flask, request, jsonify
import json
from flask.wrappers import Response
from werkzeug.serving import run_simple
from VRP_module import createEmptyGraph, createGraph, getGraphCoords, parseTimeWindows
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
        time_windows = [tuple(l) for l in data_dic['time_windows']]
        avg_speed = data_dic['avg_speed']
        vehicle_load_time = data_dic['vehicle_load']
        vehicle_unload_time = data_dic['vehicle_unload']
        depot_capacity = data_dic['depot_capacity']
        depot_location = data_dic['depot_location']
    route = VRPTWResConst_algorithm(locations, vehicles, avg_speed, time_windows, vehicle_load_time, vehicle_unload_time, depot_capacity, depot_location);
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
    solution_str = "Vehicle Routing with Time Windows with Resource Constraints Solution<br><br>"
    time_dimension = routing.GetDimensionOrDie('Time')
    total_time = 0
    for vehicle_id in range(vehicles):
        index = routing.Start(vehicle_id)
        plan_output = 'Route for vehicle {}:<br>'.format(vehicle_id) + "&nbsp;"
        while not routing.IsEnd(index):
            time_var = time_dimension.CumulVar(index)
            plan_output += '{0} Time({1},{2}) -> '.format(
                manager.IndexToNode(index), solution.Min(time_var),
                solution.Max(time_var))
            index = solution.Value(routing.NextVar(index))
        time_var = time_dimension.CumulVar(index)
        plan_output += '{0} Time({1},{2})<br>'.format(manager.IndexToNode(index), solution.Min(time_var), solution.Max(time_var))
        route_graph.append(plan_output.split(":<br>&nbsp;")[1][:-14])
        plan_output += 'Time of the route: {} min<br>'.format(solution.Min(time_var))
        solution_str += plan_output + "<br>"
        total_time += solution.Min(time_var)
    solution_str += 'Total time of all routes: {} min'.format(total_time) + "<br><br>"
    solution_str += "The VRP with Time Windows is a simplified variation of this problem. <br>Select and run the VRP with Time Windows to see the route obtained from it."
    return (solution_str, getGraphCoords(locations, parseTimeWindows(route_graph)))

def VRPTWResConst_algorithm(locations, vehicles, avg_speed, time_windows, vehicle_load_time, vehicle_unload_time, depot_capacity, depot_location):
    # Algorithm implemented using Google OR Tools and with help from this link: https://developers.google.com/optimization/routing/cvrptw_resources
    time_matrix = VRP_module.getTimeMatrix(locations, avg_speed)
    manager = pywrapcp.RoutingIndexManager(len(time_matrix), vehicles, depot_location)
    routing = pywrapcp.RoutingModel(manager)
    
    def time_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return time_matrix[from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(time_callback)

    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    time = 'Time'
    routing.AddDimension(
        transit_callback_index,
        60,
        60,
        False,
        time)
    time_dimension = routing.GetDimensionOrDie(time)
    
    for location_idx, time_window in enumerate(time_windows):
        if location_idx == 0:
            continue
        index = manager.NodeToIndex(location_idx)
        time_dimension.CumulVar(index).SetRange(time_window[0], time_window[1])
    
    for vehicle_id in range(vehicles):
        index = routing.Start(vehicle_id)
        time_dimension.CumulVar(index).SetRange(time_windows[0][0], time_windows[0][1])

    
    solver = routing.solver()
    intervals = []
    for i in range(vehicles):
        intervals.append(
            solver.FixedDurationIntervalVar(
                time_dimension.CumulVar(routing.Start(i)),
                vehicle_load_time, 'depot_interval'))
        intervals.append(
            solver.FixedDurationIntervalVar(
                time_dimension.CumulVar(routing.End(i)),
                vehicle_unload_time, 'depot_interval'))

    depot_usage = [1 for i in range(len(intervals))]
    solver.Add(solver.Cumulative(intervals, depot_usage, depot_capacity,'depot'))

    for i in range(vehicles):
        routing.AddVariableMinimizedByFinalizer(
            time_dimension.CumulVar(routing.Start(i)))
        routing.AddVariableMinimizedByFinalizer(
            time_dimension.CumulVar(routing.End(i)))

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)

    solution = routing.SolveWithParameters(search_parameters)

    if solution:
        return generate_solution(locations, solution, vehicles, routing, manager)
    else:
        return "No solution found" + "<br><br>The VRP with Time Windows is a simplified variation of this problem. <br>Select and try running the VRP with Time Windows to see if a solution can be obtained from it."

if __name__ == '__main__':
    run_simple('127.0.0.1', 31100, app, use_reloader=True)