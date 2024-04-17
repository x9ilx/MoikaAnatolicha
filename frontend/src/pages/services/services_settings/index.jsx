import React from "react";
import { useNavigate } from "react-router-dom";
import ServicesList from "../services_list";
import Button from "../../../components/button";


const ServicesSettings = () => {
 
  const refList = React.useRef(null);
  const navigate = useNavigate();

  function updateRef(e) {
    refList.current.setSearch(e.target.value); 
  }
  
  {
    document.title = "Управление услугами Чистый Грузовик";
  }
    return (
          <>
            <div className="mt-4">
            <p className="text-text-color fs-5">Управление услугами:</p>
            <Button
              clickHandler={()=>navigate("/services/add")}
              colorClass="btn-success"
              type="button"
              disabled={false}
            >
              <>Добавить услугу</>
            </Button>
            <form className="d-flex mb-3" role="search">
              <input className="form-control me-2" type="search" placeholder="Поиск по названию" aria-label="Search" onChange={(e) => {updateRef(e)}}/>
            </form>
              <ServicesList ref={refList}/>
            </div>
          </>
)};

export default ServicesSettings;
