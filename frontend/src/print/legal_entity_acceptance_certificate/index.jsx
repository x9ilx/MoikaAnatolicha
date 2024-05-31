import React from "react";
import { useParams } from "react-router-dom";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import Button from "../../components/button";
import PropTypes from "prop-types";
import api from "../../api";
import { NumertToText } from "../../utils/number_utils";

const LegalEntityAcceptanceCertificatePrint = (props) => {
  const [dateStart, setDateStart] = React.useState(new Date());
  const [dateEnd, setDateEnd] = React.useState(new Date());
  const [leInitials, setleInitials] = React.useState("");
  const [contract, setContract] = React.useState({});
  const [legalEntity, setLegalEntity] = React.useState({});
  const [orders, setOrders] = React.useState({});
  const [services, setServices] = React.useState({});
  const [totalCost, setTotalCost] = React.useState(0);

  const componentRef = React.useRef();
  const { legal_entity_id } = useParams();

  const getLegalEntityServicesForPeriod = () => {
    api
      .getLegalEntityServicesForPeriod(legal_entity_id, dateStart, dateEnd)
      .then((res) => {
        setOrders(res);
        let newArr = [];
        let total_cost = 0;
        res.map((order) => {
          let newArrItem = {
            order_number: order.order_number,
            date: null,
            services: [],
          };

          newArrItem.date = order.order_datetime;

          order?.services?.map((service) => {
            if (service.legal_entity_service === true) {
              newArrItem.services.push(service);
            }
          });

          newArrItem.services.sort(function (a, b) {
            return b.vehicle.id - a.vehicle.id;
          });

          newArr.push(newArrItem);
          total_cost += order.final_cost_contract;
        });
        setTotalCost(total_cost);
        setServices(newArr);
      });
  };

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

      api.getGetContract(res.current_contract).then((res) => {
        setContract(res);
      });
    });
  };

  React.useEffect(() => {
    getLegalEntity();
    getLegalEntityServicesForPeriod();
  }, []);

  React.useEffect(() => {
    getLegalEntityServicesForPeriod();
  }, [dateStart, dateEnd]);

  let current_index = 0;
  return (
    <div>
      <style type="text/css" media="print">
        {"@page :first {margin: 0;} @page { size:  auto; margin-top: 2em;margin-bottom: 2em;}"}
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
              <>Печать акта сдачи-приёмки</>
            </Button>
          )}
        </PrintContextConsumer>
      </ReactToPrint>
      <hr></hr>
      <div
        ref={componentRef}
        className="m-3 fs-7 fw-medium p-3 "
        style={{ textAlign: "justify" }}
      >
        <p className="lh-sm text-end">
          Приложение №4<br></br>к Договору на оказание услуг<br></br>
          по мойке транспортных средств №{contract?.id}
          <br></br>
          от {new Date(contract?.start_date).toLocaleDateString()}г.
        </p>
        <p className="fw-bold fs-6 text-center mb-3 ">
          АКТ сдачи-приёмки оказанных услуг по договору на мойку транспортных
          средств №{contract?.id}/
          {new Date().toLocaleDateString().replace(".", "").replace(".", "")}
        </p>
        <div className="row">
          <div className="col text-start">г. Новосибирск</div>
          <div className="col text-end">
            {new Date().toLocaleDateString()}г.
          </div>
        </div>
        <br></br>
        <p>
          Индивидульный предприниматель Демидов Евгений Леонидович (далее ИП
          Демидов Е. Л.), именуемый в дальнейшем &quot;ИСПОЛНИТЕЛЬ&quot;,
          действующий на основании Листа записи в ЕГРИП о государственной
          регистрации физического лица в качестве индивидуального
          предпринимателя от 23 сентября 2021 года, составил, а{" "}
          {legalEntity?.name} (далее {legalEntity?.short_name}), именуемое в
          дальнейшем &quot;ЗАКАЗЧИК&quot;, в лице директора:{" "}
          {legalEntity?.director_name}, действующего на основании Устава, принял
          настоящий АКТ об оказании следующих услуг по Договору №{contract?.id}{" "}
          от {new Date(contract?.start_date).toLocaleDateString()}г.<br></br>1.
        </p>
        <div className="m-1">
          <table
            className="table table-sm align-top border fs-9"
            style={{ textAlign: "center" }}
          >
            <thead>
              <tr>
                <th scope="col" className="border align-top">
                  №
                </th>
                <th scope="col" colSpan={6} className="border align-top">
                  Заказ
                </th>
              </tr>
              <tr>
                <th scope="col" className="border align-top"></th>
                <th scope="col" className="border align-top">
                  №
                </th>
                <th scope="col" className="border align-top">
                  Марка, модель класс ТС
                </th>
                <th scope="col" className="border align-top">
                  Гос. номер ТС
                </th>
                <th scope="col" className="border align-top">
                  Перечень оказанных услуг
                </th>
                <th scope="col" className="border align-top">
                  Стоимость оказанных услуг (₽)
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 &&
                services?.map((serviceG, index) => (
                  <>
                    <tr>
                      <th className="border px-2" scope="row">
                        {index + 1}
                      </th>
                      <td className="border fw-bold text-start" colSpan={5}>
                        Заказ №{serviceG.order_number}, от{" "}
                        {new Date(serviceG.date).toLocaleDateString()}г.
                      </td>
                    </tr>
                    {serviceG?.services?.map((service, sindex) => (
                      <tr key={serviceG + service + index}>
                        <th className="border px-2" scope="row"></th>
                        <td className="border px-2" scope="row">
                          {sindex + 1}
                        </td>
                        <td className="border " style={{ textAlign: "left" }}>
                          {service?.vehicle.vehicle_model}{" "}
                          {service?.vehicle.vehicle_type.vehicle_class_name} -{" "}
                          {service?.vehicle.vehicle_type.name}
                        </td>
                        <td className="border " style={{ textAlign: "left" }}>
                          {service.vehicle.without_plate_number
                            ? "Без гос. номера"
                            : service.vehicle.plate_number}
                        </td>
                        <td className="border" style={{ textAlign: "left" }}>
                          {service.service_name}
                        </td>
                        <td className="border ">{service.cost}₽</td>
                      </tr>
                    ))}
                  </>
                ))}
              <tr>
                <th className="border px-2 text-end" scope="row" colSpan={5}>
                  ИТОГО:
                </th>
                <td className="border fw-bold">{totalCost}₽</td>
              </tr>
            </tbody>
          </table>

          <div className="fw-medium fs-7" style={{ textAlign: "left" }}>
            2. Указанные в п. 1 Акта услуги, в период с{" "}
            {new Date(dateStart).toLocaleDateString()}г. по{" "}
            {new Date(dateEnd).toLocaleDateString()}г. оказаны в полном объеме.
            <br></br>
            3. Замечаний к услугам и предоставленным ИСПОЛНИТЕЛЕМ расходным
            материалам не имеются.<br></br>
            4. Стоимость оказания услуг составила {totalCost} ({NumertToText(totalCost)}) рублей 00 копеек, НДС
            не облагается.<br></br>
            5. Стороны взаимных претензий не имеют.
          </div>
          <p className="fw-medium fs-7 text-center mt-2 mb-0">
            ПОДПИСИ СТОРОН:
          </p>
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

LegalEntityAcceptanceCertificatePrint.propTypes = {
  //   legalEntityContract: PropTypes.object.isRequired,
};

export default LegalEntityAcceptanceCertificatePrint;
