import com.google.ortools.constraintsolver.*;
import java.util.ArrayList;

public class CVRPwithPenalties extends VRP {

    private Integer vehicles;
    private final Integer depot_location = 0;
    private int[][] distanceMatrix;
    private RoutingIndexManager manager;
    private RoutingModel routing;
    private Integer[] demands;
    private long[] vehicleCapacities;

    public CVRPwithPenalties(ArrayList<Coordinate> locations, Integer vehicles, Integer[] demands, Integer[] vehicleCapacities){
        this.vehicles = vehicles;
        this.distanceMatrix = getDistanceMatrix(locations);
        this.manager = new RoutingIndexManager(distanceMatrix.length, vehicles, depot_location);
        this.routing = new RoutingModel(manager);
        this.demands = demands;
        this.vehicleCapacities = getVehicleCapacities(vehicleCapacities);
        algorithm();
    }

    private void algorithm(){
        // Algorithm implemented using Google OR Tools and with help from this link: https://developers.google.com/optimization/routing/penalties

        long startTime = System.currentTimeMillis();

        final int transitCallbackIndex =
                routing.registerTransitCallback((long fromIndex, long toIndex) -> {
                    int fromNode = manager.indexToNode(fromIndex);
                    int toNode = manager.indexToNode(toIndex);
                    return distanceMatrix[fromNode][toNode];
                });

        routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);

        final int demandCallbackIndex = routing.registerUnaryTransitCallback((long fromIndex) -> {
            int fromNode = manager.indexToNode(fromIndex);
            return demands[fromNode];
        });

        routing.addDimensionWithVehicleCapacity(demandCallbackIndex, 0,
                vehicleCapacities,
                true,
                "Capacity");

        long penalty = 1000;
        for (int i = 1; i < distanceMatrix.length; ++i) {
            routing.addDisjunction(new long[] {manager.nodeToIndex(i)}, penalty);
        }

        RoutingSearchParameters searchParameters =
                main.defaultRoutingSearchParameters()
                        .toBuilder()
                        .setFirstSolutionStrategy(FirstSolutionStrategy.Value.PATH_CHEAPEST_ARC)
                        .build();

        Assignment solution = routing.solveWithParameters(searchParameters);

        // Run Time
        long endTime = System.currentTimeMillis();
        long time = endTime - startTime;
        printSolution(solution);
        System.out.println();
        System.out.println("Execution time: " + time +"ms");
    }

    public void printSolution(Assignment solution) {
        // Print solution route

        System.out.println("Capacitated Vehicle Routing Problem with Penalties\n");
        String droppedNodes = "Dropped nodes:";
        for (int node = 0; node < routing.size(); ++node) {
            if (routing.isStart(node) || routing.isEnd(node)) {
                continue;
            }
            if (solution.value(routing.nextVar(node)) == node) {
                droppedNodes += " " + manager.indexToNode(node);
            }
        }
        System.out.println(droppedNodes + "\n");

        long totalDistance = 0;
        long totalLoad = 0;
        for (int i = 0; i < vehicles; ++i) {
            long index = routing.start(i);
            System.out.println("Route for Vehicle " + i + ":");
            long routeDistance = 0;
            long routeLoad = 0;
            String route = "";
            while (!routing.isEnd(index)) {
                long nodeIndex = manager.indexToNode(index);
                routeLoad += demands[(int) nodeIndex];
                route += nodeIndex + " Load(" + routeLoad + ") -> ";
                long previousIndex = index;
                index = solution.value(routing.nextVar(index));
                routeDistance += routing.getArcCostForVehicle(previousIndex, index, i);
            }
            route += manager.indexToNode(routing.end(i));
            System.out.println(route);
            System.out.println("Distance of the route: " + routeDistance + "m\n");
            totalDistance += routeDistance;
            totalLoad += routeLoad;
        }
        System.out.println("Total Distance of all routes: " + totalDistance + "m\n");
        System.out.println("Total Load of all routes: " + totalLoad);
    }
}
