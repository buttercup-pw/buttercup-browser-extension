import React from "react";
import styled from "styled-components";

const ARCHIVE_IMAGES = {
    dropbox: require("../../../resources/providers/dropbox-256.png"),
    owncloud: require("../../../resources/providers/owncloud-256.png"),
    nextcloud: require("../../../resources/providers/nextcloud-256.png"),
    webdav: require("../../../resources/providers/webdav-white-256.png")
};

const Wrapper = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${p => p.vault.colour};
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 14px;
        height: auto;
        filter: brightness(0) invert(1);
    }
`;

export const VaultIcon = ({ vault }) => (
    <Wrapper vault={vault}>
        <img src={ARCHIVE_IMAGES[vault.type]} />
    </Wrapper>
);