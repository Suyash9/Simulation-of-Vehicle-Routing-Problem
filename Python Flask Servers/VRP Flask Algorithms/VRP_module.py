from matplotlib import pyplot as plt

def manhattanDist(location1, location2):
    return (abs(location1[0]-location2[0]) + abs(location1[1]-location2[1]))

# Function for computing the distance matrix for a set of input coordinates
def getDistanceMatrix(locations):
    num_locations = len(locations)
    matrix = [[0 for x in range(num_locations)] for y in range(num_locations)]
    for i in range(num_locations):
        for j in range(num_locations):
            matrix[i][j] = manhattanDist(locations[i], locations[j])
    return matrix

# Function for computing the time matrix for a set of input coordinates. Used in case of TW problems.
def getTimeMatrix(locations, avg_speed):
    num_locations = len(locations)
    matrix = [[0 for x in range(num_locations)] for y in range(num_locations)]
    for i in range(num_locations):
        for j in range(num_locations):
            matrix[i][j] = manhattanDist(locations[i], locations[j])/avg_speed
    return matrix

# Function for computing the distance matrix for a set of input coordinates in case of the Open VRP.
def getDistanceMatrixOVRP(locations):
    num_locations = len(locations)
    matrix = [[0 for x in range(num_locations+1)] for y in range(num_locations+1)]
    for i in range(num_locations):
        for j in range(num_locations):
            matrix[i+1][j+1] = manhattanDist(locations[i], locations[j])
    return matrix

# Obtain the graph coordinates to be plotted and their indexes for a set of locations and the solution route string
def getGraphCoords(locations, loc_index):
    plot_pts = []
    split_list = [index.replace(" ", "").split("->") for index in loc_index]
    index_labels = [list(map(int,k)) for k in split_list]
    for ind_list in split_list:
        vehicleX = []
        vehicleY = []
        for index in ind_list:
            vehicleX.append(locations[int(index)][0])
            vehicleY.append(locations[int(index)][1])
        plot_pts.append([vehicleX, vehicleY])
    return plot_pts, index_labels

# Convert the solution route string of the Capacitated VRP and its variants into a version that can be used by the getGraphCoords function
def parseCapacitated(loc_index):
    split = [index.replace(" ", "").split("Load") for index in loc_index]
    l = []
    for index in split:
        s = ""
        for elem in index:
            if (")" in elem):
                s+= elem.split(")")[1]
            else:
                s+= elem
        l.append(s)
    return(l)

# Convert the solution route string of the VRP with Time Windows and its variants into a version that can be used by the getGraphCoords function
def parseTimeWindows(loc_index):
    split = [index.replace(" ", "").split("Time") for index in loc_index]
    l = []
    for index in split:
        s = ""
        for elem in index:
            if (")" in elem):
                s+= elem.split(")")[1].replace("T","").replace("Ti","")
            else:
                s+= elem
        l.append(s)
    return(l)

# Create a graph with the coordinates of the routes and their indices
def createGraph(graph_coords, labels):
    fig, ax = plt.subplots()
    for i in range(len(labels)):
        x, y = graph_coords[i][0],graph_coords[i][1]
        l = labels[i]
        ax.scatter(x,y)
        ax.plot(x,y,'-o')
        for j, txt in enumerate(l):
            ax.annotate(txt, (x[j], y[j]))
    fig.suptitle("Vehicle Route(s)", fontsize=16, fontweight="bold")
    fig.savefig('GraphUploadScripts/graphs/graph.png')

def createEmptyGraph():
    fig, ax = plt.subplots()
    fig.suptitle("No Solution", fontsize=16, fontweight="bold")
    fig.savefig('graphs/graph.png')