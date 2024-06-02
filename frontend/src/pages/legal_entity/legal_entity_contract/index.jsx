import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import { toast } from "react-toastify";
import EditOrderCurrentVehicle from "../../../components/edit_order_current_vehicle";
import PropTypes from "prop-types";
import OrderElementGroup from "../../orders/order_element_group";
import Button from "../../../components/button";

const LegalEntityContract = (props) => {
  const [DELETE, setDELETE] = React.useState(false);

  const [dateStart, setDateStart] = React.useState("");
  const [dateEnd, setDateEnd] = React.useState("");
  const [contract, setContract] = React.useState({});
  const [legalEntity, setLegalEntity] = React.useState("");
  const [legalEntityServices, setLegalEntityServices] = React.useState([]);

  const { legal_entity_id } = useParams();
  const { contract_id } = useParams();

  const navigate = useNavigate();

  const getContract = () => {
    api.getGetContract(contract_id).then((res) => {
      setContract(res);
      setDateStart(res.start_date);
      setDateEnd(res.end_date);
      setLegalEntityServices(res.services);
    });
  };

  const setContractToCurrent = () => {
    if (confirm(`Действительно сделать договор текущим?`) != true) {
      return;
    }

    api
      .setContractToCurrent(contract_id)
      .then((res) => {
        navigate(0, {replace: true});
        toast.success(
          "Текущий договор изменён на " + res?.legal_entity_contract
        );
        
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  const createContract = () => {
    if (dateStart === "" || dateStart == undefined) {
      toast.error("Необходимо выбрать дату начала действия договора");
      return;
    }
    if (dateEnd === "" || dateEnd == undefined) {
      toast.error("Необходимо выбрать дату окончания действия договора");
      return;
    }
    api
      .createContract(
        legal_entity_id,
        new Date(dateStart).toISOString().split("T")[0],
        new Date(dateEnd).toISOString().split("T")[0]
      )
      .then((res) => {
        navigate(`/legal_entity/${legal_entity_id}/contract/${res}/`, {
          replace: true,
        });
        toast.success("Договор успешно сохранён");
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

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

  const getVehicleServicesList = React.useCallback(() => {
    api
      .getLegalEntityServicesList(legal_entity_id)
      .then((res) => {
        setLegalEntityServices(res);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [legal_entity_id]);

  React.useEffect(() => {
      getLegalEntity();
    if (contract_id <= 0) {
      getVehicleServicesList();
    } else {
      getContract();
    }
  }, []);

  return (
    <div>
      <p className="fw-medium">
        {contract_id > 0
          ? "Информация о договоре №" +
            contract?.id +
            ": " +
            contract?.legal_entity?.short_name
          : "Формирование договора: " + legalEntity?.short_name}
      </p>
      <div className="row">
        <div className="col-sm-6 col-12 mb-3">
          <div className="form-floating">
            <input
              type="date"
              className="form-control text"
              id="dateS"
              placeholder="dateS"
              value={dateStart}
              onChange={(e) => {
                setDateStart(e.target.value);
              }}
              disabled={contract_id > 0}
              name="dateS"
            />
            <label htmlFor="dateS">Срок действия договора С</label>
          </div>
        </div>
        <div className="col-sm-6 col-12">
          <div className="form-floating">
            <input
              type="date"
              className="form-control text"
              id="dateP"
              placeholder="dateP"
              value={dateEnd}
              onChange={(e) => {
                setDateEnd(e.target.value);
              }}
              disabled={contract_id > 0}
              name="dateP"
            />
            <label htmlFor="dateP">Срок действия договора ПО</label>
          </div>
        </div>
      </div>

      <div className="mb-0">
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne2"
                aria-expanded="false"
                aria-controls="collapseOne2"
              >
                ТС/ПП/ППЦ
              </button>
            </h2>
            <div
              id="collapseOne2"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="mb-3">
                <EditOrderCurrentVehicle
                  onMarkDelete={null}
                  vehicleList={legalEntity.vehicles || contract.vehicles}
                  onlyShow={true}
                  withoutHeader={true}
                />
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                Услуги
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              {legalEntityServices?.map((item, index) => (
                <div key={`legalEntityServices${index}`}>
                  {item.vehicle_type?.map((vtype, vindex) => (
                    <OrderElementGroup
                      key={`item.vehicle_type${vindex}`}
                      header={
                        <span className="fs-8">
                          {item.vehicle_class_name} {vtype.vehicle_type_name}
                        </span>
                      }
                      elements_with_badge={vtype.services?.map((service) => ({
                        name: (
                          <div className="row">
                            <span className="fs-8">{service.name}</span>
                          </div>
                        ),
                        badge: <div className="fs-8">{service.cost}₽</div>,
                      }))}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
      {contract_id <= 0 && (
        <Button
          clickHandler={() => {
            createContract();
          }}
          colorClass="btn-success"
          type="button"
          disabled={false}
        >
          <>Сохранить</>
        </Button>
      )}

      {contract_id > 0 && (
        <div>
          <div className="form-check form-switch form-check-reverse pb-2">
            <input
              className="form-check-input "
              type="checkbox"
              id="DELETE"
              name="DELETE"
              onChange={() => {
                setDELETE(!DELETE);
              }}
            />
            <label className="form-check-label" htmlFor="DELETE">
              Удалить данные о договоре
            </label>
          </div>
          <Link to="./print/" target="_blank">
            <Button
              clickHandler={() => {}}
              colorClass="btn-info"
              type="button"
              disabled={false}
            >
              <>Печать договора</>
            </Button>
          </Link>
          <Button
            clickHandler={() => {
              setContractToCurrent();
            }}
            colorClass="btn-success"
            type="button"
            disabled={legalEntity.current_contract == contract_id}
          >
            <>Сделать текущим договором</>
          </Button>
          {DELETE && (
            <>
              <Button
                clickHandler={() => {
                  props.setInfoStringForDelete(
                    "Договор №" +
                      contract?.pk +
                      ": " +
                      contract.legal_entity.short_name
                  );
                  props.setId(contract_id);
                  navigate("./delete/");
                }}
                colorClass="btn-danger"
                type="button"
                disabled={false}
              >
                <>УДАЛИТЬ ЗАПИСЬ О ДОГОВОРЕ</>
              </Button>
            </>
          )}
        </div>
      )}

      <Button
        clickHandler={() => {
          navigate(-1);
        }}
        colorClass="btn-primary"
        type="button"
        disabled={false}
      >
        <>Назад</>
      </Button>
    </div>
  );
};

LegalEntityContract.propTypes = {
  setInfoStringForDelete: PropTypes.func,
  setId: PropTypes.func,
};

export default LegalEntityContract;
