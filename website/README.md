# Smart Logistics and Delivery Management System

## Project Overview

The Smart Logistics and Delivery Management System is a web-based project that finds the shortest delivery route between two locations.

It uses four different algorithmic approaches to solve the same shortest-path problem. Users can enter locations, road distances, a source location, and a destination location. The system calculates and displays the shortest route and total distance.

## Real-World Problem

Delivery companies need to find shorter routes between locations to reduce travel distance, delivery time, and transportation costs.

This project demonstrates how different algorithms can solve a shortest-path problem using the same input data.

## Algorithms Used

1. **Brute Force:** Checks all possible simple paths and selects the path with the minimum distance.
2. **Divide and Conquer:** Uses recursive min-plus matrix multiplication to calculate shortest-path distances.
3. **Dynamic Programming:** Uses the Bellman-Ford algorithm to calculate the shortest path.
4. **Greedy:** Uses Dijkstra's algorithm to select the nearest unvisited location repeatedly.

## Features

- Enter between 2 and 8 locations.
- Generate location input fields and a distance matrix.
- Select source and destination locations.
- Validate user inputs.
- Compare four algorithmic approaches.
- Display the shortest route and total distance.
- Display step-by-step algorithm explanations.
- Display time and space complexities.

## Technologies Used

- HTML
- CSS
- JavaScript

## Project Folder Structure

```text
Smart_Logistics_Project/
│
├── C_Programs/
│   ├── 01_Brute_Force_TSP.c
│   ├── 02_Divide_Conquer_Closest_Pair.c
│   ├── 03_Dynamic_Programming_Knapsack.c
│   └── 04_Greedy_Dijkstra.c
│
└── website/
    ├── index.html
    ├── style.css
    ├── script.js
    └── README.md
```

## How to Run the Website

1. Download or clone this project repository.
2. Open the `website` folder.
3. Open `index.html` in a web browser.
4. Enter the number of locations.
5. Generate the input fields.
6. Enter location names and road distances.
7. Select the source and destination.
8. Click **Solve Route**.
9. Select any of the four algorithms to view its result and explanation.

## Input Rules

- The number of locations must be between 2 and 8.
- Location names must be unique and non-empty.
- Source and destination must be different.
- Road distances must be non-negative whole numbers.
- Road distances must be equal in both directions because the graph is undirected.
- A distance of 0 indicates that there is no direct road between two different locations.

## Algorithm Complexity

| Algorithm | Time Complexity | Space Complexity |
|---|---|---|
| Brute Force | O(V!) | O(V) |
| Divide and Conquer | O(V³ log V) | O(V² log V) |
| Dynamic Programming (Bellman-Ford) | O(VE) | O(V) |
| Greedy (Dijkstra) | O(V²) | O(V) |

Here, V represents the number of locations and E represents the number of roads.

## Expected Outcome

All four algorithms solve the same shortest-path problem using the same input graph. They should return the same minimum distance, although the displayed route may differ when multiple routes have equal distances.

## Conclusion

This project demonstrates how Brute Force, Divide and Conquer, Dynamic Programming, and Greedy techniques can solve the same real-world shortest-path problem. It also allows users to compare their working methods and computational complexities.
