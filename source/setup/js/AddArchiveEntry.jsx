import React from "react";

const { PropTypes } = React;

import HeaderBar from "./HeaderBar";
import WebDAVArchiveEntryForm from "./WebDAVArchiveEntryForm";
import DropboxArchiveEntryForm from "./DropboxArchiveEntryForm";
import OwnCloudArchiveEntryForm from "./OwnCloudArchiveEntryForm";
import LocalArchiveUploadForm from "./LocalArchiveUploadForm";

class AddArchiveEntry extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let FormClass;
        switch (this.props.params.type) {
            case "webdav": {
                FormClass = WebDAVArchiveEntryForm;
                break;
            }
            case "dropbox": {
                FormClass = DropboxArchiveEntryForm;
                break;
            }
            case "owncloud": {
                FormClass = OwnCloudArchiveEntryForm;
                break;
            }
            case "local-archive-upload": {
                FormClass = LocalArchiveUploadForm;
                break;
            }

            default:
                throw new Error("Unknown type: " + this.props.params.type);
        }
        return (
            <div>
                <HeaderBar />
                <h3>Add from {this.props.params.type} source</h3>
                <FormClass />
            </div>
        );
    }

}

AddArchiveEntry.propTypes = {
    params: PropTypes.shape({
        type: PropTypes.string
    })
};

export default AddArchiveEntry;
