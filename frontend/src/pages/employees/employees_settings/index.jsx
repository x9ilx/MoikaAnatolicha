import React from "react";
import { useNavigate } from "react-router-dom";
import EmployeesList from "../employess_list";
import Button from "../../../components/button";



const EmployeesSettings = () => {
 
  const refList = React.useRef(null);
  const navigate = useNavigate();

  function updateRef(e) {
    refList.current.setSearch(e.target.value); 
  }
  
  {
    document.title = "Редактирование ТС/ПП/ППЦ Чистый Грузовик";
  }
    return (
          <>
            <div className="mt-4">
            <p className="text-text-color fs-5">ТС/ПП/ППЦ:</p>
            <Button
              clickHandler={()=>navigate("/employees/add")}
              colorClass="btn-success"
              type="button"
              disabled={false}
            >
              <>Добавить сотрудника</>
            </Button>
            <form className="d-flex mb-3" role="search">
              <input className="form-control me-2" type="search" placeholder="Поиск Ф. И. О, короткому имени" aria-label="Search" onChange={(e) => {updateRef(e)}}/>
            </form>
              <EmployeesList ref={refList}/>
            </div>
          </>
)};

export default EmployeesSettings;
