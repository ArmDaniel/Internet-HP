function listTabs() {
	getCurrentWindowsTabs().then((tabs) => {
		let tabsList = document.getElementById('tabs-list');
		let currentTabs = document.createDocumentFragment();
		
		// the 2 limit was just for testing , it will be increased
		let limit = 2;
		let counter = 0;
		
		tabsList.textContent = '';
		
		for(let tab of tabs) {
			if(!tab.active && counter <= limit) {
				let tabLink = document.createElement('p');
				let space = document.createElement('hr');
				
				var parser;
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if(this.readyState == 4 && this.status == 200 ) {
						tabLink.textContent = this.responseText;
					}
				};
				var url = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=API-KEY";
				var url_var = tab.url;
				
				// must add more cases
				var ijson =  '{ "client": { "clientId": "safenet-285215", "clientVersion": "1.5.2" }, "threatInfo": { "threatTypes": ["MALWARE","SOCIAL_ENGINEERING"], "platformTypes": ["WINDOWS"], "threatEntryTypes": ["URL"], "threatEntries": [{"url": "'+url_var+'" }]} }';
				
				xhttp.open("POST",url, false);
				xhttp.setRequestHeader("Content-Type","application/json");
				xhttp.send(ijson);
				
				// must be converted to object before handling it properly
				parser = JSON.parse(xhttp.responseText);
				
				// this method checks if object is empty, which means no match was found in the threat lists
				if(Object.keys(parser).length === 0){
					
					tabLink.textContent = "The url: " + "'" + tab.url + "'" + " is safe and doesn't contain any malware!";
					
				}else{
					
					tabLink.textContent = parser.matches[0].threatType + " " + parser.matches[0].threatEntryMetadata.entries[0].key;
					
				}
				tabLink.classList.add('current-urls');
				
				currentTabs.appendChild(tabLink);
				currentTabs.appendChild(space);
			}
			counter += 1;
		}
		
		tabsList.appendChild(currentTabs);
	});
}

document.addEventListener("DOMContentLoaded",listTabs);

function getCurrentWindowsTabs() {
	return browser.tabs.query({currentWindow: true});
}