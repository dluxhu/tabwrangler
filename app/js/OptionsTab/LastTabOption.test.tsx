import { fireEvent, render, screen } from "@testing-library/react";
import LastTabOption from "./LastTabOption";

const mockSettings: Record<string, unknown> = {};
jest.mock("../useSetting", () => (key: string) => mockSettings[key]);

beforeEach(() => {
  Object.assign(mockSettings, { lastTabUrl: "", lastTabBehavior: "closeWindow" });
  Object.assign(chrome.i18n, { getMessage: (key: string) => key });
});

function radioValues() {
  return screen.getAllByRole("radio").map((radio) => (radio as HTMLInputElement).value);
}

describe("LastTabOption", () => {
  test("shows the three choices as radio buttons, with the saved one checked", () => {
    mockSettings.lastTabBehavior = "blank";
    render(<LastTabOption onChange={jest.fn()} />);
    expect(radioValues()).toEqual(["closeWindow", "url", "blank"]);
    expect(screen.getByRole("radio", { checked: true })).toHaveProperty("value", "blank");
  });

  test("puts the URL field in the row of the URL choice", () => {
    render(<LastTabOption onChange={jest.fn()} />);
    const urlRadio = screen.getAllByRole("radio")[1];
    const urlField = screen.getByRole("textbox", { name: "options_option_lastTabUrl_label" });
    expect(urlRadio.parentElement).toBe(urlField.parentElement);
  });

  test("passes radio and URL changes to onChange", () => {
    const onChange = jest.fn();
    render(<LastTabOption onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("radio")[2]);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "example.com" } });
    expect(onChange.mock.calls.map(([event]) => event.target.name)).toEqual([
      "lastTabBehavior",
      "lastTabUrl",
    ]);
  });

  test("shows an error when the URL is not valid", () => {
    mockSettings.lastTabUrl = "http://";
    render(<LastTabOption onChange={jest.fn()} />);
    expect(screen.getByText("options_option_lastTabUrl_invalid")).toBeTruthy();
    expect(screen.getByRole("textbox")).toHaveProperty("ariaInvalid", "true");
  });

  test("shows no error when the URL is valid or empty", () => {
    mockSettings.lastTabUrl = "example.com";
    const { rerender } = render(<LastTabOption onChange={jest.fn()} />);
    expect(screen.queryByText("options_option_lastTabUrl_invalid")).toBeNull();
    mockSettings.lastTabUrl = "";
    rerender(<LastTabOption onChange={jest.fn()} />);
    expect(screen.queryByText("options_option_lastTabUrl_invalid")).toBeNull();
  });
});
