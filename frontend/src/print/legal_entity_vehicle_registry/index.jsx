import React from "react";
import { useParams } from "react-router-dom";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import Button from "../../components/button";
import PropTypes from "prop-types";
import api from "../../api";

const LegalEntityVehicleRegistryPrint = (props) => {
  const [dateStart, setDateStart] = React.useState();
  const [dateEnd, setDateEnd] = React.useState();
  const [leInitials, setleInitials] = React.useState("");
  const [legalEntity, setLegalEntity] = React.useState({});
  const [emptyRow, setEmptyRow] = React.useState([]);

  const componentRef = React.useRef();
  const { legal_entity_id } = useParams();

  const getLegalEntity = () => {
    api.getLegalEntity(legal_entity_id).then((res) => {
      setLegalEntity(res);

      let li_list = res?.director_name.split(" ");
      let li = li_list[0] + " " + li_list[1][0] + ". " + li_list[2][0] + ".";
      setleInitials(li);

      let newArr = [];
      for (let index = 0; index < 25; index++) {
        newArr.push(" ");
      }
      setEmptyRow(newArr);
    });
  };

  React.useEffect(() => {
    getLegalEntity();
  }, []);

  return (
    <div>
      <style type="text/css" media="print">
        {"@page {size: landscape;}"}
      </style>
      <hr></hr>
      <div className="row">
        <div className="col-sm-6 col-12 mb-3">
          <div className="form-floating">
            <input
              type="date"
              className="form-control text"
              id="dateS"
              placeholder="dateS"
              value={dateStart}
              onChange={(e) => {
                setDateStart(e.target.value);
              }}
              name="dateS"
            />
            <label htmlFor="dateS">Период С</label>
          </div>
        </div>
        <div className="col-sm-6 col-12">
          <div className="form-floating">
            <input
              type="date"
              className="form-control text"
              id="dateP"
              placeholder="dateP"
              value={dateEnd}
              onChange={(e) => {
                setDateEnd(e.target.value);
              }}
              name="dateP"
            />
            <label htmlFor="dateP">Период ПО</label>
          </div>
        </div>
      </div>
      <ReactToPrint content={() => componentRef.current} removeAfterPrint>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <Button
              clickHandler={handlePrint}
              colorClass="btn-info"
              type="button"
            >
              <>Печать реестра ТС</>
            </Button>
          )}
        </PrintContextConsumer>
      </ReactToPrint>
      <hr></hr>
      <div
        ref={componentRef}
        className="m-3 fs-7 fw-medium p-1"
        style={{ textAlign: "justify" }}
      >
        <p className="fw-medium fs-6 text-center mb-3 ">
          РЕЕСТР на оказание услуг по мойке транспортных средств{" "}
          {legalEntity?.short_name}, с{" "}
          {new Date(dateStart).toLocaleDateString()}г. по{" "}
          {new Date(dateEnd).toLocaleDateString()}г.
        </p>
        <div className="m-1">
          <table
            className="table table-sm align-top border fs-9"
            style={{ textAlign: "center" }}
          >
            <thead>
              <tr>
                <th scope="col" className="border align-top">
                  №<br></br>п/п
                </th>
                <th scope="col" className="border align-top">
                  Дата
                </th>
                <th scope="col" className="border align-top">
                  Марка, модель класс ТС
                </th>
                <th scope="col" className="border align-top">
                  Гос. номер ТС
                </th>
                <th scope="col" className="border align-top">
                  Оказанные услуги по прейскуранту
                </th>
                <th scope="col" className="border align-top">
                  Стоимость оказанных услуг в ₽ (НСД не облагается)
                </th>
                <th scope="col" className="border align-top">
                  Подпись, фамилия ответственного лица ЗАКАЗЧИКА
                </th>
              </tr>
            </thead>
            <tbody>
              {emptyRow?.map((row, index) => (
                <>
                  <tr key={index}>
                    <th className="border px-2" scope="row">
                      {index + 1}
                    </th>
                    <td className="border text-white px-5"></td>
                    <td
                      className="border text-white"
                      style={{ paddingLeft: "10em", paddingRight: "10em" }}
                    ></td>
                    <td
                      className="border text-white"
                      style={{ paddingLeft: "7em", paddingRight: "7em" }}
                    ></td>
                    <td
                      className="border text-white"
                      style={{ paddingLeft: "8em", paddingRight: "8em" }}
                    ></td>
                    <td
                      className="border text-white"
                      style={{ paddingLeft: "3em", paddingRight: "3em" }}
                    ></td>
                    <td
                      className="border text-white"
                      style={{ paddingLeft: "8em", paddingRight: "8em" }}
                    ></td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          <div className="page-break"></div>
          <table
            className="table table-sm align-top border fs-9"
            style={{ textAlign: "center" }}
          >
            <thead>
              <tr>
                <th scope="col" className="border align-top">
                  №<br></br>п/п
                </th>
                <th scope="col" className="border align-top">
                  Дата
                </th>
                <th scope="col" className="border align-top">
                  Марка, модель класс ТС
                </th>
                <th scope="col" className="border align-top">
                  Гос. номер ТС
                </th>
                <th scope="col" className="border align-top">
                  Оказанные услуги по прейскуранту
                </th>
                <th scope="col" className="border align-top">
                  Стоимость оказанных услуг в ₽ (НСД не облагается)
                </th>
                <th scope="col" className="border align-top">
                  Подпись, фамилия ответственного лица ЗАКАЗЧИКА
                </th>
              </tr>
            </thead>
            <tbody>
              {emptyRow?.map((row, index) => (
                <>
                  {index + 26 <= 45 && (
                    <tr key={index}>
                      <th className="border px-2" scope="row">
                        {index + 26}
                      </th>
                      <td className="border text-white px-5"></td>
                      <td
                        className="border text-white"
                        style={{ paddingLeft: "10em", paddingRight: "10em" }}
                      ></td>
                      <td
                        className="border text-white"
                        style={{ paddingLeft: "7em", paddingRight: "7em" }}
                      ></td>
                      <td
                        className="border text-white"
                        style={{ paddingLeft: "8em", paddingRight: "8em" }}
                      ></td>
                      <td
                        className="border text-white"
                        style={{ paddingLeft: "3em", paddingRight: "3em" }}
                      ></td>
                      <td
                        className="border text-white"
                        style={{ paddingLeft: "8em", paddingRight: "8em" }}
                      ></td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          <div className="row">
            <div className="col">
              <span className="fw-medium fs-7 text-start">
                Общая стоимость оказания услуг по настоящему РЕЕСТРУ составляет:
              </span>
            </div>
            <div className="col me-3 border border-top-0 border-end-0 border-start-0"></div>
          </div>
          <div className="fw-medium fs-7" style={{ textAlign: "left" }}>
                ЗАКАЗЧИК в отношении оказанных ИСПОЛНИТЕЛЕМ услуг по договору за указанный период претензий не имеет
          </div>
          <p className="fw-medium fs-7 text-center mt-2 mb-0">ПОДПИСИ СТОРОН:</p>
          <div className="row mb-0" style={{ textAlign: "left" }}>
            <div className="col">
              <span>
                ИСПОЛНИТЕЛЬ:<br></br>
                <br></br>
                ________________________________ Демидов Е. Л.<br></br>
                <span className="text-center fs-8">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;М.
                  П.
                </span>
              </span>
            </div>
            <div className="col text-end">
              <span>
                ЗАКАЗЧИК:<br></br>
                <br></br>
                ________________________________ {leInitials}
                <br></br>
                <span className="text-center fs-8">
                  М.
                  П.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LegalEntityVehicleRegistryPrint.propTypes = {
  //   legalEntityContract: PropTypes.object.isRequired,
};

export default LegalEntityVehicleRegistryPrint;
