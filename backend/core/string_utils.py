import re


def normalize_phone(value):
    match = re.match(r'^([\s\d]+)$', value)
    return match.group(0) if match else ''


def normalize_plate_number(value: str):
    return re.sub('\W+', '', value.upper())
