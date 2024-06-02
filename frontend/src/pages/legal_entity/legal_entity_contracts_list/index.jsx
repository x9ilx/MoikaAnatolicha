import React from "react";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/button";
import Paginator from "../../../components/paginator";
import OrderElementGroup from "../../orders/order_element_group";
import api from "../../../api";
import { prettyPhone } from "../../../utils/string_utils";
import { toast } from "react-toastify";

const LegalEntityContractsList = forwardRef(function MyInput(props, ref) {
  const [loading, setLoading] = React.useState(true);
  const [legalEntity, setLegalEntity] = React.useState("");
  const [legalEntityContracts, setLegalEntityContracts] = React.useState({});
  const [current_page, setCurrentPage] = React.useState(1);
  const [total_page, setTotalPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const navigate = useNavigate();
  const { legal_entity_id } = useParams();

  let items_limit = 4;

  if (isMobile) {
    items_limit = 2;
  }

  React.useImperativeHandle(ref, () => ({
    setSearch,
  }));

  const getLegalEntity = React.useCallback(() => {
    api
      .getLegalEntity(legal_entity_id)
      .then((res) => {
        setLegalEntity(res);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [legal_entity_id]);

  const getLegalEntityContracts = React.useCallback(() => {
    setLoading(true);
    api
      .getLegalEntityContracts(current_page, items_limit, search)
      .then((res) => {
        res?.vehicles?.sort(function (a, b) {
          return b.vehicle.id - a.vehicle.id;
        });
        setLegalEntityContracts(res.results);
        setTotalPage(res.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  }, [current_page, items_limit, search]);

  React.useEffect(() => {
    getLegalEntity();
    getLegalEntityContracts();
  }, [current_page, items_limit, search]);

  const ChangePage = (new_page) => {
    setCurrentPage(new_page);
  };

  return (
    <>
      {loading && (
        <p className="grid h-screen place-items-center text-center mb-2">
          Загрузка списка договоров...
        </p>
      )}
      {!loading && (
        <>
          <hr></hr>
          <p className="fw-medium fs-5">
            История договоров: {legalEntity?.short_name}
          </p>
          <p className="blockquote-footer">
            Текущий договор: {legalEntity?.current_contract_verbose}
          </p>
          <hr></hr>
          <div className="row mb-3">
            <div className="vstack gap-3">
              {legalEntityContracts?.map((contract, l_index) => (
                <div key={contract?.id} className="card shadow">
                  <div className="card-header bg-primary pt-1 pb-1">
                    <div className="row fs-7 fw-medium">
                      <div
                        className="text-start text-white fw-medium "
                        style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
                      >
                        Договор №
                        {contract?.id}, от {new Date(contract?.start_date).toLocaleDateString()}г.
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-1 pb-0">
                    {/* <div className="d-flex align-items-center"> */}
                    <div className="row d-sm-flex flex-sm-row flex-column fs-7">
                      <div className="col pt-1" id="services">
                        <OrderElementGroup
                          header="Информация и услуги"
                          elements_with_badge={[
                            {
                              name: (
                                <>
                                  Срок действия: с{" "}
                                  {new Date(
                                    contract?.start_date
                                  ).toLocaleDateString()}
                                  г. по{" "}
                                  {new Date(
                                    contract?.end_date
                                  ).toLocaleDateString()}
                                  г.
                                </>
                              ),
                              badge: <></>,
                            },
                          ]}
                        />
                        {contract?.services?.map((service) =>
                          service?.vehicle_type?.map((vtype, index) => (
                            <OrderElementGroup
                              key={service}
                              header={
                                <>
                                  {service?.vehicle_class_name} -{" "}
                                  {vtype?.vehicle_type_name}
                                </>
                              }
                              elements_with_badge={vtype?.services?.map(
                                (service) => ({
                                  name: <>{service?.name}</>,
                                  badge: <>{service?.cost.toLocaleString()}₽</>,
                                })
                              )}
                            />
                          ))
                        )}
                      </div>
                      <div className="col pt-1" id="other">
                        <OrderElementGroup
                          header={<>Перечень ТС</>}
                          elements_with_badge={contract?.vehicles?.map(
                            (vehicle) => ({
                              name: (
                                <>
                                  <b>
                                    {vehicle.without_plate_number
                                      ? "Без гос. номера"
                                      : vehicle.plate_number}
                                    :
                                  </b>{" "}
                                  {vehicle.vehicle_model}{" "}
                                  {vehicle.vehicle_class_name} -{" "}
                                  {vehicle.vehicle_type_name}
                                </>
                              ),
                              badge: "",
                            })
                          )}
                        />
                      </div>
                    </div>
                    <div className="row mx-3 gap-1 mt-2">
                      <Button
                        clickHandler={() => {
                          navigate(
                            `../${legal_entity_id}/contract/${contract?.id}/`
                          );
                        }}
                        colorClass="btn-primary btn-sm"
                        type="button"
                        disabled={false}
                      >
                        <>Печать/Сделать текущим/Удалить</>
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

export default LegalEntityContractsList;
