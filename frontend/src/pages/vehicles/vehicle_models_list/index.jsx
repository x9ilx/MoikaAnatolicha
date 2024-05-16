import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { forwardRef } from "react";
import { ImCross } from "react-icons/im";
import api from "../../../api";
import OrderElementGroup from "../../orders/order_element_group";

const VehicleModelsList = forwardRef(function MyInput(props, ref) {
  const [loading, setLoading] = React.useState(true);
  const [vehicleModels, setVehicleModels] = React.useState({});

  const [search, setSearch] = React.useState("");

  React.useImperativeHandle(ref, () => ({
    setSearch,
  }));

  const getVehicleModels = React.useCallback(() => {
    setLoading(true);
    api
      .getVehicleModels(search)
      .then((res) => {
        setVehicleModels(res);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [search]);

  const deleteVehicleModel = React.useCallback((id) => {
    api
      .deleteVehicleModel(id)
      .then((res) => {
        getVehicleModels(res);
        toast.success("Модель ТС/ПП/ППЦ успешно удалена");
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, []);

  const deleteModel = (model_id) => {
    deleteVehicleModel(model_id);
  }

  React.useEffect(() => {
    getVehicleModels();
  }, [search]);

  if (vehicleModels.length === 0) {
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
                header="Модели:"
                elements_with_badge={vehicleModels?.map(
                  (vehicle_model, index) => ({
                    name: (
                      <>
                        <span key={"qweqweqweqewqsdfsfs" + index}>
                          {vehicle_model.name}
                        </span>
                      </>
                    ),
                    badge: <>
                    <ImCross
                    size={14}
                    className="text-danger"
                    style={{cursor: "pointer"}} title="Удалить модель"
                    onClick={() => {
                        if (confirm(`Удалить модель "${vehicle_model.name}"?`) == true) {
                            deleteModel(vehicle_model.id);
                        }
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

VehicleModelsList.propTypes = {
  //   vehicleClasses: PropTypes.array.isRequired,
  //   total_page: PropTypes.number.isRequired,
  //   current_page: PropTypes.number.isRequired,
  //   ChangePage: PropTypes.func.isRequired,
};

export default VehicleModelsList;
