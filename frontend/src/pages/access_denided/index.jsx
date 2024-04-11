import { useNavigate } from "react-router-dom";
import Button from "../../components/button";

const AccessDenidedPage = () => {
    const navigate = useNavigate();
    return <>
        <p className="text-danger fs-4 text-center">ДОСТУП ЗАПРЕЩЁН</p>
        <p className="text-danger fs-5  text-center">Недостаточно прав для просмотра данной страницы</p>
        <Button
        clickHandler={()=>navigate(-2)}
        colorClass="btn-success"
        type="button"
        disabled={false}
      >
        <>Вернуться</>
      </Button>
    </>
}

export default AccessDenidedPage;