import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forwardRef } from "react";
import { MdModeEdit } from "react-icons/md";
import api from "../../../api";
import OrderElementGroup from "../../orders/order_element_group";


const ServicesList = forwardRef(function MyInput(props, ref) {
  const [loading, setLoading] = React.useState(true);
  const [services, setServices] = React.useState([]);

  const [search, setSearch] = React.useState("");

  const navigate = useNavigate();

  React.useImperativeHandle(ref, () => ({
    setSearch,
  }));

  const getServices = React.useCallback(() => {
    setLoading(true);
    api
      .getServices(search)
      .then((res) => {
        setServices(res);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [search]);


  React.useEffect(() => {
    getServices();
  }, [search]);

  if (services.length === 0) {
    return (
      <>
        <p className="grid h-screen place-items-center text-center mb-2">
          Ничего не найдено
        </p>
      </>
    );
  }

  return (
    <>
      {loading && (
        <p className="grid h-screen place-items-center text-center mb-2">
          Загрузка списка техники...
        </p>
      )}
      {!loading && (
        <>
          <div className="row mb-3">
            <div className="vstack gap-3">
              <OrderElementGroup
                header="Список услуг:"
                elements_with_badge={services?.map(
                  (service, index) => ({
                    name: (
                      <>
                        <span key={"qweqweqweqewqsdfsfs" + index}>
                          {service.name}
                        </span>
                      </>
                    ),
                    badge: <>
                    <MdModeEdit
                    size={24}
                    className="text-text-color"
                    style={{cursor: "pointer"}} title="Редактировать услугу"
                    onClick={() => {
                       navigate(`./${service.id}/`)
                    }}
                    />
                    </>,
                  })
                )}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
});

ServicesList.propTypes = {
  //   vehicleClasses: PropTypes.array.isRequired,
  //   total_page: PropTypes.number.isRequired,
  //   current_page: PropTypes.number.isRequired,
  //   ChangePage: PropTypes.func.isRequired,
};

export default ServicesList;
