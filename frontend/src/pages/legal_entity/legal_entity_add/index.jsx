import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import Button from "../../../components/button";
import DataListVehicle from "../../../components/data_list_vehicle";

const LegalEntityAdd = (props) => {
  const [requisites, setRequisites] = React.useState({
    name: "",
    short_name: "",
    address: "",
    ogrn: "",
    inn: "",
    okved: "",
    okpo: "",
    name_of_bank: "",
    correspondent_account_of_bank: "",
    bik_of_bank: "",
    account_number_of_IP: "",
    email: "",
    phone: "",
    director_name: "",
    mechanic_name: "",
    accountent_name: "",
    mechanic_phone: "",
    accountent_phone: "",
    kpp: "",
    vehicles_save: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [DELETE, setDELETE] = React.useState(false);
  const [showAddVehicle, setShowAddVehicle] = React.useState(false);
  const [vehicleList, setVehicleList] = React.useState([]);

  const navigate = useNavigate();
  const { legal_entity_id } = useParams();

  const getLegalEntity = React.useCallback(() => {
    api
      .getLegalEntity(legal_entity_id)
      .then((res) => {
        setVehicleList(res.vehicles);
        setRequisites(res);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [legal_entity_id]);

  const validate = () => {
    if (requisites.name.trim().length === 0) {
      toast.error("Необходимо указать название контрагента");
      return false;
    }
    if (requisites.short_name.trim().length === 0) {
      toast.error("Необходимо указать короткое название контрагента");
      return false;
    }
    return true;
  };

  const createLegalEntity = () => {
    if (!validate()) {
      return;
    }
    const new_vehicle_requisites = {
      ...requisites,
      vehicles_save: vehicleList,
    };
    api
      .createLegalEntity(new_vehicle_requisites)
      .then((data) => {
        toast.success(`Контрагент "${data.name}" успешно создан`);
        navigate(-1);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  React.useEffect(() => {
    if (legal_entity_id) {
      setLoading(true);
      getLegalEntity();
      setLoading(false);
    }
  }, []);

  const updateLegalEntity = () => {
    if (!validate()) {
      return;
    }
    const new_vehicle_requisites = {
      ...requisites,
      vehicles_save: vehicleList,
    };
    api
      .updateLegalEntity(legal_entity_id, new_vehicle_requisites)
      .then((data) => {
        toast.success(`Данные "${data.name}" успешно обновлены`);
        navigate(-1);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  const onChangeInput = (e) => {
    setRequisites((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading & legal_entity_id) {
    <>
      <p className="grid h-screen place-items-center text-center">
        Загрузка...
      </p>
    </>;
  } else {
    return (
      <>
        <p className="fw-medium">Создание контрагента:</p>
        <p className="blockquote-footer">
          Не используемые реквизиты необходимо оставить пустыми
        </p>

        <form
          autoComplete="new-password"
          className="my-3"
          onSubmit={(e) => {
            e.preventDefault();
            {
              legal_entity_id ? updateLegalEntity() : createLegalEntity();
            }
          }}
        >
          {legal_entity_id && (
            <Button
              clickHandler={() => {
                navigate("./services/");
              }}
              colorClass="btn-info btn-sm"
              type="button"
              disabled={false}
            >
              <>Назначить услуги</>
            </Button>
          )}
          <hr></hr>
          <div
            className="accordion accordion-flush mb-3"
            id="accordionFlushExample"
          >
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="true"
                  aria-controls="flush-collapseOne"
                >
                  Основные
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse show"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="name"
                      placeholder="name"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.name}
                      name="name"
                    />
                    <label htmlFor="name">Наименование организации</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="short_name"
                      placeholder="short_name"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.short_name}
                      name="short_name"
                    />
                    <label htmlFor="short_name">
                      Короткое наименование организации
                    </label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="address"
                      placeholder="address"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.address}
                      name="address"
                    />
                    <label htmlFor="address">Юридический адрес</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="email"
                      placeholder="email"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.email}
                      name="email"
                    />
                    <label htmlFor="email">E-mail</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control text"
                      id="phone"
                      placeholder="phone"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.phone}
                      name="phone"
                    />
                    <label htmlFor="phone">Телефон</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="director_name"
                      placeholder="director_name"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.director_name}
                      name="director_name"
                    />
                    <label htmlFor="director_name">
                      Ф. И. О. руководящего лица
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseTwo"
                  aria-expanded="false"
                  aria-controls="flush-collapseTwo"
                >
                  Государственные
                </button>
              </h2>
              <div
                id="flush-collapseTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="ogrn"
                      placeholder="ogrn"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.ogrn}
                      name="ogrn"
                    />
                    <label htmlFor="ogrn">ОГРН</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="inn"
                      placeholder="inn"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.inn}
                      name="inn"
                    />
                    <label htmlFor="inn">ИНН</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="kpp"
                      placeholder="kpp"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.kpp}
                      name="kpp"
                    />
                    <label htmlFor="inn">КПП</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="okved"
                      placeholder="okved"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.okved}
                      name="okved"
                    />
                    <label htmlFor="okved">ОКВЭД</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="okpo"
                      placeholder="okpo"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.okpo}
                      name="okpo"
                    />
                    <label htmlFor="okpo">ОКПО</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseThree"
                  aria-expanded="false"
                  aria-controls="flush-collapseThree"
                >
                  Банковские
                </button>
              </h2>
              <div
                id="flush-collapseThree"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="name_of_bank"
                      placeholder="name_of_bank"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.name_of_bank}
                      name="name_of_bank"
                    />
                    <label htmlFor="name_of_bank">Наименование банка</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="correspondent_account_of_bank"
                      placeholder="correspondent_account_of_bank"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.correspondent_account_of_bank}
                      name="correspondent_account_of_bank"
                    />
                    <label htmlFor="correspondent_account_of_bank">
                      Кореспондентский счёт
                    </label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="bik_of_bank"
                      placeholder="bik_of_bank"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.bik_of_bank}
                      name="bik_of_bank"
                    />
                    <label htmlFor="bik_of_bank">БИК</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="account_number_of_IP"
                      placeholder="account_number_of_IP"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.account_number_of_IP}
                      name="account_number_of_IP"
                    />
                    <label htmlFor="account_number_of_IP">Расчётный счёт</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapse4"
                  aria-expanded="false"
                  aria-controls="flush-collapse4"
                >
                  Прочее
                </button>
              </h2>
              <div
                id="flush-collapse4"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="mechanic_name"
                      placeholder="mechanic_name"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.mechanic_name}
                      name="mechanic_name"
                    />
                    <label htmlFor="mechanic_name">Ф. И. О. механика</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control text"
                      id="mechanic_phone"
                      placeholder="mechanic_phone"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.mechanic_phone}
                      name="mechanic_phone"
                    />
                    <label htmlFor="mechanic_phone">Телефон механика</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control text"
                      id="accountent_name"
                      placeholder="accountent_name"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.accountent_name}
                      name="accountent_name"
                    />
                    <label htmlFor="accountent_name">Ф. И. О. бухгалтера</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control text"
                      id="accountent_phone"
                      placeholder="accountent_phone"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={requisites.accountent_phone}
                      name="accountent_phone"
                    />
                    <label htmlFor="accountent_phone">Телефон бухгалтера</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapse5"
                  aria-expanded="false"
                  aria-controls="flush-collapse5"
                >
                  Связные ТС/ПП/ППЦ
                </button>
              </h2>
              <div
                id="flush-collapse5"
                className="accordion-collapse collapse "
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <DataListVehicle
                    vehicleListFinal={vehicleList.length > 0 ? vehicleList : []}
                    setVehicleListFinal={setVehicleList}
                    ownerId={requisites?.id ? requisites?.id : null}
                    ownerName={requisites.name}
                    onShowAdd={setShowAddVehicle}
                  />
                </div>
              </div>
            </div>
          </div>
          {requisites.current_contract > 0 && (
            <span className="fw-medium">
              Текущий договор:{" "}
              <a
                className="link-body-emphasis"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate(`./contract/${requisites.current_contract}/`);
                }}
              >
                {requisites.current_contract_verbose}
              </a>
            </span>
          )}
          <hr></hr>
          {!showAddVehicle && (
            <>
              <Button
                clickHandler={() => {}}
                colorClass="btn-success"
                type="submit"
                disabled={false}
              >
                <>Сохранить данные</>
              </Button>
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

              {legal_entity_id && (
                <>
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
                      Удалить данные о контрагенте
                    </label>
                  </div>
                  {DELETE && (
                    <>
                      <Button
                        clickHandler={() => {
                          props.setInfoStringForDelete(
                            "контрагента " + requisites.name
                          );
                          props.setId(legal_entity_id);
                          navigate("./delete/");
                        }}
                        colorClass="btn-danger"
                        type="button"
                        disabled={false}
                      >
                        <>УДАЛИТЬ ЗАПИСЬ О КОНТРАГЕНТЕ</>
                      </Button>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </form>
      </>
    );
  }
};

LegalEntityAdd.propTypes = {
  setInfoStringForDelete: PropTypes.func,
  setId: PropTypes.func,
};

export default LegalEntityAdd;
