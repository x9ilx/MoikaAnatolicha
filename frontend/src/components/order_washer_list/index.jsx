import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import OrderElementGroup from "../../pages/orders/order_element_group";
import { TbReportMoney } from "react-icons/tb";
import { MdModeEdit } from "react-icons/md";

const OrderWasherList = (props) => {
  return (
    <div className="form-floating mt-3">
      <div
        className={`d-flex m-0 border p-1 bg-${props.headerColor} fw-medium text-white p-2`}
        style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
      >
        <div className="flex-fill text-start ">Выбранные мойщики:</div>
        {!props.onlyShow && (
          <>
            <div className="flex-shrink-1 text-end">
              <MdModeEdit
                size={24}
                className=""
                style={{ cursor: "pointer" }}
                title="Изменить мойщиков"
                onClick={() => {
                  props.onStartEditWasher();
                }}
              />
            </div>
          </>
        )}
      </div>
      <div className="border py-1 ">
        <OrderElementGroup
          header=""
          elements_with_badge={props.washerList?.map((washer) => ({
            name: washer.short_name,
            badge: "",
          }))}
        />
      </div>
    </div>
  );
};

OrderWasherList.propTypes = {
  washerList: PropTypes.array.isRequired,
  onStartEditWasher: PropTypes.func.isRequired,
  onlyShow: PropTypes.bool,
  headerColor: PropTypes.string.isRequired,
};

export default OrderWasherList;
