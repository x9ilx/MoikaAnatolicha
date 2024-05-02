import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";

const SelectPaymentMethod = (props) => {

  const [paymentMethods, setPaymentsMethod] = React.useState([])

  const getPaymentMethods = React.useCallback(() => {
    api
      .getPaymentMethods()
      .then((res) => {
        setPaymentsMethod(res)
        props.onSetPaymentMethod(props.currentPaymentMethod || res[0].name);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, []);

  React.useEffect(() => {
    getPaymentMethods();
  }, [])


  return (
    <>
      <div className="form-floating mb-3">
        <p className="">Способ оплаты:</p>
        <select
        disabled={!props.enable}
          className="form-select text p-3"
          id="currentType"
          placeholder="currentType"
          value={props.currentPaymentMethod}
          onChange={(e) => {
            props.onSetPaymentMethod(e.target.value);
          }}
          name="currentType"
        >
          {paymentMethods.map((method, ind) => (
            <option key={ind + "sdfsdfsfd"} value={method.name}>
              {method.verbose_name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

SelectPaymentMethod.propTypes = {
  currentPaymentMethod: PropTypes.string.isRequired,
  onSetPaymentMethod: PropTypes.func.isRequired,
  enable: PropTypes.bool,
};

export default SelectPaymentMethod;
