from mopidy_marceline import Extension
from mopidy_marceline import frontend as frontend_lib


def test_get_default_config() -> None:
    ext = Extension()

    config = ext.get_default_config()

    assert "[marceline]" in config
    assert "enabled = true" in config


def test_get_config_schema() -> None:
    ext = Extension()

    schema = ext.get_config_schema()

    # TODO Test the content of your config schema
    # assert "username" in schema
    # assert "password" in schema


# TODO Write more tests
