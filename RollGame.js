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

    // Select one good player for Oberon and one evil player for Titania.
const misinformationTargets = {};

if (Object.values(assignments).includes("Oberon")) {
    const goodTargets = Object.entries(assignments)
        .filter(([player, role]) => {
            const character = characters.find(c => c.name === role);

            const hasInformation =
                character?.viewedPlayers.length > 0 ||
                role === "Guinevere";

            return character?.allignment === "good" && hasInformation;
        })
        .map(([player]) => player);

    if (goodTargets.length > 0) {
        const target =
            goodTargets[Math.floor(Math.random() * goodTargets.length)];

        misinformationTargets[target] = "Oberon";
    }
}

if (Object.values(assignments).includes("Titania")) {
    const evilTargets = Object.entries(assignments)
        .filter(([player, role]) => {
            const character = characters.find(c => c.name === role);

            const hasInformation =
                character?.viewedPlayers.length > 0 ||
                role === "Colgrevance";

            return character?.allignment === "evil" && hasInformation;
        })
        .map(([player]) => player);

    if (evilTargets.length > 0) {
        const target =
            evilTargets[Math.floor(Math.random() * evilTargets.length)];

        misinformationTargets[target] = "Titania";
    }
}

    
    var playerInformation = []

    players.forEach((name, i) => {
      var playerEntry = createDescription(assignments, name, misinformationTargets[name])
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

function createDescription(assigned, player, misinformationAbility){
    let character = characters.find(characters => characters.name == assigned[player]);
    var seenCharacters = character.viewedPlayers;

    let seenPlayers = Object.entries(assigned)
  .filter(([assigned, character]) => seenCharacters.includes(character))
  .map(([player]) => player);

    // Change one piece of the target's information.
if (misinformationAbility) {
    if (seenPlayers.length > 0) {
        // Replace one player they should see with someone they should not.
        const incorrectPlayers = Object.keys(assigned).filter(
            name =>
                name !== player &&
                !seenPlayers.includes(name)
        );

        if (incorrectPlayers.length > 0) {
            const index = Math.floor(
                Math.random() * seenPlayers.length
            );

            const incorrectPlayer = incorrectPlayers[
                Math.floor(Math.random() * incorrectPlayers.length)
            ];

            seenPlayers[index] = incorrectPlayer;
        }
    }
}

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
    var statement = guinevereDescription(assigned, misinformationAbility === "Oberon");
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
  case "Colgrevance": {
    var statement = "You see ";

    const seenEntries = Object.entries(assigned)
        .filter(([player, character]) =>
            colgrevanceView.includes(character)
        )
        .map(([player, character]) => ({
            player,
            character
        }));

    // Titania changes one role Colgrevance sees.
    if (misinformationAbility === "Titania" && seenEntries.length > 0) {
        const incorrectRoles = Object.values(assigned).filter(
            role => !colgrevanceView.includes(role)
        );

        if (incorrectRoles.length > 0) {
            const index = Math.floor(
                Math.random() * seenEntries.length
            );

            const incorrectRole =
                incorrectRoles[
                    Math.floor(Math.random() * incorrectRoles.length)
                ];

            seenEntries[index].character = incorrectRole;
        }
    }

    seenEntries.forEach(({ player, character }) => {
        statement += `${player} as ${character}\n`;
    });

    break;
}
  default:
}
if (seenCharacters.length !== 0) {
    let seenPlayersText;

    if (seenPlayers.length === 1) {
        seenPlayersText = seenPlayers[0];
    } else if (seenPlayers.length === 2) {
        seenPlayersText = `${seenPlayers[0]} and ${seenPlayers[1]}`;
    } else {
        seenPlayersText =
            `${seenPlayers.slice(0, -1).join(", ")}, and  ${seenPlayers[seenPlayers.length - 1]}`;
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

// Tell the targeted player whose ability altered their information.
if (misinformationAbility) {
    description +=
        `\nYour information was altered by ${misinformationAbility}.`;
}

//console.log(description)
return description
}

function guinevereDescription(assigned, misinformation = false) {
    const guineverePlayer = Object.keys(assigned).find(
        player => assigned[player] === "Guinevere"
    );

    const players = Object.keys(assigned).filter(
        player => player !== guineverePlayer
    );

    const trueStatements = [];
    const falseStatements = [];

    players.forEach((playerA) => {
        const characterA = characters.find(
            character => character.name === assigned[playerA]
        );

        if (!characterA) return;

        players.forEach((playerB) => {
            if (playerA === playerB) return;

            const statement = `${playerA} sees ${playerB}`;

            if (characterA.viewedPlayers.includes(assigned[playerB])) {
                trueStatements.push(statement);
            } else {
                falseStatements.push(statement);
            }
        });
    });

    if (trueStatements.length === 0 || falseStatements.length === 0) {
        return "No information available.";
    }

    // Start with one true statement and one false statement.
    const trueStatement =
        trueStatements[Math.floor(Math.random() * trueStatements.length)];

    const falseStatement =
        falseStatements[Math.floor(Math.random() * falseStatements.length)];

    let statements = [trueStatement, falseStatement];
        
// Oberon changes one name in one randomly selected statement.
if (misinformation) {
    const statementIndex = Math.floor(Math.random() * 2);
    const parts = statements[statementIndex].split(" sees ");
    const nameIndex = Math.floor(Math.random() * 2);

    const replacementCandidates = players.filter(name => {
        // Never use Guinevere's player name.
        if (name === guineverePlayer) return false;

        // Don't replace a name with itself.
        if (name === parts[nameIndex]) return false;

        // Prevent "Player A sees Player A".
        const proposedParts = [...parts];
        proposedParts[nameIndex] = name;

        return proposedParts[0] !== proposedParts[1];
    });

    if (replacementCandidates.length > 0) {
        const replacement =
            replacementCandidates[
                Math.floor(Math.random() * replacementCandidates.length)
            ];

        parts[nameIndex] = replacement;
        statements[statementIndex] = `${parts[0]} sees ${parts[1]}`;
    }
}

    // Randomize statement order.
    if (Math.random() < 0.5) {
        statements.reverse();
    }

    return `Either ${statements[0]}, or ${statements[1]}.`;
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
