import React from "react";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import Paginator from "../../../components/paginator";
import OrderElementGroup from "../../orders/order_element_group";
import api from "../../../api";
import { prettyPhone } from "../../../utils/string_utils";
import LegalEntityOffcanvasDocs from "../../../components/legal_entity_offcanvas_docs";

const LegalEntityList = forwardRef(function MyInput(props, ref) {
  const [loading, setLoading] = React.useState(true);
  const [legalEntities, setLegalEntities] = React.useState({});
  const [current_page, setCurrentPage] = React.useState(1);
  const [total_page, setTotalPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const navigate = useNavigate();

  let items_limit = 8;

  if (isMobile) {
    items_limit = 4;
  }

  React.useImperativeHandle(ref, () => ({
    setSearch,
  }));

  const getLegalEntities = React.useCallback(() => {
    setLoading(true);
    api
      .getLegalEntities(current_page, items_limit, search)
      .then((res) => {
        setLegalEntities(res.results);
        setTotalPage(res.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          alert(errors.join(", "));
        }
      });
  }, [current_page, items_limit, search]);

  React.useEffect(() => {
    getLegalEntities();
  }, [getLegalEntities]);

  const ChangePage = (new_page) => {
    setCurrentPage(new_page);
  };

  if (legalEntities.length === 0) {
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
              {legalEntities?.map((legal_entity, l_index) => (
                <div key={legal_entity.id} className="card shadow">
                  <div className="card-header bg-primary pt-1 pb-1">
                    <div className="row fs-7 fw-medium">
                      <div
                        className="text-start text-white fw-medium "
                        style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
                      >
                        {legal_entity.short_name}
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-1 pb-0">
                    {/* <div className="d-flex align-items-center"> */}
                    <div className="row d-sm-flex flex-sm-row flex-column fs-7">
                      <div className="col  pt-1" id="services">
                        <OrderElementGroup
                          header="Информация"
                          elements_with_badge={[
                            {
                              name: (
                                <>
                                  <b>ИНН:</b> {legal_entity.inn}
                                </>
                              ),
                              badge: "",
                            },
                            {
                              name: (
                                <>
                                  <b>Телефон:</b>{" "}
                                  {legal_entity.phone ? (
                                    <a
                                      className="alert-link"
                                      href={`tel:${legal_entity.phone}`}
                                    >
                                      {prettyPhone(legal_entity.phone)}
                                    </a>
                                  ) : (
                                    "не указан"
                                  )}
                                </>
                              ),
                              badge: "",
                            },
                            { name: legal_entity.director_name, badge: "" },
                          ]}
                        />
                      </div>
                      <div className="col  pt-1" id="washers">
                        <OrderElementGroup
                          header="Связные ТС/ПП/ППЦ"
                          elements_with_badge={legal_entity?.vehicles?.map(
                            (vehicle) => ({
                              name: (
                                <>
                                  <b>
                                    {vehicle?.without_plate_number
                                      ? "Без гос. номера"
                                      : vehicle?.plate_number}
                                    :
                                  </b>{" "}
                                  {vehicle?.vehicle_class_name}{" "}
                                  {vehicle?.vehicle_model}{" "}
                                  {isMobile ? <br></br> : ""} (
                                  {vehicle?.vehicle_type_name})
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
                          navigate(`./${legal_entity.id}/`);
                        }}
                        colorClass="btn-primary btn-sm"
                        type="button"
                        disabled={false}
                      >
                        <>Редактировать</>
                      </Button>
                    </div>
                    <div className="row mx-3 mb-2">
                      <Button
                        clickHandler={() => {}}
                        colorClass="btn-info btn-sm"
                        type="button"
                        disabled={false}
                        offcanvasName={`LE${l_index}_offcanvas`}
                        marginBottom={2}
                      >
                        <>Документы</>
                      </Button>
                      <LegalEntityOffcanvasDocs
                        legalEntity={legal_entity}
                        offcanvasName={`LE${l_index}_offcanvas`}
                      />
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

LegalEntityList.propTypes = {
  //   vehicleClasses: PropTypes.array.isRequired,
  //   total_page: PropTypes.number.isRequired,
  //   current_page: PropTypes.number.isRequired,
  //   ChangePage: PropTypes.func.isRequired,
};

export default LegalEntityList;
