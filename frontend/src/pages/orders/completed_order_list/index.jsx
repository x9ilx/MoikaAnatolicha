import React from "react";
import OrderElement from "../order_element";
import api from "../../../api";
import Paginator from "../../../components/paginator";
import { useAuth } from "../../../contexts/auth-context";
import { EmployerPosition } from "../../../constants";

const CompletedOrderList = () => {
  const [loading, setLoading] = React.useState(true);
  const [current_page, setCurrentPage] = React.useState(1);
  const [total_page, setTotalPage] = React.useState(1);

  const [activeOrders, setActiveOrders] = React.useState([]);

  const auth = useAuth();

  let items_limit = 4;

  const ChangePage = (new_page) => {
    setCurrentPage(new_page);
  };

  const getOrders = React.useCallback(() => {
    api.getCompletedOrdersForDay(current_page, items_limit).then((data) => {
      setActiveOrders(data.results);
      setTotalPage(data.total_pages);
    });
  }, [current_page, items_limit]);

  React.useEffect(() => {
    setLoading(true);
    getOrders();
    setLoading(false);
  }, [getOrders]);

  if (loading) {
    return (
      <>
        <p className="grid h-screen place-items-center text-center">
          Загрузка...
        </p>
      </>
    );
  }

  return (
    <>
      <p className="fw-medium">Выполненные заказы:</p>
      {auth.employerInfo.employer_info.position === EmployerPosition.MANAGER && <p className="blockquote-footer">за сутки</p>}
      {auth.employerInfo.employer_info.position === EmployerPosition.ADMINISTRATOR && <p className="blockquote-footer">за текущую смену</p>}
      <div className="row">
        <div className="vstack gap-3">
          {activeOrders.map((order, index) => (
            <OrderElement
              key={"activeOrders" + index}
              order={order}
              isCompletedOrder={true}
            />
          ))}
          <Paginator
            total_page={total_page}
            current_page={current_page}
            OnChangePage={ChangePage}
          />
        </div>
      </div>
    </>
  );
};

export default CompletedOrderList;
