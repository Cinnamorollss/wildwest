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
        duration: 5, // days
        skillGain: {
            husbandry: 5,
            riding: 3
        }
    },
    "History": {
        cost: 40,
        duration: 4, // days
        skillGain: {
            mining: 4,
            knowledge: 5
        }
    }
};

let currentCourse = null;
let studyDaysLeft = 0;

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
    `;
}

function viewSkills() {
    let skillsHTML = Object.entries(gameState.skills).map(([skill, level]) => 
        `<li>${skill.charAt(0).toUpperCase() + skill.slice(1)}: ${level} 
        <button onclick="showSkillInfo('${skill}')">?</button></li>`
    ).join('');

    document.getElementById('game-area').innerHTML = `
        <h2>Your Skills</h2>
        <ul>${skillsHTML}</ul>
        <button onclick="updateGameArea()">Back</button>
    `;
}

function showSkillInfo(skill) {
    alert(`${skill.charAt(0).toUpperCase() + skill.slice(1)}: ${skillDescriptions[skill]}`);
}

function findWork() {
    let jobListHTML = jobs.map((job, index) => 
        `<button onclick="acceptJob(${index})">${job.title} - $${job.salary.toFixed(2)}/day</button>`
    ).join('');

    document.getElementById('game-area').innerHTML = `
        <h2>Available Jobs</h2>
        <p>Choose a job to start earning money:</p>
        ${jobListHTML}
        <button onclick="updateGameArea()">Go Back</button>
    `;
}

function acceptJob(jobIndex) {
    gameState.job = jobs[jobIndex];
    alert(`You've started working as a ${gameState.job.title}!`);
    updateGameArea();
}

function restForTheDay() {
    if (currentCourse) {
        continueStudying();
    } else if (gameState.job) {
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
    let exploreOptions = [
        "You stumble upon an old book, gaining 1 Knowledge.",
        "You help a local move some heavy crates, gaining 1 Strength.",
        "You chat with some locals at the saloon, gaining 1 Speech.",
        "You observe wildlife near the town, gaining 1 Hunting.",
    ];
    let randomEvent = exploreOptions[Math.floor(Math.random() * exploreOptions.length)];
    alert(randomEvent);
    
    // Update the relevant skill
    let skillGained = randomEvent.split("gaining 1 ")[1].split(".")[0].toLowerCase();
    gameState.skills[skillGained]++;
    
    updateGameArea();
}

function viewAvailableTasks() {
    let tasks = [
        { name: "Help at the local farm", reward: 5, skillGain: { husbandry: 2, strength: 1 } },
        { name: "Assist the blacksmith", reward: 7, skillGain: { smithing: 2, strength: 1 } },
        { name: "Go on a hunting trip", reward: 10, skillGain: { hunting: 2, aiming: 1 } }
    ];

    let tasksHTML = tasks.map((task, index) => 
        `<button onclick="completeTask(${index})">${task.name} - $${task.reward}</button>`
    ).join('');

    document.getElementById('game-area').innerHTML = `
        <h2>Available Tasks</h2>
        <p>Choose a task to complete:</p>
        ${tasksHTML}
        <button onclick="updateGameArea()">Go Back</button>
    `;
}

function completeTask(taskIndex) {
    let tasks = [
        { name: "Help at the local farm", reward: 5, skillGain: { husbandry: 2, strength: 1 } },
        { name: "Assist the blacksmith", reward: 7, skillGain: { smithing: 2, strength: 1 } },
        { name: "Go on a hunting trip", reward: 10, skillGain: { hunting: 2, aiming: 1 } }
    ];

    let task = tasks[taskIndex];
    gameState.money += task.reward;
    Object.entries(task.skillGain).forEach(([skill, gain]) => {
        gameState.skills[skill] += gain;
    });

    alert(`You completed the task: ${task.name}. You earned $${task.reward} and improved your skills!`);
    updateGameArea();
}

function study() {
    if (currentCourse) {
        document.getElementById('game-area').innerHTML = `
            <h2>Studying ${currentCourse}</h2>
            <p>Days left: ${studyDaysLeft}</p>
            <button onclick="continueStudying()">Continue Studying</button>
            <button onclick="updateGameArea()">Quit Studying</button>
        `;
    } else {
        let courseListHTML = Object.entries(courses).map(([courseName, courseInfo]) => 
            `<button onclick="startCourse('${courseName}')">${courseName} - Cost: $${courseInfo.cost}, Duration: ${courseInfo.duration} days</button>`
        ).join('');

        document.getElementById('game-area').innerHTML = `
            <h2>Available Courses</h2>
            <p>Your money: $${gameState.money.toFixed(2)}</p>
            ${courseListHTML}
            <button onclick="updateGameArea()">Go Back</button>
        `;
    }
}

function startCourse(courseName) {
    if (gameState.money >= courses[courseName].cost) {
        gameState.money -= courses[courseName].cost;
        currentCourse = courseName;
        studyDaysLeft = courses[courseName].duration;
        alert(`You've enrolled in ${courseName}. Your studies will take ${studyDaysLeft} days.`);
        study();
    } else {
        alert("You don't have enough money for this course.");
    }
}

function continueStudying() {
    studyDaysLeft--;
    gameState.day++;

    if (studyDaysLeft === 0) {
        // Course completed
        Object.entries(courses[currentCourse].skillGain).forEach(([skill, gain]) => {
            gameState.skills[skill] += gain;
        });
        alert(`Congratulations! You've completed the ${currentCourse} course and improved your skills!`);
        currentCourse = null;
        updateGameArea();
    } else {
        study();
    }
}

window.onload = initGame;
