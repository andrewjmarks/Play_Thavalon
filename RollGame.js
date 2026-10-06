// Filename: public/RollGame.js

// Code written in public files is shared by your site's
// Backend, page code, and site code environments.

// Use public files to hold utility functions that can
// be called from multiple locations in your site's code.
// export function add(nameArray) {
// 	return param1 + param2;
// }

// function assignCharacters(names, characters) {
//     const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);

//     return names.map((name, i) => ({
//         name: name,
//         character: shuffledCharacters[i]
//     }));
// }
const playerRatio = [
    {playerNum: 5, goodNum: 3, evilNum: 2},
    {playerNum: 7, goodNum: 4, evilNum: 3},
    {playerNum: 8, goodNum: 5, evilNum: 3},
    {playerNum: 10, goodNum: 6, evilNum: 4}
]

const characters = [
    {name: "Merlin", allignment: "good", playerNumber: 5, viewedPlayers: ["Morgana", "Maelegant", "Oberon", "Agravaine", "Colgrevance", "Lancelot"], viewedRoles: []},
    {name: "Percival", allignment: "good", playerNumber: 5, viewedPlayers: ["Merlin", "Morgana"], viewedRoles: []},
    {name: "Lancelot", allignment: "good", playerNumber: 5, viewedPlayers: [], viewedRoles: []},
    {name: "Iseult", allignment: "good", playerNumber: 5, viewedPlayers: ["Tristan"], viewedRoles: []},
    {name: "Tristan", allignment: "good", playerNumber: 5, viewedPlayers: ["Iseult"], viewedRoles: [],},
    {name: "Guinevere", allignment: "good", playerNumber: 5, viewedPlayers: [], viewedRoles: []},
    {name: "Titania", allignment: "good", playerNumber: 7, viewedPlayers: [], viewedRoles: ["Oberon"]},
    {name: "Arthur", allignment: "good", playerNumber: 7, viewedPlayers: [], viewedRoles: ["Merlin", "Percival", "Lancelot", "Iseult", "Tristan", "Guinevere", "Titania"]},
    {name: "Mordred", allignment: "evil", playerNumber: 5, viewedPlayers: ["Morgana", "Maelegant", "Oberon", "Agravaine"], viewedRoles: []},
    {name: "Morgana", allignment: "evil", playerNumber: 5, viewedPlayers: ["Mordred", "Maelegant", "Oberon", "Agravaine"], viewedRoles: []},
    {name: "Maelegant", allignment: "evil", playerNumber: 5, viewedPlayers: ["Mordred", "Morgana", "Oberon", "Agravaine"], viewedRoles: []},
    {name: "Oberon", allignment: "evil", playerNumber: 5, viewedPlayers: ["Mordred", "Morgana", "Maelegant", "Agravaine"], viewedRoles: []},
    {name: "Agravaine", allignment: "evil", playerNumber: 8, viewedPlayers: ["Mordred", "Morgana", "Maelegant", "Oberon"], viewedRoles: []},
    {name: "Colgrevance", allignment: "evil", playerNumber: 10, viewedPlayers: [], viewedRoles: []}
];

let colgrevanceView = ["Mordred", "Morgana", "Maelegant", "Oberon", "Agravaine"]
let arthurView = ["Merlin", "Percival", "Lancelot", "Iseult", "Tristan", "Guinevere", "Titania"]


var seen = []

export function assignCharacters(players) {
    let availableChars = characters.filter(characters => characters.playerNumber <= players.length);

    let evilNum = playerRatio.find(playerRatio => playerRatio.playerNum == players.length)?.evilNum;

    let goodNum = playerRatio.find(playerRatio => playerRatio.playerNum == players.length)?.goodNum;

do {
    do {
        var goodCharacters = getRandomCharacters(availableChars, "good", goodNum)
    } while ((goodCharacters.some(goodCharacters => goodCharacters.name === "Tristan") && !goodCharacters.some(goodCharacters => goodCharacters.name === "Iseult"))||(!goodCharacters.some(goodCharacters => goodCharacters.name === "Tristan") && goodCharacters.some(goodCharacters => goodCharacters.name === "Iseult")));
    var evilCharacters = getRandomCharacters(availableChars, "evil", evilNum)
    var inplaychars = [...goodCharacters, ...evilCharacters]
} while (inplaychars.some(inplaychars => inplaychars.name === "Percival") && !inplaychars.some(inplaychars => inplaychars.name === "Merlin") && !inplaychars.some(inplaychars => inplaychars.name === "Morgana"))

    let shuffled = [...inplaychars].sort(() => 0.5 - Math.random());
    shuffled = shuffled.map(shuffled => shuffled.name)
    const assignments = {};

    players.forEach((name, i) => {
        assignments[name] = shuffled[i % shuffled.length];
    });

    console.log(assignments)
    var playerInformation = []

    players.forEach((name, i) => {
      var playerEntry = createDescription(assignments,name)
      playerInformation = [
    ...playerInformation,
    {name, playerEntry}
]
    });
    
    return playerInformation;

}

function getRandomCharacters(array, allignment, count) {
    let availableChars = array.filter(array => array.allignment == allignment);
    let shuffled = [...availableChars].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function createDescription(assigned, player){
    let character = characters.find(characters => characters.name == assigned[player]);
    var seenCharacters = character.viewedPlayers

    let seenPlayers = Object.entries(assigned)
  .filter(([assigned, character]) => seenCharacters.includes(character))
  .map(([player]) => player);

    var baseDescription =  "You are " + assigned[player] + ". You are " + characters.find(characters => characters.name == assigned[player])?.allignment + ".\n"

 switch (assigned[player]) {
  case "Merlin":
    var statement = "evil (or Lancelot)."
    break;
  case "Percival":
    var statement = "Merlin or Morgana."
    break;
  case "Lancelot":
    var statement = "You may play a reversal card."
    break;
  case "Tristan":
  case "Iseult":
    var statement = "your beautiful lover."
    break;
  case "Guinevere":
    var statement = guinevereDescription(assigned);
    break;
  case "Arthur":
    var statement = "These good characters are in play:\n"
    Object.entries(assigned)
    .filter(([player, character]) => arthurView.includes(character))
    .forEach(([player, character]) => {
      statement = statement + character + ", "
    });
    break;
  case "Titania":
    var statement = "You have messed with an evil player's information."
    if (Object.values(assigned).includes("Oberon")) {
      statement = statement + "\nOberon is in the game."
    }
    break
  case "Mordred":
  case "Morgana":
    var statement = "your fellow evil team."
    break;
  case "Maelegant":
    var statement = "your fellow evil team.\nYou may play a reversal card."
    break;
  case "Oberon":
    var statement = "your fellow evil team.\nYou have messed with a good player's information"
    break;
  case "Agravaine": 
    var statement = "your fellow evil team.\nYou must play failure cards.\nIf you are on a successful mission, you may reveal yourself to fail the mission instead."
    break;
  case "Colgrevance":
    var statement = "You see "
    Object.entries(assigned)
    .filter(([player, character]) => colgrevanceView.includes(character))
    .forEach(([player, character]) => {
      statement = statement + player+ " as " + character + "\n"
    });
    break;
  default:
}
if (seenCharacters.length !== 0) {
    let seenPlayersText;

    if (seenPlayers.length === 1) {
        seenPlayersText = seenPlayers[0];
    } else if (seenPlayers.length === 2) {
        seenPlayersText = `${seenPlayers[0]} & ${seenPlayers[1]}`;
    } else {
        seenPlayersText =
            `${seenPlayers.slice(0, -1).join(", ")} & ${seenPlayers[seenPlayers.length - 1]}`;
    }

    var description =
        baseDescription +
        "You see " +
        seenPlayersText +
        " as " +
        statement;
} else {
    var description = baseDescription + statement;
}


//console.log(description)
return description
}

function guinevereDescription(assigned) {
    const guineverePlayer = Object.keys(assigned).find(
        player => assigned[player] === "Guinevere"
    );

    // All players except Guinevere
    const players = Object.keys(assigned).filter(
        player => player !== guineverePlayer
    );

    // Find all true "Player A sees Player B" relationships
    const trueStatements = [];

    players.forEach((playerA) => {
        const characterA = characters.find(
            character => character.name === assigned[playerA]
        );

        if (!characterA) {
            return;
        }

        characterA.viewedPlayers.forEach((seenCharacter) => {
            players.forEach((playerB) => {
                if (assigned[playerB] === seenCharacter) {
                    trueStatements.push(
                        `${playerA} sees ${playerB}`
                    );
                }
            });
        });
    });

    if (trueStatements.length === 0) {
        return "No information available.";
    }

    // Pick a true statement
    const trueStatement =
        trueStatements[Math.floor(Math.random() * trueStatements.length)];

    // Find a false statement
    let falseStatement;
    let falsePlayerA;
    let falsePlayerB;

    do {
        falsePlayerA =
            players[Math.floor(Math.random() * players.length)];

        falsePlayerB =
            players[Math.floor(Math.random() * players.length)];

        falseStatement =
            `${falsePlayerA} sees ${falsePlayerB}`;

    } while (
        falsePlayerA === falsePlayerB ||
        trueStatements.includes(falseStatement)
    );

    // Randomize which statement appears first
    if (Math.random() < 0.5) {
        return `Either ${trueStatement}, or ${falseStatement}.`;
    } else {
        return `Either ${falseStatement}, or ${trueStatement}.`;
    }
}

// const result = assignCharacters(names, characters);
// console.log(result);

// The following code demonstrates how to call the add
// function from your site's page code or site code.
/*
import {add} from 'public/RollGame.js'
$w.onReady(function () {
    let sum = add(6,7);
    console.log(sum);
});
*/

/*
wixData.query("Players")
  .eq("name", "Alice")
  .find()
  .then((results) => {

    let item = results.items[0];
    item.evilNum = 9;

    wixData.update("Players", item);

  });
*/
