import React from "react";
import { useNavigate } from "react-router-dom";
import VehiclesList from "../vehicles_list";
import Button from "../../../components/button";


const VehicleListSettings = () => {
 
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
              clickHandler={() => navigate("./add")}
              colorClass="btn-success"
              type="button"
              disabled={false}
            >
              <>Добавить ТС/ПП/ППЦ</>
            </Button>
            <hr></hr>
            <form className="d-flex mb-3" role="search">
              <input className="form-control me-2" type="search" placeholder="Поиск по гос. номеру, названию, ИНН" aria-label="Search" onChange={(e) => {updateRef(e)}}/>
            </form>
              <VehiclesList ref={refList}/>
            </div>
          </>
)};

export default VehicleListSettings;
