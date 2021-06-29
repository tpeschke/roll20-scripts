//======================================================================================\\
//==========================================SET UP========================================\\
//==========================================================================================\\

// You need a rollable table named "Rumors"
// That each of that tables line items is going to be a rumor.

// There is no limit to the length so they can be fairly long.

//======================================Character Sheet Set Up======================================\\

// When set up correctly, this script with automatically add rumors to a player's handout that they can later reference.
// It will also keep track, not giving them duplicates and alerting you when you need to add more rumors.

// Each player will need a character sheet and a default token and that it's assigned to a player.

// And that's it.

//======================================Macro Set Up======================================\\

// Head to your "Collections" tab and add this macro:

// !gatherRumors --@{selected|character_id}

// I usually call it "Give Rumor" and check "In Bar" so I have it handy

//==============================================================================\\
//=====================================USING======================================\\
//==================================================================================\\

// Once that's all set up, whenever you want to give out a rumor, select a token that's linked to a character sheet and hit the macro.
// If there is no character sheet linked, it won't work

// What you should see is the rumor pop up as a whisper: it's also been whispered to the owner of that token.

// If they don't have a handout of rumors, one will be created for them called {TOKEN NAME}_Rumors.
// Be sure to give them ownership over it.

// They can actually edit the body of this document as they will: new rumors will just be added to the bottom of it and it won't effective
// which rumors they get.
// HOWEVER, they can't edit the name.

on("ready", function () {
	on("chat:message", function (msg) {
		if (msg.type == "api" && msg.content.indexOf("!gatherRumors") == 0) {
			var args = msg.content.split("--");
			var PC = args[1].trim();

			var pcSheet = getObj("character", PC);

			var rumor = getRumor(pcSheet);

			if (rumor === "") {
				sendChat("Rumors", `/w "${pcSheet.get("name")}" You know all the rumors. Ask your GM to add more.`);
				sendChat("Rumors", `/w gm This player knows all the rumors.`);
			} else {
				sendChat("Rumors", `/w "${pcSheet.get("name")}" ${rumor}`);
				sendChat("Rumors", `/w gm ${rumor}`);
			}
		}
	})
})

function getRumor(PC) {
	var rumorList = gatherRumors('Rumors');
	var rumor = pickBestRumor(PC, rumorList);
	return rumor;
}

function gatherRumors(rumorTableName) {
	var rumorTable = findObjs({
		type: "rollabletable",
		name: rumorTableName
	});

	if (rumorTable[0] === undefined) {
		rumorTable[0] = createObj("rollabletable", { name: rumorTableName });
	}

	var rumorList = findObjs({
		type: "tableitem",
		rollabletableid: rumorTable[0].get("id")
	});

	return rumorList.map(function (rumor) { return rumor.get("name"); })
}

function pickBestRumor(PC, appRumors) {
	currentlyKnownRumors = getKnownRumors(PC);
	var bestRumor = "";
	var bestRumors = appRumors.filter(function (rumor) { return !currentlyKnownRumors.includes(rumor) });

	if (bestRumors.length != 0) {
		bestRumor = bestRumors[Math.floor(Math.random() * bestRumors.length)]
	};
	addRumorToKnownRumors(PC, bestRumor);
	return bestRumor;
}

function getKnownRumors(PC) {
	const playerRumorTable = PC.get("name").replace(/ /g, "_") + "_Rumors";
	var pcRumorList = gatherRumors(playerRumorTable);
	if (pcRumorList === undefined) {
		pcRumorList = [];
	};
	return pcRumorList;
}

function addRumorToKnownRumors(PC, rumor) {
	if (rumor == "") {
		return;
	};
	const playerRumors = PC.get("name").replace(/ /g, "_") + "_Rumors";
	var rumorTable = findObjs({
		type: "rollabletable",
		name: playerRumors
	});

	if (rumorTable[0] === undefined) {
		rumorTable = createObj("rollabletable", { name: playerRumors });
	}
	else {
		rumorTable = rumorTable[0];
	};

	const newRumor = createObj("tableitem", { name: rumor, rollabletableid: rumorTable.get("id") });


	var playerRumorHandout = findObjs({ type: "handout", name: playerRumors })[0]
	if (playerRumorHandout === undefined) {
		playerRumorHandout = createObj("handout", { name: playerRumors });
		playerRumorHandout.set("notes", "<h2>Rumors Learned:</h2>")
	}

	var rumorList = playerRumorHandout.get("notes", function (notes) {
		notes += `<p>- ${rumor}</p>`
		setTimeout(() => playerRumorHandout.set("notes", notes), 0);
	});
}