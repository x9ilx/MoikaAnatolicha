import React from "react";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import Paginator from "../../../components/paginator";
import OrderElementGroup from "../../orders/order_element_group";
import { toast } from "react-toastify";
import api from "../../../api";

const VehicleClassList = forwardRef(function MyInput(props, ref) {
  const [loading, setLoading] = React.useState(true);
  const [vehicleClasses, setVehicleClasses] = React.useState({});
  const [current_page, setCurrentPage] = React.useState(1);
  const [total_page, setTotalPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const navigate = useNavigate();

  let items_limit = 8;

  if (isMobile) {
    items_limit = 4;
  }

  React.useImperativeHandle(ref, () => ({
    setSearch
  }));

  const getVehicleClasses = React.useCallback(() => {
    setLoading(true);
    api
      .getVehicleClasses(current_page, items_limit, search)
      .then((res) => {
        setVehicleClasses(res.results);
        setTotalPage(res.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [current_page, items_limit, search]);

  React.useEffect(() => {
    getVehicleClasses();
  }, [getVehicleClasses]);

  const ChangePage = (new_page) => {
    setCurrentPage(new_page);
  };


  if (vehicleClasses.length === 0) {
    return <>
    <p className="grid h-screen place-items-center text-center mb-2">
          Ничего не найдено
        </p>
    </>
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
          <div className="row mb-3" >
            <div className="vstack gap-3">
              {vehicleClasses?.map((vehicle) => (
                <div className="card shadow" key={vehicle?.id}>
                  <div className="card-header bg-primary pl-2 pr-2 pt-1 pb-1">
                    <div className="row fs-8 fw-medium">
                      <div
                        className="col-7 text-start  text-white fs-7 fw-medium"
                        style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
                      >
                        {vehicle?.name}
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-1 pb-0">
                    <div className="row px-4 d-sm-flex flex-sm-row flex-column fs-8">
                      <OrderElementGroup
                        header="Типы для услуг"
                        elements_with_badge={vehicle.vehicle_types?.map(
                          (vehicle_type) => ({
                            name: vehicle_type.name,
                            badge: "",
                          })
                        )}
                      />
                    </div>
                    <div className="row mx-3 gap-1 my-2">
                      <Button
                        clickHandler={() => {
                          navigate("/vehicles/classes/" + vehicle?.id);
                        }}
                        colorClass="btn-primary"
                        type="button"
                        disabled={false}
                      >
                        <>Редактировать</>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Paginator
            total_page={total_page}
            current_page={current_page}
            OnChangePage={ChangePage}
          />
        </>
      )}
    </>
  );
});

VehicleClassList.propTypes = {
  //   vehicleClasses: PropTypes.array.isRequired,
  //   total_page: PropTypes.number.isRequired,
  //   current_page: PropTypes.number.isRequired,
  //   ChangePage: PropTypes.func.isRequired,
};

export default VehicleClassList;
