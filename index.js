// Global variables
let currentPlayer = null;
let allPlayers = []; // This would typically be stored in a database

// Main game initialization
function initGame() {
    document.getElementById('game-area').innerHTML = `
        <h2>Welcome to Wild West Frontier</h2>
        <p>You find yourself in a small frontier town in the American Wild West. The year is 1875, and opportunity awaits those brave enough to seize it.</p>
        <button onclick="startCharacterCreation()">Create Your Character</button>
    `;
}

// Start character creation process
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

// Validate and create character
function validateAndCreateCharacter(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const errorMessage = document.getElementById('error-message');

    // Validate name (only letters, numbers, and underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
        errorMessage.textContent = "Name can only contain letters, numbers, and underscores.";
        return;
    }

    // Check if name is unique
    if (allPlayers.some(player => player.name === name)) {
        errorMessage.textContent = "This name is already taken. Please choose another.";
        return;
    }

    // Create character object
    const character = {
        name: name,
        gender: document.getElementById('gender').value,
        age: parseInt(document.getElementById('age').value),
        origin: document.getElementById('origin').value,
        maritalStatus: document.getElementById('marital-status').value,
        children: parseInt(document.getElementById('children').value),
        backstory: document.getElementById('backstory').value
    };

    // Add character to allPlayers (in a real game, this would be saved to a database)
    allPlayers.push(character);
    currentPlayer = character;

    // Start the game
    startAdventure();
}

// Start the adventure
function startAdventure() {
    document.getElementById('game-area').innerHTML = `
        <h2>Welcome to the Wild West, ${currentPlayer.name}!</h2>
        <p>You are a ${currentPlayer.age}-year-old ${currentPlayer.gender} from ${currentPlayer.origin}.</p>
        <p>Marital Status: ${currentPlayer.maritalStatus}</p>
        <p>Children: ${currentPlayer.children}</p>
        <p>Your backstory: ${currentPlayer.backstory}</p>
        <h3>What would you like to do?</h3>
        <button onclick="exploreCity()">Explore the City</button>
        <button onclick="findWork()">Look for Work</button>
        <button onclick="visitSaloon()">Visit the Saloon</button>
    `;
}

// Placeholder functions for game actions
function exploreCity() {
    alert("You explore the dusty streets of the frontier town...");
    // Add more game logic here
}

function findWork() {
    alert("You start asking around for job opportunities...");
    // Add more game logic here
}

function visitSaloon() {
    alert("You push through the swinging doors of the local saloon...");
    // Add more game logic here
}

// Initialize the game when the page loads
window.onload = initGame;
