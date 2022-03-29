const result = document.querySelector("#result");
const copyButton = document.querySelector('#copy-button');

if(copyButton) {
	copyButton.addEventListener('click', copyToClipboard)
}

function copyToClipboard() {
	if(navigator.clipboard && result) {
		result.classList.remove('confirm');

		navigator.clipboard.writeText(result.innerHTML).then(() => {
		console.log('Async: Copying to clipboard was successful!');

		result.classList.add('confirm');

	}, (err) => {
		console.error('Async: Could not copy text: ', err);
	});
	}
}
