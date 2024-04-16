import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import LegalEntityList from "../legal_entity_list";



const LegalEntitySettings = () => {
 
  const refList = React.useRef(null);
  const navigate = useNavigate();

  function updateRef(e) {
    refList.current.setSearch(e.target.value); 
  }
  
  {
    document.title = "Редактирование контрагентов Чистый Грузовик";
  }
    return (
          <>
            <div className="mt-4">
            <p className="text-text-color fs-5">Контрагенты:</p>
            <Button
              clickHandler={() => {navigate("./add")}}
              colorClass="btn-success"
              type="button"
              disabled={false}
            >
              <>Добавить контрагента</>
            </Button>
            <form className="d-flex mb-3" role="search">
              <input className="form-control me-2" type="search" placeholder="Поиск по названию, ИНН, гос. номеру" aria-label="Search" onChange={(e) => {updateRef(e)}}/>
            </form>
              <LegalEntityList ref={refList}/>
            </div>
          </>
)};

export default LegalEntitySettings;
