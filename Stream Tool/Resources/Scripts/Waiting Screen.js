//animation stuff
const pMove = 20; //distance to move for most of the animations
const sMove = 40; //distance for the score assets

const fadeInTime = .3; //(seconds)
const fadeOutTime = .2;
let introDelay = .8; //all animations will get this delay when the html loads (use this so it times with your transition)

//to avoid the code constantly running the same method over and over
let p1CharacterPrev, p1SkinPrev, p1ScorePrev, p1ColorPrev, p1wlPrev;
let p2CharacterPrev, p2SkinPrev, p2ScorePrev, p2ColorPrev, p2wlPrev;
let bestOfPrev;

//max text sizes (used when resizing back)
const roundSize = '32px';
const casterSize = '24px';
const twitterSize = '20px';
const tournamentSize = '36px';

//variables for the twitter/twitch constant change
let socialInt1;
let socialInt2;
let twitter1, twitch1, twitter2, twitch2;
let socialSwitch = true; //true = twitter, false = twitch
const socialInterval = 12000;


let startup = true;


window.onload = init;

function init() {
	async function mainLoop() {
		const scInfo = await getInfo();
		getData(scInfo);
	}

	mainLoop();
	setInterval( () => { mainLoop(); }, 500); //update interval
}

async function getData(scInfo) {

	let round = scInfo['round'];
	let bestOf = scInfo['bestOf'];
  let tournamentName = scInfo['tournamentName'];

	let caster1 = scInfo['caster1Name'];
	twitter1 = scInfo['caster1Twitter'];
	twitch1 = scInfo['caster1Twitch'];
	let caster2 = scInfo['caster2Name'];
	twitter2 = scInfo['caster2Twitter'];
	twitch2 = scInfo['caster2Twitch'];


	//first, things that will happen only the first time the html loads
	if (startup) {


		//set the caster info
		updateSocialText("caster1N", caster1, casterSize, "caster1TextBox");
		updateSocialText("caster1Tr", twitter1, twitterSize, "caster1TwitterBox");
		updateSocialText("caster2N", caster2, casterSize, "caster2TextBox");
		updateSocialText("caster2Tr", twitter2, twitterSize, "caster2TwitterBox");


    //set the tournament text
		updateText("tournament", tournamentName, tournamentSize);




		//if a caster has no name, hide its icon
		if (caster1 == "") {
			document.getElementById('caster1TextBox').style.opacity = 0;
		}
		if (caster2 == "") {
			document.getElementById('caster2TextBox').style.opacity = 0;
		}
  

		startup = false; //next time we run this function, it will skip all we just did
  }
	//now things that will happen constantly
	else {

    //set the tournament text
		updateText("tournament", tournamentName, tournamentSize);
		


		//update caster 1 info
		if (document.getElementById('caster1N').textContent != caster1){
			fadeOut("#caster1TextBox", () => {
				updateSocialText("caster1N", caster1, casterSize, 'caster1TextBox');
				//if no caster name, dont fade in the caster icon
				if (caster1 != "") {
					fadeIn("#caster1TextBox", .2);
				}
			});
		}
		//caster 1's twitter
		if (document.getElementById('caster1Tr').textContent != twitter1){
			updateSocial(twitter1, "caster1Tr", "caster1TwitterBox", twitch1, "caster1TwitchBox");
		}

		//caster 2, same as above
		if (document.getElementById('caster2N').textContent != caster2){
			fadeOut("#caster2TextBox", () => {
				updateSocialText("caster2N", caster2, casterSize, 'caster2TextBox');
				if (caster2 != "") {
					fadeIn("#caster2TextBox", .2);
				}
			});
		}
		if (document.getElementById('caster2Tr').textContent != twitter2){
			updateSocial(twitter2, "caster2Tr", "caster2TwitterBox", twitch2, "caster2TwitchBox");
		}
	}
}


//did an image fail to load? this will be used to show nothing
function showNothing(itemEL) {
	itemEL.setAttribute('src', 'Resources/Literally Nothing.png');
}


//score change, pretty simple
function updateScore(pNum, pScore, pColor) {
	const score1EL = document.getElementById('win1P'+pNum);
	const score2EL = document.getElementById('win2P'+pNum);
	const score3EL = document.getElementById('win3P'+pNum);


	if (pScore >= 1) {
		scoreChange(score1EL, getHexColor(pColor));
	} else if (score1EL.style.fill != "rgb(65, 65, 65)") {
		scoreChange(score1EL, "#414141");
	}
	if (pScore >= 2) {
		scoreChange(score2EL, getHexColor(pColor));
	} else if (score2EL.style.fill != "rgb(65, 65, 65)") {
		scoreChange(score2EL, "#414141");
	}
	if (pScore == 3) {
		scoreChange(score3EL, getHexColor(pColor));
	} else if (score3EL.style.fill != "rgb(65, 65, 65)") {
		scoreChange(score3EL, "#414141");
	}
}
function scoreChange(scoreEL, color) {
	gsap.to(scoreEL, {fill: "#ffffff", duration: fadeInTime})
	gsap.to(scoreEL, {delay: fadeInTime, fill: color, duration: fadeInTime})
}

//updates the player's text and portrait background colors
function updateColor(colorID, textID, pColor) {
	const colorEL = document.getElementById(colorID);
	const textEL = document.getElementById(textID);

	gsap.to(colorEL, {backgroundColor: getHexColor(pColor), duration: fadeInTime});
	gsap.to(textEL, {color: getHexColor(pColor), duration: fadeInTime});
}

function updateBorder(bestOf) {
	document.getElementById('borderP1').setAttribute('src', 'Resources/Overlay/Border ' + bestOf + '.png');
	document.getElementById('borderP2').setAttribute('src', 'Resources/Overlay/Border ' + bestOf + '.png');
	bestOfPrev = bestOf
}

//team logo change
function updateTeamLogo(logoID, pTeam) {
	//search for an image with the team name
	const logoEL = document.getElementById(logoID);
	logoEL.setAttribute('src', 'Resources/TeamLogos/' + pTeam + '.png');
	//no image? show nothing
	if (startup) {logoEL.addEventListener("error", () => {showNothing(logoEL)})}
}

//the logic behind the twitter/twitch constant change
function socialChange1(twitterWrapperID, twitchWrapperID) {

	const twitterWrapperEL = document.getElementById(twitterWrapperID);
	const twitchWrapperEL = document.getElementById(twitchWrapperID);

	if (startup) {

		//if first time, set initial opacities so we can read them later
		if (!twitter1 && !twitch1) { //if all blank
			twitterWrapperEL.style.opacity = 0;
			twitchWrapperEL.style.opacity = 0;
		} else if (!twitter1 && !!twitch1) { //if twitter blank
			twitterWrapperEL.style.opacity = 0;
			twitchWrapperEL.style.opacity = 1;
		} else {
			twitterWrapperEL.style.opacity = 1;
			twitchWrapperEL.style.opacity = 0;
		}
		

	} else if (!!twitter1 && !!twitch1) {

		if (socialSwitch) {
			fadeOut(twitterWrapperEL, () => {
				fadeIn(twitchWrapperEL, 0);
			});
		} else {
			fadeOut(twitchWrapperEL, () => {
				fadeIn(twitterWrapperEL, 0);
			});
		}

	}
}
//i didnt know how to make it a single function im sorry ;_;
function socialChange2(twitterWrapperID, twitchWrapperID) {

	const twitterWrapperEL = document.getElementById(twitterWrapperID);
	const twitchWrapperEL = document.getElementById(twitchWrapperID);

	if (startup) {

		if (!twitter2 && !twitch2) {
			twitterWrapperEL.style.opacity = 0;
			twitchWrapperEL.style.opacity = 0;
		} else if (!twitter2 && !!twitch2) {
			twitterWrapperEL.style.opacity = 0;
			twitchWrapperEL.style.opacity = 1;
		} else {
			twitterWrapperEL.style.opacity = 1;
			twitchWrapperEL.style.opacity = 0;
		}

	} else if (!!twitter2 && !!twitch2) {

		if (socialSwitch) {
			fadeOut(twitterWrapperEL, () => {
				fadeIn(twitchWrapperEL, 0);
			});
		} else {
			fadeOut(twitchWrapperEL, () => {
				fadeIn(twitterWrapperEL, 0);
			});
		}

	}
}
//function to decide when to change to what
function updateSocial(mainSocial, mainText, mainBox, otherSocial, otherBox) {
	//check if this is for twitch or twitter
	let localSwitch = socialSwitch;
	if (mainText == "caster1Th" || mainText == "caster2Th") {
		localSwitch = !localSwitch;
	}
	//check if this is their turn so we fade out the other one
	if (localSwitch) {
		fadeOut("#"+otherBox, () => {})
	}

	//now do the classics
	fadeOut("#"+mainBox, () => {
		updateSocialText(mainText, mainSocial, twitterSize, mainBox);
		//check if its twitter's turn to show up
		if (otherSocial == "" && mainSocial != "") {
			fadeIn("#"+mainBox, .2);
		} else if (localSwitch && mainSocial != "") {
			fadeIn("#"+mainBox, .2);
		} else if (otherSocial != "") {
			fadeIn("#"+otherBox, .2);
		}
	});
}

//player text change
function updatePlayerName(wrapperID, nameID, teamID, pName, pTeam) {
	const nameEL = document.getElementById(nameID);
	nameEL.style.fontSize = '30px'; //set original text size
	nameEL.textContent = pName; //change the actual text
	const teamEL = document.getElementById(teamID);
	teamEL.style.fontSize = '20px';
	teamEL.textContent = pTeam;
	resizeText(document.getElementById(wrapperID)); //resize if it overflows
}

//round change
function updateRound(round) {
	const roundEL = document.getElementById('round');
	roundEL.style.fontSize = roundSize; //set original text size
	roundEL.textContent = round; //change the actual text
	resizeText(roundEL); //resize it if it overflows
}

//generic text changer
function updateText(textID, textToType, maxSize) {
	const textEL = document.getElementById(textID);
	textEL.style.fontSize = maxSize; //set original text size
	textEL.textContent = textToType; //change the actual text
	resizeText(textEL); //resize it if it overflows
}
//social text changer
function updateSocialText(textID, textToType, maxSize, wrapper) {
	const textEL = document.getElementById(textID);
	textEL.style.fontSize = maxSize; //set original text size
	textEL.textContent = textToType; //change the actual text
	const wrapperEL = document.getElementById(wrapper)
	resizeText(wrapperEL); //resize it if it overflows
}


//fade out
function fadeOut(itemID, funct) {
	gsap.to(itemID, {opacity: 0, duration: fadeOutTime, onComplete: funct});
}

//fade out but with movement
function fadeOutMove(itemID, move, funct) {
	gsap.to(itemID, {x: -move, opacity: 0, ease: "power1.in", duration: fadeOutTime, onComplete: funct});
}

//fade out but for character/saga icon
function fadeOutChara (itemID, sagaID, move, funct) {
	gsap.to(itemID, {x: -move, opacity: 0, ease: "power1.in", duration: fadeOutTime, onComplete: funct});
	gsap.to(sagaID, {opacity: 0, ease: "power1.in", duration: fadeOutTime});
}

//fade in
function fadeIn(itemID) {
	gsap.to(itemID, {delay: .2, opacity: 1, duration: fadeInTime});
}

//fade in but with movement
function fadeInMove(itemID) {
	gsap.to(itemID, {delay: .3, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
}

//fade in but for the character/saga icon
function fadeInChara(itemID, sagaID, move = pMove) {
	gsap.to(itemID, {delay: .2, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	gsap.fromTo(sagaID,
		{x: -move},
		{delay: .3, x: 0, opacity: .3, ease: "power1.in", duration: fadeOutTime});
}

//fade in for the characters when first loading
function initCharaFade(charaID, sagaID, move = pMove) {
	gsap.fromTo(charaID,
		{x: pMove},
		{delay: introDelay, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	gsap.fromTo(sagaID,
		{x: move},
		{delay: introDelay+.2, x: 0, opacity: .3, ease: "power2.out", duration: fadeInTime});
}

//played when loading the html
function moveScoresIntro(pNum, bestOf, pWL, move) {
	const score1EL = document.getElementById('win1P'+pNum);
	const score2EL = document.getElementById('win2P'+pNum);
	const score3EL = document.getElementById('win3P'+pNum);
	const wlEL = document.getElementById('wlP'+pNum);

	gsap.fromTo(score1EL, 
		{x:-move},
		{delay: introDelay+.2, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	gsap.fromTo(score2EL, 
		{x:-move},
		{delay: introDelay+.4, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	if (bestOf == "Bo5") {
		gsap.fromTo(score3EL, 
			{x:-move},
			{delay: introDelay+.6, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	}
	if (pWL == "W" || pWL == "L") {
		gsap.fromTo(wlEL, 
			{x:-move},
			{delay: introDelay+.8, x: 0, opacity: 1, ease: "power2.out", duration: fadeInTime});
	}

}


//check if winning or losing in a GF, then change image
function updateWL(pWL, playerNum) {
	const pWLEL = document.getElementById('wlP' + playerNum + 'Text');
	if (pWL == "W") {
		pWLEL.setAttribute('src', 'Resources/Overlay/[W].png')
	} else if (pWL == "L") {
		pWLEL.setAttribute('src', 'Resources/Overlay/[L].png')
	}
	if (startup) {pWLEL.addEventListener("error", () => {
		showNothing(pWLEL)
	})}
}

//text resize, keeps making the text smaller until it fits
function resizeText(textEL) {
	const childrens = textEL.children;
	while (textEL.scrollWidth > textEL.offsetWidth) {
		if (childrens.length > 0) { //for team+player texts
			Array.from(childrens).forEach(function (child) {
				child.style.fontSize = getFontSize(child);
			});
		} else {
			textEL.style.fontSize = getFontSize(textEL);
		}
	}
}
//returns a smaller fontSize for the given element
function getFontSize(textElement) {
	return (parseFloat(textElement.style.fontSize.slice(0, -2)) * .90) + 'px';
}

//color codes here!
function getHexColor(color) {
	switch (color) {
		case "Red":
			return "#e54c4c";
		case "Blue":
			return "#4b4ce5";
		case "Yellow":
			return "#ffcb00";
		case "Green":
			return "#00b200";
		case "CPU":
			return "#808080";
		default:
			return "#808080";
	}
}

//searches for the main json file
function getInfo() {
	return new Promise(function (resolve) {
		const oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.open("GET", 'Resources/Texts/ScoreboardInfo.json');
		oReq.send();

		//will trigger when file loads
		function reqListener () {
			resolve(JSON.parse(oReq.responseText))
		}
	})
	//i would gladly have used fetch, but OBS local files wont support that :(
}

//searches for a json file with character data
function getCharInfo(pCharacter) {
	return new Promise(function (resolve) {
		const oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.onerror = () => {resolve("notFound")}; //for obs local file browser sources
		oReq.open("GET", 'Resources/Texts/Character Info/' + pCharacter + '.json');
		oReq.send();

		function reqListener () {
			try {resolve(JSON.parse(oReq.responseText))}
			catch {resolve("notFound")} //for live servers
		}
	})
}

//character portrait and saga icon change
async function updateChar(pCharacter, pSkin, charID, sagaID) {
	const charEL = document.getElementById(charID);
	//change the image path depending on the character and skin
	charEL.setAttribute('src', 'Resources/Characters/Portraits/' + pCharacter + '/' + pSkin + '.png');
	//add a listener to show the random portrait if the image fails to load
	if (startup) {charEL.addEventListener("error", () => {
		if (charEL == document.getElementById("p1Character")) {
			charEL.setAttribute('src', 'Resources/Characters/Portraits/Random CPU.png');
		} else {
			charEL.setAttribute('src', 'Resources/Characters/Portraits/Random CPU 2.png');
		}
	})}

	//update the saga icon depending on the character
	const sagaEL = document.getElementById(sagaID);
	const charInfo = await getCharInfo(pCharacter);
	sagaEL.setAttribute('src', 'Resources/Characters/Saga Icons/' + charInfo.saga + '.png')
	//add a listener to show nothing if the image fails to load
	if (startup) {sagaEL.addEventListener("error", () => {showNothing(sagaEL)})}
}