// Global variables
let currentPlayer = null;
let allPlayers = [];
let gameState = {
    day: 1,
    money: 0,
    job: null,
    skills: {
        influence: 0,
        speech: 0,
        shooting: 0,
        aiming: 0,
        strength: 0,
        knowledge: 0,
        smithing: 0,
        mining: 0,
        hunting: 0,
        husbandry: 0,
        riding: 0
    }
};

const jobs = [
    { 
        title: "Ranch Hand", 
        salary: 2,
        requirements: {},
        skillGain: { strength: 1, husbandry: 2 }
    },
    { 
        title: "Freighter", 
        salary: 2,
        requirements: {},
        skillGain: { strength: 1, knowledge: 1 }
    },
    { 
        title: "Grocer", 
        salary: 2,
        requirements: {},
        skillGain: { speech: 1, influence: 1 }
    }
];

const skillDescriptions = {
    influence: "Your ability to sway others. Improve by interacting with people and completing social tasks.",
    speech: "Your eloquence and persuasiveness. Enhance through conversations and public speaking.",
    shooting: "Your firearm proficiency. Practice at the shooting range or during hunting trips.",
    aiming: "Your accuracy with ranged weapons. Improve through target practice and hunting.",
    strength: "Your physical power. Increase by doing manual labor or exercising.",
    knowledge: "Your general understanding of the world. Grow by reading books and exploring.",
    smithing: "Your skill in metalworking. Develop by assisting at the blacksmith or crafting items.",
    mining: "Your expertise in extracting minerals. Improve by working in mines or prospecting.",
    hunting: "Your ability to track and hunt animals. Enhance through hunting trips and wildlife observation.",
    husbandry: "Your skill with animals. Increase by working with livestock and caring for animals.",
    riding: "Your proficiency in horseback riding. Improve through practice and long journeys."
};

const courses = {
    "Geology and Animal Studies": {
        cost: 50,
        duration: 5,
        skillGain: {
            husbandry: 5,
            riding: 3
        }
    },
    "History": {
        cost: 40,
        duration: 4,
        skillGain: {
            mining: 4,
            knowledge: 5
        }
    }
};

let currentCourse = null;
let studyDaysLeft = 0;

const randomEvents = {
    weather: [
        { description: "A sudden rainstorm soaks you to the bone.", effect: () => { gameState.money -= 1; } },
        { description: "A beautiful sunny day lifts your spirits.", effect: () => { gameState.skills.strength += 1; } },
        { description: "A dust storm forces you to seek shelter.", effect: () => { gameState.money -= 2; } },
        { description: "A rainbow appears after a light shower, bringing good luck.", effect: () => { gameState.money += 3; } },
        { description: "A chilly wind makes you shiver.", effect: () => { gameState.skills.endurance += 1; } },
        { description: "A scorching heat wave slows down the town.", effect: () => { gameState.money -= 1; } },
        { description: "A mild, perfect day makes everyone cheerful.", effect: () => { gameState.skills.speech += 1; } },
        { description: "Fog rolls in, creating an eerie atmosphere.", effect: () => { gameState.skills.hunting += 1; } },
        { description: "A light snowfall brings a touch of winter magic.", effect: () => { gameState.skills.knowledge += 1; } },
        { description: "A windy day sends tumbleweeds rolling through town.", effect: () => { /* No effect */ } }
    ],
    npc: [
        { description: "A friendly stranger shares some useful information with you.", effect: () => { gameState.skills.knowledge += 1; } },
        { description: "You help an old man carry his groceries.", effect: () => { gameState.skills.strength += 1; } },
        { description: "A local challenges you to a friendly shooting contest.", effect: () => { gameState.skills.shooting += 1; } },
        { description: "A traveling salesman offers you a 'special' deal.", effect: () => { gameState.money -= 5; } },
        { description: "You break up a bar fight, impressing the onlookers.", effect: () => { gameState.skills.influence += 2; } },
        { description: "A mysterious stranger tells you a cryptic riddle.", effect: () => { gameState.skills.knowledge += 1; } },
        { description: "You assist the town doctor with a patient.", effect: () => { gameState.skills.knowledge += 2; } },
        { description: "A group of children ask you to tell them a story.", effect: () => { gameState.skills.speech += 1; } },
        { description: "You help the sheriff track down a petty thief.", effect: () => { gameState.skills.hunting += 2; } },
        { description: "An old prospector shares some mining tips with you.", effect: () => { gameState.skills.mining += 1; } }
    ],
    animal: [
        { description: "You spot a rare bird species.", effect: () => { gameState.skills.knowledge += 1; } },
        { description: "A stray dog follows you around town.", effect: () => { gameState.skills.husbandry += 1; } },
        { description: "You help catch a runaway horse.", effect: () => { gameState.skills.riding += 1; } },
        { description: "A rattlesnake crosses your path, testing your reflexes.", effect: () => { gameState.skills.aiming += 1; } },
        { description: "You witness a beautiful butterfly emerging from its cocoon.", effect: () => { gameState.skills.knowledge += 1; } },
        { description: "A mischievous raccoon raids the general store.", effect: () => { gameState.skills.hunting += 1; } },
        { description: "You help a farmer deliver a calf.", effect: () => { gameState.skills.husbandry += 2; } },
        { description: "A majestic eagle soars overhead, inspiring you.", effect: () => { gameState.skills.influence += 1; } },
        { description: "You encounter a gentle deer in the woods.", effect: () => { gameState.skills.hunting += 1; } },
        { description: "A playful squirrel steals your hat.", effect: () => { gameState.money -= 1; } }
    ],
    job: [
        { description: "Your boss is impressed with your hard work and gives you a bonus.", effect: () => { gameState.money += 5; } },
        { description: "A mishap at work causes some property damage.", effect: () => { gameState.money -= 3; } },
        { description: "You learn a new trick of the trade.", effect: () => { 
            const jobSkills = Object.keys(gameState.job.skillGain);
            const randomSkill = jobSkills[Math.floor(Math.random() * jobSkills.length)];
            gameState.skills[randomSkill] += 1;
        }},
        { description: "You work overtime and earn extra pay.", effect: () => { gameState.money += 3; } },
        { description: "A difficult customer tests your patience.", effect: () => { gameState.skills.speech += 1; } },
        { description: "You receive a commendation for your reliability.", effect: () => { gameState.skills.influence += 1; } },
        { description: "A busy day at work leaves you exhausted but more experienced.", effect: () => { 
            const jobSkills = Object.keys(gameState.job.skillGain);
            jobSkills.forEach(skill => gameState.skills[skill] += 1);
        }},
        { description: "You suggest an improvement that impresses your employer.", effect: () => { gameState.money += 2; gameState.skills.knowledge += 1; } },
        { description: "A mistake at work costs you some pay.", effect: () => { gameState.money -= 2; } },
        { description: "You help train a new employee.", effect: () => { gameState.skills.speech += 1; gameState.skills.influence += 1; } }
    ],
    romantic: [
        { description: "A pretty lady winks at you on the street.", effect: () => { gameState.skills.speech += 1; } },
        { description: "You have a pleasant conversation with an attractive stranger at the saloon.", effect: () => { gameState.skills.speech += 1; } },
        { description: "You receive an anonymous love letter.", effect: () => { gameState.skills.knowledge += 1; } },
        { description: "A secret admirer leaves flowers on your doorstep.", effect: () => { gameState.skills.influence += 1; } },
        { description: "You dance with a charming partner at a local gathering.", effect: () => { gameState.skills.influence += 1; } },
        { description: "A potential suitor asks you for a courtship walk.", effect: () => { gameState.skills.speech += 1; } },
        { description: "You write a heartfelt poem for someone special.", effect: () => { gameState.skills.knowledge += 1; } },
        { description: "You receive advice on matters of the heart from a wise elder.", effect: () => { gameState.skills.knowledge += 1; } },
        { description: "A case of mistaken identity leads to an awkward romantic encounter.", effect: () => { gameState.skills.speech += 1; } },
        { description: "You help a couple reconcile their differences.", effect: () => { gameState.skills.influence += 2; } }
    ],
    misc: [
        { description: "You find a lucky horseshoe.", effect: () => { gameState.money += 2; } },
        { description: "A traveling circus comes to town, providing entertainment.", effect: () => { gameState.skills.knowledge += 1; } },
        { description: "You witness a shooting star and make a wish.", effect: () => { /* No effect, just flavor */ } },
        { description: "A town meeting discusses important local issues.", effect: () => { gameState.skills.knowledge += 1; gameState.skills.influence += 1; } },
        { description: "You participate in a local festival.", effect: () => { gameState.skills.speech += 1; } },
        { description: "A traveling photographer offers to take your portrait.", effect: () => { gameState.money -= 1; } },
        { description: "You find an interesting book in the general store.", effect: () => { gameState.skills.knowledge += 2; gameState.money -= 1; } },
        { description: "A group of travelers share stories from distant lands.", effect: () => { gameState.skills.knowledge += 2; } },
        { description: "You help organize a community barn-raising.", effect: () => { gameState.skills.strength += 1; gameState.skills.influence += 1; } },
        { description: "A local gold rush rumor excites the town.", effect: () => { gameState.skills.mining += 1; } }
    ]
};

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
        <button onclick="viewSkills()">View Skills</button>
        <h3>What would you like to do?</h3>
        <button onclick="findWork()">Look for Work</button>
        <button onclick="exploreCity()">Explore the City</button>
        <button onclick="restForTheDay()">Rest for the Day</button>
        <button onclick="viewAvailableTasks()">View Available Tasks</button>
        <button onclick="study()">Study</button>
