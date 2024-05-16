import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import VehicleModelsList from "../vehicle_models_list";


const VehicleModelsSettings = () => {
 
  const refList = React.useRef(null);
  const navigate = useNavigate();

  function updateRef(e) {
    refList.current.setSearch(e.target.value); 
  }
  
  {
    document.title = "Управление моделями ТС/ПП/ППЦ Чистый Грузовик";
  }
    return (
          <>
            <div className="mt-4">
            <p className="text-text-color fs-5">Управление моделями ТС/ПП/ППЦ:</p>
            <hr></hr>
            <form className="d-flex mb-3" role="search">
              <input className="form-control me-2" type="search" placeholder="Поиск по названию" aria-label="Search" onChange={(e) => {updateRef(e)}}/>
            </form>
              <VehicleModelsList ref={refList}/>
            </div>
          </>
)};

export default VehicleModelsSettings;
