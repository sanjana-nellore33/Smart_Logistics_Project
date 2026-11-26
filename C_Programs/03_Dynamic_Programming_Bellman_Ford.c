#include <stdio.h>
#define MAX 8
#define MAX_EDGES (MAX * MAX)
#define INF 1000000000

typedef struct { int from, to, weight; } Edge;
int main(void) {
    int n, source, destination, dist[MAX], parent[MAX], edgeCount = 0;
    Edge edges[MAX_EDGES];
    printf("DYNAMIC PROGRAMMING - BELLMAN-FORD SHORTEST ROUTE\n");
    printf("Enter number of locations (2-%d): ", MAX);
    if (scanf("%d", &n) != 1 || n < 2 || n > MAX) return printf("Invalid number of locations.\n"), 1;
    int graph[MAX][MAX];
    printf("Enter the %d x %d distance matrix (0 means no direct road):\n", n, n);
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) scanf("%d", &graph[i][j]);
    printf("Enter source (1-%d) and destination (1-%d): ", n, n);
    if (scanf("%d%d", &source, &destination) != 2 || source < 1 || source > n || destination < 1 || destination > n || source == destination)
        return printf("Invalid source or destination.\n"), 1;
    source--; destination--;

    for (int u = 0; u < n; u++) for (int v = 0; v < n; v++)
        if (graph[u][v] > 0) edges[edgeCount++] = (Edge){u, v, graph[u][v]};
    for (int i = 0; i < n; i++) { dist[i] = INF; parent[i] = -1; }
    dist[source] = 0;

    for (int pass = 0; pass < n - 1; pass++) {
        int changed = 0;
        for (int e = 0; e < edgeCount; e++) {
            int u = edges[e].from, v = edges[e].to, w = edges[e].weight;
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w; parent[v] = u; changed = 1;
            }
        }
        if (!changed) break;
    }
    if (dist[destination] == INF) { printf("No route exists.\n"); return 0; }
    int reversePath[MAX], length = 0, current = destination;
    while (current != -1 && length < MAX) { reversePath[length++] = current; current = parent[current]; }
    printf("Shortest route: ");
    for (int i = length - 1; i >= 0; i--) printf("L%d%s", reversePath[i] + 1, i == 0 ? "\n" : " -> ");
    printf("Minimum distance: %d\n", dist[destination]);
    printf("Time complexity: O(VE)\nSpace complexity: O(V)\n");
    return 0;
}
