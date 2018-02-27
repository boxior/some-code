require('./jquery.select3230');

function initSelect3230(selector, options) {
	const $select3230 = $(selector);

	if(!$select3230[0]) {
		console.log(`Не найден элемент "${selector}"`);
		return;
	}

	$(selector).select3230(options)
}

window.itua = window.itua || {};
window.itua.initSelect3230 = initSelect3230;
module.exports = initSelect3230;