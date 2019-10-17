AOS.init();

var manifestData = chrome.runtime.getManifest();
const name = document.getElementById("n");
const version = document.getElementById("v");
const extensionName = document.getElementById("extensionName");
const pullRequests = document.getElementById("pullRequests");
const announcement = document.getElementById("announcement");


fetch('https://api.github.com/repos/PreMiD/Presences/pulls')
	.then((res) => { return res.json() })
	.then(function(data) { 
        pullRequests.innerText = "";
		data.forEach(element => {

			if(element.state == "open") {

                if(element.title.length > 35) 
                    title = element.title.substring(0,34) + "...";
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

fetch('https://api.thedrop.me/announcement')
	.then((res) => { return res.json() })
	.then(function(data) { 
        if(data[0].title.length > 0 && data[0].message.length > 0 && manifestData.version == data[0].version) {

            announcement.classList.add("announcement");
            announcement.classList.add("flex");

            announcement.innerHTML = `
            <i class="ion ion-ios-cloud-outline" style="font-size: 40px; color: #fd8900;"></i> 
            <div class="anno-text">
                <div class="anno-title" id="title">
                    ${data[0].title}
                    <a class="hvr-icon-grow" href="${data[0].link}" target="_blank">
                        <i class="fas fa-external-link-alt hvr-icon" style="font-size: 13px;margin-bottom: 3px;color: #fd8900;line-height: 0;margin-left: 5px;" aria-hidden="true"></i>
                    </a>
                </div>
                <p id="message">${data[0].message}</p>
            </div>
            `;

        }
    });

name.innerText = manifestData.name;
extensionName.innerText = manifestData.name;
version.innerText = `v${manifestData.version}`;