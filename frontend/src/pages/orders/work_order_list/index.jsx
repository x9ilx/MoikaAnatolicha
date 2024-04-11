import OrderElement from "../order_element";

const WorkOrderList = () => {
  return (
    <>
      <div className="row">
        <div className="vstack gap-3">
          <OrderElement />
          <OrderElement />
          <OrderElement />
          <OrderElement />
          <OrderElement />
          <OrderElement />
        </div>
      </div>
    </>
  );
};

export default WorkOrderList;
