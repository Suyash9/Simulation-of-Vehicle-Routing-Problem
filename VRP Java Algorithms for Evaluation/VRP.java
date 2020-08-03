import com.google.ortools.constraintsolver.*;
import java.util.ArrayList;
import java.util.Arrays;

abstract class VRP {
    static {
        System.loadLibrary("jniortools");
    }

    public static Integer manhattanDist(Coordinate location1, Coordinate location2){
        return Math.abs(location1.getX()-location2.getX()) + Math.abs(location1.getY()-location2.getY());
    }

    /*
    private Integer euclideanDist(Coordinate location1, Coordinate location2){
        return (int) Math.sqrt(Math.pow((location1.getX()-location2.getX()),2) + Math.pow((location1.getY()-location2.getY()),2));
    }
    */

    // Method for computing the distance matrix for a set of input coordinates
    public int[][] getDistanceMatrix(ArrayList<Coordinate> locations){
        int[][] mat = new int[locations.size()][locations.size()];
        for (int i=0; i<locations.size(); i++) {
            for (int j = 0; j < locations.size(); j++)
                mat[i][j] = manhattanDist(locations.get(i), locations.get(j));
        }
        return mat;
    }

    // Method for computing the time matrix for a set of input coordinates. Used in case of TW problems.
    public int[][] getTimeMatrix(ArrayList<Coordinate> locations, Integer avg_speed) {
        int[][] mat = new int[locations.size()][locations.size()];
        for (int i=0; i<locations.size(); i++) {
            for (int j = 0; j < locations.size(); j++)
                mat[i][j] = manhattanDist(locations.get(i), locations.get(j))/avg_speed;
        }

        return mat;
    }

    // Method for getting the capacities of a vehicle
    public long[] getVehicleCapacities(Integer[] list){
        ArrayList<Integer> temp_list = new ArrayList<>(Arrays.asList(list));

        long[] capacities = new long[temp_list.size()];
        for (int i = 0; i < temp_list.size(); i++)
            capacities[i] = temp_list.get(i);

        return capacities;
    }

    public abstract void printSolution(Assignment solution);
}
