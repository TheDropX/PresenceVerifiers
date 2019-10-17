var manifestData = chrome.runtime.getManifest();

chrome.runtime.onMessage.addListener(function(request) {
	if(request.message == "firstCheck") {
		firstCheck();
		checkForUpdate();
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

function firstCheck() {

	chrome.storage.sync.get({ pullRequests: [] }, function(prs) {

		fetch('https://api.github.com/repos/PreMiD/Presences/pulls')
			.then((res) => { return res.json() })
			.then(function(data) { 
				data.forEach(element => {

					if(element.state == "open") {

						if(!prs.pullRequests.includes(element.number)) {
							
							prs.pullRequests.push(element.number);

							sendNotification(`${element.number}`, "New pull request created.", `#${element.number}: ${element.title}`, element.html_url, "Go to Pull Request");

						}
					}
				});
				
			}).then(() => {

				savePullRequests(prs.pullRequests);
				
			})
	});

}

function checkForUpdate() {

	fetch('https://api.github.com/repos/TheDropX/PresenceVerifiers/releases')
		.then((res) => { return res.json() })
		.then(function(data) { 

			if(data[0].tag_name < manifestData.version) {

				sendNotification(`newUpdate`, "New update available.", `Install the new version to get the latest features and bug fixes.`, data[0].html_url, "Download");

				setTimeout(() => {
					chrome.notifications.clear("newUpdate");
				}, 60000);

			}
			
	})

}

function savePullRequests(value) {

	chrome.storage.sync.set({ pullRequests: value }, function() {});

}

function getPullRequests() {

	chrome.storage.sync.get({ pullRequests: [] }, function(data) {});

}

