//======================================================================================\\
//==========================================SET UP========================================\\
//==========================================================================================\\

// You need a rollable table named "RandomEncountersMain"
// That tables needs these table items:
//      Combat
//      Social
//      Challenge
// Their weights don't matter but you can remove social or challenge if that's not your king of game

// For each table item on RandomEncountersMain you need a corresponding table with that name
// Their table entries should correspond to the encounter type. Their weights do matter.

// For example, my Social table has these table items:
//      Prelate Missionaries
//      Bound Demon
//      Spirit
//      Refugee Traders
//      Magic Creature (non-hostile)
//      Hermit
//      Hedge Witch/Wizard
//      Rival Adventuring Party
//      Roleplaying Situation
//      Confrontation Creature
//      Faction Looking to Parley

//======================================FURTHER CUSTOMIZATION======================================\\

// You'll notice there's a lot of extra code: that's because this script is highly customized to my campaign
// but here's how you'd customize it for you

//LINKS
// For certain encounters, I have links to exterior sites (mostly my game's bestiary)
// If you want to add your own (or get rid of mine), use this template, adding it below line 136

//         case "{TABLE ITEM}":
//              linkString = "{LINK}";
//          break;

// You'll also notice that you can completely change the string that shows up: 
// I use it primarily for Factions but there's not reason you can't use it for other stuff.
// Here's the template for that:

//         case "{TABLE ITEM}":
//              return "{WHATEVER YOU WANT}";

//HINTS
// For certain encounters, the table item itself is vague so you can add a hint about possible ways it can manifest.
// So, for instance:

//      case "Roleplaying Situation":
//          return "Something shows up where it shouldn't. Inner conflict, inner-party conflict, reliving an old memory, a bad omen";

// Gives me ideas for what "Roleplaying Situations" mean.

// To add your own (or remove mine), you can use the following template, adding it below line 186

//      case "{TABLE ITEM}":
//          return "{HINT(S)}";

//FACTIONS
// I like Factions so I included them in my random encounters
// If you also want to include them, add these table items (table in brackets)
//      Faction Looking For Fight [Combat]
//      Faction Looking to Parley [Social]
//      Signs of Another Faction [Challenge]
//      Faction Trying to Escape [Challenge]

// You'll also need to swap out your Factions for mine. You'll find the array of Factions on line 133 and line 185
// Just replace each entry with your own Factions. If you want a Faction to be more common, add it multiple times.

//==============================================================================\\
//=====================================USING======================================\\
//==================================================================================\\

// Once that's all set up, all you need to do is type "!randomEncounter" into chat to get that day's weather.

on("ready", function () {
    on("chat:message", function (msg) {
        if (msg.type == "api" && msg.content.indexOf("!randomEncounter") == 0) {

            var encounterType = findType();
            var encounter = getEncounter(encounterType);
            var transformedEncounter = transformEncounter(encounter);
            var hint = addHint(encounter);

            var chatString = `/w gm ${encounterType}: ${transformedEncounter}`;
            if (hint) {
                chatString += `<br/>*hint: ${hint}*`;
            }
            sendChat("Random Encounter", chatString);
        }
    })
})

function findType() {
    var encounterTypes = findObjs({
        type: "rollabletable",
        name: "RandomEncounterMain"
    });
    var encounterTypes = findObjs({
        type: 'tableitem',
        rollabletableid: encounterTypes[0].get("id")
    });

    return encounterTypes[Math.floor(Math.random() * encounterTypes.length)].get("name");
}

function getEncounter(type) {
    var encountersWithWeights = [];
    var encounterTable = findObjs({
        type: "rollabletable",
        name: type
    });
    var encounterTableItems = findObjs({
        type: 'tableitem',
        rollabletableid: encounterTable[0].get("id")
    });

    encounterTableItems.forEach(function (element, index, list) {
        var i,
            weight = parseInt(element.get('weight'));

        for (i = 0; i < weight; i++) {
            encountersWithWeights.push(element.get('name'));
        }
    });
    return encountersWithWeights[Math.floor(Math.random() * encountersWithWeights.length)];
}

function transformEncounter(encounter) {
    var linkString = null;
    let factions = ['Refugees', 'Outriders', 'Gaerish Raiders', "Prelate's Missionaries"];

    switch (encounter) {
        case "Bound Demon":
            linkString = "https://bestiary.dragon-slayer.net/search;types=1;goDirectlyTo=true";
            break;
        case "Spirit":
            linkString = "https://bestiary.dragon-slayer.net/search;types=3;goDirectlyTo=true";
            break;
        case "Weird Creature":
            linkString = "https://bestiary.dragon-slayer.net/search;types=6;subsystem=2;goDirectlyTo=true";
            break;
        case "Hedge Witch/Wizard":
            linkString = "https://bestiary.dragon-slayer.net/beast/271/gm";
            break;
        case "Flora":
            linkString = "https://bestiary.dragon-slayer.net/search;types=11;goDirectlyTo=true";
            break;
        case "Living Spell":
            linkString = "https://bestiary.dragon-slayer.net/beast/124/gm";
            break;
        case "Challenge Creature":
            linkString = "https://bestiary.dragon-slayer.net/search;subsystem=3;environ=2;goDirectlyTo=true";
            break;
        case "Confrontation Creature":
            linkString = "https://bestiary.dragon-slayer.net/search;subsystem=2;environ=2;goDirectlyTo=true";
            break;
        case "Combat Creature":
            linkString = "https://bestiary.dragon-slayer.net/search;subsystem=1;environ=2;goDirectlyTo=true";
            break;
        case "Faction Looking For Fight":
            return `${factions[Math.floor(Math.random() * factions.length)]} looking for a fight`;
        case "Faction Looking to Parley":
            return `${factions[Math.floor(Math.random() * factions.length)]} looking to parley`;
        case "Signs of Another Faction":
            return `Signs of ${factions[Math.floor(Math.random() * factions.length)]} are nearby`;
        case "Faction Trying to Escape":
            return `${factions[Math.floor(Math.random() * factions.length)]} wanting to escape`;
        default:
            linkString = null;
            break;
    }

    if (linkString) {
        return `**[${encounter}](${linkString})**`;
    } else {
        return encounter;
    }
}

function addHint(encounter) {
    let factions = ['Refugees', 'Outriders', 'Gaerish Raiders', "Prelate's Missionaries"];
    switch (encounter) {
        case "Rival Adventuring Party":
            return "May include Bound Spirits";
        case "Roleplaying Situation":
            return "Something shows up where it shouldn't. Inner conflict, inner-party conflict, reliving an old memory, a bad omen";
        case "Environmental":
            return "Shattered tower, sinkhole, river, cliff, getting lost";
        case "Active Hazard":
            return "Fires, soulstorm, trap, snare, flood, Living Spell";
        case "Complication":
            return "Broken equipment, lost, spoiled food, no shelter";
        case "Red Herring":
            return "False ambush, abandoned lair/campsight, someone trying to seem more tough than they are";
        case "Monster Lair When Monster Isn't Home":
            return `[Click Here For Random Monster](https://bestiary.dragon-slayer.net/search;environ=2;goDirectlyTo=true)`;
        case "Caught Between Two Factions":
            let factionOne = factions[Math.floor(Math.random() * factions.length)];
            let factionTwo = factions[Math.floor(Math.random() * factions.length)];
            return `${factionOne} and ${factionTwo}`;
        case "Refugees wanting to escape":
            return "Economic refugees, escaped slaves, reformed cultist looking for safety, being chased by monster/another faction, hunters wounded by monster";
        case "Outriders wanting to escape":
            return "Returning from raids with slaves/food/equipment, general raiding party";
        case "Gaerish Raiders wanting to escape":
            return "Returning from raids with slaves/food/equipment, general raiding party";
        case "Prelate's Missionaries wanting to escape":
            return "Returning with slaves/food/equipment/captured former cultists/previous artifact, desecrating holy site";
        default:
            return null;
    }
}