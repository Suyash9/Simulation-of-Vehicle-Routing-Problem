import com.google.ortools.constraintsolver.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

public class VRPwithInitialRoutes extends VRP {

    private Integer vehicles;
    private final Integer depot_location = 0;
    private int[][] distanceMatrix;
    private RoutingIndexManager manager;
    private RoutingModel routing;
    private long[][] initialRoutes;

    public VRPwithInitialRoutes(ArrayList<Coordinate> locations, Integer vehicles, long[][] initialRoutes){
        this.vehicles = vehicles;
        this.distanceMatrix = getDistanceMatrix(locations);
        this.initialRoutes = initialRoutes;
        this.manager = new RoutingIndexManager(distanceMatrix.length, vehicles, depot_location);
        this.routing = new RoutingModel(manager);
        algorithm();
    }

    public void algorithm(){
        // Algorithm implemented using Google OR Tools and with help from this link: https://developers.google.com/optimization/routing/routing_tasks

        long startTime = System.currentTimeMillis();

        final int transitCallbackIndex =
                routing.registerTransitCallback((long fromIndex, long toIndex) -> {
                    int fromNode = manager.indexToNode(fromIndex);
                    int toNode = manager.indexToNode(toIndex);
                    return distanceMatrix[fromNode][toNode];
                });

        routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);

        routing.addDimension(transitCallbackIndex, 0, 3000,
                true,
                "Distance");
        RoutingDimension distanceDimension = routing.getMutableDimension("Distance");
        distanceDimension.setGlobalSpanCostCoefficient(100);

        RoutingSearchParameters searchParameters = main.defaultRoutingSearchParameters().toBuilder().build();

        Assignment solution = routing.solveWithParameters(searchParameters);

        System.out.println("Vehicle Routing Problem with Initial Routes\n");
        System.out.println("Initial solution:\n");
        initialSolutionAlgorithm();

        // Run Time
        long endTime = System.currentTimeMillis();
        long time = endTime - startTime;
        System.out.println("Solution after search:\n");
        printSolution(solution);
        System.out.println();
        System.out.println("Execution time: " + time +"ms");
    }

    @Override
    public void printSolution(Assignment solution) {
        // Print solution route

        long maxRouteDistance = 0;
        for (int i = 0; i < vehicles; i++) {
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

    private void initialSolutionAlgorithm(){
        // Print initial solution

        ArrayList<Long> initial_solution = new ArrayList<>();
        for (int i=0; i< initialRoutes.length; i++){
            System.out.println("Route for vehicle " + i + ":");
            long[] route = initialRoutes[i];
            int sum = 0;
            String strList[] = Arrays.stream(initialRoutes[i]).mapToObj(String::valueOf).toArray(String[]::new);
            System.out.println(String.join(" -> ", strList));
            for (int j=0; j< route.length-1; j++){
                sum += distanceMatrix[(int) route[j]][(int) route[j+1]];
            }
            System.out.println("Distance of the route: " + sum + "m\n");
            initial_solution.add((long) sum);
        }
        System.out.println("Maximum of the route distances: " + Collections.max(initial_solution) + "\n");
    }
}
