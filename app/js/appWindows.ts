// IDs of app windows, like installed web apps. Tabs only carry their `windowId`, so this keeps the
// IDs for Tab Rules to match synchronously. A window keeps its type for its whole life. This is a
// SINGLETON used by both background.ts and the UI, like `tabGroupTitles`.
const appWindowIds = new Set<number>();
let initPromise: Promise<void> | undefined;

const AppWindows = {
  // Loads the IDs of all open app windows. Later changes arrive through the listeners below.
  init(): Promise<void> {
    // Firefox for Android has no windows API.
    if (!chrome.windows) return Promise.resolve();
    initPromise ??= chrome.windows.getAll({ windowTypes: ["app"] }).then((windows) => {
      windows.forEach((window) => {
        if (window.id != null) appWindowIds.add(window.id);
      });
    });
    return initPromise;
  },

  has(windowId: number): boolean {
    return appWindowIds.has(windowId);
  },
};

// Registered when the module loads so a service worker adds them synchronously on its first turn.
// Without a filter, window events include app windows.
if (chrome.windows) {
  chrome.windows.onCreated.addListener((window) => {
    if (window.type === "app" && window.id != null) appWindowIds.add(window.id);
  });
  chrome.windows.onRemoved.addListener((windowId) => {
    appWindowIds.delete(windowId);
  });
}

export default AppWindows;
