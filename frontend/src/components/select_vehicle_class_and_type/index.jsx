import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import api from "../../api";

const SelectVehicleClassAndType = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [fisrtLoad, setFisrtLoad] = React.useState(true);
  const [currentClass, setCurrentClass] = React.useState(
    props.currentVehicleClass
  );
  const [currentClassIndex, setCurrentClassIndex] = React.useState(-1);
  const [currentType, setCurrentType] = React.useState(
    props.currentVehicleType
  );
  const [currentTypeIndex, setCurrentTypeIndex] = React.useState(-1);
  const [currentClassName, setCurrentClassName] = React.useState(
    props.currentVehicleClassName
  );
  const [currentTypeName, setCurrentTypeName] = React.useState(
    props.currentVehicleTypeName
  );

  const [vehicleClasses, setVehicleClasses] = React.useState([]);
  const [vehicleTypes, setVehicleTypes] = React.useState([]);

  const setVehicleClassIndexAndVehicleTypeIndex = React.useCallback(() => {
    if (props.currentVehicleClass && vehicleClasses.length > 0) {
      const index = vehicleClasses.findIndex(
        (v_class) => v_class.id === props.currentVehicleClass
      );
      setCurrentClass(vehicleClasses[index].id);
      props.onSelectClass(vehicleClasses[index].id, vehicleClasses[index].name);
      setCurrentClassIndex(index);
    }
    setFisrtLoad(false);
  }, [props.currentVehicleClass, vehicleClasses]);

  React.useEffect(() => {
    setVehicleClassIndexAndVehicleTypeIndex();
  }, [vehicleClasses, setVehicleClassIndexAndVehicleTypeIndex]);

  const getVehicleClassesAndTypes = React.useCallback(() => {
    setLoading(true);
    api
      .getVehicleClasses(1, 999999, "")
      .then((res) => {
        setVehicleClasses(res.results);

        let ci = 0;

        if (props.currentVehicleClass) {
          ci = res?.results?.findIndex(
            (v_class) => v_class.id === props.currentVehicleClass
          );
        }

        
        setVehicleTypes(res.results[ci]?.vehicle_types);

        if (!props.currentVehicleClass) {
          setCurrentClassIndex(0);
          setCurrentClass(res.results[0]?.id);
          setCurrentClassName(res.results[0]?.name);
        } else {
          setCurrentClassIndex(ci);
          setCurrentClass(props.currentVehicleClass);
          setCurrentClassName(props.currentVehicleClassName);
        }

        if (!props.currentVehicleType) {
          setCurrentTypeIndex(0);
          setCurrentType(res.results[0]?.vehicle_types[0]?.id);
          setCurrentTypeName(res.results[0]?.vehicle_types[0]?.name);
        } else {
          const ti = res.results[ci]?.vehicle_types.findIndex(
            (v_type) => v_type.id === props.currentVehicleType
          );
          setCurrentTypeIndex(ti);
          setCurrentType(props.currentVehicleType);
          setCurrentTypeName(props.currentVehicleTypeName);
        }

        setLoading(false);
      })
      .catch((err) => {
        const errors = Object.values(err);
        if (errors) {
          toast.error(errors.join(", "));
        }
      });
  }, [props]);

  React.useEffect(() => {
    getVehicleClassesAndTypes();
  }, []);

  const getVehicleTypesByClass = React.useCallback(() => {
    if (currentClassIndex >= 0 && vehicleClasses) {
      let classes = vehicleClasses[currentClassIndex].vehicle_types;
      setVehicleTypes(classes);

      // setCurrentType(classes[0]?.id);
      // setCurrentTypeName(classes[0]?.name);
      // setCurrentTypeIndex(0);
      // props.onSelectType(classes[0]?.id, classes[0]?.name);
    }
  }, [currentClassIndex, vehicleClasses]);

  const changeVClass = React.useCallback(
    (class_id, class_index, class_name) => {
      setCurrentClass(class_id);
      setCurrentClassIndex(class_index);
      setCurrentType(vehicleClasses[class_index].vehicle_types[0]?.id);
      setCurrentClassName(class_name);
      setCurrentTypeName(
        vehicleClasses[class_index].vehicle_types[0]?.name
      );
      setCurrentTypeIndex(0);
    },
    [vehicleClasses]
  );

  React.useEffect(() => {
    getVehicleTypesByClass();
  }, [currentClassIndex]);

  React.useEffect(() => {
    props.onSelectType(currentType, currentTypeName);
  }, [currentTypeName, currentType, props]);

  if (loading || fisrtLoad) {
    return (
      <>
        <p className="grid h-screen place-items-center text-center">
          Загрузка...
        </p>
      </>
    );
  }

  return (
    <>
      <div className="form-floating mb-3">
        <p className="">Класс ТС/ПП/ППЦ:</p>
        <select
          className="form-select text p-3"
          id="currentClass"
          placeholder="currentClass"
          value={currentClass}
          onChange={(e) => {
            // setCurrentClass(e.target.value);
            // setCurrentClassIndex(e.target.selectedIndex);
            // setCurrentClassName(e.target[e.target.selectedIndex].text);
            props.onSelectClass(
              e.target.value,
              e.target[e.target.selectedIndex].text
            );
            changeVClass(
              e.target.value,
              e.target.selectedIndex,
              e.target[e.target.selectedIndex].text
            );
          }}
          name="currentClass"
        >
          {vehicleClasses?.map((vehicle_class, index) => (
            <option key={index} value={vehicle_class.id}>
              {vehicle_class.name}
            </option>
          ))}
        </select>
      </div>

      {currentClassIndex >= 0 && (
        <>
          <div className="form-floating mb-3">
            <p className="">Тип ТС/ПП/ППЦ:</p>
            <select
              className="form-select text p-3"
              id="currentType"
              placeholder="currentType"
              value={currentType}
              onChange={(e) => {
                props.onSelectType(
                  e.target.value,
                  e.target[e.target.selectedIndex].text
                );
                setCurrentType(e.target.value);
                setCurrentTypeIndex(e.target.selectedIndex);
                setCurrentTypeName(e.target[e.target.selectedIndex].text);
              }}
              name="currentType"
            >
              {vehicleTypes.map((vehicle_type, ind) => (
                <option key={ind + "sdfsdfsfd"} value={vehicle_type.id}>
                  {vehicle_type.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </>
  );
};

SelectVehicleClassAndType.propTypes = {
  currentVehicleClass: PropTypes.number,
  currentVehicleClassName: PropTypes.string,
  currentVehicleType: PropTypes.number,
  currentVehicleTypeName: PropTypes.string,
  onSelectClass: PropTypes.func.isRequired,
  onSelectType: PropTypes.func.isRequired,
  setVehicleFromParent: PropTypes.bool,
};

export default SelectVehicleClassAndType;
