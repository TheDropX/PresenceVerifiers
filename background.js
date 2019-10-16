chrome.runtime.onMessage.addListener(function(request) {
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

	chrome.storage.sync.get({ pullRequests: [] }, function(prs) {

		console.log("Fetching...");

		fetch('https://api.github.com/repos/TheDropX/thedrop.me/pulls')
			.then((res) => { return res.json() })
			.then(function(data) { 
				data.forEach(element => {

					if(element.state == "open") {

						console.log(element.number)

						if(!prs.pullRequests.includes(element.number)) {
							
							prs.pullRequests.push(element.number);

							sendNotification(`${element.number}`, "New pull request created.", `#${element.number}: ${element.title}`, element.html_url, "Go to Pull Request");

							console.log("New pull request, sending notification...");

						}
					}
				});
				
			}).then(() => {

				savePullRequests(prs.pullRequests);
				
			})
	});

}

function savePullRequests(value) {

	chrome.storage.sync.set({ pullRequests: value }, function() {});

}

function getPullRequests() {

	chrome.storage.sync.get({ pullRequests: [] }, function(data) {});

}

