import React from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

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
      <button
        type="button"
        className="w-100 btn btn-primary mt-2 text-white fw-medium lh-lg"
        style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
        onClick={() => {
          navigate(-1);
        }}
      >
        Отмена
      </button>
      {DELETE && (
        <button
          type="button"
          className="w-100 btn btn-danger mt-2 mb-5 text-white fw-medium lh-lg"
          style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
          onClick={() => props.onDelete()}
        >
          УДАЛИТЬ
        </button>
      )}
    </>
  );
};

DeletePage.propTypes = {
  info_string: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

export default DeletePage;
