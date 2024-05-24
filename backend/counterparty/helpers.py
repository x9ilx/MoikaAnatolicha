def get_services_from_service_legal_entity(legal_entity_services):
    results = []
    vehicle_classes = {}

    for legal_entity_service in legal_entity_services:
        vehicle_type_id = (
            legal_entity_service.service_vehicle_type.vehicle_type.id
        )
        vehicle_type_name = (
            legal_entity_service.service_vehicle_type.vehicle_type.name
        )
        vehicle_type_class_id = (
            legal_entity_service.service_vehicle_type.vehicle_type.vehicle_class.id
        )
        vehicle_type_class_name = (
            legal_entity_service.service_vehicle_type.vehicle_type.vehicle_class.name
        )

        if vehicle_type_class_id not in vehicle_classes.keys():
            vehicle_classes[vehicle_type_class_id] = {
                'vehicle_class_id': vehicle_type_class_id,
                'vehicle_class_name': vehicle_type_class_name,
                'show': True,
                'vehicle_type': [],
            }

        added = True
        for v_t_id in vehicle_classes[vehicle_type_class_id]['vehicle_type']:
            if v_t_id['vehicle_type_id'] == vehicle_type_id:
                added = False

        if added:
            vehicle_classes[vehicle_type_class_id]['vehicle_type'].append(
                {
                    'vehicle_type_id': vehicle_type_id,
                    'vehicle_type_name': vehicle_type_name,
                    'show': True,
                    'services': [],
                }
            )

        service_info = legal_entity_service.service_vehicle_type

        for vehicle_type in vehicle_classes[vehicle_type_class_id][
            'vehicle_type'
        ]:
            if vehicle_type['vehicle_type_id'] == vehicle_type_id:
                vehicle_type['services'].append(
                    {
                        'service_type_id': service_info.id,
                        'id': service_info.service.id,
                        'name': service_info.service.name,
                        'cost': legal_entity_service.cost,
                        'employer_salary': legal_entity_service.employer_salary
                        if hasattr(legal_entity_service, 'employer_salary')
                        else 0,
                        'percentage_for_washer': legal_entity_service.percentage_for_washer
                        if hasattr(
                            legal_entity_service, 'percentage_for_washer'
                        )
                        else 0,
                        'to_be_added': True,
                        'to_be_removed': False,
                    }
                )

    for res in vehicle_classes.values():
        results.append(res)

    return results
