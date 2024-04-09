import React from 'react';
import logo from '/logo.jpg'
import { FiEdit } from "react-icons/fi";

const Header = () => {
  const [editOrder, setEditOrder] = React.useState(false);

  return (
    <>
      <div className="row align-items-center">
      <ul className="nav nav-underline align-items-center">
        <img src={logo} width={80}></img>
        {editOrder && 
         <li className="nav-item" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Продолжить заполнение заказа">
         <a className="nav-link text-primary active ">
           <FiEdit className='' />
         </a>
       </li>
        }
        <li className="nav-item">
          <a className="nav-link text-primary" href="#">
            Заказы в работе <span className="badge bg-danger">7</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-primary" href="#">
            Выполненные заказы <span className="badge bg-success">880</span>
          </a>
        </li>
      </ul>
      <hr></hr>
    </div>
    </>
  );
};

export default Header;
