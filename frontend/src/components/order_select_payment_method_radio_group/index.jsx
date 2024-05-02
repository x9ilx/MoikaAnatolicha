import React from "react";
import PropTypes from "prop-types";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import api from "../../api";
import SelectPaymentMethod from "../order_select_payment_method";

const SelectPaymentMethodRadioGroup = (props) => {
  const [paymentMethods, setPaymentsMethod] = React.useState([]);

  const getPaymentMethods = React.useCallback(() => {
    api
      .getPaymentMethods()
      .then((res) => {
        setPaymentsMethod(res);
        props.onSetPaymentMethod(props.currentPaymentMethod || res[0].name);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, []);

  React.useEffect(() => {
    getPaymentMethods();
  }, []);

  if (isMobile) {
    return (
      <div className="form-floating mb-3">
        <SelectPaymentMethod
          onSetPaymentMethod={props.onSetPaymentMethod}
          currentPaymentMethod={props.currentPaymentMethod}
          enable={props.enable}
        />
      </div>
    );
  }

  return (
    <div className="form-floating mb-0">
      <p className="m-0">Способ оплаты:</p>
      <div
        className="row mb-3"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        {paymentMethods.map((method, ind) => (
          <div key={`paymentMethods${ind}`} className="col" style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}>
            <input
              type="radio"
              className="btn-check"
              name={"btnradio" + ind}
              id={"btnradio" + ind}
              autoComplete="off"
              checked={props.currentPaymentMethod === method.name}
              value={method.name}
              onChange={(e) => {
                props.onSetPaymentMethod(e.target.value);
              }}
              disabled={!props.enable}
            />
            <label
              className="btn btn-outline-primary  w-100 btn-sm"
              style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)"}}
              htmlFor={"btnradio" + ind}
            >
              {method.verbose_name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

SelectPaymentMethodRadioGroup.propTypes = {
  currentPaymentMethod: PropTypes.string.isRequired,
  onSetPaymentMethod: PropTypes.func.isRequired,
  enable: PropTypes.bool,
};

export default SelectPaymentMethodRadioGroup;