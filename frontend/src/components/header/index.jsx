import React from "react";
import logo from "/logo.jpg";
import { RxDropdownMenu } from "react-icons/rx";
import { useAuth } from "../../contexts/auth-context";
import { IoMan } from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdCleaningServices } from "react-icons/md";
import { FaTruckFront } from "react-icons/fa6";
import { HiDocumentReport } from "react-icons/hi";
import { HiDocumentText } from "react-icons/hi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { IoLogOutSharp } from "react-icons/io5";
import { IoIosListBox } from "react-icons/io";
import { GiCarDoor } from "react-icons/gi";
import { GiCarKey } from "react-icons/gi";

import { EmployerPosition } from "../../constants";
import { useNavigate } from "react-router-dom";
import ActiveOrderCount from "../order_active_count";
import ClosedOrderCount from "../closed_order_count";

const Header = React.forwardRef(function MyInput(props, ref) {
  const [menuShow, setMenuShow] = React.useState(false);
  const [update, setUpdate] = React.useState(false);

  const activeOrderRef = React.useRef(null);
  const closedOrderRef = React.useRef(null);

  React.useImperativeHandle(ref, () => ({
    setUpdate,
    update,
  }));

  const auth = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    activeOrderRef.current.setUpdate(!update)
    closedOrderRef.current.setUpdate(!update)
  }, [update])

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white  pb-0 ">
        <div className="container-fluid">
          <a className="navbar-brand" style={{cursor: "pointer"}}>
            <img src={logo} width={80}></img>
          </a>
          <button
            className="navbar-toggler me-3 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setMenuShow(!menuShow)}
          >
            <RxDropdownMenu
              size={32}
              className="text-text-color"
              style={menuShow ? { transform: "scaleY(-1)" } : ""}
            />
          </button>
          <div
            className="collapse navbar-collapse p-2"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a
                  className="nav-link text-primary"
                  style={{cursor: "pointer"}}
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Заказы в работе <ActiveOrderCount ref={activeOrderRef}/>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-primary" style={{cursor: "pointer"}} onClick={() => {navigate("/completed/", { state: { search: '' } })}}>
                  Выполненные заказы <ClosedOrderCount ref={closedOrderRef}/>
                </a>
              </li>
            </ul>
          </div>

          <div
            className="collapse navbar-collapse p-2"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle me-3"
                  style={{cursor: "pointer"}}
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Меню ({auth.employerInfo.employer_info.short_name})
                </a>
                <div
                  className="dropdown-menu me-5"
                  aria-labelledby="navbarDropdown"
                >
                  {auth.employerInfo.employer_info.position ==
                    EmployerPosition.MANAGER && (
                    <>
                      <a
                        className="dropdown-item"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                          navigate("/legal_entity/");
                        }}
                      >
                        <HiBuildingOffice2
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Контрагенты
                      </a>
                      <a
                        className="dropdown-item"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                          navigate("/employees/");
                        }}
                      >
                        <IoMan size={14} className="me-2 text-text-color" />
                        Сотрудники
                      </a>
                      <a className="dropdown-item" style={{cursor: "pointer"}}
                      onClick={() => {
                        navigate("/services/");
                      }}>
                        <MdCleaningServices
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Услуги
                      </a>
                      <div className="dropdown-divider"></div>
                      <a
                        className="dropdown-item"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                          navigate("/vehicles/classes/");
                        }}
                      >
                        <FaTruckFront
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Классы ТС/ПП/ППЦ
                      </a>
                      <a
                        className="dropdown-item"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                          navigate("/vehicles/models/");
                        }}
                      >
                        <GiCarDoor size={14} className="me-2 text-text-color" />
                        Модели ТС/ПП/ППЦ
                      </a>

                      <a
                        className="dropdown-item"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                          navigate("/vehicles/");
                        }}
                      >
                        <GiCarKey size={14} className="me-2 text-text-color" />
                        ТС/ПП/ППЦ
                      </a>

                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" style={{cursor: "pointer"}} onClick={() => {
                          navigate("/statistic/");
                        }}>
                        <HiDocumentReport
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Статистика
                      </a>
                      {/* <a className="dropdown-item" style={{cursor: "pointer"}}>
                        <HiDocumentText
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Отчёты
                      </a> */}
                      <a className="dropdown-item" style={{cursor: "pointer"}}
                      onClick={() => {
                        navigate("/employees/salaries/");
                      }}
                      >
                        <FaMoneyCheckAlt
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Заработная плата
                      </a>
                      {/* <a className="dropdown-item" style={{cursor: "pointer"}}>
                        <HiDocumentRemove
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Расходы
                      </a> */}
                      <div className="dropdown-divider"></div>
                      {/* <a
                        className="dropdown-item"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                          navigate("/company/");
                        }}
                      >
                        <IoIosListBox
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Реквизиты
                      </a> */}
                      <a
                        className="dropdown-item"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                          navigate("/settings/");
                        }}
                      >
                        <IoIosListBox
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Настройки
                      </a>
                      
                      <a
                        className="dropdown-item"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                          auth.logOut();
                        }}
                      >
                        <IoLogOutSharp
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Выход
                      </a>
                    </>
                  )}
                  {auth.employerInfo.employer_info.position !=
                    EmployerPosition.MANAGER && (
                    <>
                     <a
                        className="dropdown-item"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                          auth.logOut();
                        }}
                      >
                        <IoLogOutSharp
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Закрыть смену
                      </a>
                    </>
                    )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
});

export default Header;
