import React from "react";
import logo from "/logo.jpg";
import { RxDropdownMenu } from "react-icons/rx";
import { useAuth } from "../../contexts/auth-context";
import { IoMan } from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { MdCleaningServices } from "react-icons/md";
import { FaTruckFront } from "react-icons/fa6";
import { HiDocumentRemove } from "react-icons/hi";
import { HiDocumentReport } from "react-icons/hi";
import { HiDocumentText } from "react-icons/hi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { IoLogOutSharp } from "react-icons/io5";
import { IoIosListBox } from "react-icons/io";

import { EmployerPosition } from "../../constants";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [menuShow, setMenuShow] = React.useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top pb-0 ">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
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
                  href="#"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Заказы в работе{" "}
                  <span className="badge bg-danger ms-1">7</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-primary" href="#">
                  Выполненные заказы
                  <span className="badge bg-success ms-1">880</span>
                </a>
              </li>
            </ul>
          </div>
          {auth.employerInfo.employer_info.position ==
            EmployerPosition.MANAGER && (
            <>
              <div
                className="collapse navbar-collapse p-2"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle me-3"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Меню
                    </a>
                    <div
                      className="dropdown-menu me-5"
                      aria-labelledby="navbarDropdown"
                    >
                      <a className="dropdown-item" href="#" onClick={() => {
                          navigate("/legal_entity/");
                        }}>
                        <HiBuildingOffice2
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Контрагенты
                      </a>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => {
                          navigate("/employees/");
                        }}
                      >
                        <IoMan size={14} className="me-2 text-text-color" />
                        Сотрудники
                      </a>
                      <a className="dropdown-item" href="#">
                        <MdCleaningServices
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Услуги
                      </a>
                      <div className="dropdown-divider"></div>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => {
                          navigate("/vehicles/classes/");
                        }}
                      >
                        <FaTruckFront
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Классы ТС/ПЦ/ППЦ
                      </a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="#">
                        <HiDocumentReport
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Статистика
                      </a>
                      <a className="dropdown-item" href="#">
                        <HiDocumentText
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Отчёты
                      </a>
                      <a className="dropdown-item" href="#">
                        <FaMoneyCheckAlt
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Заработная плата
                      </a>
                      <a className="dropdown-item" href="#">
                        <HiDocumentRemove
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Расходы
                      </a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="#" onClick={() => {
                          navigate("/company/");
                        }}>
                        <IoIosListBox
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Реквизиты
                      </a>
                      <a className="dropdown-item" href="#" onClick={() => {auth.logOut()}}>
                        <IoLogOutSharp
                          size={14}
                          className="me-2 text-text-color"
                        />
                        Выход
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
