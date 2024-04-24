import React from "react";
import PropTypes from "prop-types";
import { FaTrashRestore } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { isMobile } from "react-device-detect";


const EditOrderCurrentVehicle = (props) => {
  return (
    <div>
      <p key={"vehicleListFina123sdfsdfsdfsdfl"} className="fw-medium mt-3">
        Список ТС/ПЦ/ППЦ:
      </p>
      <ul key={"vehicleListF345345ina123sdfl"} className="list-group my-3">
        {props.vehicleList?.map((vehicle, index) => (
          <div key={"vehicleListFinal" + vehicle.plate_number + index}>
            <li
              key={"vehicleListFinal" + vehicle.plate_number + index}
              className={`list-group-item fs-7
              ${vehicle.to_be_removed ? " bg-danger text-white" : ""} 
              `}
            >
              <div
                key={"vehicleListFinal123" + vehicle.plate_number + index}
                className="row"
              >
                <div className="d-flex">
                  <div
                    key={"vehicleListFinal3332" + vehicle.plate_number + index}
                    className="flex-grow-1 flex-fill"
                  >
                    <b
                      key={"vehicleListFinal554" + vehicle.plate_number + index}
                    >
                      {vehicle?.plate_number}:
                    </b>{" "}
                    {vehicle?.vehicle_class_name} {vehicle?.vehicle_model}{" "}
                    {isMobile && <br />}
                    {vehicle?.vehicle_class} ({vehicle?.vehicle_type})<br></br>
                    {vehicle?.owner}
                  </div>
                  <>
                    {!vehicle.to_be_removed && (
                      <>
                        <div
                          key={
                            "vehicleListFina434343434l" +
                            vehicle.plate_number +
                            index
                          }
                          className={`align-items-end`}
                          title="Пометить на удаление"
                        >
                          <ImCross
                            key={
                              "vehicleListFinweweweal" +
                              vehicle.plate_number +
                              index
                            }
                            size={14}
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              props.onMarkDelete(index, true);
                            }}
                          />
                        </div>
                      </>
                    )}
                    {vehicle.to_be_removed && (
                      <>
                        <div
                          key={
                            "vehicleListFinjhjjal" +
                            vehicle.plate_number +
                            index
                          }
                          className={`align-items-end${
                            isMobile ? "text-center" : "text-end"
                          }`}
                          title="Отменить удаление"
                        >
                          <FaTrashRestore
                            key={
                              "vehicleListFinxcvxzcvzal" +
                              vehicle.plate_number +
                              index
                            }
                            size={18}
                            className={`text-white fw-medium`}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              props.onMarkDelete(index, false);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </>
                </div>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

EditOrderCurrentVehicle.propTypes = {
  onMarkDelete: PropTypes.func.isRequired,
  vehicleList: PropTypes.array.isRequired,
};

export default EditOrderCurrentVehicle;
