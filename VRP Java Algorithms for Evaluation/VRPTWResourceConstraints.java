import com.google.ortools.constraintsolver.*;

import java.util.ArrayList;
import java.util.Arrays;

public class VRPTWResourceConstraints extends VRP {

    private Integer vehicles;
    private final Integer depot_location = 0;
    private RoutingIndexManager manager;
    private RoutingModel routing;
    private int[][] timeMatrix;
    private int[][] time_windows;
    private Integer vehicle_loadingTime;
    private Integer vehicle_unloadingTime;
    private Integer depot_capacity;

    public VRPTWResourceConstraints(ArrayList<Coordinate> locations, Integer vehicles, int[][] time_windows, Integer avg_speed,
                                    Integer vehicle_loadingTime, Integer vehicle_unloadingTime, Integer depot_capacity){
        this.vehicles = vehicles;
        this.timeMatrix = getTimeMatrix(locations, avg_speed);
        this.manager = new RoutingIndexManager(timeMatrix.length, vehicles, depot_location);
        this.routing = new RoutingModel(manager);
        this.time_windows = time_windows;
        this.vehicle_loadingTime = vehicle_loadingTime;
        this.vehicle_unloadingTime = vehicle_unloadingTime;
        this.depot_capacity = depot_capacity;
        algorithm();
    }

    private void algorithm() {
        // Algorithm implemented using Google OR Tools and with help from this link: https://developers.google.com/optimization/routing/cvrptw_resources

        long startTime = System.currentTimeMillis();

        final int transitCallbackIndex =
                routing.registerTransitCallback((long fromIndex, long toIndex) -> {
                    int fromNode = manager.indexToNode(fromIndex);
                    int toNode = manager.indexToNode(toIndex);
                    return timeMatrix[fromNode][toNode];
                });

        routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);

        routing.addDimension(transitCallbackIndex,
                30,
                30,
                false,
                "Time");

        RoutingDimension timeDimension = routing.getMutableDimension("Time");

        for (int i = 1; i < time_windows.length; ++i) {
            long index = manager.nodeToIndex(i);
            timeDimension.cumulVar(index).setRange(time_windows[i][0], time_windows[i][1]);
        }

        for (int i = 0; i < vehicles; ++i) {
            long index = routing.start(i);
            timeDimension.cumulVar(index).setRange(time_windows[0][0], time_windows[0][1]);
        }

        Solver solver = routing.solver();
        IntervalVar[] intervals = new IntervalVar[vehicles * 2];
        for (int i = 0; i < vehicles; ++i) {
            intervals[2 * i] = solver.makeFixedDurationIntervalVar(
                    timeDimension.cumulVar(routing.start(i)), vehicle_loadingTime, "depot_interval");
            intervals[2 * i + 1] = solver.makeFixedDurationIntervalVar(
                    timeDimension.cumulVar(routing.end(i)), vehicle_unloadingTime, "depot_interval");
        }

        long[] depotUsage = new long[intervals.length];
        Arrays.fill(depotUsage, 1);
        solver.addConstraint(solver.makeCumulative(intervals, depotUsage, depot_capacity, "depot"));

        for (int i = 0; i < vehicles; ++i) {
            routing.addVariableMinimizedByFinalizer(timeDimension.cumulVar(routing.start(i)));
            routing.addVariableMinimizedByFinalizer(timeDimension.cumulVar(routing.end(i)));
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

    @Override
    public void printSolution(Assignment solution) {
        // Print solution route

        RoutingDimension timeDimension = routing.getMutableDimension("Time");
        long totalTime = 0;
        System.out.println("Vehicle Routing Problem with Time Windows with Resource Constraints\n");
        for (int i = 0; i < vehicles; ++i) {
            long index = routing.start(i);
            System.out.println("Route for Vehicle " + i + ":");
            String route = "";
            while (!routing.isEnd(index)) {
                IntVar timeVar = timeDimension.cumulVar(index);
                route += manager.indexToNode(index) + " Time(" + solution.min(timeVar) + ","
                        + solution.max(timeVar) + ") -> ";
                index = solution.value(routing.nextVar(index));
            }
            IntVar timeVar = timeDimension.cumulVar(index);
            route += manager.indexToNode(index) + " Time(" + solution.min(timeVar) + ","
                    + solution.max(timeVar) + ")";
            System.out.println(route);
            System.out.println("Time of the route: " + solution.min(timeVar) + " min\n");
            totalTime += solution.min(timeVar);
        }
        System.out.println("Total time of all routes: " + totalTime + " min");
    }
}
