import React from "react";
import { push } from "react-router-redux";
import styled from "styled-components";
import { Button, Intent } from "@blueprintjs/core";
import { dispatch } from "../redux/index.js";
import InPagePopupBody from "./InPagePopupBody.js";
import { disableLoginForDomain } from "../library/messaging.js";
import { closeDialog, openURL } from "../library/context.js";
import { getExtensionURL } from "../../shared/library/extension.js";
import { useTranslation } from "react-i18next";

const ActionButton = styled(Button)`
    margin-bottom: 8px;
`;

function disableForDomain() {
    disableLoginForDomain();
    closeDialog();
}

function manageDisabledDomains() {
    openURL(getExtensionURL("setup.html#/settings/disabled-login-domains"));
}

export default function DisableSaveCredentialsPage(props) {
    const { t } = useTranslation(["dialog", "common"]);

    return (
        <InPagePopupBody title={t("save-prompt.disable.headline")}>
            <ActionButton
                fill
                text={t("save-prompt.disable.for-this-domain")}
                onClick={disableForDomain}
                intent={Intent.DANGER}
            />
            <ActionButton
                fill
                text={t("save-prompt.disable.manage-disabled-domains")}
                onClick={manageDisabledDomains}
            />
            <Button fill text={t("base:back")} onClick={() => dispatch(push("/save-new-credentials"))} />
        </InPagePopupBody>
    );
}
