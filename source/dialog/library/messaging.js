import log from "../../shared/library/log.js";
import i18n from "../../shared/i18n";

export function copyToClipboard(text) {
    chrome.runtime.sendMessage({ type: "copy-to-clipboard", content: text });
}

export function disableLoginForDomain(domain) {
    chrome.runtime.sendMessage({ type: "disable-login-domain", domain });
}

export function getLastLogins() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "get-used-credentials", mode: "all" }, resp => {
            if (Array.isArray(resp.credentials) && resp.credentials.length > 0) {
                resolve(resp.credentials);
            } else {
                reject(new Error(i18n.t("dialog:errors.failed-getting-last-login-details")));
            }
        });
    });
}

export function setGeneratedPassword(password) {
    chrome.runtime.sendMessage({ type: "set-generated-password", password });
}

export function sendCredentialsToTab(sourceID, entryID, signIn) {
    chrome.runtime.sendMessage(
        {
            type: "send-credentials-to-current-tab",
            sourceID,
            entryID,
            signIn
        },
        response => {
            if (!response.ok) {
                log.error(`Failed sending credentials to tab: ${response.error}`);
                alert(
                    i18n.t("dialog:errors.an-error-occurred-while-trying-to-fetch-credentials", {
                        error: response.error
                    })
                );
            }
        }
    );
}

export function stopCurrentSavePrompt() {
    // Cancel save for current tab
    chrome.runtime.sendMessage({ type: "stop-prompt-saved-credentials" });
}
