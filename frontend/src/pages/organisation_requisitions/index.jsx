import React from "react";
import Button from "../../components/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const OrganistaionRequisites = () => {
  const [requisites, setRequisites] = React.useState({
    name: "",
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
  });
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();

  const getRequisites = React.useCallback(() => {
    api
      .getRequisites()
      .then((res) => {
        setRequisites(res);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, []);

  const changeRequisites = () => {
    api
      .setRequisites(requisites)
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
    getRequisites();
    setLoading(false);
  }, [getRequisites]);

  const onChangeInput = (e) => {
    setRequisites((prevState) => ({
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
        <p className="fw-medium">Реквизиты организации:</p>
        <p className="blockquote-footer">
          Не используемые реквизиты необходимо оставить пустыми
        </p>
        <hr></hr>
        <form
          autoComplete="new-password"
          className="my-3"
          onSubmit={(e) => {
            e.preventDefault();
            {
              changeRequisites();
            }
          }}
        >
          <div className="accordion accordion-flush" id="accordionFlushExample">
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
                      Должность/Руководящее лицо
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

export default OrganistaionRequisites;
