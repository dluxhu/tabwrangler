type WindowListener = (window: chrome.windows.Window) => void;
type RemovedListener = (windowId: number) => void;

function loadAppWindows(openWindows: Partial<chrome.windows.Window>[]) {
  const listeners: { created?: WindowListener; removed?: RemovedListener } = {};
  Object.assign(chrome, {
    windows: {
      getAll: jest.fn(() => Promise.resolve(openWindows)),
      onCreated: { addListener: (listener: WindowListener) => (listeners.created = listener) },
      onRemoved: { addListener: (listener: RemovedListener) => (listeners.removed = listener) },
    },
  });
  let appWindows!: typeof import("./appWindows").default;
  jest.isolateModules(() => {
    appWindows = jest.requireActual("./appWindows").default;
  });
  return { appWindows, listeners };
}

afterEach(() => {
  Object.assign(chrome, { windows: undefined });
});

describe("appWindows", () => {
  test("loads the open app windows", async () => {
    const { appWindows } = loadAppWindows([{ id: 7, type: "app" }]);
    await appWindows.init();
    expect(chrome.windows.getAll).toHaveBeenCalledWith({ windowTypes: ["app"] });
    expect(appWindows.has(7)).toBe(true);
  });

  test("adds app windows as they open and removes them as they close", async () => {
    const { appWindows, listeners } = loadAppWindows([]);
    await appWindows.init();
    listeners.created!({ id: 8, type: "app" } as chrome.windows.Window);
    listeners.created!({ id: 9, type: "normal" } as chrome.windows.Window);
    expect(appWindows.has(8)).toBe(true);
    expect(appWindows.has(9)).toBe(false);
    listeners.removed!(8);
    expect(appWindows.has(8)).toBe(false);
  });
});
