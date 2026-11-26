#include <stdio.h>
#define MAX 8
#define INF 1000000000

int n, graph[MAX][MAX], visited[MAX];
int bestDistance = INF, bestPath[MAX], bestLength = 0;
int currentPath[MAX];

void search(int current, int destination, int distance, int length) {
    if (current == destination) {
        if (distance < bestDistance) {
            bestDistance = distance;
            bestLength = length;
            for (int i = 0; i < length; i++) bestPath[i] = currentPath[i];
        }
        return;
    }

    for (int next = 0; next < n; next++) {
        if (!visited[next] && graph[current][next] > 0) {
            visited[next] = 1;
            currentPath[length] = next;
            search(next, destination, distance + graph[current][next], length + 1);
            visited[next] = 0; // Backtrack so another path can use this location.
        }
    }
}

int main(void) {
    int source, destination;
    printf("BRUTE FORCE - SHORTEST DELIVERY ROUTE\n");
    printf("Enter number of locations (2-%d): ", MAX);
    if (scanf("%d", &n) != 1 || n < 2 || n > MAX) return printf("Invalid number of locations.\n"), 1;
    printf("Enter the %d x %d distance matrix (0 means no direct road):\n", n, n);
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) scanf("%d", &graph[i][j]);
    printf("Enter source (1-%d) and destination (1-%d): ", n, n);
    if (scanf("%d%d", &source, &destination) != 2 || source < 1 || source > n || destination < 1 || destination > n || source == destination)
        return printf("Invalid source or destination.\n"), 1;

    source--; destination--;
    visited[source] = 1;
    currentPath[0] = source;
    search(source, destination, 0, 1);

    if (bestDistance == INF) printf("No route exists.\n");
    else {
        printf("Shortest route: ");
        for (int i = 0; i < bestLength; i++) printf("L%d%s", bestPath[i] + 1, i == bestLength - 1 ? "\n" : " -> ");
        printf("Minimum distance: %d\n", bestDistance);
    }
    printf("Time complexity: O(V!) worst case\nSpace complexity: O(V)\n");
    return 0;
}
