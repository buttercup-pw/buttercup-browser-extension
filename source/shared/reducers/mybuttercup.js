import {
    MYBUTTERCUP_CLEAR_STATE,
    MYBUTTERCUP_SET_ACCESS_TOKEN,
    MYBUTTERCUP_SET_AUTH_ID,
    MYBUTTERCUP_SET_NAME,
    MYBUTTERCUP_SET_REFRESH_TOKEN,
    MYBUTTERCUP_SET_VAULT_ID,
} from "../actions/types.js";

const INITIAL = {
    accessToken: null,
    authenticationID: null,
    name: null,
    refreshToken: null,
    vaultID: null,
};

export default function myButtercupReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case MYBUTTERCUP_CLEAR_STATE:
            return {
                ...state,
                accessToken: null,
                authenticationID: null,
                refreshToken: null,
                vaultID: null,
            };
        case MYBUTTERCUP_SET_AUTH_ID:
            return {
                ...state,
                authenticationID: action.payload,
            };
        case MYBUTTERCUP_SET_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: action.payload,
            };
        case MYBUTTERCUP_SET_REFRESH_TOKEN:
            return {
                ...state,
                refreshToken: action.payload,
            };
        case MYBUTTERCUP_SET_VAULT_ID:
            return {
                ...state,
                vaultID: action.payload,
            };
        case MYBUTTERCUP_SET_NAME:
            return {
                ...state,
                name: action.payload,
            };
        default:
            return state;
    }
}
