class NavigationBar {
	constructor({ title = "AppTitle", actions = []}) {
		this.title = title;
		this.actions = actions;
	}

	createTitle() {
		const titleDiv = document.createElement("div");
		titleDiv.className = "title-container";

		const titleElement = document.createElement("h1");
		titleElement.id = "navigation-bar-title";
		titleElement.innerText = this.title;

		titleDiv.appendChild(titleElement);

		return titleDiv;
	}

	createActions() {
		const actionsDiv = document.createElement("div");
		actionsDiv.className = "navigation-bar-actions";
		this.actions.forEach(action => {
			const button = document.createElement("button");
			button.className = "navigation-bar-actions-buttons";
			button.innerText = action.label;
			button.addEventListener("click", action.onClick);

			actionsDiv.appendChild(button);
		});

		return actionsDiv;
	}

	createBar() {
		const navigationBar = document.createElement("nav");
		navigationBar.className = "navigation-bar";

		const titleDiv = this.createTitle();
		const actionsDiv = this.createActions();


		navigationBar.appendChild(titleDiv);
		navigationBar.appendChild(actionsDiv);

		return header;
	}
}