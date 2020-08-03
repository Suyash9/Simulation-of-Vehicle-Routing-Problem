import java.util.*;

public class Main {

    public static void main(String args[]){
        ArrayList<Coordinate> locations = new ArrayList<>();
        locations.add(new Coordinate(12,15));
        locations.add(new Coordinate(2,19));
        locations.add(new Coordinate(4,17));
        locations.add(new Coordinate(6,23));
        locations.add(new Coordinate(15,12)); // 5
        /*locations.add(new Coordinate(15,17));
        locations.add(new Coordinate(15,11));
        locations.add(new Coordinate(17,12));
        locations.add(new Coordinate(13,12));
        locations.add(new Coordinate(11,17));  // 10
        locations.add(new Coordinate(19,12));
        locations.add(new Coordinate(14,17));
        locations.add(new Coordinate(19,13));
        locations.add(new Coordinate(11,12));
        locations.add(new Coordinate(16,28)); // 15
        locations.add(new Coordinate(17,13));
        locations.add(new Coordinate(14,25));
        locations.add(new Coordinate(19,43));
        locations.add(new Coordinate(11,56));
        locations.add(new Coordinate(16,28)); // 20
        locations.add(new Coordinate(17,10));
        locations.add(new Coordinate(14,20));
        locations.add(new Coordinate(19,40));
        locations.add(new Coordinate(11,50));
        locations.add(new Coordinate(16,22)); // 25
        locations.add(new Coordinate(7,10));
        locations.add(new Coordinate(4,20));
        locations.add(new Coordinate(9,40));
        locations.add(new Coordinate(1,50));
        locations.add(new Coordinate(6,22)); // 30
        locations.add(new Coordinate(71,10));
        locations.add(new Coordinate(42,20));
        locations.add(new Coordinate(93,40));
        locations.add(new Coordinate(14,50));
        locations.add(new Coordinate(65,22));
        locations.add(new Coordinate(78,10));
        locations.add(new Coordinate(47,20));
        locations.add(new Coordinate(96,40));
        locations.add(new Coordinate(15,50));
        locations.add(new Coordinate(64,22)); // 40
        locations.add(new Coordinate(71,19));
        locations.add(new Coordinate(42,21));
        locations.add(new Coordinate(93,42));
        locations.add(new Coordinate(14,53));
        locations.add(new Coordinate(65,24));
        locations.add(new Coordinate(78,15));
        locations.add(new Coordinate(47,26));
        locations.add(new Coordinate(96,47));
        locations.add(new Coordinate(15,58));
        locations.add(new Coordinate(64,25)); // 50
        locations.add(new Coordinate(37,19));
        locations.add(new Coordinate(34,21));
        locations.add(new Coordinate(23,42));
        locations.add(new Coordinate(34,53));
        locations.add(new Coordinate(65,24));
        locations.add(new Coordinate(19,11));
        locations.add(new Coordinate(7,26));
        locations.add(new Coordinate(6,47));
        locations.add(new Coordinate(15,8));
        locations.add(new Coordinate(64,5)); // 60
        locations.add(new Coordinate(9,11));
        locations.add(new Coordinate(42,1));
        locations.add(new Coordinate(9,42));
        locations.add(new Coordinate(14,3));
        locations.add(new Coordinate(65,2));
        locations.add(new Coordinate(78,5));
        locations.add(new Coordinate(47,6));
        locations.add(new Coordinate(9,47));
        locations.add(new Coordinate(1,58));
        locations.add(new Coordinate(64,5)); // 70
        locations.add(new Coordinate(1,15));
        locations.add(new Coordinate(27,19));
        locations.add(new Coordinate(47,17));
        locations.add(new Coordinate(67,23));
        locations.add(new Coordinate(19,12));
        locations.add(new Coordinate(37,17));
        locations.add(new Coordinate(72,123));
        locations.add(new Coordinate(86,12));
        locations.add(new Coordinate(94,12));
        locations.add(new Coordinate(3,17)); // 80
        locations.add(new Coordinate(15,15));
        locations.add(new Coordinate(29,19));
        locations.add(new Coordinate(7,17));
        locations.add(new Coordinate(67,2));
        locations.add(new Coordinate(9,2));
        locations.add(new Coordinate(37,1));
        locations.add(new Coordinate(72,13));
        locations.add(new Coordinate(88,12));
        locations.add(new Coordinate(92,16));
        locations.add(new Coordinate(3,24)); // 90
        locations.add(new Coordinate(66,15));
        locations.add(new Coordinate(67,19));
        locations.add(new Coordinate(77,17));
        locations.add(new Coordinate(97,2));
        locations.add(new Coordinate(90,2));
        locations.add(new Coordinate(32,1));
        locations.add(new Coordinate(73,13));
        locations.add(new Coordinate(71,12));
        locations.add(new Coordinate(96,16));
        locations.add(new Coordinate(31,24)); // 100
        locations.add(new Coordinate(12,45));
        locations.add(new Coordinate(67,14));
        locations.add(new Coordinate(77,14));
        locations.add(new Coordinate(97,24));
        locations.add(new Coordinate(90,23));
        locations.add(new Coordinate(32,17));
        locations.add(new Coordinate(73,19));
        locations.add(new Coordinate(71,10));
        locations.add(new Coordinate(96,11));
        locations.add(new Coordinate(31,27)); // 110
        locations.add(new Coordinate(2,45));
        locations.add(new Coordinate(6,14));
        locations.add(new Coordinate(7,14));
        locations.add(new Coordinate(9,24));
        locations.add(new Coordinate(9,23));
        locations.add(new Coordinate(2,17));
        locations.add(new Coordinate(7,19));
        locations.add(new Coordinate(1,10));
        locations.add(new Coordinate(6,11));
        locations.add(new Coordinate(13,27)); // 120
        locations.add(new Coordinate(28,45));
        locations.add(new Coordinate(68,14));
        locations.add(new Coordinate(78,14));
        locations.add(new Coordinate(98,24));
        locations.add(new Coordinate(98,23));
        locations.add(new Coordinate(28,17));
        locations.add(new Coordinate(78,19));
        locations.add(new Coordinate(18,10));
        locations.add(new Coordinate(68,11));
        locations.add(new Coordinate(18,27)); // 130
        locations.add(new Coordinate(25,55));
        locations.add(new Coordinate(65,54));
        locations.add(new Coordinate(75,54));
        locations.add(new Coordinate(95,54));
        locations.add(new Coordinate(95,53));
        locations.add(new Coordinate(25,57));
        locations.add(new Coordinate(75,59));
        locations.add(new Coordinate(15,50));
        locations.add(new Coordinate(65,51));
        locations.add(new Coordinate(15,57)); // 140
        locations.add(new Coordinate(26,55));
        locations.add(new Coordinate(66,54));
        locations.add(new Coordinate(76,54));
        locations.add(new Coordinate(96,54));
        locations.add(new Coordinate(96,53));
        locations.add(new Coordinate(26,57));
        locations.add(new Coordinate(76,59));
        locations.add(new Coordinate(16,50));
        locations.add(new Coordinate(66,51));
        locations.add(new Coordinate(16,57)); // 150 */

        Integer vehicles = 3;

        // Basic Vehicle Routing Problem
        BasicVRP basicVrp = new BasicVRP(locations, vehicles);
        System.out.println("----------------------------------------------------------------------------------------------------------------------------------");
        System.out.println();

        // Capacitated VRP
        Integer[] demands = {2, 2, 4, 2, 2};
        Integer[] vehicleCapacities = {10, 15, 20};
        CapacitatedVRP cvrp = new CapacitatedVRP(locations, vehicles, demands, vehicleCapacities);
        System.out.println("----------------------------------------------------------------------------------------------------------------------------------");
        System.out.println();

        // Pickups and Deliveries VRP
        int[][] pickups_deliveries = {
                {1, 2},
                /*{13, 2},
                {11,16},*/
        };
        PickupsDeliveriesVRP pdvrp = new PickupsDeliveriesVRP(locations, vehicles, pickups_deliveries);
        System.out.println("----------------------------------------------------------------------------------------------------------------------------------");
        System.out.println();

        // Vehicle Routing Problem with Time Windows
        int[][] time_windows = {
                {0,30},
                {1,30},
                {5,60},
                {4,40},
                {2,80}, // 5
                /*{6,100},
                {7,25},
                {8,60},
                {7,100},
                {5,10}, // 10
                {7,15},
                {10,50},
                {20,50},
                {21,60},
                {22,60}, // 15
                {20,50},
                {10, 50},*/
        };
        Integer avg_speed = 2;
        VRPTimeWindows vrptw = new VRPTimeWindows(locations, vehicles, time_windows, avg_speed);
        System.out.println("----------------------------------------------------------------------------------------------------------------------------------");
        System.out.println();

        // Vehicle Routing Problem with Time Windows with resource constraints
        Integer vehicleLoadTime = 5;
        Integer vehicleUnloadTime = 5;
        Integer depotCapacity = 2;
        VRPTWResourceConstraints vrptwrc = new VRPTWResourceConstraints(locations, vehicles, time_windows, avg_speed,
                vehicleLoadTime, vehicleUnloadTime, depotCapacity);
        System.out.println("----------------------------------------------------------------------------------------------------------------------------------");
        System.out.println();

        // Capacitated Vehicle Routing Problem with Penalties
        Integer[] demandsPenalties = {0, 1, 8, 0, 1};
        CVRPwithPenalties cvrpp = new CVRPwithPenalties(locations, vehicles, demandsPenalties, vehicleCapacities);
        System.out.println("----------------------------------------------------------------------------------------------------------------------------------");
        System.out.println();

        // Open Vehicle Routing Problem
        OpenVRP openvrp = new OpenVRP(locations, vehicles);
        System.out.println("----------------------------------------------------------------------------------------------------------------------------------");
        System.out.println();

        // Vehicle Routing Problem with Initial Routes
        final long[][] initialRoutes = {
                {0, 2, 1},
                {0, 1, 0}
        };
        VRPwithInitialRoutes vrpir = new VRPwithInitialRoutes(locations, vehicles, initialRoutes);
        System.out.println("----------------------------------------------------------------------------------------------------------------------------------");
        System.out.println();

        // Vehicle Routing Problem with Starts and Ends
        final int[] starts = {1, 2, 1};
        final int[] ends = {0, 0, 0};
        VRPwithStartsEnds vrpwse = new VRPwithStartsEnds(locations, vehicles, starts, ends);
    }

    // Method to print matrix
    private static void printMatrix(int[][] mat){
        for (int[] row : mat)
            System.out.println(Arrays.toString(row));
    }
}
