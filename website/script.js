
const INF = Infinity;

let selectedAlgorithm = "brute";
let currentGraph = null;
let generatedCount = 0;

const algorithmInfo = {
    brute: {
        name: "Brute Force",
        time: "O(V!)",
        space: "O(V)",
        explanation: [
            "Start from the selected source location.",
            "Explore every possible path without visiting a location twice.",
            "Calculate the distance of every path reaching the destination.",
            "Choose the path with the minimum distance."
        ]
    },
    divide: {
        name: "Divide and Conquer",
        time: "O(V³ log V)",
        space: "O(V² log V)",
        explanation: [
            "Represent the delivery network as a distance matrix.",
            "Divide the allowed path length into smaller parts recursively.",
            "Combine the smaller results using min-plus matrix multiplication.",
            "Find the minimum distance and reconstruct the delivery route."
        ]
    },
    dynamic: {
        name: "Dynamic Programming (Bellman-Ford)",
        time: "O(VE)",
        space: "O(V)",
        explanation: [
            "Set the source distance to zero and all other distances to infinity.",
            "Consider every road and update distances when a shorter route is found.",
            "Repeat the process up to V - 1 times.",
            "Use the final distances and parent locations to reconstruct the shortest route."
        ]
    },
    greedy: {
        name: "Greedy (Dijkstra)",
        time: "O(V²)",
        space: "O(V)",
        explanation: [
            "Set the source distance to zero.",
            "Select the unvisited location with the smallest known distance.",
            "Update the distances of its neighbouring locations.",
            "Repeat until all reachable locations are processed."
        ]
    }
};

function showError(message) {
    document.getElementById("errorMessage").textContent = message;
}

function clearError() {
    document.getElementById("errorMessage").textContent = "";
}

// Save existing form values before generating new fields
function getExistingInput() {
    const names = [];
    const distances = [];
    let source = 0;
    let destination = 1;

    for (let i = 0; i < generatedCount; i++) {
        const nameField = document.getElementById(`location${i}`);

        if (nameField) {
            names.push(nameField.value);
        }

        distances[i] = [];

        for (let j = 0; j < generatedCount; j++) {
            const field = document.getElementById(`distance${i}_${j}`);
            distances[i][j] = field ? field.value : "0";
        }
    }

    const sourceField = document.getElementById("source");
    const destinationField = document.getElementById("destination");

    if (sourceField) source = Number(sourceField.value);
    if (destinationField) destination = Number(destinationField.value);

    return { names, distances, source, destination };
}

// Generate location and distance input fields
function generateFields() {
    const count = Number(document.getElementById("locationCount").value);

    if (!Number.isInteger(count) || count < 2 || count > 8) {
        showError("Enter a number of locations between 2 and 8.");
        return;
    }

    clearError();

    const oldData = getExistingInput();
    const oldCount = generatedCount;

    const locationInputs = document.getElementById("locationInputs");
    const matrixInputs = document.getElementById("matrixInputs");

    let locationHTML = `
        <h3>Location Names</h3>
        <p>Enter a unique name for each location.</p>
    `;

    for (let i = 0; i < count; i++) {
        let name = oldData.names[i];

        if (name === undefined) {
            name = `Location ${i + 1}`;
        }

        locationHTML += `
            <label>Location ${i + 1}</label>
            <input type="text" id="location${i}"
                   value="${escapeHTML(name)}"
                   placeholder="Enter location name">
        `;
    }

    locationHTML += `
        <h3>Starting and Destination Locations</h3>

        <label for="source">Starting Location</label>
        <select id="source"></select>

        <label for="destination">Destination Location</label>
        <select id="destination"></select>
    `;

    locationInputs.innerHTML = locationHTML;

    const sourceSelect = document.getElementById("source");
    const destinationSelect = document.getElementById("destination");

    for (let i = 0; i < count; i++) {
        sourceSelect.add(new Option(`Location ${i + 1}`, i));
        destinationSelect.add(new Option(`Location ${i + 1}`, i));
    }

    sourceSelect.value = oldData.source < count ? oldData.source : 0;

    const newDestination =
        oldData.destination < count ? oldData.destination : 1;

    destinationSelect.value =
        newDestination === Number(sourceSelect.value)
            ? (Number(sourceSelect.value) === 0 ? 1 : 0)
            : newDestination;

    let matrixHTML = `
        <table class="matrix-table">
            <tr>
                <th>From / To</th>
    `;

    for (let i = 0; i < count; i++) {
        matrixHTML += `<th>${i + 1}</th>`;
    }

    matrixHTML += `</tr>`;

    for (let i = 0; i < count; i++) {
        matrixHTML += `<tr><th>${i + 1}</th>`;

        for (let j = 0; j < count; j++) {
            let value = 0;

            if (i === j) {
                value = 0;
            } else if (i < oldCount && j < oldCount) {
                value = oldData.distances[i][j];
            } else if (oldCount === 0 && count === 4) {
                const sample = [
                    [0, 10, 15, 0],
                    [10, 0, 35, 25],
                    [15, 35, 0, 30],
                    [0, 25, 30, 0]
                ];

                value = sample[i][j];
            }

            matrixHTML += `
                <td>
                    <input type="number"
                           id="distance${i}_${j}"
                           value="${value}"
                           min="0"
                           step="1"
                           ${i === j ? "disabled" : ""}
                           aria-label="Distance from location ${i + 1} to ${j + 1}">
                </td>
            `;
        }

        matrixHTML += `</tr>`;
    }

    matrixHTML += `</table>`;
    matrixInputs.innerHTML = matrixHTML;

    generatedCount = count;
    currentGraph = null;

    document.getElementById("result").innerHTML = `
        <h3>Algorithm Results</h3>
        <p>Enter your delivery network and select an algorithm.</p>
    `;
}

// Escape text before inserting location names into HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Read and validate user input
function readInput() {
    const count = Number(document.getElementById("locationCount").value);

    if (!Number.isInteger(count) || count < 2 || count > 8) {
        throw new Error("Number of locations must be between 2 and 8.");
    }

    const names = [];

    for (let i = 0; i < count; i++) {
        const name = document.getElementById(`location${i}`).value.trim();

        if (!name) {
            throw new Error(`Enter a name for Location ${i + 1}.`);
        }

        names.push(name);
    }

    if (new Set(names.map(name => name.toLowerCase())).size !== count) {
        throw new Error("Location names must be unique.");
    }

    const source = Number(document.getElementById("source").value);
    const destination = Number(document.getElementById("destination").value);

    if (source === destination) {
        throw new Error("Starting and destination locations must be different.");
    }

    const graph = Array.from({ length: count }, () => Array(count).fill(0));

    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            if (i === j) continue;

            const input = document.getElementById(`distance${i}_${j}`);
            const value = Number(input.value);

            if (
                input.value.trim() === "" ||
                !Number.isSafeInteger(value) ||
                value < 0
            ) {
                throw new Error("Distances must be non-negative whole numbers.");
            }

            graph[i][j] = value;
        }
    }

    for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
            if (graph[i][j] !== graph[j][i]) {
                throw new Error(
                    "Road distances must be equal in both directions."
                );
            }
        }
    }

    if (!graph.some((row, i) => row.some((value, j) => i !== j && value > 0))) {
        throw new Error("Enter at least one road distance.");
    }

    return { graph, names, source, destination, count };
}

// 1. BRUTE FORCE
function bruteForce(graph, source, destination) {
    const n = graph.length;
    const visited = Array(n).fill(false);
    let bestDistance = INF;
    let bestPath = [];

    function search(current, distance, path) {
        if (current === destination) {
            if (distance < bestDistance) {
                bestDistance = distance;
                bestPath = [...path];
            }
            return;
        }

        for (let next = 0; next < n; next++) {
            if (!visited[next] && graph[current][next] > 0) {
                visited[next] = true;
                search(next, distance + graph[current][next], [...path, next]);
                visited[next] = false;
            }
        }
    }

    visited[source] = true;
    search(source, 0, [source]);

    return { distance: bestDistance, path: bestPath };
}

// Min-plus matrix multiplication
function minPlusMultiply(A, B) {
    const n = A.length;
    const C = Array.from({ length: n }, () => Array(n).fill(INF));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                C[i][j] = Math.min(C[i][j], A[i][k] + B[k][j]);
            }
        }
    }

    return C;
}

// Recursive matrix exponentiation
function minPlusPower(A, exponent) {
    if (exponent === 1) return A;

    const half = minPlusPower(A, Math.floor(exponent / 2));
    const squared = minPlusMultiply(half, half);

    if (exponent % 2 === 0) return squared;

    return minPlusMultiply(squared, A);
}

// 2. DIVIDE AND CONQUER
function divideAndConquer(graph, source, destination) {
    const n = graph.length;

    const matrix = graph.map((row, i) =>
        row.map((value, j) =>
            i === j ? 0 : value > 0 ? value : INF
        )
    );

    let maxEdges = 1;

    while (maxEdges < n - 1) {
        maxEdges *= 2;
    }

    const shortest = minPlusPower(matrix, maxEdges);
    const bestDistance = shortest[source][destination];

    if (bestDistance === INF) {
        return { distance: INF, path: [] };
    }

    const path = [source];
    const visited = Array(n).fill(false);
    let current = source;
    visited[current] = true;

    while (current !== destination) {
        let nextLocation = -1;

        for (let next = 0; next < n; next++) {
            if (
                !visited[next] &&
                graph[current][next] > 0 &&
                shortest[next][destination] !== INF &&
                graph[current][next] + shortest[next][destination] ===
                    shortest[current][destination]
            ) {
                nextLocation = next;
                break;
            }
        }

        if (nextLocation === -1) {
            throw new Error("Could not reconstruct the Divide and Conquer route.");
        }

        current = nextLocation;
        visited[current] = true;
        path.push(current);
    }

    return { distance: bestDistance, path };
}

// 3. DYNAMIC PROGRAMMING: BELLMAN-FORD
function bellmanFord(graph, source, destination) {
    const n = graph.length;
    const dist = Array(n).fill(INF);
    const parent = Array(n).fill(-1);
    dist[source] = 0;

    const edges = [];

    for (let u = 0; u < n; u++) {
        for (let v = 0; v < n; v++) {
            if (graph[u][v] > 0) {
                edges.push([u, v, graph[u][v]]);
            }
        }
    }

    for (let i = 0; i < n - 1; i++) {
        let changed = false;

        for (const [u, v, weight] of edges) {
            if (dist[u] !== INF && dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                parent[v] = u;
                changed = true;
            }
        }

        if (!changed) break;
    }

    if (dist[destination] === INF) {
        return { distance: INF, path: [] };
    }

    const path = [];
    let current = destination;

    while (current !== -1) {
        path.push(current);
        current = parent[current];
    }

    path.reverse();
    return { distance: dist[destination], path };
}

// 4. GREEDY: DIJKSTRA
function dijkstra(graph, source, destination) {
    const n = graph.length;
    const dist = Array(n).fill(INF);
    const visited = Array(n).fill(false);
    const parent = Array(n).fill(-1);

    dist[source] = 0;

    for (let count = 0; count < n; count++) {
        let u = -1;

        for (let i = 0; i < n; i++) {
            if (!visited[i] && (u === -1 || dist[i] < dist[u])) {
                u = i;
            }
        }

        if (u === -1 || dist[u] === INF) break;

        visited[u] = true;

        if (u === destination) break;

        for (let v = 0; v < n; v++) {
            if (
                !visited[v] &&
                graph[u][v] > 0 &&
                dist[u] + graph[u][v] < dist[v]
            ) {
                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;
            }
        }
    }

    if (dist[destination] === INF) {
        return { distance: INF, path: [] };
    }

    const path = [];
    let current = destination;

    while (current !== -1) {
        path.push(current);
        current = parent[current];
    }

    path.reverse();
    return { distance: dist[destination], path };
}

// Display algorithm results
function displayResult(algorithm, result, data) {
    const info = algorithmInfo[algorithm];
    const resultDiv = document.getElementById("result");

    const route = result.path.length
        ? result.path.map(index => escapeHTML(data.names[index])).join(" → ")
        : "No route available";

    const distance = result.distance === INF
        ? "No route available"
        : `${result.distance} distance units`;

    resultDiv.innerHTML = `
        <h3>${info.name}</h3>
        <h4>Step-by-Step Explanation</h4>
        <ol>
            ${info.explanation.map(step => `<li>${step}</li>`).join("")}
        </ol>
        <h4>Time Complexity</h4>
        <p>${info.time}</p>
        <h4>Space Complexity</h4>
        <p>${info.space}</p>
        <h4>Shortest Delivery Route</h4>
        <p>${route}</p>
        <h4>Minimum Delivery Distance</h4>
        <p><strong>${distance}</strong></p>
        <p>Starting Location: ${escapeHTML(data.names[data.source])}</p>
        <p>Destination Location: ${escapeHTML(data.names[data.destination])}</p>
    `;
}

// Run selected algorithm
function runAlgorithm(algorithm) {
    try {
        clearError();

        const data = readInput();
        currentGraph = data;

        let result;

        if (algorithm === "brute") {
            result = bruteForce(data.graph, data.source, data.destination);
        } else if (algorithm === "divide") {
            result = divideAndConquer(data.graph, data.source, data.destination);
        } else if (algorithm === "dynamic") {
            result = bellmanFord(data.graph, data.source, data.destination);
        } else {
            result = dijkstra(data.graph, data.source, data.destination);
        }

        displayResult(algorithm, result, data);

    } catch (error) {
        showError(error.message);
    }
}

// Button events
document.getElementById("generateButton")
    .addEventListener("click", generateFields);

document.getElementById("solveButton")
    .addEventListener("click", () => runAlgorithm(selectedAlgorithm));

document.querySelectorAll("[data-algorithm]").forEach(button => {
    button.addEventListener("click", () => {
        selectedAlgorithm = button.dataset.algorithm;
        runAlgorithm(selectedAlgorithm);
    });
});

// Generate initial fields
generateFields();
