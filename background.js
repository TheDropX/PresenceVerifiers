chrome.runtime.onMessage.addListener(function(request) {
	if (request.message == "sendNotification") {
		sendNotification("newPR", request.notificationTitle, request.notificationMessage, request.link, "Go to Pull Request");
	}
	if(request.message == "firstCheck") {
		firstCheck(request.allPullRequests);
	}
});


function sendNotification(name, notificationTitle, notificationMessage, link, buttonTitle) {

	var notificationOptions = {

		type: 'basic',
		iconUrl: 'assets/img/logo.png',
		title: notificationTitle,
		message: notificationMessage,
		buttons: [
			{'title': buttonTitle},
			{'title': 'Ignore'}
		]
	
	};

	chrome.notifications.create(name, notificationOptions);
	
	chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {

		if (notifId === name) {
			if (btnIdx === 0) {
				window.open(link);
			} else if (btnIdx === 1) {
				chrome.notifications.clear(name);
			}
		}

	});

}

function firstCheck(PR) {

	chrome.storage.sync.get({ pullRequests: [] }, function(data) {

		if(JSON.stringify(data.pullRequests) !== JSON.stringify(PR))
			sendNotification("fCheck", "New/Closed Pull Requests", "Changes detected in pull requests.", "https://github.com/PreMiD/Presences", "Go to repository");

		savePullRequests(PR);
	
	});

}

function savePullRequests(value) {

	chrome.storage.sync.set({ pullRequests: value }, function() {});

}

function getPullRequests() {

	chrome.storage.sync.get({ pullRequests: [] }, function(data) {});

}

