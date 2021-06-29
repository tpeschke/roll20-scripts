//======================================================================================\\
//==========================================SET UP========================================\\
//==========================================================================================\\

// Create a character named "Room Template".
// Add this as a macro to it:

// !getHandout--@{selected|token_id}

// Name it "Get-Handout".

// Name it what you want but check "Show as Token Action".

// Create a token and change its "Represents Character" value to "Room Template".
// Set Bar 3's value to whatever you want to call your handout.

//==============================================================================\\
//=====================================USING======================================\\
//==================================================================================\\

// Once that's all set up, when you click on the token, you should see, in the upper righthand corner, a button 
// labelled "Get-Handout", clicking on it will deposite a direct link to that handout in chat, whispered to you.

// The first time you click it, it will create the handout for you. After that, it'll simply retrieve the link.
// You can use this with handouts that already exist by simply setting Bar 3's value to the name of the handout:
// If it detects one that already exists, it'll simply retrieve its link for you.

//======================================FURTHER CUSTOMIZATION======================================\\

// I choose to use bar 3's value because it's super easy to edit without having to edit the rest of the token.
// That means that if you have a special token set as default for the "Room Template" character, you can quickly 
// drag it onto the battlemap and edit the red circle's value to get it up and running.

// If you want to base it on the name (for whatever reason), you can change "bar3_value" on line 42 to "name".


on("ready", function () {
	on("chat:message", function (msg) {
		if (msg.type == "api" && msg.content.indexOf("!getHandout") == 0) {
			var args = msg.content.split("--");
			var tokenId = args[1].trim();
			var handoutName = getObj("graphic", tokenId).get("bar3_value");
			var handout = findObjs({
				type: "handout",
				name: handoutName
			});

			if (handout[0]) {
				handout = handout[0];
				sendChat("Handout Helper", `/w gm [${handout.get('name')}'s Handout Link](http://journal.roll20.net/handout/${handout.get('id')})`);
			} else {
				var newHandout = createObj("handout", { name: handoutName });
				sendChat("Handout Helper", `/w gm ${newHandout.get('name')} didn't exist before so one has been created for you. <br/>[${newHandout.get('name')}'s Handout Link](http://journal.roll20.net/handout/${newHandout.get('id')})`);
			}
		}
	})
})