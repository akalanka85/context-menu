var ContextMenu = (function () {
    function ContextMenu(menuId, targetSelector) {
        this.menuItems = [];
        this.menu = document.getElementById(menuId);
        this.targetArea = document.querySelector(targetSelector);
        this.init();
    }
    ContextMenu.prototype.init = function () {
        var _this = this;
        this.targetArea.addEventListener("contextmenu", function (event) { return _this.show(event); });
        document.addEventListener("click", function (event) { return _this.handleClickOutside(event); });
        document.addEventListener("keydown", function (event) { return _this.handleKeyPress(event); });
        document.addEventListener("contextmenu", function (event) { return _this.preventDefaultRightClick(event); });
    };
    ContextMenu.prototype.setMenuItems = function (items) {
        this.menuItems = items;
        this.renderMenuItems();
    };
    ContextMenu.prototype.renderMenuItems = function () {
        var _this = this;
        this.menu.innerHTML = "";
        this.menuItems.forEach(function (item) {
            var menuItemElement = document.createElement("li");
            menuItemElement.classList.add("menu-item");
            menuItemElement.textContent = item.label;
            menuItemElement.tabIndex = 0;
            menuItemElement.addEventListener("click", function () {
                item.action();
                _this.hide();
            });
            menuItemElement.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    item.action();
                    _this.hide();
                }
            });
            _this.menu.appendChild(menuItemElement);
        });
    };
    ContextMenu.prototype.show = function (event) {
        event.preventDefault();
        var clientX = event.clientX, clientY = event.clientY;
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        var menuWidth = this.menu.offsetWidth;
        var menuHeight = this.menu.offsetHeight;
        var adjustedX = Math.min(clientX, viewportWidth - menuWidth - 10);
        var adjustedY = Math.min(clientY - 20, viewportHeight - menuHeight - 20);
        this.menu.style.top = "".concat(adjustedY, "px");
        this.menu.style.left = "".concat(adjustedX, "px");
        this.menu.classList.remove("hidden");
    };
    ContextMenu.prototype.hide = function () {
        this.menu.classList.add("hidden");
    };
    ContextMenu.prototype.handleClickOutside = function (event) {
        if (!this.menu.contains(event.target)) {
            this.hide();
        }
    };
    ContextMenu.prototype.handleKeyPress = function (event) {
        if (event.key === "Escape") {
            this.hide();
        }
    };
    ContextMenu.prototype.preventDefaultRightClick = function (event) {
        if (!this.targetArea.contains(event.target)) {
            event.preventDefault();
        }
    };
    return ContextMenu;
}());
var contextMenu = new ContextMenu("context-menu", ".context-area");
var menuItems = [
    {
        label: "Option 1",
        action: function () { return alert("Option 1 clicked"); },
    },
    {
        label: "Option 2",
        action: function () { return alert("Option 2 clicked"); },
    },
    {
        label: "Option 3",
        action: function () { return alert("Option 3 clicked"); },
    },
];
contextMenu.setMenuItems(menuItems);
export {};
