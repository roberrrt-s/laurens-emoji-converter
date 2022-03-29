import emojiFromText from "emoji-from-text";
import translate from "translate";
import 'dotenv/config';

export default async function convert(input = "no input") {
	// config
	translate.engine = "deepl";
	translate.key = process.env.DEEPL_API;
	translate.from = "nl";
	translate.to = "en";

	// convert to array
	const splitString = input.split(' ');

	// config for array operations
	let newString = [];
	let newEmojiString = []
	let promises = []

	// convert all array items to promises using translate
	splitString.forEach(async (el, i) => {
		promises.push(translate(el));
	});

	// when translation of all is complete
	return Promise.all(promises).then(data => {
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

		return emojiString;
	})

}