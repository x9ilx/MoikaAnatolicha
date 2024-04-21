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
        props.onSetPaymentMethod(res[0].name);
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
        <p className="">Метод оплаты:</p>
        <select
          className="form-select text p-3"
          id="currentType"
          placeholder="currentType"
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
  onSetPaymentMethod: PropTypes.func.isRequired,
};

export default SelectPaymentMethod;
