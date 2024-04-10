import { useNavigate } from "react-router-dom";

const AccessDenidedPage = () => {
    const navigate = useNavigate();
    return <>
        <p className="text-danger fs-4 text-center">ДОСТУП ЗАПРЕЩЁН</p>
        <p className="text-danger fs-5  text-center">Недостаточно прав для просмотра данной страницы</p>
        <button type="button" className="btn btn-sm btn-primary w-100" onClick={()=>navigate(-2)}>
            Вернуться
        </button>
    </>
}

export default AccessDenidedPage;