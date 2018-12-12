def rm_values(some_list, *args):
    if not some_list:
        return []
    return [k for k in some_list if k not in args]


def rm_keys(some_dict, *args):
    if not some_dict:
        return {}
    return {k: v for k, v in some_dict.items() if k not in args}
