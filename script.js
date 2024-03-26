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

        if (!agentTerm && !mapTerm) {
            throw new Error('Preencha pelo menos um dos campos de pesquisa.');
        }

        clearResults();

        if (agentTerm) {
            displayAgentInfo(await fetchAgentInfo(agentTerm));
        } else {
            displayMapInfo(await fetchMapInfo(mapTerm));
        }
    } catch (error) {
        console.error(error);
        displayError(error.message);
    }
});

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

// Função para exibir a lista de agentes
function displayAgentList(agentNames) {
    const agentListElement = document.getElementById('agentList');
    const agentList = document.createElement('ul');

    agentNames.forEach(agentName => {
        const listItem = document.createElement('li');
        listItem.textContent = agentName;
        agentList.appendChild(listItem);
    });

    agentListElement.innerHTML = '<h2>Lista de Agentes:</h2>';
    agentListElement.appendChild(agentList);
}
