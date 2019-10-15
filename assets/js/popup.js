AOS.init();

var manifestData = chrome.runtime.getManifest();
const name = document.getElementById("n");
const version = document.getElementById("v");
const extensionName = document.getElementById("extensionName");
const pullRequests = document.getElementById("pullRequests");


fetch('https://api.github.com/repos/PreMiD/Presences/pulls')
	.then((res) => { return res.json() })
	.then(function(data) { 
        pullRequests.innerText = "";
		data.forEach(element => {

			if(element.state == "open") {

                if(element.title.length > 31) 
                    title = element.title.substring(0,30) + "...";
                else title = element.title;

                pullRequests.innerHTML += `
                <div class="pr hvr-grow">
                    <a class="hvr-icon-grow" href="${element.html_url}" target="_blank">
                        <i class="fas fa-external-link-alt hvr-icon"></i>
                    </a>
                    <p>${title}</p>
                </div>
                `;

			}

		});
    });

name.innerText = manifestData.name;
extensionName.innerText = manifestData.name;
version.innerText = `v${manifestData.version}`;

