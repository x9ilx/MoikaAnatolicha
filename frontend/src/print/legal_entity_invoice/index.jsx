import React from "react";
import { useParams } from "react-router-dom";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
// import QRCode from "react-qr-code";
import { QRCodeSVG } from "qrcode.react";
import Button from "../../components/button";
import api from "../../api";
import { toast } from "react-toastify";
import {
  NumertToTextOnlyCurrency,
  NumertToTextWithCurrency,
} from "../../utils/number_utils";

const LegalEntityInvoicePrint = (props) => {
  const componentRef = React.useRef();
  const [invoice, setInvoice] = React.useState({});
  const [totalCost, setTotalCost] = React.useState(0);
  const [finalServices, setFinalServices] = React.useState([]);

  const { invoice_id } = useParams();

  const getInvoice = () => {
    api
      .getInvoice(invoice_id)
      .then((res) => {
        setInvoice(res);

        let newArr = res.services
        newArr.sort(function (a, b) {
            return b.count - a.count;
          });

        setFinalServices(newArr);

        let total_cost = 0;
        res?.services?.map((service) => {
          total_cost += parseInt(service.total_cost);
        });
        setTotalCost(total_cost);
      })
      .catch((err) => {
        Object.keys(err).map((key) => toast.error(key + ": " + err[key]));
      });
  };

  React.useEffect(() => {
    getInvoice();
  }, []);

  return (
    <div>
      <style type="text/css" media="print">
        {
          "@page :first {margin: 0;} @page { size:  auto; margin-top: 2em;margin-bottom: 2em;}"
        }
      </style>
      <hr></hr>

      <ReactToPrint content={() => componentRef.current} removeAfterPrint>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <Button
              clickHandler={handlePrint}
              colorClass="btn-info"
              type="button"
            >
              <>Печать счёта</>
            </Button>
          )}
        </PrintContextConsumer>
      </ReactToPrint>
      <hr></hr>
      <div
        ref={componentRef}
        className="m-3 fs-8 p-3 "
        style={{ textAlign: "justify" }}
      >
        <div className="row">
          <div className="col-9">
            <table
              className="table table-sm border border-black align-top fs-9"
              style={{ textAlign: "center" }}
            >
              <tbody>
                <tr>
                  <td
                    className="border-bottom-0"
                    rowSpan={2}
                    colSpan={4}
                    style={{ textAlign: "left" }}
                  >
                    Филиал &quot;Центральный&quot; Банка ВТБ (ПАО), г. Москва
                  </td>
                  <td
                    className="border border-black"
                    rowSpan={1}
                    colSpan={1}
                    style={{ textAlign: "center" }}
                  >
                    БИК
                  </td>
                  <td
                    className="border-bottom-0"
                    rowSpan={1}
                    colSpan={3}
                    style={{ textAlign: "left" }}
                  >
                    044525411
                  </td>
                </tr>
                <tr>
                  <td
                    className="border-bottom-0 border border-black"
                    rowSpan={1}
                    colSpan={1}
                    style={{ textAlign: "center" }}
                  >
                    Сч. №
                  </td>
                  <td
                    className="border-bottom-0  "
                    rowSpan={1}
                    colSpan={3}
                    style={{ textAlign: "left" }}
                  >
                    30101810145250000411
                  </td>
                </tr>
                <tr>
                  <td
                    className="fs-10 border-top-0"
                    rowSpan={1}
                    colSpan={4}
                    style={{ textAlign: "left" }}
                  >
                    Банк получателя
                  </td>
                  <td
                    className="border border-black border-top-0"
                    rowSpan={1}
                    colSpan={1}
                    style={{ textAlign: "center" }}
                  ></td>
                  <td
                    className=""
                    rowSpan={1}
                    colSpan={3}
                    style={{ textAlign: "left" }}
                  ></td>
                </tr>
                <tr>
                  <td
                    className="border border-black"
                    rowSpan={1}
                    colSpan={2}
                    style={{ textAlign: "left" }}
                  >
                    ИНН 541000885202
                  </td>
                  <td
                    className="border-bottom-0"
                    rowSpan={1}
                    colSpan={2}
                    style={{ textAlign: "left" }}
                  >
                    КПП 0 <span className="text-white">ЗАПОЛН</span>
                  </td>
                  <td
                    className="border border-black border-bottom-0"
                    rowSpan={1}
                    colSpan={1}
                    style={{ textAlign: "center" }}
                  >
                    Сч. №
                  </td>
                  <td
                    className="border-bottom-0"
                    rowSpan={1}
                    colSpan={3}
                    style={{ textAlign: "left" }}
                  >
                    40802810213234220682
                  </td>
                </tr>
                <tr>
                  <td
                    className="border border-black border-bottom-0"
                    rowSpan={1}
                    colSpan={4}
                    style={{ textAlign: "left" }}
                  >
                    Индивидуальный Предприниматель Демидов Евгений Леонидович
                  </td>
                  <td
                    className="border border-black border-top-0 border-bottom-0"
                    rowSpan={1}
                    colSpan={1}
                    style={{ textAlign: "center" }}
                  ></td>
                  <td
                    className="border-bottom-0"
                    rowSpan={1}
                    colSpan={3}
                    style={{ textAlign: "left" }}
                  ></td>
                </tr>
                <tr>
                  <td
                    className="fs-10 border-top-0 border-bottom-0"
                    rowSpan={1}
                    colSpan={4}
                    style={{ textAlign: "left" }}
                  >
                    Получатель
                  </td>
                  <td
                    className="border border-black border-top-0"
                    rowSpan={1}
                    colSpan={1}
                    style={{ textAlign: "center" }}
                  ></td>
                  <td
                    className=""
                    rowSpan={1}
                    colSpan={3}
                    style={{ textAlign: "left" }}
                  ></td>
                </tr>
                <tr>
                  <td
                    className="border border-black border-bottom-0"
                    rowSpan={1}
                    colSpan={8}
                    style={{ textAlign: "left" }}
                  >
                    Оплата по счёту №{invoice.id}, от{" "}
                    {new Date(invoice.date_of_issue).toLocaleDateString()}г.
                  </td>
                </tr>
                <tr>
                  <td
                    className="fs-10 border-black"
                    rowSpan={1}
                    colSpan={8}
                    style={{ textAlign: "left" }}
                  >
                    Назначение платежа
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-3">
            <QRCodeSVG
              // unicode={true}
              size={150}
              //   style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`ST00012|Name=Индивидуальный предприниматель Демидов Евгений Леонидович|PersonalAcc=40802810213234220682|BankName=Филиал "Центральный" Банка ВТБ (ПАО), г. Моск|BIC=044525411|CorrespAcc=30101810145250000411|PayeeINN=541000885202|Purpose=Оплата по счёту №${
                invoice?.id
              }, от ${new Date(
                invoice?.date_of_issue
              ).toLocaleDateString()}г.|Sum=${totalCost}00|KPP=0`}
              //   viewBox={`0 0 150 150`}
            />
            <br></br>
            <p className="fs-11 lh-sm mt-2">
              Оплатите, отсканировав код в банковском приложении, платёжном
              терминале или передав сотруднику банка
            </p>
          </div>
        </div>
        <p className="fw-bold fs-4 border border-black border-2 border-top-0 border-start-0 border-end-0">
          Счёт на оплату №{invoice?.id}, от{" "}
          {new Date(invoice?.date_of_issue).toLocaleDateString()}г.
        </p>
        <table
          className="table table-sm table-borderless align-top fs-8"
          style={{ textAlign: "left" }}
        >
          <tbody>
            <tr>
              <td className="pe-5">Поставщик:</td>
              <td className="fw-bold">
                Индивидуальный предприниматель Демидов Евгений Леонидович, ИНН
                541000885202, ОБЛ. НОВОСИБИРСКАЯ, Г. НОВОСИБИРСК
              </td>
            </tr>
            <tr>
              <td className="pe-5">Покупатель:</td>
              <td className="fw-bold">
                {invoice?.legal_entity?.short_name}, ИНН{" "}
                {invoice?.legal_entity?.inn}, КПП {invoice?.legal_entity?.kpp},{" "}
                {invoice?.legal_entity?.address.toUpperCase()}
              </td>
            </tr>
            <tr>
              <td className="pe-5">Основание:</td>
              <td className="fw-bold">
                {invoice?.legal_entity?.current_contract_verbose}
              </td>
            </tr>
          </tbody>
        </table>
        <table
          className="table table-sm table-borderless border-black align-top fs-9"
          style={{ textAlign: "left" }}
        >
          <thead>
            <tr>
              <th scope="col " className="border border-black text-center">
                №
              </th>
              <th scope="col" className="border border-black text-center">
                Наименование товара, работ, услуг
              </th>
              <th scope="col" className="border border-black text-center">
                Количество
              </th>
              <th scope="col" className="border border-black text-center">
                Ед. изм.
              </th>
              <th scope="col" className="border border-black text-center">
                Цена
              </th>
              <th scope="col" className="border border-black text-center">
                Сумма
              </th>
            </tr>
          </thead>
          <tbody>
            {finalServices?.map((service, index) => (
              <tr key={index}>
                <th scope="col" className="border border-black text-center">
                  {index + 1}
                </th>
                <td className="border border-black">{service.name}</td>
                <td className="border border-black text-center">
                  {service.count}
                </td>
                <td className="border border-black text-center">шт.</td>
                <td className="border border-black text-center">
                  {service.cost.toLocaleString()},00
                </td>
                <td className="border border-black text-center">
                  {service.total_cost.toLocaleString()},00
                </td>
              </tr>
            ))}
            <tr>
              <th
                scope="col"
                colSpan={5}
                className="text-end border border-black border-bottom-0 border-start-0"
              >
                Итого:
              </th>
              <th className="border border-black text-center">
                {totalCost.toLocaleString()},00
              </th>
            </tr>
            <tr>
              <th
                scope="col"
                colSpan={5}
                className="text-end border border-black border-bottom-0 border-start-0 border-top-0"
              >
                Без налога (НДС):
              </th>
              <th className="border border-black text-end">-</th>
            </tr>
            <tr>
              <th
                scope="col"
                colSpan={5}
                className="text-end border border-black border-bottom-0 border-start-0 border-top-0"
              >
                Всего к оплате::
              </th>
              <th className="border border-black text-center">
                {totalCost.toLocaleString()},00
              </th>
            </tr>
          </tbody>
        </table>

        <p className="fs-8">
          Всего наименований {finalServices?.length}, на сумму{" "}
          {totalCost.toLocaleString()} {NumertToTextOnlyCurrency(totalCost)}
        </p>
        <p className="fw-bold fs-8 border border-black border-1 border-top-0 border-start-0 border-end-0">
          {NumertToTextWithCurrency(totalCost)}
        </p>
        <br></br>
        <table
          className="table table-sm table-borderless align-top fs-8"
          style={{ textAlign: "left" }}
        >
          <tbody>
            <tr>
              <td className="pe-5">Руководитель:</td>
              <td className="fw-bold">
               _______________________________
              </td>
              <td className="fw-bold">
               Демидов Евгений Леонидович
              </td>
            </tr>
            <tr>
              <td className="pe-5"></td>
              <td className="fw-bold"></td>
              <td className="fw-bold"></td>
            </tr>
            <tr>
              <td className="pe-5"></td>
              <td className="fw-bold"></td>
              <td className="fw-bold"></td>
            </tr>
            <tr>
              <td className="pe-5"></td>
              <td className="fw-bold"></td>
              <td className="fw-bold"></td>
            </tr>
            <tr>
              <td className="pe-5"></td>
              <td className="fw-bold"></td>
              <td className="fw-bold"></td>
            </tr>
            <tr>
              <td className="pe-5">Главный бухгалтер:</td>
              <td className="fw-bold">
               _______________________________
              </td>
              <td className="fw-bold">
               Демидов Евгений Леонидович
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

LegalEntityInvoicePrint.propTypes = {
  //   legalEntityContract: PropTypes.object.isRequired,
};

export default LegalEntityInvoicePrint;
