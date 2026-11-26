#include <stdio.h>
#define MAX 8
#define INF 1000000000

typedef long long ll;
int n, graph[MAX][MAX], visited[MAX], path[MAX], pathLength = 0;
ll direct[MAX][MAX];

void minPlusMultiply(ll A[MAX][MAX], ll B[MAX][MAX], ll C[MAX][MAX]) {
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) {
        C[i][j] = INF;
        for (int k = 0; k < n; k++)
            if (A[i][k] + B[k][j] < C[i][j]) C[i][j] = A[i][k] + B[k][j];
    }
}

void minPlusPower(ll A[MAX][MAX], int exponent, ll result[MAX][MAX]) {
    if (exponent == 1) {
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) result[i][j] = A[i][j];
        return;
    }
    ll half[MAX][MAX], squared[MAX][MAX];
    minPlusPower(A, exponent / 2, half);
    minPlusMultiply(half, half, squared);
    if (exponent % 2 == 0) {
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) result[i][j] = squared[i][j];
    } else minPlusMultiply(squared, A, result);
}

int main(void) {
    int source, destination, maxEdges = 1;
    ll shortest[MAX][MAX];
    printf("DIVIDE AND CONQUER - SHORTEST DELIVERY ROUTE\n");
    printf("Enter number of locations (2-%d): ", MAX);
    if (scanf("%d", &n) != 1 || n < 2 || n > MAX) return printf("Invalid number of locations.\n"), 1;
    printf("Enter the %d x %d distance matrix (0 means no direct road):\n", n, n);
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) scanf("%d", &graph[i][j]);
    printf("Enter source (1-%d) and destination (1-%d): ", n, n);
    if (scanf("%d%d", &source, &destination) != 2 || source < 1 || source > n || destination < 1 || destination > n || source == destination)
        return printf("Invalid source or destination.\n"), 1;
    source--; destination--;

    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++)
        direct[i][j] = (i == j) ? 0 : (graph[i][j] > 0 ? graph[i][j] : INF);
    while (maxEdges < n - 1) maxEdges *= 2;
    minPlusPower(direct, maxEdges, shortest);

    if (shortest[source][destination] >= INF) { printf("No route exists.\n"); return 0; }
    int current = source;
    path[pathLength++] = current;
    visited[current] = 1;
    while (current != destination) {
        int nextLocation = -1;
        for (int next = 0; next < n; next++) {
            if (!visited[next] && graph[current][next] > 0 && shortest[next][destination] < INF &&
                graph[current][next] + shortest[next][destination] == shortest[current][destination]) {
                nextLocation = next; break;
            }
        }
        if (nextLocation == -1) { printf("Could not reconstruct the route.\n"); return 1; }
        current = nextLocation; visited[current] = 1; path[pathLength++] = current;
    }
    printf("Shortest route: ");
    for (int i = 0; i < pathLength; i++) printf("L%d%s", path[i] + 1, i == pathLength - 1 ? "\n" : " -> ");
    printf("Minimum distance: %lld\n", shortest[source][destination]);
    printf("Time complexity: O(V^3 log V)\nSpace complexity: O(V^2 log V) as declared for the recursive matrix method\n");
    return 0;
}
