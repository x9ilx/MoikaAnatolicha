import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { forwardRef } from "react";
import api from "../../../api";
import OrderElementGroup from "../../orders/order_element_group";
import Paginator from "../../../components/paginator";
import { isMobile } from "react-device-detect";
import Button from "../../../components/button";
import OrderElement from "../order_element";

const CompleteOrderListV2 = forwardRef(function MyInput(props, ref) {
  const [loading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState({});

  const [search, setSearch] = React.useState(props.search);
  const [dateStart, setDateStart] = React.useState("");
  const [dateEnd, setDateEnd] = React.useState("");

  const [current_page, setCurrentPage] = React.useState(1);
  const [total_page, setTotalPage] = React.useState(1);

  let items_limit = 8;

  if (isMobile) {
    items_limit = 4;
  }

  const navigate = useNavigate();

  React.useImperativeHandle(ref, () => ({
    setSearch,
    setDateStart,
    setDateEnd,
  }));

  const getOrders = React.useCallback(() => {
    setLoading(true);
    api
      .getOrders(
        current_page,
        items_limit,
        true,
        `&order_datetime__gte=${
          dateStart ? new Date(dateStart).toISOString().slice(0, -14) : ""
        }&order_datetime__lte=${
          dateEnd ? new Date(dateEnd).toISOString().slice(0, -14) : ""
        }&multi_search=${search}`
      )
      .then((res) => {
        setOrders(res.results);
        setTotalPage(res.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [search, current_page, dateEnd, dateStart, items_limit]);

  React.useEffect(() => {
    getOrders();
  }, [search, dateStart, dateEnd, getOrders]);

  const ChangePage = (new_page) => {
    setCurrentPage(new_page);
  };

  if (orders.length === 0) {
    return (
      <>
        <p className="grid h-screen place-items-center text-center mb-2">
          Ничего не найдено
        </p>
      </>
    );
  }

  return (
    <div>
      {loading && (
        <p className="grid h-screen place-items-center text-center mb-2">
          Загрузка списка техники...
        </p>
      )}
      {!loading && (
        <div className="row mb-3">
          <div className="vstack gap-3">
            {orders?.map((order) => (
                <OrderElement
                key={`ord${order.id}`}
                  order={order}
                  isCompletedOrder={true}
                  isSalaryInfo={true}
                />
            ))}

            <Paginator
              total_page={total_page}
              current_page={current_page}
              OnChangePage={ChangePage}
            />
          </div>
        </div>
      )}
    </div>
  );
});

CompleteOrderListV2.propTypes = {
  search: PropTypes.string,
  //   total_page: PropTypes.number.isRequired,
  //   current_page: PropTypes.number.isRequired,
  //   ChangePage: PropTypes.func.isRequired,
};

export default CompleteOrderListV2;
