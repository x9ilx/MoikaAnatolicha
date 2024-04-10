import OrderElementGroup from "../order_element_group";

const OrderElement = (order) => {
  return (
    <>
      <div className="card shadow">
        <div className="card-header bg-secondary pl-2 pr-2 pt-1 pb-1">
          <div className="row fs-7 fw-medium">
            <div className="col-9 text-start text-body-secondary">
              08.04.2023 14:32 (4 500₽)
            </div>
            <div className="col-3 text-end text-body-secondary">00:04:32</div>
          </div>
        </div>
        <div className="card-body p-1 pb-0">
          {/* <div className="d-flex align-items-center"> */}
          <div className="row d-sm-flex flex-sm-row flex-column fs-7">
            <div className="col  pt-1" id="services">
              <OrderElementGroup
                header="Седельный тягач (европа)"
                elements_with_badge={{
                  Химчистка: "1 700₽",
                  "Мойка с химией": "1 500₽",
                  "Мойка двигателя": "600₽",
                }}
              />
              <OrderElementGroup
                header="Цистера"
                elements_with_badge={{
                  "Мойка с химией": "1 700₽",
                }}
              />
            </div>
            <div className="col  pt-1" id="washers">
              <OrderElementGroup
                header="Мойщики"
                elements_with_badge={{
                  Саня: "Получит 300₽",
                  Валера: "Получит 300₽",
                  Алевтина: "Получит 300₽",
                }}
              />
            </div>
          </div>
          <div className="row mx-3 gap-1 my-2">
            <button type="button" className="btn btn-bd-primary text_light fw-medium lh-lg">
              Завершить заказ
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderElement;
