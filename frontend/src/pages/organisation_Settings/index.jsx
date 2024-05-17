import React from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Button from "../../components/button";

const OrganistaionSettings = () => {
  const [settings, setSettings] = React.useState({
    administrator_wage_threshold: "",
    administrator_earnings_after_threshold: "",
    administrator_additional_payment_threshold: "",
    administrator_additional_payments_after_threshold: "",
  });
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();

  const getSettings = React.useCallback(() => {
    api
      .getSettings()
      .then((res) => {
        setSettings(res);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, []);

  const changeSettings = () => {
    api
      .setSettings(settings)
      .then((data) => {
        toast.success("Данные успешно обновлены");
        navigate("/");
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  React.useEffect(() => {
    setLoading(true);
    getSettings();
    setLoading(false);
  }, [getSettings]);

  const onChangeInput = (e) => {
    setSettings((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    <>
      <p className="grid h-screen place-items-center text-center">
        Загрузка...
      </p>
    </>;
  } else {
    return (
      <>
        <p className="fw-medium">Настройки организации:</p>
        <hr></hr>
        <form
          autoComplete="new-password"
          className="my-3"
          onSubmit={(e) => {
            e.preventDefault();
            changeSettings();
          }}
        >
          <div className="accordion accordion-flush" id="accordionFlushExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOneOrder"
                  aria-expanded="true"
                  aria-controls="flush-collapseOneOrder"
                >
                  Заказы
                </button>
              </h2>
              <div
                id="flush-collapseOneOrder"
                className="accordion-collapse collapse show"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control text"
                      id="overdue_order_timer"
                      placeholder="overdue_order_timer"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={settings.overdue_order_timer}
                      name="overdue_order_timer"
                    />
                    <label htmlFor="overdue_order_timer">
                      Время просроченого заказа (минуты)
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
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  Заработная плата администраторов
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control text"
                      id="administrator_wage_threshold"
                      placeholder="administrator_wage_threshold"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={settings.administrator_wage_threshold}
                      name="administrator_wage_threshold"
                    />
                    <label htmlFor="administrator_wage_threshold">
                      Порог получения ЗП
                    </label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control text"
                      id="administrator_earnings_after_threshold"
                      placeholder="administrator_earnings_after_threshold"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={settings.administrator_earnings_after_threshold}
                      name="administrator_earnings_after_threshold"
                    />
                    <label htmlFor="administrator_earnings_after_threshold">
                      ЗП после достижения порога
                    </label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control text"
                      id="administrator_additional_payment_threshold"
                      placeholder="administrator_additional_payment_threshold"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={
                        settings.administrator_additional_payment_threshold
                      }
                      name="administrator_additional_payment_threshold"
                    />
                    <label htmlFor="administrator_additional_payment_threshold">
                      Порог для дополнительных выплат
                    </label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control text"
                      id="administrator_additional_payments_after_threshold"
                      placeholder="administrator_additional_payments_after_threshold"
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                      value={
                        settings.administrator_additional_payments_after_threshold
                      }
                      name="administrator_additional_payments_after_threshold"
                    />
                    <label htmlFor="administrator_additional_payments_after_threshold">
                      Размер дополнительных выплат
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr></hr>

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
        </form>
      </>
    );
  }
};

export default OrganistaionSettings;
