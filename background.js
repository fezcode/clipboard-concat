var browser = browser || chrome; // Chrome compatibility

function onCreated() {
	if (browser.runtime.lastError) {
		console.log(`Error: ${browser.runtime.lastError}`);
	} else {
		console.log("Item created successfully");
	}
}

const MENU_ENTRIES = {
	newline: "newline",
	comma: "comma",
	semicolon: "semicolon",
	space: "space",
	clear: "clear",
	paste: "paste"
};

function clipboardOpened(info, tab) {
	const menuItemId = info.menuItemId;
	let current_clipboard = "";
	let new_clipboard = "";
	let selection_or_link = info.linkUrl || info.selectionText;
	let delim = "";

	console.log("~~~~~~~~~~~~~~~~~");
	console.log(current_clipboard);
	console.log("~~~~~~~~~~~~~~~~~");

	console.log("===============================");
	console.log(info);
	console.log("===============================");
	  
	
	navigator.clipboard.readText().then(
		(clipText) => {
			console.log(">>>>>>>");
			console.log(clipText);
			console.log(">>>>>>>");


			current_clipboard = clipText;
			switch (menuItemId) {
				case MENU_ENTRIES.newline:
					delim = "\n";
					break;

				case MENU_ENTRIES.comma:
					delim = ",";
					break;

				case MENU_ENTRIES.semicolon:
					delim = ";";
					break;
				
				case MENU_ENTRIES.space:
				default:
					delim = " ";
					break;
			}

			console.log("XXXXXXXXX")
			if (menuItemId === MENU_ENTRIES.paste) {
				let targetElementId = info.targetElementId;
				
				browser.tabs.executeScript(tab.id, {
					frameId: info.frameId,
					code: `browser.menus.getTargetElement(${info.targetElementId}).value="${current_clipboard}";`,
				});
		
				console.log("PASTING")
				return;
			}

			else if (menuItemId === MENU_ENTRIES.clear) {
				new_clipboard = "";
			} else if (current_clipboard != null && current_clipboard != "") {
				new_clipboard = current_clipboard + delim + selection_or_link;
			} else {
				new_clipboard = selection_or_link;
			}

			navigator.clipboard.writeText(new_clipboard).then(function() {
				/* clipboard successfully set */
				console.log("Clipboard successfully modified")
		
			}, function() {
				/* clipboard write failed */
				console.error("Clipboard writing error")

			});

		}
	);
}

browser.contextMenus.create({
	contexts: ["link", "selection"],
	id: MENU_ENTRIES.newline,
	title: "With Newline"
}, onCreated);

browser.contextMenus.create({
	contexts: ["link", "selection"],
	id: MENU_ENTRIES.comma,
	title: "With Comma"
}, onCreated);

browser.contextMenus.create({
	contexts: ["link", "selection"],
	id: MENU_ENTRIES.semicolon,
	title: "With Semicolon"
}, onCreated);

browser.contextMenus.create({
	contexts: ["link", "selection"],
	id: MENU_ENTRIES.space,
	title: "With Space"
}, onCreated);

browser.contextMenus.create({
	id: "separator-1",
	type: "separator",
	contexts: ["all"]
}, onCreated);

browser.contextMenus.create({
	contexts: ["all"],
	id: MENU_ENTRIES.clear,
	title: "Clear Clipboard"
}, onCreated);

browser.contextMenus.create({
	id: "separator-2",
	type: "separator",
	contexts: ["all"]
}, onCreated);

// browser.contextMenus.create({
// 	contexts: ["editable"],
// 	id: MENU_ENTRIES.paste,
// 	title: "Paste"
// }, onCreated);


browser.contextMenus.onClicked.addListener(clipboardOpened);