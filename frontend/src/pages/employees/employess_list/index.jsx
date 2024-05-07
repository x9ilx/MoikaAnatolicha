import React from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api";
import { prettyPhone } from "../../../utils/string_utils";
import Paginator from "../../../components/paginator";
import Button from "../../../components/button";
import EmployerOffcanvasDocs from "../../../components/employer_offcanvas_docs";
import EmployeeShiftsAndOrders from "../employer_shift_list";

const EmployeesList= React.forwardRef(function MyInput(props, ref) {
  const [loading, setLoading] = React.useState(true);
  const [employees, setEmployees] = React.useState({});

  const [current_page, setCurrentPage] = React.useState(1)
  const [total_page, setTotalPage] = React.useState(1)
  const [search, setSearch] = React.useState("");

  const navigate = useNavigate();

  React.useImperativeHandle(ref, () => ({
    setSearch,
  }));

  let items_limit = 8;

  if (isMobile) {
    items_limit = 4
  }

  const getEmployeesList = React.useCallback(() => {
    setLoading(true);
    api
      .getEmployeesList(current_page, items_limit, search)
      .then((res) => {
        setEmployees(res.results);
        setTotalPage(res.total_pages)
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
    getEmployeesList();
  }, [getEmployeesList]);


  const ChangePage = (new_page) => {
    setCurrentPage(new_page)
  }

  {
    document.title = "Редактирование сотрудников Чистый Грузовик";
  }

    return (
      <>
        {loading && (
          <p className="grid h-screen place-items-center text-center mb-2">
            Загрузка списка сотрудников...
          </p>
        )}
        {!loading && (
          <>
          <div className="mt-4">

            <div className="row mb-3">
           
              <div className="vstack gap-3">
                {employees?.map((employer, emp_index) => (
                  <div className="card shadow" key={employer?.id}>
                    <div className="card-header bg-primary pl-2 pr-2 pt-1 pb-1">
                      <div className="row fs-8 fw-medium">
                        <div className="col-7 text-start  text-white fs-7 fw-medium"
                        style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}>
                          {employer?.short_name}
                        </div>
                        <div className="col-5 text-end  text-white fs-7 fw-medium">
                          {employer?.position_verbose}
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-1 pb-1">
                      <div className="row px-4 d-sm-flex flex-sm-row flex-column fs-8">
                        <p className="pt-1 mx-1 my-0">
                          <b>Имя:</b> {employer?.name}
                        </p>
                        <p className="py-1 mx-1 my-0">
                          <b>Телефон:</b>{" "}
                          {employer?.phone ? (
                            <a
                              href={"tel:" + employer.phone}
                              className="alert-link"
                            >
                              {prettyPhone(employer.phone)}
                            </a>
                          ) : (
                            "Не указан"
                          )}
                        </p>
                        <p className="py-0 mx-1 my-0">
                          <b>Пользователь CRM:</b> {employer?.user_name}
                        </p>
                      </div>
                      <div className="vstack gap-0 mx-3 mt-3">
                        <Button
                          clickHandler={()=>navigate("/employees/" + employer?.id)}
                          colorClass="btn-primary btn-sm"
                          type="button"
                          disabled={false}
                          marginBottom={2}
                        >
                          <>Редактировать</>
                        </Button>
                        <Button
                          clickHandler={() => {}}
                          colorClass="btn-info btn-sm"
                          type="button"
                          disabled={false}
                          offcanvasName={`employer${emp_index}_offcanvas`}
                          marginBottom={2}
                        >
                          <>Документы</>
                        </Button>
                        <EmployerOffcanvasDocs
                        employer={employer}
                        offcanvasName={`employer${emp_index}_offcanvas`}
                        />
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Paginator total_page={total_page} current_page={current_page} OnChangePage={ChangePage}/>
            </div>
          </>
        )}
      </>
    );
});

export default EmployeesList;
