// shared.js
function getWorkRange(startTime, endTime, now = new Date()) {
	const [sh, sm] = startTime.split(':').map(Number);
	const [eh, em] = endTime.split(':').map(Number);

	const start = new Date(now);
	start.setHours(sh, sm, 0, 0);

	const end = new Date(start);
	end.setHours(eh, em, 0, 0);

	// 야간 근무 (종료가 다음날)
	if (end <= start) {
		end.setDate(end.getDate() + 1);
	}

	return { start, end };
}

function calculateEarning(data, now = new Date()) {
	if (!data.money || !data.startTime || !data.endTime) return null;

	const { start, end } = getWorkRange(data.startTime, data.endTime, now);

	const totalSeconds = (end - start) / 1000;
	if (totalSeconds <= 0) return null;

	let dailyWage = 0;
	const money = Number(data.money);

	if (data.calcType === 'month') {
		const days = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0
		).getDate();
		dailyWage = money / days;
	} else if (data.calcType === 'day') {
		dailyWage = money;
	} else {
		// 시급
		dailyWage = money * (totalSeconds / 3600);
	}

	const perSecond = dailyWage / totalSeconds;

	let elapsed = (now - start) / 1000;
	if (elapsed < 0) elapsed = 0;
	if (elapsed > totalSeconds) elapsed = totalSeconds;

	return {
		earned: elapsed * perSecond,
		dailyWage,
		perSecond,
		totalSeconds
	};
}