import Button from "../../../components/button";
import OrderElementGroup from "../order_element_group";

const OrderElement = (order) => {
  return (
    <>
      <div className="card shadow">
        <div className="card-header bg-primary pl-2 pr-2 pt-1 pb-1">
          <div className="row fs-7 fw-medium">
            <div
              className="col-9 text-start text-white fw-medium "
              style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
            >
              08.04.2023 14:32 (4 500₽)
            </div>
            <div
              className="col-3 text-end text-white fw-medium"
              style={{ textShadow: "1px -1px 7px rgba(0,0,0,0.45)" }}
            >
              00:04:32
            </div>
          </div>
        </div>
        <div className="card-body p-1 pb-0">
          {/* <div className="d-flex align-items-center"> */}
          <div className="row d-sm-flex flex-sm-row flex-column fs-7">
            <div className="col  pt-1" id="services">
              <OrderElementGroup
                header="Седельный тягач (европа)"
                elements_with_badge={[
                  { name: "Химчистка", badge: "1 700₽" },
                  { name: "Мойка с химией", badge: "1 500₽" },
                  { name: "Мойка двигателя", badge: "600₽" },
                ]}
              />
              <OrderElementGroup
                header="Цистера"
                elements_with_badge={[
                  { name: "Мойка с химией", badge: "1 700₽" },
                ]}
              />
            </div>
            <div className="col  pt-1" id="washers">
              <OrderElementGroup
                header="Мойщики"
                elements_with_badge={[
                  { name: "Саня", badge: "Получит 300₽" },
                  { name: "Валера", badge: "Получит 300₽" },
                  { name: "Алевтина", badge: "Получит 300₽" },
                ]}
              />
            </div>
          </div>
          <div className="row mx-3 gap-1 my-2">
            <Button
              clickHandler={() => {}}
              colorClass="btn-primary"
              type="button"
              disabled={false}
            >
              <>Завершить заказ</>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderElement;
