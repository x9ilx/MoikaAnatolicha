import React from "react";
import { useNavigate } from "react-router-dom";
import EmployerSalariesList from "../employer_salaries_list";

const EmployerSalaryListSettings = () => {
  const refList = React.useRef(null);
  const navigate = useNavigate();

  function updateRef(e) {
    if (refList.current.setSearchEmployer) {
      refList.current.setSearchEmployer(e.target.value);
    }
  }

  function updateStartDate(e) {
    if (refList.current.setDateStart) {

      refList.current.setDateStart(e ? e : '');
    }
  }

  function updateEndtDate(e) {
    if (refList.current.setDateEnd) {
      refList.current.setDateEnd(e ? e : '');
    }
  }

  {
    document.title = "Редактирование ЗП Чистый Грузовик";
  }
  return (
    <>
      <div className="mt-4">
        <p className="text-text-color fs-5">Список ЗП:</p>
        <hr></hr>
          <div className="row">
            <div className="col-sm-6 col-12 mb-3">
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control text"
                  id="dateS"
                  placeholder="dateS"
                  onChange={(e) => {
                    updateStartDate(e.target.value);
                  }}
                  name="dateS"
                />
                <label htmlFor="dateS">Дата С</label>
              </div>
            </div>
            <div className="col-sm-6 col-12">
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control text"
                  id="dateP"
                  placeholder="dateP"
                  onChange={(e) => {
                    updateEndtDate(e.target.value);
                  }}
                  name="dateP"
                />
                <label htmlFor="dateP">Дата ПО</label>
              </div>
            </div>
          </div>
        <input
            className="form-control me-2"
            type="search"
            placeholder="Поиск по ФИО, короткому имени"
            aria-label="Search"
            onChange={(e) => {
              updateRef(e);
            }}
          />
          <hr></hr>
        <EmployerSalariesList ref={refList} />
      </div>
    </>
  );
};

export default EmployerSalaryListSettings;
