import { fireEvent, render, screen } from "@testing-library/react";
import LastTabOption from "./LastTabOption";

const mockSettings: Record<string, unknown> = {};
jest.mock("../useSetting", () => (key: string) => mockSettings[key]);

beforeEach(() => {
  Object.assign(mockSettings, { lastTabUrl: "", lastTabBehavior: "closeWindow" });
  Object.assign(chrome.i18n, { getMessage: (key: string) => key });
});

function optionValues() {
  return screen.getAllByRole("option").map((option) => (option as HTMLOptionElement).value);
}

describe("LastTabOption", () => {
  test("does not offer the URL when it is not set", () => {
    render(<LastTabOption onChange={jest.fn()} onSaveSetting={jest.fn()} />);
    expect(optionValues()).toEqual(["closeWindow", "blank"]);
  });

  test("offers the URL when it is set", () => {
    mockSettings.lastTabUrl = "example.com";
    render(<LastTabOption onChange={jest.fn()} onSaveSetting={jest.fn()} />);
    expect(optionValues()).toEqual(["closeWindow", "url", "blank"]);
  });

  test("shows close the window when the URL is chosen but not set", () => {
    mockSettings.lastTabBehavior = "url";
    render(<LastTabOption onChange={jest.fn()} onSaveSetting={jest.fn()} />);
    expect(screen.getByRole("combobox")).toHaveProperty("value", "closeWindow");
  });

  test("saves the chosen behavior", () => {
    const onSaveSetting = jest.fn();
    render(<LastTabOption onChange={jest.fn()} onSaveSetting={onSaveSetting} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "blank" } });
    expect(onSaveSetting).toHaveBeenCalledWith("lastTabBehavior", "blank");
  });

  test("tells the user when the URL is not valid", () => {
    mockSettings.lastTabUrl = "http://";
    render(<LastTabOption onChange={jest.fn()} onSaveSetting={jest.fn()} />);
    expect(screen.getByText("options_option_lastTabUrl_invalid")).toBeTruthy();
  });
});
