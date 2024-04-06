import { useFormWithValidation } from "../../utils/validation";
import { AuthContext } from "../../contexts";
import { Form, Navigate } from "react-router-dom";
import { useContext } from "react";
import MetaTags from "react-meta-tags";
import logo from '../../../public/logo.jpg'

const SignIn = ({ onSignIn }) => {
  const { values, handleChange, errors, isValid, resetForm } =
    useFormWithValidation();
  const authContext = useContext(AuthContext);

  return (
    <>
      {authContext && <Navigate to="/" />}
      <MetaTags>
        <title>Войти в CRM</title>
        <meta name="description" content="Чистый грузовик - Войти в CRM" />
        <meta property="og:title" content="Войти в CRM" />
      </MetaTags>

      <div className="text-center">
        <img className="img-fluid col-md-5 px-0" src={logo}></img>
      </div>

      <form onSubmit={e => {
          e.preventDefault()
          onSignIn(values)
        }}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control text"
            id="floatingUsername"
            placeholder="name@example.com"
            onChange={handleChange}
            name='username'
          />
          <label htmlFor="floatingUsername">Пользователь</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control text"
            id="floatingPassword"
            placeholder="Password"
            onChange={handleChange}
            name='password'
          />
          <label htmlFor="floatingPassword">Пароль</label>
        </div>
        <button type="submit" className="w-100 btn btn-primary mt-3 mb-5 text">Войти в CRM</button>
      </form>
    </>
  );
  
};

export default SignIn;
