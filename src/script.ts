import { MenuItem } from "./menu-item";

class ContextMenu {
  private readonly menu: HTMLElement;
  private readonly targetArea: HTMLElement;
  private menuItems: MenuItem[] = [];

  constructor(menuId: string, targetSelector: string) {
    this.menu = document.getElementById(menuId)!;
    this.targetArea = document.querySelector(targetSelector)!;

    this.init();
  }

  private init(): void {
    this.targetArea.addEventListener("contextmenu", (event: MouseEvent) => this.show(event));
    document.addEventListener("click", (event: MouseEvent) => this.handleClickOutside(event));
    document.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeyPress(event));
    document.addEventListener("contextmenu", (event: MouseEvent) => this.preventDefaultRightClick(event));
  }

  public setMenuItems(items: MenuItem[]): void {
    this.menuItems = items;
    this.renderMenuItems();
  }

  private renderMenuItems(): void {
    this.menu.innerHTML = "";

    this.menuItems.forEach((item: MenuItem) => {
      const menuItemElement = document.createElement("li");
      menuItemElement.classList.add("menu-item");
      menuItemElement.textContent = item.label;
      menuItemElement.tabIndex = 0;

      // Action on click
      menuItemElement.addEventListener("click", () => {
        item.action();
        this.hide();
      });

      // Action on keyboard navigation (Space or Enter)
      menuItemElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          item.action();
          this.hide();
        }
      });

      this.menu.appendChild(menuItemElement);
    });
  }

  private show(event: MouseEvent): void {
    event.preventDefault();
    const { clientX, clientY } = event;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = this.menu.offsetWidth;
    const menuHeight = this.menu.offsetHeight;

    const adjustedX = Math.min(clientX, viewportWidth - menuWidth - 10);
    const adjustedY = Math.min(clientY - 20, viewportHeight - menuHeight - 20);

    // Show the menu
    this.menu.style.top = `${adjustedY}px`;
    this.menu.style.left = `${adjustedX}px`;
    this.menu.classList.remove("hidden");
  }

  // Hide the context menu
  private hide(): void {
    this.menu.classList.add("hidden");
  }

  private handleClickOutside(event: MouseEvent): void {
    if (!this.menu.contains(event.target as Node)) {
      this.hide();
    }
  }

  private handleKeyPress(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.hide();
    }
  }

  private preventDefaultRightClick(event: MouseEvent): void {
    if (!this.targetArea.contains(event.target as Node)) {
      event.preventDefault();
    }
  }
}

const contextMenu = new ContextMenu("context-menu", ".context-area");

const menuItems: MenuItem[] = [
  {
    label: "Option 1",
    action: () => alert("Option 1 clicked"),
  },
  {
    label: "Option 2",
    action: () => alert("Option 2 clicked"),
  },
  {
    label: "Option 3",
    action: () => alert("Option 3 clicked"),
  },
];

contextMenu.setMenuItems(menuItems);
