import { assignCharacters } from "./RollGame.js";

const SUPABASE_URL = "https://gqtuupyqhgqbismnlssl.supabase.co";
const SUPABASE_KEY = "sb_publishable_4tCAGKB8-k5rvfsFDeAlLA_iPWWbByI";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const firstWords = [
    "Arthurs",
    "Guineveres",
    "Merlins",
    "Morganas",
    "Mordreds",
    "Lancelots",
    "Gawains",
    "Gareths",
    "Kays",
    "Percivals",
    "Tristans",
    "Iseults",
    "Nimues",
    "Uthers",
    "Igraines",
    "Elaines",
    "Bediveres",
    "Galahads",
    "Bors",
    "Agravaines",
    "Camelots",
    "Avalons",
    "Tintagels",
    "Camlanns"
];

const secondWords = [
    "Sword",
    "Crown",
    "RoundTable",
    "Scabbard",
    "Shield",
    "Spear",
    "Chalice",
    "Grail",
    "Stone",
    "Tower",
    "Castle",
    "Throne",
    "Banner",
    "Cloak",
    "Ring",
    "Mirror",
    "Book",
    "Bell",
    "Rose",
    "Raven",
    "Dragon",
    "Oak",
    "Forest",
    "Lake"
];

function generateGameCode() {
    const first =
        firstWords[Math.floor(Math.random() * firstWords.length)];

    const second =
        secondWords[Math.floor(Math.random() * secondWords.length)];

    return `${first}-${second}`.toUpperCase();
}

const playerInput = document.getElementById("playerInput");
const addButton = document.getElementById("addButton");
const playerList = document.getElementById("playerList");
const playerCount = document.getElementById("playerCount");
const startButton = document.getElementById("startButton");
const gameCreated = document.getElementById("gameCreated");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");
const allowedPlayerCount = [5,7,8,10];
const openGames = document.getElementById("openGames");

let players = [];

function addPlayer() {
    const name = playerInput.value.trim();

    if (name === "") {
        return;
    }

    players.push(name);

    playerInput.value = "";

    renderPlayers();

    // Keep the input focused on mobile.
    playerInput.focus();
}

function removePlayer(index) {
    players.splice(index, 1);

    renderPlayers();

    // Keep the input ready for another player.
    playerInput.focus();
}

function renderPlayers() {
    playerList.innerHTML = "";

    players.forEach((player, index) => {

        const playerElement = document.createElement("div");
        playerElement.className = "player";

        const nameElement = document.createElement("span");
        nameElement.textContent = player;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            removePlayer(index);
        });

        playerElement.appendChild(nameElement);
        playerElement.appendChild(removeButton);

        playerList.appendChild(playerElement);
    });

    playerCount.textContent =
        players.length === 1
            ? "1 player"
            : `${players.length} players`;
}

addButton.addEventListener("click", addPlayer);

playerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addPlayer();
    }
});

startButton.addEventListener("click", () => {
    console.log("Players:", players);
});

startButton.addEventListener("click", async () => {
    if (!allowedPlayerCount.includes(players.length)) {
        alert("Incorrect player count. Must have 5, 7, 8, or 10 players.");
        return;
    }
    // if (players.length !== 0) {
    //     alert("Add at least one player.");
    //     return;
    // }

    // Create a unique ID for this game.
    const gameId = crypto.randomUUID();
    
    // Generate the short game code.
    const gameCode = generateGameCode();

    // Create the game.
    const { error: gameError } = await supabaseClient
        .from("games")
        .insert({
            id: gameId,
            title: "Thavalon Game",
            game_code: gameCode
        });

    if (gameError) {
        console.error("Error creating game:", gameError);
        alert(`Could not create the game:\n${gameError.message}`);
        return;
    }

    // Create a player record for each player.
    const playerNames = players.map((name) => name);

const assignments = assignCharacters(playerNames);

const playerRows = assignments.map((player) => ({
    game_id: gameId,
    name: player.name,
    character: player.playerEntry
}));

    const { error: playerError } = await supabaseClient
        .from("players")
        .insert(playerRows);

    if (playerError) {
        console.error("Error creating players:", playerError);
        alert(`Game created, but could not save the players:\n${playerError.message}`);
        return;
    }

    console.log("Game created:", gameId);
    console.log("Game code:", gameCode);
    console.log("Players created:", playerRows);
    
    window.location.href = `${gameCode}`;
});

async function loadOpenGames() {
    const { data: games, error } = await supabaseClient
        .from("games")
        .select("id, game_code, created_at")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error loading games:", error);
        openGames.innerHTML = "<p>Could not load open games.</p>";
        return;
    }

    openGames.innerHTML = "";

    if (games.length === 0) {
        openGames.innerHTML = "<p>No open games.</p>";
        return;
    }

    games.forEach((game) => {
        const button = document.createElement("button");

        button.textContent = game.game_code;
        button.className = "open-game-button";

        button.addEventListener("click", () => {
            window.location.href =
                `${encodeURIComponent(game.game_code)}`;
        });

        openGames.appendChild(button);
    });
}


const characterGuide = {
    Merlin: {
        alignment: "Good",
        playerCount: "5+ players",
        description: "You learn all players who are evil (except for Mordred), but Lancelot may also appear in your information."
    },
    Percival: {
        alignment: "Good",
        playerCount: "5+ players",
        description: "You learn which players are Merlin or Morgana, but you cannot tell which one is which."
    },
    Lancelot: {
        alignment: "Good",
        playerCount: "5+ players",
        description: "You may play a reversal card."
    },
    Iseult: {
        alignment: "Good",
        playerCount: "5+ players",
        description: "You learn who your lover Tristan is."
    },
    Tristan: {
        alignment: "Good",
        playerCount: "5+ players",
        description: "You learn who your lover Iseult is."
    },
    Guinevere: {
        alignment: "Good",
        playerCount: "5+ players",
        description: "You receive two statements about which players see other players. One statement is true and the other is false."
    },
    Titania: {
        alignment: "Good",
        playerCount: "7+ players",
        description: "You alter one part of an evil player's information. If Oberon is in the game, you learn that he is present."
    },
    Arthur: {
        alignment: "Good",
        playerCount: "7+ players",
        description: "You learn which good characters are in play. Your information cannot be altered by Oberon."
    },
    Mordred: {
        alignment: "Evil",
        playerCount: "5+ players",
        description: "You learn your fellow evil teammates. You cannot be seen by Merlin"
    },
    Morgana: {
        alignment: "Evil",
        playerCount: "5+ players",
        description: "You learn your fellow evil teammates. Percival may mistake you for Merlin."
    },
    Maelegant: {
        alignment: "Evil",
        playerCount: "5+ players",
        description: "You learn your fellow evil teammates. You may play a reversal card."
    },
    Oberon: {
        alignment: "Evil",
        playerCount: "5+ players",
        description: "You learn your fellow evil teammates. You also alter one part of a good player's information."
    },
    Agravaine: {
        alignment: "Evil",
        playerCount: "8+ players",
        description: "You learn your fellow evil teammates. You must play failure cards. If you are on a successful mission, you may reveal yourself to fail the mission instead."
    },
    Colgrevance: {
        alignment: "Evil",
        playerCount: "10 players",
        description: "You learn your fellow evil teammates as well as their exact roles."
    }
};

const howToPlayButton = document.getElementById("howToPlayButton");
const howToPlayOverlay = document.getElementById("howToPlayOverlay");
const closeHowToPlay = document.getElementById("closeHowToPlay");
const characterGuideButtons = document.getElementById("characterGuideButtons");
const characterGuideDescription = document.getElementById("characterGuideDescription");

// Create a button for every character.
Object.entries(characterGuide).forEach(([name, info]) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "character-guide-button";
    button.textContent = name;

    button.addEventListener("click", () => {
        characterGuideDescription.replaceChildren();

        const title = document.createElement("h3");
        title.textContent = name;

const alignment = document.createElement("p");
alignment.className = "character-guide-alignment";
alignment.textContent = info.alignment;

const playerCounts = document.createElement("p");
playerCounts.className = "character-guide-player-counts";
playerCounts.textContent = info.playerCount;

const description = document.createElement("p");
description.textContent = info.description;

characterGuideDescription.append(
    title,
    alignment,
    playerCounts,
    description
);

        document.querySelectorAll(".character-guide-button")
            .forEach(item => item.classList.remove("selected"));

        button.classList.add("selected");
    });

    characterGuideButtons.appendChild(button);
});

function openHowToPlay() {
    howToPlayOverlay.hidden = false;
}

function closeHowToPlayOverlay() {
    howToPlayOverlay.hidden = true;
}

howToPlayButton.addEventListener("click", openHowToPlay);
closeHowToPlay.addEventListener("click", closeHowToPlayOverlay);

// Close when clicking the darkened area outside the panel.
howToPlayOverlay.addEventListener("click", (event) => {
    if (event.target === howToPlayOverlay) {
        closeHowToPlayOverlay();
    }
});

// Close with Escape.
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !howToPlayOverlay.hidden) {
        closeHowToPlayOverlay();
    }
});



loadOpenGames();
