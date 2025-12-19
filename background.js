// background.js
importScripts('shared.js');

function updateBadge() {
	chrome.storage.local.get(
		['money', 'calcType', 'startTime', 'endTime', 'isRunning'],
		(data) => {
			if (!data.isRunning) {
				chrome.action.setBadgeText({ text: '' });
				return;
			}

			const result = calculateEarning(data, new Date());
			if (!result) return;

			const earned = Math.floor(result.earned);

			let text = '';
			if (earned >= 1_000_000) {
				text = Math.floor(earned / 10_000) + '만';
			} else if (earned >= 1_000) {
				text = (earned / 1_000).toFixed(1) + 'k';
			} else {
				text = String(earned);
			}

			chrome.action.setBadgeText({ text });
			chrome.action.setBadgeBackgroundColor({ color: '#000000' });
		}
	);
}

setInterval(updateBadge, 1000);