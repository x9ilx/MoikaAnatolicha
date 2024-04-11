import { useFormWithValidation } from "../../utils/validation";
import { Navigate } from "react-router-dom";
import logo from "/logo.jpg";
import { useAuth } from "../../contexts/auth-context";
import Button from "../../components/button";

const SignIn = () => {
  const { values, handleChange, errors, isValid, resetForm } =
    useFormWithValidation();
  const auth = useAuth();

  {
    document.title = "Войти в CRM Чистый Грузовик";
  }
  return (
    <>
      {auth.loggedIn && <Navigate to="/" />}

      <div className="text-center">
        <img className="img-fluid col-md-5 px-0" src={logo}></img>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          auth.loginAction(values);
        }}
      >
        <div className="form-floating mb-3">
          <input
            className="form-control text"
            id="floatingUsername"
            placeholder="name@example.com"
            onChange={handleChange}
            name="username"
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
            name="password"
          />
          <label htmlFor="floatingPassword">Пароль</label>
        </div>
        <Button
          clickHandler={() => {}}
          colorClass="btn-primary mt-3"
          type="submit"
          disabled={false}
        >
          <>Войти в CRM</>
        </Button>
      </form>
    </>
  );
};

export default SignIn;
