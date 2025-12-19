// windows.js
const display = document.getElementById('current-earning');
const actionBtn = document.getElementById('action-btn');
const app = document.getElementById('app');

let isRunning = false;

function init() {
	chrome.storage.local.get(
		['money', 'calcType', 'startTime', 'endTime', 'isRunning'],
		(data) => {
			if (data.money)
				document.getElementById('money-input').value = data.money;

			if (data.calcType) {
				document.querySelector(
					`input[name="calc-type"][value="${data.calcType}"]`
				).checked = true;
			}

			if (data.startTime)
				document.getElementById('start-time').value = data.startTime;

			if (data.endTime)
				document.getElementById('end-time').value = data.endTime;

			isRunning = !!data.isRunning;
			updateButton();

			app.classList.remove('hidden');
		}
	);
}

function updateButton() {
	actionBtn.innerText = isRunning ? '파밍정지' : '파밍시작';
	actionBtn.className = isRunning ? 'btn-stop' : 'btn-start';
}

function updateUI() {
	if (!isRunning) return;

	chrome.storage.local.get(
		['money', 'calcType', 'startTime', 'endTime'],
		(data) => {
			const result = calculateEarning(data, new Date());
			if (!result) return;

			const earned = Math.floor(result.earned);
			const todayWage = Math.round(result.dailyWage);

			display.innerText =
				`초당파밍 ${earned.toLocaleString()}원\n` +
				`오늘의일당 ${todayWage.toLocaleString()}원`;
		}
	);
}

actionBtn.addEventListener('click', () => {
	if (!isRunning) {
		const settings = {
			money: document.getElementById('money-input').value,
			calcType: document.querySelector(
				'input[name="calc-type"]:checked'
			).value,
			startTime: document.getElementById('start-time').value,
			endTime: document.getElementById('end-time').value,
			isRunning: true
		};

		if (!settings.money) {
			alert('얼마를 버는지 입력해주세요.');
			return;
		}

		chrome.storage.local.set(settings, () => {
			isRunning = true;
			updateButton();
		});
	} else {
		chrome.storage.local.set({ isRunning: false }, () => {
			isRunning = false;
			updateButton();
			chrome.action.setBadgeText({ text: '' });
		});
	}
});

setInterval(updateUI, 1000);
init();