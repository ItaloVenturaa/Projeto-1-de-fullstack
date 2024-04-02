const API_URL = 'https://valorant-api.com/v1/';

const resultsElement = document.getElementById('results');
const agentInputElement = document.getElementById('agentInput');
const mapInputElement = document.getElementById('mapInput');

document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const agentTerm = agentInputElement.value.trim();
    const mapTerm = mapInputElement.value.trim();

    try {

        if (agentTerm && mapTerm) {
            throw new Error('Preencha apenas um dos campos: Agente ou Mapa.');
        }

        clearResults();

        if (!agentTerm && !mapTerm) {
            displayAllAgents(await fetchAllAgents());
            displayAllMaps(await fetchAllMaps());
        } else {
            if (agentTerm) {
                const agentInfo = await fetchAgentInfo(agentTerm);
                displayAgentInfo(agentInfo);
            }
            if (mapTerm) {
                const mapInfo = await fetchMapInfo(mapTerm);
                displayMapInfo(mapInfo);
            }
        }
    } catch (error) {
        console.error(error);
        displayError(error.message);
    }
});

async function fetchAllAgents() {
    const response = await fetch(API_URL + 'agents');
    const data = await response.json();

    if (data.status !== 200) {
        throw new Error('Erro ao obter a lista de agentes.');
    }

    return data.data;
}

async function fetchAllMaps() {
    const response = await fetch(API_URL + 'maps');
    const data = await response.json();

    if (data.status !== 200) {
        throw new Error('Erro ao obter a lista de mapas.');
    }

    return data.data;
}

async function fetchAgentInfo(agentName) {
    const response = await fetch(API_URL + 'agents?name=' + agentName);
    const data = await response.json();

    if (data.status !== 200) {
        throw new Error('Agente não encontrado.');
    }

    const agentData = data.data.find(agent => agent.displayName.toLowerCase() === agentName.toLowerCase());

    if (!agentData) {
        throw new Error('Agente não encontrado.');
    }

    return agentData;
}

async function fetchMapInfo(mapName) {
    const response = await fetch(API_URL + 'maps?name=' + mapName);
    const data = await response.json();

    if (data.status !== 200) {
        throw new Error('Mapa não encontrado.');
    }

    const mapData = data.data.find(map => map.displayName.toLowerCase() === mapName.toLowerCase());

    if (!mapData) {
        throw new Error('Mapa não encontrado.');
    }

    return mapData;
}

function clearResults() {
    resultsElement.innerHTML = '';
}

function displayAllAgents(agents) {
    agents.forEach(agent => {
        const agentElement = document.createElement('div');
        agentElement.classList.add('agent');
        agentElement.innerHTML = `
            <h2>${agent.displayName}</h2>
            <p>${agent.description}</p>
            <img src="${agent.bustPortrait}" alt="${agent.displayName}">
        `;
        resultsElement.appendChild(agentElement);
    });
}

function displayAllMaps(maps) {
    maps.forEach(map => {
        const mapElement = document.createElement('div');
        mapElement.classList.add('map');
        mapElement.innerHTML = `
            <h2>${map.displayName}</h2>
            <p>${map.narrativeDescription}</p>
            <img src="${map.splash}" alt="${map.displayName}">
        `;
        resultsElement.appendChild(mapElement);
    });
}

function displayAgentInfo(agentData) {
    const { displayName, description, bustPortrait } = agentData;
    resultsElement.innerHTML = `
        <h2>${displayName}</h2>
        <p>${description}</p>
        <img src="${bustPortrait}" alt="${displayName}">
    `;
}

function displayMapInfo(mapData) {
    const { displayName, narrativeDescription, splash } = mapData;
    resultsElement.innerHTML = `
        <h2>${displayName}</h2>
        <p>${narrativeDescription}</p>
        <img src="${splash}" alt="${displayName}">
    `;
}

function displayError(message) {
    resultsElement.innerHTML = `<p class="error">${message}</p>`;
}