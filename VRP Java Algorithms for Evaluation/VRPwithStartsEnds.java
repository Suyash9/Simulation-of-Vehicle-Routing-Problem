import com.google.ortools.constraintsolver.*;

import java.util.ArrayList;

public class VRPwithStartsEnds extends VRP {

    private Integer vehicles;
    private final Integer depot_location = 0;
    private int[][] distanceMatrix;
    private RoutingIndexManager manager;
    private RoutingModel routing;
    private int[] starts;
    private int[] ends;

    public VRPwithStartsEnds(ArrayList<Coordinate> locations, Integer vehicles, int[] starts, int[] ends){
        this.vehicles = vehicles;
        this.distanceMatrix = getDistanceMatrix(locations);
        this.starts = starts;
        this.ends = ends;
        this.manager = new RoutingIndexManager(distanceMatrix.length, vehicles, starts, ends);
        this.routing = new RoutingModel(manager);
        algorithm();
    }

    private void algorithm(){
        // Algorithm implemented using Google OR Tools and with help from this link: https://developers.google.com/optimization/routing/routing_tasks

        long startTime = System.currentTimeMillis();

        final int transitCallbackIndex =
                routing.registerTransitCallback((long fromIndex, long toIndex) -> {
                    int fromNode = manager.indexToNode(fromIndex);
                    int toNode = manager.indexToNode(toIndex);
                    return distanceMatrix[fromNode][toNode];
                });

        routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);

        routing.addDimension(transitCallbackIndex, 0, 2000,
                true,
                "Distance");
        RoutingDimension distanceDimension = routing.getMutableDimension("Distance");
        distanceDimension.setGlobalSpanCostCoefficient(100);

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

    @Override
    public void printSolution(Assignment solution) {
        // Print solution route

        long maxRouteDistance = 0;
        System.out.println("Vehicle Routing Problem with Starts and Ends\n");
        for (int i = 0; i < vehicles; ++i) {
            long index = routing.start(i);
            System.out.println("Route for Vehicle " + i + ":");
            long routeDistance = 0;
            String route = "";
            while (!routing.isEnd(index)) {
                route += manager.indexToNode(index) + " -> ";
                long previousIndex = index;
                index = solution.value(routing.nextVar(index));
                routeDistance += routing.getArcCostForVehicle(previousIndex, index, i);
            }
            System.out.println(route + manager.indexToNode(index));
            System.out.println("Distance of the route: " + routeDistance + "m\n");
            maxRouteDistance = Math.max(routeDistance, maxRouteDistance);
        }
        System.out.println("Maximum of the route distances: " + maxRouteDistance + "m");
    }
}
