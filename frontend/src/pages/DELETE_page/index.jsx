import React from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/button";

const DeletePage = (props) => {
  const [DELETE, setDELETE] = React.useState(false);
  const { message } = useLocation();

  const navigate = useNavigate();

  return (
    <>
      <p className="text-danger fs-4 text-center">СТРАНИЦА УДАЛЕНИЯ</p>
      <p className=" fs-5 ">
        Действительно удалить
      </p>
      <p className="fs-5">{props.info_string ? props.info_string : message}?</p>
      <div className="form-check form-switch form-check-reverse pb-2">
        <input
          className="form-check-input "
          type="checkbox"
          id="DELETE"
          name="DELETE"
          onChange={() => {
            setDELETE(!DELETE);
          }}
        />
        <label className="form-check-label" htmlFor="DELETE">
          Удалить данные
        </label>
      </div>
      <Button
        clickHandler={()=>navigate(-1)}
        colorClass="btn-primary"
        type="button"
        disabled={false}
      >
        <>Вернуться</>
      </Button>
      {DELETE && (
        <Button
        clickHandler={()=>  props.onDelete()}
        colorClass="btn-danger"
        type="button"
        disabled={false}
      >
        <>УДАЛИТЬ</>
      </Button>
      )}
    </>
  );
};

DeletePage.propTypes = {
  info_string: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

export default DeletePage;
