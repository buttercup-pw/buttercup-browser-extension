import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Button, Card, Classes, ControlGroup, H4, InputGroup, Spinner } from "@blueprintjs/core";
import classNames from "classnames";
import LayoutMain from "./LayoutMain.js";
import {
    disableDomainForSavePrompt,
    getDisabledSavePromptDomains,
    removeDisabledDomainForSavePrompt
} from "../library/messaging.js";

const Table = styled.table`
    width: 100%;
`;

function isDomain(str) {
    return /^[^\/:_]+(\.[^\/:_]+)+$/.test(str) || str === "localhost";
}

export default function DisabledLoginDomainsPage() {
    const [domains, setDomains] = useState([]);
    const [loadingDomains, setLoadingDomains] = useState(false);
    const { t } = useTranslation();
    const [newDomain, setNewDomain] = useState("");
    const fetchDomains = () => {
        setLoadingDomains(true);
        getDisabledSavePromptDomains().then(fetchedDomains => {
            setLoadingDomains(false);
            setDomains(fetchedDomains);
        });
    };
    const addNewDomain = async () => {
        await disableDomainForSavePrompt(newDomain);
        setNewDomain("");
        fetchDomains();
    };
    const removeExistingDomain = async domain => {
        await removeDisabledDomainForSavePrompt(domain);
        fetchDomains();
    };
    useEffect(fetchDomains, []);
    return (
        <LayoutMain title="Disabled Save-Details Prompts">
            <H4>Disabled Domains</H4>
            <Card>
                <Choose>
                    <When condition={loadingDomains}>
                        <Spinner />
                    </When>
                    <Otherwise>
                        <Table
                            className={classNames(
                                Classes.HTML_TABLE,
                                Classes.HTML_TABLE_BORDERED,
                                Classes.HTML_TABLE_STRIPED
                            )}
                        >
                            <thead>
                                <tr>
                                    <th>Domain</th>
                                    <th>{t("remove")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <Choose>
                                    <When condition={domains.length > 0}>
                                        <For each="domain" of={domains}>
                                            <tr key={domain}>
                                                <td>
                                                    <code>{domain}</code>
                                                </td>
                                                <td>
                                                    <Button
                                                        small
                                                        icon="delete"
                                                        onClick={() => removeExistingDomain(domain)}
                                                    />
                                                </td>
                                            </tr>
                                        </For>
                                    </When>
                                    <Otherwise>
                                        <tr>
                                            <td colSpan="2">
                                                <center>
                                                    <i>No domains</i>
                                                </center>
                                            </td>
                                        </tr>
                                    </Otherwise>
                                </Choose>
                            </tbody>
                        </Table>
                        <br />
                        <ControlGroup>
                            <InputGroup
                                leftIcon="globe-network"
                                placeholder="Add domain..."
                                onChange={evt => setNewDomain(evt.target.value)}
                                value={newDomain}
                            />
                            <Button icon="add" disabled={!isDomain(newDomain)} onClick={addNewDomain} />
                        </ControlGroup>
                    </Otherwise>
                </Choose>
            </Card>
        </LayoutMain>
    );
}
