var allPullRequests = [], initialPullRequests = [];

var style = "font-weight: 800; padding: 2px 5px; color: white;";


fetch('https://api.github.com/repos/PreMiD/Presences/pulls')
	.then((res) => { return res.json() })
	.then(function(data) { 
		data.forEach(element => {
			if(element.state == "open") {

				initialPullRequests.push(element.number);
                allPullRequests.push(element.number);

            }

		});
    }).then(() => {

        chrome.runtime.sendMessage(chrome.runtime.id, {
            "message": "firstCheck",
            "allPullRequests": allPullRequests
        });

    });


function info(message) {
    console.log(
        "%cPresence Verifiers%cINFO%c " + message,
        style + "border-radius: 25px 0 0 25px; background: #478511;",
        style + "border-radius: 0 25px 25px 0; background: #08682E;",
        "color: unset;"
    );
}
