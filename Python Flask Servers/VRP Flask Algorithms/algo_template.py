from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import VRP_module
from flask import Flask, request, jsonify
import json
from flask.wrappers import Response

app = Flask(__name__)

@app.route('/vrp', methods=['POST'])
def run_vrp():
    rf=request.form
    for key in rf.keys():
        data_dic=json.loads(key)
        locations = [tuple(l) for l in data_dic['locations']]
        vehicles = data_dic['vehicles']
    print(locations)
    print(vehicles)
    resp_dic={'route':0}
    resp = jsonify(resp_dic)
    resp.headers['Access-Control-Allow-Origin']='*'
    return resp