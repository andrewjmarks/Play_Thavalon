import { assignCharacters } from "./RollGame.js";

const SUPABASE_URL = "https://gqtuupyqhgqbismnlssl.supabase.co";
const SUPABASE_KEY = "sb_publishable_4tCAGKB8-k5rvfsFDeAlLA_iPWWbByI";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const gameCodeElement = document.getElementById("gameCode");
const playerButtons = document.getElementById("playerButtons");
const playerInformationElement = document.getElementById("playerInformation");
const rerollButton = document.getElementById("rerollButton");
const endGameButton = document.getElementById("endGameButton");

// Get the game code from the URL.
const urlParams = new URLSearchParams(window.location.search);

let gameCode = urlParams.get("code");

if (!gameCode) {
    gameCode = sessionStorage.getItem("thavalonGameCode");
}

gameCodeElement.textContent = gameCode || "No game code";

// Stop if there is no code.
if (!gameCode) {
    playerList.textContent = "No game code provided.";
} else {
    loadGame();
}

async function loadGame() {
    // Find the game using its short code.
    const { data: game, error: gameError } = await supabaseClient
        .from("games")
        .select("id, game_code, title")
        .eq("game_code", gameCode.toUpperCase())
        .single();

    if (gameError) {
        console.error("Error finding game:", gameError);
        playerList.textContent = "Game not found.";
        return;
    }

    // Get the players belonging to this game.
    const { data: players, error: playerError } = await supabaseClient
        .from("players")
        .select("id, name, character")
        .eq("game_id", game.id);

    console.log("Players returned from Supabase:", players);

    if (playerError) {
        console.error("Error loading players:", playerError);
        playerList.textContent = "Could not load players.";
        return;
    }


    console.log("Character assignments:", playerInformation);

players.forEach((player) => {
    const button = document.createElement("button");

    button.textContent = player.name;
    button.className = "player-name-button";

    button.addEventListener("click", () => {
        console.log("Clicked player:", player.name);
        console.log("Saved information:", player.character);

        playerInformationElement.textContent = player.character;
    });

    playerButtons.appendChild(button);
});

  rerollButton.addEventListener("click", async () => {
    const confirmReroll = confirm(
        "Are you sure you want to re-roll the characters?"
    );

    if (!confirmReroll) {
        return;
    }

    const playerNames = players.map((player) => player.name);

    const assignments = assignCharacters(playerNames);

    for (const assignment of assignments) {
        const player = players.find(
            (player) => player.name === assignment.name
        );

        const { error } = await supabaseClient
            .from("players")
            .update({
                character: assignment.playerEntry
            })
            .eq("id", player.id);

        if (error) {
            console.error("Error updating player:", error);
            alert(`Could not re-roll the game:\n${error.message}`);
            return;
        }
    }

    alert("The game has been re-rolled.");

    location.reload();
});

    endGameButton.addEventListener("click", async () => {
    const confirmEnd = confirm(
        "Are you sure you want to end this game? This cannot be undone."
    );

    if (!confirmEnd) {
        return;
    }

    // Delete the players first.
    const { error: playerError } = await supabaseClient
        .from("players")
        .delete()
        .eq("game_id", game.id);

    if (playerError) {
        console.error("Error deleting players:", playerError);
        alert(`Could not end the game:\n${playerError.message}`);
        return;
    }

    // Then delete the game itself.
    const { error: gameError } = await supabaseClient
        .from("games")
        .delete()
        .eq("id", game.id);

    if (gameError) {
        console.error("Error deleting game:", gameError);
        alert(`Players were deleted, but the game could not be deleted:\n${gameError.message}`);
        return;
    }

    // Return to the game creation page.
    window.location.href = "index.html";
});
}
