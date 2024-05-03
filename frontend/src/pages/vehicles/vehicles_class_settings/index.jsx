import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import VehicleClassList from "../vehicle_class_list";



const VehicleClassSettings = () => {
 
  const refList = React.useRef(null);
  const navigate = useNavigate();

  function updateRef(e) {
    refList.current.setSearch(e.target.value);
  }
  
  {
    document.title = "Редактирование классов ТС/ПЦ/ППЦ Чистый Грузовик";
  }
    return (
          <>
            <div className="mt-4">
            <p className="text-text-color fs-5">Классы/типы ТС/ПЦ/ППЦ:</p>
            <Button
              clickHandler={() => {navigate("/vehicles/classes/add")}}
              colorClass="btn-success"
              type="button"
              disabled={false}
              hint="Чтобы создать тип ТС/ПЦ/ППЦ, для услуг, необходимо нажать 'редактировать' на созданом классе ТС/ПЦ/ППЦ"
            >
              <>Добавить класс ТС/ПЦ/ППЦ</>
            </Button>
            <hr></hr>
            <form className="d-flex mb-3" role="search">
              <input className="form-control me-2" type="search" placeholder="Поиск по названию класса/типа" aria-label="Search" onChange={(e) => {updateRef(e)}}/>
            </form>
            
              <VehicleClassList ref={refList}/>
            </div>
          </>
)};

export default VehicleClassSettings;
