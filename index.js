import emojiFromText from "emoji-from-text";
import translate from "translate";
import 'dotenv/config';

// config
translate.engine = "deepl";
translate.key = process.env.DEEPL_API;
translate.from = "nl";
translate.to = "en";

// testing string
const testString = "Delta Heavy (gebruiken liquid drum tracks in een aantal nummers zoals ghost, kaleidoscope en white flag VIP bijv, die worden aangedreven door melodische elementen (in hun geval weliswaar een enorme neuro vibe met veel neuro instruments, maar als je neuro en liquid wil contrasteren is de echte vraag volgensmij of een nummer voornamelijk een complexe bass en complexe drum pattern heeft met slechts ondersteuning van melodische achtergrondelementen, dan is het neuro. En bij liquid worden leads ondersteund door wat simpelere bass en drum patterns. Dat er voornamelijk upbeat happy leads bij liquid voorkomen en duistere vibes bij neuro is niet echt waar het om gaat als je het op productie niveau vergelijkt)";

// convert to array
const splitString = testString.split(' ');

// config for array operations
let newString = [];
let newEmojiString = []
let promises = []

// convert all array items to promises using translate
splitString.forEach(async (el, i) => {
	promises.push(translate(el));
});

// when translation of all is complete
Promise.all(promises).then(data => {
	// create new array
	const mergedArray = []

	// loop over all promise results
	for(let i = 0; i < data.length; i++) {

		// convert data to emoji
		let emj = emojiFromText(data[i]);

		// if the word is "a" or a single letter, do not use as input
		if(data[i].length < 2) {
			emj = [];
		}

		// when multiple options arise, choose the highest score
		if(emj.length) {
			emj = emj.sort((a,b) => a.score-b.score)[emj.length-1]
		}

		// push into new array with old word, new word(s) and emoji if applicable
		mergedArray.push({
			new: data[i],
			old: splitString[i],
			// check if emoji path exists and if score is more than .94 -- else void
			emoji: emj?.match?.emoji?.char && emj?.match?.score > 0.94 ? emj.match.emoji.char : '',
		})
	}

	console.log(mergedArray)

	// convert array of obj back to single string
	let emojiString = mergedArray.map(el => `${el.old}${el.emoji} `).join('');
	console.log(emojiString)
})
