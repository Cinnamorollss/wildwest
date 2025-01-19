// Global variables
let currentPlayer = null;
let allPlayers = [];
let gameState = {
    day: 1,
    money: 0,
    job: null,
    skills: {
        strength: 1,
        intelligence: 1,
        dexterity: 1,
        charisma: 1,
        endurance: 1
    }
};

const jobs = [
    { 
        title: "Ranch Hand", 
        salary: 2,
        requirements: { strength: 0 },
        skillGain: { strength: 2, endurance: 1 }
    },
    { 
        title: "Miner", 
        salary: 4,
        requirements: { strength: 10, endurance: 5 },
        skillGain: { strength: 3, endurance: 2 }
    },
    { 
        title: "Blacksmith", 
        salary: 3,
        requirements: { strength: 15, dexterity: 10 },
        skillGain: { strength: 2, dexterity: 2 }
    },
    { 
        title: "Saloon Worker", 
        salary: 2,
        requirements: { charisma: 5 },
        skillGain: { charisma: 2, dexterity: 1 }
    },
    { 
        title: "Merchant", 
        salary: 3,
        requirements: { intelligence: 10, charisma: 10 },
        skillGain: { intelligence: 2, charisma: 2 }
    },
    { 
        title: "Butcher", 
        salary: 5,
        requirements: { strength: 50, dexterity: 20 },
        skillGain: { strength: 1, dexterity: 3 }
    }
];

function initGame() {
    document.getElementById('game-area').innerHTML = `
        <h2>Welcome to Wild West Frontier</h2>
        <p>You find yourself in a small frontier town in the American Wild West. The year is 1875, and opportunity awaits those brave enough to seize it.</p>
        <button onclick="startCharacterCreation()">Create Your Character</button>
    `;
}

function startCharacterCreation() {
    document.getElementById('game-area').innerHTML = `
        <h2>Create Your Character</h2>
        <form id="character-form">
            <input type="text" id="name" placeholder="Choose your name" required>
            <select id="gender" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <input type="number" id="age" min="18" max="70" placeholder="Age (18-70)" required>
            <select id="origin" required>
                <option value="">Country of Origin</option>
                <option value="usa">United States</option>
                <option value="mexico">Mexico</option>
                <option value="ireland">Ireland</option>
                <option value="germany">Germany</option>
            </select>
            <select id="marital-status" required>
                <option value="">Marital Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
            </select>
            <input type="number" id="children" min="0" max="10" placeholder="Number of children (0-10)" required>
            <textarea id="backstory" rows="4" placeholder="Write a short backstory" required></textarea>
            <button type="submit">Create Character</button>
        </form>
        <p id="error-message"></p>
    `;

    document.getElementById('character-form').addEventListener('submit', validateAndCreateCharacter);
}

function validateAndCreateCharacter(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const errorMessage = document.getElementById('error-message');

    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
        errorMessage.textContent = "Name can only contain letters, numbers, and underscores.";
        return;
    }

    if (allPlayers.some(player => player.name === name)) {
        errorMessage.textContent = "This name is already taken. Please choose another.";
        return;
    }

    const character = {
        name: name,
        gender: document.getElementById('gender').value,
        age: parseInt(document.getElementById('age').value),
        origin: document.getElementById('origin').value,
        maritalStatus: document.getElementById('marital-status').value,
        children: parseInt(document.getElementById('children').value),
        backstory: document.getElementById('backstory').value
    };

    allPlayers.push(character);
    currentPlayer = character;

    startAdventure();
}

function startAdventure() {
    gameState.money = 50 + Math.floor(Math.random() * 51); // Start with $50-$100
    updateGameArea();
}

function updateGameArea() {
    document.getElementById('game-area').innerHTML = `
        <h2>Welcome to the Wild West, ${currentPlayer.name}!</h2>
        <p>You are a ${currentPlayer.age}-year-old ${currentPlayer.gender} from ${currentPlayer.origin}.</p>
        <h3>Your Stats:</h3>
        <p>Money: $${gameState.money.toFixed(2)}</p>
        <p>Day: ${gameState.day}</p>
        <p>Current Job: ${gameState.job ? gameState.job.title : 'Unemployed'}</p>
        <h4>Skills:</h4>
        <ul>
            ${Object.entries(gameState.skills).map(([skill, level]) => `<li>${skill.charAt(0).toUpperCase() + skill.slice(1)}: ${level}</li>`).join('')}
        </ul>
        <h3>What would you like to do?</h3>
        <button onclick="findWork()">Look for Work</button>
        <button onclick="exploreCity()">Explore the City</button>
        <button onclick="restForTheDay()">Rest for the Day</button>
    `;
}

function findWork() {
    let jobListHTML = jobs.map((job, index) => {
        let canApply = Object.entries(job.requirements).every(([skill, level]) => gameState.skills[skill] >= level);
        let buttonClass = canApply ? "" : "disabled";
        return `<button onclick="acceptJob(${index})" ${canApply ? '' : 'disabled'}>${job.title} - $${job.salary.toFixed(2)}/day</button>`;
    }).join('');

    document.getElementById('game-area').innerHTML = `
        <h2>Available Jobs</h2>
        <p>Choose a job to start earning money:</p>
        ${jobListHTML}
        <button onclick="updateGameArea()">Go Back</button>
    `;
}

function acceptJob(jobIndex) {
    const job = jobs[jobIndex];
    if (Object.entries(job.requirements).every(([skill, level]) => gameState.skills[skill] >= level)) {
        gameState.job = job;
        alert(`You've started working as a ${gameState.job.title}!`);
    } else {
        alert("You don't meet the skill requirements for this job!");
    }
    updateGameArea();
}

function restForTheDay() {
    if (gameState.job) {
        gameState.money += gameState.job.salary;
        gameState.day++;
        
        // Increase skills based on job
        Object.entries(gameState.job.skillGain).forEach(([skill, gain]) => {
            gameState.skills[skill] += gain;
        });
        
        alert(`You worked as a ${gameState.job.title} and earned $${gameState.job.salary.toFixed(2)}. Your skills have improved!`);
    } else {
        alert("You rested for the day but didn't earn any money. Find a job to start earning!");
        gameState.day++;
    }
    updateGameArea();
}

function exploreCity() {
    alert("You explore the dusty streets of the frontier town... (More features coming soon!)");
    updateGameArea();
}

window.onload = initGame;
