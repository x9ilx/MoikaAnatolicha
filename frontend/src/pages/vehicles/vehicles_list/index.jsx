import React from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api";
import Button from "../../../components/button";
import Paginator from "../../../components/paginator";
import OrderElementGroup from "../../orders/order_element_group";

const VehiclesList = React.forwardRef(function MyInput(props, ref) {
  const [loading, setLoading] = React.useState(true);
  const [vehicles, setVehicles] = React.useState({});

  const [current_page, setCurrentPage] = React.useState(1);
  const [total_page, setTotalPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const navigate = useNavigate();

  React.useImperativeHandle(ref, () => ({
    setSearch,
  }));


  let items_limit = 8;

  if (isMobile) {
    items_limit = 4;
  }

  const getVehiclesList = React.useCallback(() => {
    setLoading(true);
    api
      .getVehiclesList(current_page, items_limit, search)
      .then((res) => {
        setVehicles(res.results);
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
    getVehiclesList();
  }, [getVehiclesList]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const ChangePage = (new_page) => {
    setCurrentPage(new_page);
  };

  {
    document.title = "Редактирование ТС/ПП/ППЦ Чистый Грузовик";
  }

  if (vehicles.length === 0) {
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
          Загрузка списка ТС/ПП/ППЦ...
        </p>
      )}
      {!loading && (
        <>
          <div className="mt-4">
            <div className="row mb-3">
              <div className="vstack gap-3">
                {vehicles?.map((vehicle) => (
                  <div className="card shadow" key={vehicle?.id}>
                    <div className="card-header bg-primary pl-2 pr-2 pt-1 pb-1">
                      <div className="row fs-8 fw-medium">
                        <div
                          className="text-start  text-white fs-7 fw-medium"
                          style={{
                            textShadow: "1px -1px 7px rgba(0,0,0,0.45)",
                          }}
                        >
                          {vehicle?.vehicle_type?.vehicle_class_name}{" "}
                          {vehicle?.vehicle_model}
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-1 pb-1">
                      <div className="row px-4 d-sm-flex flex-sm-row flex-column fs-8">
                        <div className="col  pt-1" id="services">
                          <OrderElementGroup
                            header="Информация о ТС/ПП/ППЦ"
                            elements_with_badge={[
                              {
                                name: (
                                  <>
                                    <b>Гос. номер: {vehicle?.without_plate_number ? "без гос. номера": vehicle?.plate_number}</b> 
                                  </>
                                ),
                                badge: "",
                              },
                              {
                                name: (
                                  <>
                                    <b>Тип:</b> {vehicle?.vehicle_type?.name || "Класс ТС удалён"}
                                  </>
                                ),
                                badge: "",
                              },
                            ]}
                          />
                        </div>
                        <div className="col  pt-1" id="services">
                          <OrderElementGroup
                            header="Информация о владельце"
                            elements_with_badge={[
                              {
                                name: (
                                  <>
                                    {vehicle?.owner?.short_name}
                                  </>
                                ),
                                badge: "",
                              },
                            ]}
                          />
                        </div>
                      </div>
                      <div className="row mx-3 gap-1 my-2">
                        <Button
                          clickHandler={() =>
                            navigate("/vehicles/" + vehicle?.id)
                          }
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
          </div>
        </>
      )}
    </>
  );
});

export default VehiclesList;
