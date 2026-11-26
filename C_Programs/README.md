# C Programs for Smart Logistics and Delivery Management System

These four standalone C programs solve the same shortest-path problem used by the website. They use an adjacency matrix for an undirected graph. Enter `0` for no direct road and a positive integer for a road distance. Locations are numbered from 1 to n.

1. `01_Brute_Force.c` - recursive path exploration and backtracking.
2. `02_Divide_and_Conquer.c` - recursive min-plus matrix exponentiation.
3. `03_Dynamic_Programming_Bellman_Ford.c` - repeated edge relaxation.
4. `04_Greedy_Dijkstra.c` - repeatedly selects the unvisited location with the smallest tentative distance.

All programs accept 2 to 8 locations. The project website is separate and remains unchanged; its four JavaScript implementations are still in `website/script.js`.

Compile, for example: `gcc 01_Brute_Force.c -o brute_force`
Run on Windows: `brute_force.exe`
