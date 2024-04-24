import React from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../../../api";
import Button from "../../../components/button";
import OrderElementGroup from "../../orders/order_element_group";

const ServiceAdd = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [name, setName] = React.useState("");
  const [vehicleClassesAndTypes, setVehicleClassesAndTypes] = React.useState(
    []
  );
  const [serviceVehicleTypes, setServiceVehicleTypes] = React.useState([]);
  const [DELETE, setDELETE] = React.useState(false);

  const navigate = useNavigate();
  const { service_id } = useParams();

  const UpdateService = (data) => {
    api
      .updateService(service_id, data)
      .then((data) => {
        toast.success("Услуга " + name + " успешно обновлена");
        navigate("/services/")
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  const CreateService = (data) => {
    api
      .createService(data)
      .then((data) => {
        toast.success("Услуга " + name + " успешно создана");
        navigate("/services/")
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  const getVehileTypesAndVehicleClasses = React.useCallback(() => {
    api
      .getVehicleClasses(1, 99999, "")
      .then((res) => {
        setVehicleClassesAndTypes(res.results);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, []);

  const getService = React.useCallback(() => {
    api
      .getService(service_id)
      .then((res) => {
        setName(res.name);
        api.getVehicleTypesForService(service_id).then((res_vehicle_type) => {
          setServiceVehicleTypes(res_vehicle_type);
        });
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [service_id]);

  const changeDefaultArrayvehicleClassesAndTypes = React.useCallback(() => {
    let vehicle_classes_and_types = vehicleClassesAndTypes.map((v_class) => ({
      ...v_class,
      vehicle_types: v_class.vehicle_types.map((v_type) => ({
        ...v_type,
        include: serviceVehicleTypes.some(
          (e) => e.vehicle_type.id == v_type.id
        ),
        cost:
          serviceVehicleTypes.filter(
            (item) => item.vehicle_type.id == v_type.id
          )[0]?.cost || 0,
        employer_salary:
          serviceVehicleTypes.filter(
            (item) => item.vehicle_type.id == v_type.id
          )[0]?.employer_salary || 0,
        percentage_for_washer:
          serviceVehicleTypes.filter(
            (item) => item.vehicle_type.id == v_type.id
          )[0]?.percentage_for_washer || 30,
      })),
    }));

    setVehicleClassesAndTypes(vehicle_classes_and_types);
  }, [serviceVehicleTypes, vehicleClassesAndTypes]);

  React.useEffect(() => {
    changeDefaultArrayvehicleClassesAndTypes();
  }, [serviceVehicleTypes]);

  React.useEffect(() => {
    setLoading(true);
    if (service_id) {
      getService();
    } else {
      setServiceVehicleTypes([
        {
          vehicle_type: {
            id: 0,
            name: "",
            vehicle_class: 0,
            vehicle_class_name: "",
          },
          id: 0,
          name: "",
          vehicle_class: 0,
          vehicle_class_name: "",
          cost: "0",
          employer_salary: "0",
          percentage_for_washer: 0,
        },
      ]);
    }
    getVehileTypesAndVehicleClasses();
    setLoading(false);
  }, []);

  const changeServiceAvaliable = (class_index, type_index, type_id) => {
    const include =
      vehicleClassesAndTypes[class_index].vehicle_types[type_index].include;

    let vehicle_classes_and_types = vehicleClassesAndTypes.map((v_class) => ({
      ...v_class,
      vehicle_types: v_class.vehicle_types.map((v_type) => ({
        ...v_type,
        include: v_type.id === type_id ? !include : v_type.include || false,
        cost: v_type.cost || 0,
        employer_salary: v_type.employer_salary || 0,
        percentage_for_washer: v_type.percentage_for_washer || 30,
      })),
    }));

    setVehicleClassesAndTypes(vehicle_classes_and_types);
  };

  const setValue = (name, type_id, value, max_value) => {
    // value = parseInt(value.replace(/^0+/, ""));
    value = Number(value).toString();
    if (max_value > 0) {
      value = value > max_value ? max_value : value;
    }
    let vehicle_classes_and_types = vehicleClassesAndTypes.map((v_class) => ({
      ...v_class,
      vehicle_types: v_class.vehicle_types.map((v_type) => ({
        ...v_type,
        [name]: v_type.id === type_id ? value : v_type[name],
      })),
    }));

    setVehicleClassesAndTypes(vehicle_classes_and_types);
  };

  const serviceSaveUpdate = () => {
    if (name.trim().length === 0) {
      toast.error("Необходимо указать название услуги");
      return;
    }

    let service_vehicle = [];

    vehicleClassesAndTypes.map((v_class) =>
      v_class.vehicle_types.map((v_type) =>
        service_vehicle.push({
          id: v_type.id,
          include: v_type.include,
          cost: v_type.cost || 0,
          employer_salary: v_type.employer_salary || 0,
          percentage_for_washer: v_type.percentage_for_washer || 30,
        })
      )
    );

    let data = {
      service_id: service_id,
      service_name: name,
      service_vehicle_types: service_vehicle,
    };

    if (service_id) {
      UpdateService(data);
    } else {
      CreateService(data);
    }
  };

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
      <p className="text-text-color fs-5">{service_id ? "Редактирование услуги" : "Создание услуги"}</p>
      <hr></hr>
      <form
        autoComplete="new-password"
        onSubmit={(e) => {
          e.preventDefault();
          //   UpdateVehicleClass();
        }}
      >
        <div className="form-floating mb-3">
          <input
            required
            className="form-control text"
            id="name"
            placeholder="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            name="name"
          />
          <label htmlFor="name">Название услуги</label>
        </div>
        <p className="text-text-color fs-5">Доступность услуги/настройки:</p>
        <div className="accordion accordion-flush" id="accordionFlushExample">
          {vehicleClassesAndTypes.map((vehicle_class, class_index) => (
            <div
              key={vehicle_class.name + class_index}
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
                  {vehicle_class.name}
                </button>
              </h2>
              <div
                id={`flush-collapse${class_index}`}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body ">
                  {vehicle_class.vehicle_types.map(
                    (vehicle_type, type_index) => (
                      <div key={vehicle_type.name + type_index}>
                        <div className="row">
                          <OrderElementGroup
                            header=""
                            elements_with_badge={[
                              {
                                name: <div className="fw-medium">{vehicle_type.name}</div>,
                                badge: (
                                  <div className="form-check form-switch form-check-reverse pb-2">
                                    <input
                                      className="form-check-input "
                                      type="checkbox"
                                      id={`service_available_${type_index}`}
                                      name={`service_available_${type_index}`}
                                      checked={vehicle_type.include}
                                      onChange={() => {
                                        changeServiceAvaliable(
                                          class_index,
                                          type_index,
                                          vehicle_type.id
                                        );
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`service_available_${type_index}`}
                                    ></label>
                                  </div>
                                ),
                              },
                            ]}
                          />
                        </div>
                        <div className="row d-sm-flex flex-sm-row flex-column fs-7 mt-1">
                          {vehicle_type.include && (
                            <>
                              <div className="col">
                                <div className="form-floating mb-3">
                                  <input
                                    required
                                    className="form-control text"
                                    id="number"
                                    min={0}
                                    type="number"
                                    placeholder="name"
                                    onChange={(e) => {
                                      setValue(
                                        "cost",
                                        vehicle_type.id,
                                        e.target.value,
                                        0
                                      );
                                    }}
                                    value={vehicle_type.cost || 0}
                                    name="name"
                                  />
                                  <label htmlFor="name">Стоимость услуги</label>
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
                                    onChange={(e) => {
                                      setValue(
                                        "employer_salary",
                                        vehicle_type.id,
                                        e.target.value,
                                        0
                                      );
                                    }}
                                    value={vehicle_type.employer_salary || 0}
                                    name="name"
                                  />
                                  <label htmlFor="name">
                                    Базовая стоимость услуги
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
                                    onChange={(e) => {
                                      setValue(
                                        "percentage_for_washer",
                                        vehicle_type.id,
                                        e.target.value,
                                        100
                                      );
                                    }}
                                    value={
                                      vehicle_type.percentage_for_washer || 30
                                    }
                                    name="name"
                                  />
                                  <label htmlFor="name">% мойщика</label>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <hr></hr>
        <Button
          clickHandler={() => {
            serviceSaveUpdate();
          }}
          colorClass="btn-success"
          type="button"
          disabled={false}
        >
          <>Сохранить</>
        </Button>
        <Button
          clickHandler={() => {
            navigate("/services/");
          }}
          colorClass="btn-primary"
          type="button"
          disabled={false}
        >
          <>Назад</>
        </Button>

        {service_id && (
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
                Удалить услугу
              </label>
            </div>
            {DELETE && (
              <>
                <Button
                  clickHandler={() => {
                    props.setInfoStringForDelete(
                      'Услугу "' +
                        name +
                        '"? Перед удалением сделайте все необходимые отчёты и выдайте ЗП, так как могут возникнуть проблемы, если услуга удалена.'
                    );
                    props.setId(service_id);
                    navigate("./delete/");
                  }}
                  colorClass="btn-danger"
                  type="button"
                  disabled={false}
                >
                  <>УДАЛИТЬ УСЛУГУ</>
                </Button>
              </>
            )}
          </>
        )}
      </form>
    </>
  );
};

ServiceAdd.propTypes = {
  setInfoStringForDelete: PropTypes.func,
  setId: PropTypes.func,
};

export default ServiceAdd;
