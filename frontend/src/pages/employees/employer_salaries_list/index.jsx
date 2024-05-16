import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { forwardRef } from "react";
import api from "../../../api";
import OrderElementGroup from "../../orders/order_element_group";
import Paginator from "../../../components/paginator";
import { isMobile } from "react-device-detect";
import Button from "../../../components/button";

const EmployerSalariesList = forwardRef(function MyInput(props, ref) {
  const [loading, setLoading] = React.useState(true);
  const [salaries, setSalaries] = React.useState({});

  const [searchEmployer, setSearchEmployer] = React.useState("");
  const [dateStart, setDateStart] = React.useState("");
  const [dateEnd, setDateEnd] = React.useState("");

  const [current_page, setCurrentPage] = React.useState(1);
  const [total_page, setTotalPage] = React.useState(1);

  let items_limit = 8;

  if (isMobile) {
    items_limit = 4;
  }

  const navigate = useNavigate();

  React.useImperativeHandle(ref, () => ({
    setSearchEmployer,
    setDateStart,
    setDateEnd,
  }));

  const getSalaries = React.useCallback(() => {
    setLoading(true);
    api
      .getAllSalaries(
        current_page,
        items_limit,
        searchEmployer,
        dateStart ? new Date(dateStart).toISOString().slice(0,-14) : '',
        dateEnd ? new Date(dateEnd).toISOString().slice(0,-14) : '',
      )
      .then((res) => {
        setSalaries(res.results);
        setTotalPage(res.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [searchEmployer, current_page, dateEnd, dateStart, items_limit]);

  React.useEffect(() => {
    getSalaries();
  }, [searchEmployer, dateStart, dateEnd, getSalaries]);

  const ChangePage = (new_page) => {
    setCurrentPage(new_page);
  };

  if (salaries.length === 0) {
    return (
      <>
        <p className="grid h-screen place-items-center text-center mb-2">
          Ничего не найдено
        </p>
      </>
    );
  }

  return (
    <div>
      {loading && (
        <p className="grid h-screen place-items-center text-center mb-2">
          Загрузка списка техники...
        </p>
      )}
      {!loading && (
        <div className="row mb-3">
          <div className="vstack gap-3">
            {salaries?.map((salary) => (
              <div className="card shadow" key={salary?.id}>
                <div className="card-header bg-primary pl-2 pr-2 pt-1 pb-1">
                  <div className="row fs-8 fw-medium">
                    <div
                      className="text-start  text-white fs-7 fw-medium"
                      style={{
                        textShadow: "1px -1px 7px rgba(0,0,0,0.45)",
                      }}
                    >
                      Дата выдачи:{" "}
                      {new Date(salary?.date_of_issue).toLocaleDateString()}г.
                    </div>
                  </div>
                </div>
                <div className="card-body p-1 pb-1">
                  <div className="row px-4 d-sm-flex flex-sm-row flex-column fs-8">
                    <div className="col  pt-1" id="services">
                      <OrderElementGroup
                        header="Информация о сотруднике"
                        elements_with_badge={[
                          
                          {
                            name: (
                              <>
                                <b>Ф. И. О.:</b> {salary?.employer.name}
                              </>
                            ),
                          },
                          {
                            name: (
                              <>
                                <b>Короткое имя:</b>{" "}
                                {salary?.employer.short_name}
                              </>
                            ),
                          },
                          {
                            name: (
                              <>
                                <b>Период:</b> {new Date(salary?.start_date).toLocaleDateString()} - {new Date(salary?.end_date).toLocaleDateString()}
                              </>
                            ),
                          },
                          {
                            name: (
                              <>
                                <b>Итого:</b>{" "}
                                {salary?.employer_salary}₽
                              </>
                            ),
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="row mx-3 gap-1 my-2">
                    <Button
                      clickHandler={() => navigate(`../${salary?.employer.id}/salary/${salary?.id}/`)}
                      colorClass="btn-primary btn-sm"
                      type="button"
                      disabled={false}
                    >
                      <>Подробно</>
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Paginator
              total_page={total_page}
              current_page={current_page}
              OnChangePage={ChangePage}
            />
          </div>
        </div>
      )}
    </div>
  );
});

EmployerSalariesList.propTypes = {
  //   vehicleClasses: PropTypes.array.isRequired,
  //   total_page: PropTypes.number.isRequired,
  //   current_page: PropTypes.number.isRequired,
  //   ChangePage: PropTypes.func.isRequired,
};

export default EmployerSalariesList;
