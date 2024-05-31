"""Copyright(c) David Rueter All rights reserved. This program is made
available under the terms of the AGPLv3 license. See the LICENSE file in the project root for more information. """

def is_value_safe(value, safe_set):
    """Check if the value is in the safe params list."""
    return value in safe_set


def walk_json(data, safe_set, skip_keys):
    """Recursively walk through the JSON data, checking values against the safe_set.
       Returns a list of unsafe values."""
    unsafe_values = []
    if isinstance(data, dict):
        for key, value in data.items():
            if key in skip_keys:
                continue  # Skip checking this key-value pair
            if isinstance(value, (dict, list)):
                # Recurse into sub-dictionaries or lists
                unsafe_values.extend(walk_json(value, safe_set, skip_keys))
            elif not is_value_safe(value, safe_set):
                unsafe_values.append(value)
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, (dict, list)):
                # Recurse into sub-items
                unsafe_values.extend(walk_json(item, safe_set, skip_keys))
            elif not is_value_safe(item, safe_set):
                unsafe_values.append(item)
    return unsafe_values