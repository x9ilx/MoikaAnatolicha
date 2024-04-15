import React from "react";
import PropTypes from "prop-types";


const ModalWindow = ({props, children}) => {
  return (
    <>
      <div
        className="modal fade"
        id="ModalWindow"
        tabIndex="-1"
        aria-labelledby="ModalWindowLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="ModalWindowLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
                {children}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ModalWindow.propTypes = {
    // vehicleListFinal: PropTypes.array.isRequired,
};

export default ModalWindow;