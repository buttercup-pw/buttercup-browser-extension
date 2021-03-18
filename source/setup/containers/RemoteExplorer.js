import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import RemoteExplorer from "../components/RemoteExplorer.js";
import { setDirectoryContents, setDirectoryLoading } from "../actions/remoteFiles.js";
import { getDropboxDirectoryContents, getGoogleDriveDirectoryContents, getWebDAVClient } from "../library/remote.js";
import { notifyError } from "../library/notify.js";
import log from "../../shared/library/log.js";
import { webdavContentsToTree } from "../library/webdav.js";
import { dropboxContentsToTree } from "../library/dropbox.js";
import {
    googleDriveContentsToTree,
    groupContentsByDirectory as groupGoogleDriveContentsByDirectory
} from "../../shared/library/googleDrive.js";
import { getAllDirectoryContents, getDirectoryContents, getDirectoriesLoading } from "../selectors/remoteFiles.js";
import { getLocalDirectoryContents, localContentsToTree } from "../library/localFile.js";

function contentsToTree(contents, fetchType) {
    switch (fetchType) {
        case "webdav":
            return webdavContentsToTree(contents);
        case "dropbox":
            return dropboxContentsToTree(contents);
        case "googledrive":
            return googleDriveContentsToTree(contents);
        case "localfile":
            return localContentsToTree(contents);
        default:
            notifyError(
                "Failed processing directory contents",
                "The remote source type was invalid for processing directory contents"
            );
            throw new Error(`Failed converting remote contents to tree: Unknown type: ${fetchType}`);
    }
}

function fetchRemoteDirectory(dispatch, directory, fetchType) {
    let fetchRemoteContents;
    switch (fetchType) {
        case "webdav":
            fetchRemoteContents = dir => getWebDAVClient().getDirectoryContents(dir);
            break;
        case "dropbox":
            fetchRemoteContents = dir => getDropboxDirectoryContents(dir);
            break;
        case "googledrive":
            fetchRemoteContents = () => getGoogleDriveDirectoryContents();
            break;
        case "localfile":
            fetchRemoteContents = dir => getLocalDirectoryContents(dir);
            break;
        default:
            notifyError(
                "Failed fetching directory contents",
                "The remote source type was invalid for making requests against"
            );
            throw new Error(`Unknown remote fetch type: ${fetchType}`);
    }
    dispatch(
        setDirectoryLoading({
            directory,
            isLoading: true
        })
    );
    log.info(`Fetching remote contents for path: ${directory}`);
    return fetchRemoteContents(directory)
        .then(contents => {
            log.info(`Received ${fetchType} directory contents: ${directory}`, contents);
            if (fetchType === "googledrive") {
                // ALL contents are returned, so sort
                const dirIndex = groupGoogleDriveContentsByDirectory(contents);
                ["/", ...Object.keys(dirIndex)].forEach(subDir => {
                    dispatch(
                        setDirectoryContents({
                            directory: subDir,
                            contents: dirIndex[subDir]
                        })
                    );
                });
            } else {
                dispatch(
                    setDirectoryContents({
                        directory,
                        contents
                    })
                );
            }
            dispatch(
                setDirectoryLoading({
                    directory,
                    isLoading: false
                })
            );
        })
        .catch(err => {
            notifyError(
                "Failed fetching directory contents",
                `Failed fetching the remote contents of '${directory}': ${err.message}`
            );
            log.error(`Failed fetching ${fetchType} contents of '${directory}': ${err.message}`);
            console.error(err);
            dispatch(
                setDirectoryLoading({
                    directory,
                    isLoading: false
                })
            );
        });
}

export default withTranslation()(
    connect(
        (state, ownProps) => ({
            directoriesLoading: getDirectoriesLoading(state),
            rootDirectory: contentsToTree(getAllDirectoryContents(state), ownProps.fetchType)
        }),
        {
            onOpenDirectory: (directory, fetchType) => (dispatch, getState) => {
                const state = getState();
                const dirContents = getDirectoryContents(state, directory);
                if (!dirContents) {
                    fetchRemoteDirectory(dispatch, directory, fetchType);
                }
            },
            onReady: fetchType => dispatch => {
                fetchRemoteDirectory(dispatch, "/", fetchType);
            }
        }
    )(RemoteExplorer)
);
