import settings, { type LastTabBehaviorOption, type SettingsSchema } from "../settings";
import cx from "classnames";
import { parseLastTabUrl } from "../tabUtil";
import useSetting from "../useSetting";

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveSetting: <K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]) => void;
}

function isLastTabBehavior(value: string): value is LastTabBehaviorOption {
  return value === "blank" || value === "closeWindow" || value === "url";
}

export default function LastTabOption({ onChange, onSaveSetting }: Props) {
  const lastTabBehavior = useSetting("lastTabBehavior");
  const lastTabUrl = useSetting("lastTabUrl");
  const hasUrl = parseLastTabUrl(lastTabUrl) != null;
  const isUrlInvalid = lastTabUrl.trim() !== "" && !hasUrl;

  return (
    <>
      <label className="form-label mt-3" htmlFor="lastTabBehavior">
        <strong>{chrome.i18n.getMessage("options_option_lastTabBehavior_label")}</strong>
      </label>
      <div className="row mb-2">
        <div className="col-8">
          <select
            className="form-select"
            id="lastTabBehavior"
            name="lastTabBehavior"
            onChange={(event) => {
              if (isLastTabBehavior(event.target.value))
                onSaveSetting("lastTabBehavior", event.target.value);
            }}
            // "url" without a URL closes the window. Show that.
            value={lastTabBehavior === "url" && !hasUrl ? "closeWindow" : lastTabBehavior}
          >
            <option value="closeWindow">
              {chrome.i18n.getMessage("options_option_lastTabBehavior_closeWindow")}
            </option>
            {hasUrl && (
              <option value="url">
                {chrome.i18n.getMessage("options_option_lastTabBehavior_url")}
              </option>
            )}
            <option value="blank">
              {chrome.i18n.getMessage("options_option_lastTabBehavior_blank")}
            </option>
          </select>
        </div>
      </div>
      <label className="form-label" htmlFor="lastTabUrl">
        <strong>{chrome.i18n.getMessage("options_option_lastTabUrl_label")}</strong>
      </label>
      <div className="row">
        <div className="col-8">
          <input
            className="form-control"
            defaultValue={settings.get("lastTabUrl")}
            id="lastTabUrl"
            inputMode="url"
            name="lastTabUrl"
            onChange={onChange}
            placeholder="https://example.com"
            type="text"
          />
        </div>
      </div>
      <div className="row mb-1">
        <div className={cx("col-9 form-text", { "text-primary": isUrlInvalid })}>
          {chrome.i18n.getMessage(
            isUrlInvalid
              ? "options_option_lastTabUrl_invalid"
              : "options_option_lastTabUrl_description",
          )}
        </div>
      </div>
    </>
  );
}
