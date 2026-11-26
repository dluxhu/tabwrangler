import cx from "classnames";
import { parseLastTabUrl } from "../tabUtil";
import settings from "../settings";
import useSetting from "../useSetting";

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LastTabOption({ onChange }: Props) {
  const lastTabBehavior = useSetting("lastTabBehavior");
  const lastTabUrl = useSetting("lastTabUrl");
  const isUrlInvalid = lastTabUrl.trim() !== "" && parseLastTabUrl(lastTabUrl) == null;

  function radio(value: string) {
    return (
      <input
        checked={lastTabBehavior === value}
        className="form-check-input"
        id={`lastTabBehavior-${value}`}
        name="lastTabBehavior"
        onChange={onChange}
        type="radio"
        value={value}
      />
    );
  }

  return (
    <>
      <label className="form-label mt-3">
        <strong>{chrome.i18n.getMessage("options_option_lastTabBehavior_label")}</strong>
      </label>
      <div className="form-check">
        {radio("closeWindow")}
        <label className="form-check-label" htmlFor="lastTabBehavior-closeWindow">
          {chrome.i18n.getMessage("options_option_lastTabBehavior_closeWindow")}
        </label>
      </div>
      <div className="form-check d-flex align-items-center gap-2">
        {radio("url")}
        <label className="form-check-label text-nowrap" htmlFor="lastTabBehavior-url">
          {chrome.i18n.getMessage("options_option_lastTabBehavior_url")}
        </label>
        <input
          aria-describedby={isUrlInvalid ? "lastTabUrl-error" : undefined}
          aria-invalid={isUrlInvalid}
          aria-label={chrome.i18n.getMessage("options_option_lastTabUrl_label")}
          className={cx("form-control form-control-sm", { "is-invalid": isUrlInvalid })}
          defaultValue={settings.get("lastTabUrl")}
          id="lastTabUrl"
          inputMode="url"
          name="lastTabUrl"
          onChange={onChange}
          placeholder="https://example.com"
          style={{ maxWidth: "20rem" }}
          type="text"
        />
      </div>
      {isUrlInvalid && (
        <div className="form-check form-text text-danger mt-0" id="lastTabUrl-error">
          {chrome.i18n.getMessage("options_option_lastTabUrl_invalid")}
        </div>
      )}
      <div className="form-check mb-1">
        {radio("blank")}
        <label className="form-check-label" htmlFor="lastTabBehavior-blank">
          {chrome.i18n.getMessage("options_option_lastTabBehavior_blank")}
        </label>
      </div>
    </>
  );
}
