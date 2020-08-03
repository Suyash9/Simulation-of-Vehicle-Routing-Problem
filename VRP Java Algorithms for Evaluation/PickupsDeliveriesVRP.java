import com.google.ortools.constraintsolver.*;
import java.util.*;

public class PickupsDeliveriesVRP extends VRP{

    private Integer vehicles;
    private final Integer depot_location = 0;
    private int[][] distanceMatrix;
    private RoutingIndexManager manager;
    private RoutingModel routing;
    int[][]  pickups_deliveries;

    public PickupsDeliveriesVRP(ArrayList<Coordinate> locations, Integer vehicles, int[][] pickups_deliveries){
        this.vehicles = vehicles;
        this.distanceMatrix = getDistanceMatrix(locations);
        this.manager = new RoutingIndexManager(distanceMatrix.length, vehicles, depot_location);
        this.routing = new RoutingModel(manager);
        this.pickups_deliveries = pickups_deliveries;
        algorithm();
    }

    private void algorithm(){
        // Algorithm implemented using Google OR Tools and with help from this link: https://developers.google.com/optimization/routing/pickup_delivery

        long startTime = System.currentTimeMillis();

        final int transitCallbackIndex =
                routing.registerTransitCallback((long fromIndex, long toIndex) -> {
                    int fromNode = manager.indexToNode(fromIndex);
                    int toNode = manager.indexToNode(toIndex);
                    return distanceMatrix[fromNode][toNode];
                });

        routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);

        routing.addDimension(transitCallbackIndex,
                0,
                3000,
                true,
                "Distance");
        RoutingDimension distanceDimension = routing.getMutableDimension("Distance");
        distanceDimension.setGlobalSpanCostCoefficient(100);

        Solver solver = routing.solver();
        for (int[] request : pickups_deliveries) {
            long pickupIndex = manager.nodeToIndex(request[0]);
            long deliveryIndex = manager.nodeToIndex(request[1]);
            routing.addPickupAndDelivery(pickupIndex, deliveryIndex);
            solver.addConstraint(
                    solver.makeEquality(routing.vehicleVar(pickupIndex), routing.vehicleVar(deliveryIndex)));
            solver.addConstraint(solver.makeLessOrEqual(
                    distanceDimension.cumulVar(pickupIndex), distanceDimension.cumulVar(deliveryIndex)));
        }

        RoutingSearchParameters searchParameters =
                main.defaultRoutingSearchParameters()
                        .toBuilder()
                        .setFirstSolutionStrategy(FirstSolutionStrategy.Value.PARALLEL_CHEAPEST_INSERTION)
                        .build();

        Assignment solution = routing.solveWithParameters(searchParameters);

        // Run time
        long endTime = System.currentTimeMillis();
        long time = endTime - startTime;
        printSolution(solution);
        System.out.println();
        System.out.println("Execution time: " + time +"ms");
    }

    public void printSolution(Assignment solution) {
        // Print solution route

        System.out.println("Pickups and Deliveries Vehicle Routing Problem\n");
        long totalDistance = 0;
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
            System.out.println("Distance of the route: " + routeDistance + "m");
            totalDistance += routeDistance;
        }
        System.out.println("Total Distance of all routes: " + totalDistance + "m");
    }
}
