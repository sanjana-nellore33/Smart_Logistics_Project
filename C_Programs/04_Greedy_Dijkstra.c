#include <stdio.h>
#define MAX 8
#define INF 1000000000

int main(void) {
    int n, source, destination, graph[MAX][MAX];
    int dist[MAX], visited[MAX] = {0}, parent[MAX];
    printf("GREEDY - DIJKSTRA SHORTEST DELIVERY ROUTE\n");
    printf("Enter number of locations (2-%d): ", MAX);
    if (scanf("%d", &n) != 1 || n < 2 || n > MAX) return printf("Invalid number of locations.\n"), 1;
    printf("Enter the %d x %d distance matrix (0 means no direct road):\n", n, n);
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) scanf("%d", &graph[i][j]);
    printf("Enter source (1-%d) and destination (1-%d): ", n, n);
    if (scanf("%d%d", &source, &destination) != 2 || source < 1 || source > n || destination < 1 || destination > n || source == destination)
        return printf("Invalid source or destination.\n"), 1;
    source--; destination--;
    for (int i = 0; i < n; i++) { dist[i] = INF; parent[i] = -1; }
    dist[source] = 0;

    for (int count = 0; count < n; count++) {
        int u = -1;
        for (int i = 0; i < n; i++)
            if (!visited[i] && (u == -1 || dist[i] < dist[u])) u = i;
        if (u == -1 || dist[u] == INF) break;
        visited[u] = 1;
        if (u == destination) break;
        for (int v = 0; v < n; v++) {
            if (!visited[v] && graph[u][v] > 0 && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v]; parent[v] = u;
            }
        }
    }
    if (dist[destination] == INF) { printf("No route exists.\n"); return 0; }
    int reversePath[MAX], length = 0, current = destination;
    while (current != -1 && length < MAX) { reversePath[length++] = current; current = parent[current]; }
    printf("Shortest route: ");
    for (int i = length - 1; i >= 0; i--) printf("L%d%s", reversePath[i] + 1, i == 0 ? "\n" : " -> ");
    printf("Minimum distance: %d\n", dist[destination]);
    printf("Time complexity: O(V^2) using an adjacency matrix\nSpace complexity: O(V)\n");
    return 0;
}
