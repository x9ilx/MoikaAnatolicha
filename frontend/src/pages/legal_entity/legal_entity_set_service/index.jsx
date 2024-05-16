import React from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import api from "../../../api";
import Button from "../../../components/button";
import OrderElementGroup from "../../orders/order_element_group";
import { ImCross } from "react-icons/im";

const LegalEntitySetServices = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [serviceAddition, setServiceAddition] = React.useState(false);
  const [deleteMode, setDeleteMode] = React.useState(false);

  const [name, setName] = React.useState("");
  const [inn, setInn] = React.useState("");
  const [vehicleList, setVehicleList] = React.useState([]);
  const [vehicleClassesList, setVehicleClassesList] = React.useState([]);
  const [currentVehicleClassIndex, setCurrentVehicleClassIndex] =
    React.useState(0);
  const [currentVehicleTypesIndex, setCurrentVehicleTypesIndex] =
    React.useState(0);
  const [currentServiceIndex, setCurrentServiceIndex] = React.useState(0);
  const [currentServiceID, setCurrentServiceID] = React.useState("");
  const [allServicesList, setAllServicesList] = React.useState([]);

  const [servicesList, setServicesList] = React.useState("");

  const navigate = useNavigate();
  const { legal_entity_id } = useParams();


  const setLegalEntityServicesList = React.useCallback(() => {
    api
      .setLegalEntityServicesList(legal_entity_id, servicesList)
      .then((res) => {
        navigate(0)
        toast.success("Данные успешно обновлены");
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [legal_entity_id, servicesList]);
  
  const getAllServicesList = React.useCallback((vehicle_type_id) => {
    api
      .getServicesForVehicleType(vehicle_type_id)
      .then((res) => {
        setAllServicesList(res);
        setCurrentServiceID(res[0]?.service.id || null);
        setCurrentServiceIndex(0);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, []);

  const setVehicleClass = React.useCallback(
    (vehicle_class_index) => {
      setCurrentVehicleClassIndex(parseInt(vehicle_class_index));
      setCurrentVehicleTypesIndex(0);
      const vehicle_type_id =
        vehicleClassesList[vehicle_class_index].vehicle_types[0].id;
      getAllServicesList(vehicle_type_id);
    },
    [getAllServicesList, vehicleClassesList]
  );

  const setVehicleType = React.useCallback(
    (vehicle_type_index) => {
      const vehicle_type_id =
        vehicleClassesList[currentVehicleClassIndex].vehicle_types[
          vehicle_type_index
        ].id;
      getAllServicesList(vehicle_type_id);
    },
    [vehicleClassesList, currentVehicleClassIndex, getAllServicesList]
  );

  const getVehicleServicesList = React.useCallback(() => {
    api
      .getLegalEntityVehicleServicesList(legal_entity_id)
      .then((res) => {
        setServicesList(res);
        if (res.length > 0) {
          toast.info("Список услуг загружен, на основании добавленых ТС");
        } else {
          toast.info("Список услуг не загружен. Нет данных.");
        }
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [legal_entity_id]);

  const getServicesList = React.useCallback(() => {
    api
      .getLegalEntityServicesList(legal_entity_id)
      .then((res) => {
        setServicesList(res);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [legal_entity_id]);

  const getLegalEntity = React.useCallback(() => {
    api
      .getLegalEntity(legal_entity_id)
      .then((res) => {
        setVehicleList(res.vehicles);
        setName(res.name);
        setInn(res.inn);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [legal_entity_id]);

  const getVehicleClasses = React.useCallback(() => {
    api
      .getVehicleClasses(1, 99999, "")
      .then((res) => {
        setVehicleClassesList(res.results);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [setVehicleType]);

  React.useEffect(() => {
    setLoading(true);
    if (legal_entity_id) {
      getLegalEntity();
      getServicesList();
    }
    getVehicleClasses();
    setLoading(false);
  }, []);

  const LoadServicesDefault = () => {
    if (confirm(`Данное действие обновит весь список. Продолжить?`) == true) {
      getVehicleServicesList();
    }
  };

  const checkServiceNumberInVehicleType = (array) => {
    let countType = 0;
    let countService = 0;

    array.map((item, class_index) => {
      countType = item?.vehicle_type?.length;

      item?.vehicle_type?.map((v_type, type_index) => {
        countService = v_type?.services?.length;

        v_type?.services?.map((service) => {
          if (service?.to_be_removed === true) {
            countService = countService - 1;
          }
        });

        if (countService === 0) {
          array[class_index].vehicle_type[type_index].show = false;
        }

        if (!v_type?.show) {
          countType = countType - 1;
        }
      });

      if (countType === 0) {
        array[class_index].show = false;
      }
    });

    return array;
  };

  const setValue = React.useCallback(
    (name, class_index, type_index, service_index, value, max_value) => {
      value = Number(value).toString();
      if (max_value > 0) {
        value = value > max_value ? max_value : value;
      }

      let newArr = [...servicesList]
      newArr[class_index].vehicle_type[type_index].services[service_index][name] = value
      setServicesList(newArr);
    },
    [servicesList]
  );

  const deleteService = React.useCallback(
    (serviceID, typeID, classID) => {
      let haveClassIndex = -1;
      let haveTypeIndex = -1;
      let haveServiceIndex = -1;

      servicesList.map((item, class_index) => {
        item?.vehicle_type.map((v_type, type_index) => {
          v_type?.services.map((service, service_index) => {
            if (
              service.id === serviceID &&
              v_type.vehicle_type_id === typeID &&
              item.vehicle_class_id === classID
            ) {
              haveClassIndex = class_index;
              haveTypeIndex = type_index;
              haveServiceIndex = service_index;
            }
          });
        });
      });

      let newArr = [...servicesList];
      newArr[haveClassIndex].vehicle_type[haveTypeIndex].services[
        haveServiceIndex
      ].to_be_removed = true;
      newArr[haveClassIndex].vehicle_type[haveTypeIndex].services[
        haveServiceIndex
      ].to_be_added = false;
      setServicesList(checkServiceNumberInVehicleType(newArr));
    },
    [servicesList]
  );

  const deleteType = React.useCallback(
    (typeID, classID) => {
      let newArr = [...servicesList];
      newArr[classID].vehicle_type[typeID].show = false;
      newArr[classID].vehicle_type[typeID].services.map((service) => {
        service.to_be_removed = true;
        service.to_be_added = false;
      }
      );

      setServicesList(checkServiceNumberInVehicleType(newArr));
    },
    [servicesList]
  );

  const addCustomService = React.useCallback(() => {
    const vehicle_class = {
      vehicle_class_id: vehicleClassesList[currentVehicleClassIndex].id,
      vehicle_class_name: vehicleClassesList[currentVehicleClassIndex].name,
      show: true,
    };
    const vehicle_type = {
      vehicle_type_id:
        vehicleClassesList[currentVehicleClassIndex].vehicle_types[
          currentVehicleTypesIndex
        ].id,
      vehicle_type_name:
        vehicleClassesList[currentVehicleClassIndex].vehicle_types[
          currentVehicleTypesIndex
        ].name,
      show: true,
    };
    const service = {
      service_type_id: -1,
      id: allServicesList[currentServiceIndex].service.id,
      name: allServicesList[currentServiceIndex].service.name,
      cost: allServicesList[currentServiceIndex].cost,
      employer_salary: allServicesList[currentServiceIndex].employer_salary,
      percentage_for_washer:
        allServicesList[currentServiceIndex].percentage_for_washer,
      to_be_added: true,
      to_be_removed: false,
    };
    let selectedVehicleClassID =
      vehicleClassesList[currentVehicleClassIndex].id;
    let selectedVehicleTypeID =
      vehicleClassesList[currentVehicleClassIndex].vehicle_types[
        currentVehicleTypesIndex
      ].id;

    if (servicesList.length > 0) {
      let haveClass = false;
      let haveClassIndex = -1;
      let haveType = false;
      let haveTypeIndex = -1;
      let haveService = false;
      let haveTypeService = -1;

      servicesList.map((item, index) => {
        if (item.vehicle_class_id === selectedVehicleClassID) {
          haveClass = true;
          haveClassIndex = index;

          item?.vehicle_type.map((v_type, index_type) => {
            if (v_type.vehicle_type_id === selectedVehicleTypeID) {
              haveType = true;
              haveTypeIndex = index_type;

              v_type?.services.map((service, index_service) => {
                if (service.id === currentServiceID) {
                  haveService = true;
                  haveTypeService = index_service;
                }
              });
            }
          });
        }
      });

      if (haveClass) {
        if (haveType) {
          if (haveService) {
            let newArr = servicesList;
            newArr[haveClassIndex].vehicle_type[haveTypeIndex].services[
              haveTypeService
            ].to_be_removed = false;
            newArr[haveClassIndex].vehicle_type[haveTypeIndex].services[
              haveTypeService
            ].to_be_added = true;
            newArr[haveClassIndex].vehicle_type[haveTypeIndex].show = true;
            newArr[haveClassIndex].show = true;
            setServicesList(checkServiceNumberInVehicleType(newArr));
          } else {
            let newArr = servicesList;
            const newData = { ...service };
            newArr[haveClassIndex].vehicle_type[haveTypeIndex].services.push({
              ...newData,
            });
            newArr[haveClassIndex].vehicle_type[haveTypeIndex].show = true;
            newArr[haveClassIndex].show = true;
            setServicesList(checkServiceNumberInVehicleType(newArr));
          }
        } else {
          let newArr = servicesList;
          const newData = {
            ...vehicle_type,
            show: true,
            services: [{ ...service }],
          };
          newArr[haveClassIndex].show = true;
          newArr[haveClassIndex].vehicle_type.push({ ...newData });
          setServicesList(checkServiceNumberInVehicleType(newArr));
        }
      } else {
        setServicesList((prevList) => {
          return prevList.concat({
            ...vehicle_class,
            show: true,
            vehicle_type: [
              {
                ...vehicle_type,
                show: true,
                services: [
                  {
                    ...service,
                  },
                ],
              },
            ],
          });
        });
      }
    } else {
      setServicesList([
        {
          ...vehicle_class,
          show: true,
          vehicle_type: [
            {
              ...vehicle_type,
              show: true,
              services: [
                {
                  ...service,
                },
              ],
            },
          ],
        },
      ]);
    }

    setCurrentVehicleClassIndex(0);
    setCurrentVehicleTypesIndex(0);
    setCurrentServiceIndex(0);
    setCurrentServiceID("");
    setServiceAddition(false);
  }, [
    allServicesList,
    currentServiceIndex,
    currentVehicleClassIndex,
    currentVehicleTypesIndex,
    servicesList,
    vehicleClassesList,
    currentServiceID,
  ]);

  return (
    <>
      {loading && (
        <p className="grid h-screen place-items-center text-center">
          Загрузка...
        </p>
      )}
      {!loading && (
        <>
          <p className="text-text-color fs-5">
            Переопределение стоимость услуг
          </p>
          {vehicleList.length > 0 && (
            <Button
              clickHandler={() => {
                LoadServicesDefault();
              }}
              colorClass="btn-info btn-sm"
              type="button"
              disabled={false}
            >
              <>Загрузить услуги исходя из ТС/ПП/ППЦ</>
            </Button>
          )}
          <hr></hr>
          <p>Наименование организации: {name}</p>
          <p className="blockquote-footer">ИНН: {inn}</p>
          <OrderElementGroup
            header="ТС/ПП/ППЦ:"
            elements_with_badge={vehicleList.map((vehicle, index) => ({
              name: (
                <div className="fs-7">
                  <b key={"vehicleListFinal554" + vehicle?.plate_number + index}>
                    {vehicle?.without_plate_number ? "Без гос. номера" : vehicle?.plate_number}:
                  </b>{" "}
                  {vehicle?.vehicle_class_name} {vehicle?.vehicle_model}{" "}
                  {isMobile && <br />}({vehicle?.vehicle_type_name})
                </div>
              ),
              badge: "",
            }))}
          />

          <form
            autoComplete="new-password"
            onSubmit={(e) => {
              e.preventDefault();
              {
                // employer_id ? UpdateEmployer() : CreateEmployer();
              }
            }}
          >
            {serviceAddition && (
              <p className="text-text-color fs-5 mt-3">Добавление услуги:</p>
            )}
            {!serviceAddition && (
              <p className="text-text-color fs-5 mt-3">
                Настройки доступных услуг:
              </p>
            )}
            {!serviceAddition && (
              <>
                <Button
                  clickHandler={() => {
                    setServiceAddition(true);
                    setVehicleClass(0);
                  }}
                  colorClass="btn-info btn-sm"
                  type="button"
                  disabled={false}
                >
                  <>Добавить услугу</>
                </Button>

                {servicesList.length > 0 && (
                  <Button
                    clickHandler={() => {
                      setDeleteMode(!deleteMode);
                    }}
                    colorClass="btn-danger btn-sm"
                    type="button"
                    disabled={false}
                  >
                    <>
                      {deleteMode
                        ? "Выключить режим удаления"
                        : "Включить режим удаления"}
                    </>
                  </Button>
                )}
              </>
            )}

            {serviceAddition && (
              <>
                <div className="form-floating mb-3">
                  <p className="">Класс ТС/ПП/ППЦ:</p>
                  <select
                    className="form-select text p-3"
                    id="currentClass"
                    placeholder="currentClass"
                    value={currentVehicleClassIndex}
                    onChange={(e) => {
                      setVehicleClass(parseInt(e.target.value));
                    }}
                    name="currentClass"
                  >
                    {vehicleClassesList?.map((vehicle_class, index) => (
                      <option key={"vehicleClassesList" + index} value={index}>
                        {vehicle_class.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-floating mb-3">
                  <p className="">Тип ТС/ПП/ППЦ:</p>
                  <select
                    className="form-select text p-3"
                    id="currentClass"
                    placeholder="currentClass"
                    value={currentVehicleTypesIndex}
                    onChange={(e) => {
                      setCurrentVehicleTypesIndex(parseInt(e.target.value));
                      setVehicleType(parseInt(e.target.value));
                    }}
                    name="currentClass"
                  >
                    {vehicleClassesList[
                      currentVehicleClassIndex
                    ].vehicle_types?.map((vehicle_type, index) => (
                      <option key={"vehicle_types" + index} value={index}>
                        {vehicle_type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-floating mb-3">
                  <p className="">Услуга:</p>
                  <select
                    className="form-select text p-3"
                    id="currentClass"
                    placeholder="currentClass"
                    value={currentServiceID}
                    onChange={(e) => {
                      setCurrentServiceID(parseInt(e.target.value));
                      setCurrentServiceIndex(parseInt(e.target.selectedIndex));
                    }}
                    name="currentClass"
                  >
                    {allServicesList?.map((service, index) => (
                      <option
                        key={"allServicesList" + index}
                        value={service.service.id}
                      >
                        {service.service.name}
                      </option>
                    ))}
                  </select>
                  <hr></hr>
                  <Button
                    clickHandler={() => {
                      addCustomService();
                    }}
                    colorClass="btn-success"
                    type="button"
                    disabled={false}
                  >
                    <>Добавить услугу</>
                  </Button>
                  <Button
                    clickHandler={() => {
                      setCurrentVehicleClassIndex(0);
                      setCurrentVehicleTypesIndex(0);
                      setServiceAddition(false);
                    }}
                    colorClass="btn-primary"
                    type="button"
                    disabled={false}
                  >
                    <>Отменить</>
                  </Button>
                </div>
              </>
            )}
            {!serviceAddition && (
              <>
                {servicesList.length > 0 && (
                  <>
                    <div
                      className="accordion accordion-flush"
                      id="accordionFlushExample"
                    >
                      {servicesList?.map((vehicle_class, class_index) => (
                        <div key={"werwrw" + class_index}>
                          {vehicle_class.show && (
                            <>
                              <div
                                key={
                                  vehicle_class.vehicle_class_name + class_index
                                }
                                className="accordion-item"
                              >
                                <h2 className="accordion-header">
                                  <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#flush-collapse${class_index}`}
                                    aria-expanded="false"
                                    aria-controls={`flush-collapse${class_index}`}
                                  >
                                    {vehicle_class.vehicle_class_name}
                                  </button>
                                </h2>
                                <div
                                  id={`flush-collapse${class_index}`}
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#accordionFlushExample"
                                >
                                  <div className="accordion-body ">
                                    {vehicle_class.vehicle_type?.map(
                                      (vehicle_type, type_index) => (
                                        <div key={"wqerwerwrf" + type_index}>
                                          {vehicle_type.show && (
                                            <>
                                              <div
                                                key={
                                                  vehicle_type.vehicle_type_name +
                                                  type_index
                                                }
                                              >
                                                <div className="row">
                                                  <p className="fw-medium fs-6 mb-0">
                                                    {
                                                      vehicle_type.vehicle_type_name
                                                    }
                                                    :
                                                  </p>
                                                </div>
                                                {deleteMode && (
                                                  <Button
                                                    clickHandler={() => {
                                                      if (
                                                        confirm(
                                                          `Действительно удалить тип "${vehicle_type.vehicle_type_name}" класса "${vehicle_class.vehicle_class_name}"?`
                                                        ) == true
                                                      ) {
                                                        deleteType(
                                                          type_index,
                                                          class_index
                                                        );
                                                      }
                                                    }}
                                                    colorClass="btn-danger btn-sm"
                                                    type="button"
                                                    disabled={false}
                                                  >
                                                    <>
                                                      Удалить{" "}
                                                      {
                                                        vehicle_type.vehicle_type_name
                                                      }
                                                    </>
                                                  </Button>
                                                )}
                                                {vehicle_type.services?.map(
                                                  (service, service_index) => (
                                                    <div
                                                      key={
                                                        "werwr33343w" +
                                                        service_index
                                                      }
                                                    >
                                                      {!service.to_be_removed && (
                                                        <div
                                                          key={
                                                            "wewerwersdfsdff2121212134" +
                                                            service_index
                                                          }
                                                          className="row d-sm-flex flex-sm-row flex-column fs-7 mt-1"
                                                        >
                                                          <p className="fs-6">
                                                            {service.name}:
                                                          </p>
                                                          <div className="col">
                                                            <div className="form-floating mb-3">
                                                              <input
                                                                required
                                                                className="form-control text"
                                                                id="number"
                                                                min={0}
                                                                type="number"
                                                                placeholder="name"
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  setValue(
                                                                    "cost",
                                                                    class_index,
                                                                    type_index,
                                                                    service_index,
                                                                    e.target.value,
                                                                    0
                                                                  );
                                                                }}
                                                                value={
                                                                  service.cost ||
                                                                  0
                                                                }
                                                                name="name"
                                                              />
                                                              <label htmlFor="name">
                                                                Стоимость услуги
                                                              </label>
                                                            </div>
                                                          </div>
                                                          <div className="col">
                                                            <div className="form-floating mb-3">
                                                              <input
                                                                required
                                                                className="form-control text"
                                                                id="number"
                                                                type="number"
                                                                min={0}
                                                                placeholder="name"
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  setValue(
                                                                    "employer_salary",
                                                                    class_index,
                                                                    type_index,
                                                                    service_index,
                                                                    e.target.value,
                                                                    0
                                                                  );
                                                                }}
                                                                value={
                                                                  service.employer_salary ||
                                                                  0
                                                                }
                                                                name="name"
                                                              />
                                                              <label htmlFor="name">
                                                                Базовая
                                                                стоимость услуги
                                                              </label>
                                                            </div>
                                                          </div>
                                                          <div className="col">
                                                            <div className="form-floating mb-3">
                                                              <input
                                                                required
                                                                className="form-control text"
                                                                id="number"
                                                                type="number"
                                                                min={0}
                                                                max={100}
                                                                placeholder="name"
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  setValue(
                                                                    "percentage_for_washer",
                                                                    class_index,
                                                                    type_index,
                                                                    service_index,
                                                                    e.target.value,
                                                                    100
                                                                  );
                                                                }}
                                                                value={
                                                                  service.percentage_for_washer ||
                                                                  30
                                                                }
                                                                name="name"
                                                              />
                                                              <label htmlFor="name">
                                                                % мойщика
                                                              </label>
                                                            </div>
                                                          </div>
                                                          {deleteMode && (
                                                            <Button
                                                              clickHandler={() => {
                                                                if (
                                                                  confirm(
                                                                    `Действительно удалить услугу "${service.name}" для типа "${vehicle_type.vehicle_type_name}", класса "${vehicle_class.vehicle_class_name}"?`
                                                                  ) == true
                                                                ) {
                                                                  deleteService(
                                                                    service.id,
                                                                    vehicle_type.vehicle_type_id,
                                                                    vehicle_class.vehicle_class_id
                                                                  );
                                                                }
                                                              }}
                                                              colorClass="btn-danger btn-sm"
                                                              type="button"
                                                              disabled={false}
                                                            >
                                                              <>
                                                                Удалить{" "}
                                                                {service.name}
                                                              </>
                                                            </Button>
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <hr></hr>

                <Button
                  clickHandler={() => {setLegalEntityServicesList()}}
                  colorClass="btn-success"
                  type="button"
                  disabled={false}
                >
                  <>Сохранить</>
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
              </>
            )}
          </form>
        </>
      )}
    </>
  );
};

LegalEntitySetServices.propTypes = {
  setInfoStringForDelete: PropTypes.func,
  setId: PropTypes.func,
};

export default LegalEntitySetServices;
