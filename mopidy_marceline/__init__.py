import logging
import pathlib
import tornado.web
from importlib.metadata import version

from mopidy import config, ext

__version__ = version("mopidy-marceline")
__folder__ = pathlib.Path(__file__).parent

# TODO: If you need to log, use loggers named after the current Python module
logger = logging.getLogger(__name__)


class SPARouterHandler(tornado.web.StaticFileHandler):

    def initialize(self, path):
        self.path = str(path)
        self.absolute_path = path
        self.dirname = path.parent
        self.filename = path.name

        super().initialize(self.dirname)

    def get(self, path=None, include_body=True):
        return super().get(self.path, include_body)


def marceline_factory(config, core):
    path = __folder__ / "static"

    return [
        (f"/({'|'.join(str(p.relative_to(path)) if p.is_file() else f'{p.relative_to(path)}/.*' for p in path.iterdir())})",
         tornado.web.StaticFileHandler, {
             "path": path
         }),
        (r"/.*", SPARouterHandler, {
            "path": path / "index.html"
        }),
    ]


class Extension(ext.Extension):
    dist_name = "mopidy-marceline"
    ext_name = "marceline"
    version = __version__

    def get_default_config(self):
        return config.read(__folder__ / "ext.conf")

    # def get_config_schema(self):
    #     schema = super().get_config_schema()
    #     # TODO: Comment in and edit, or remove entirely
    #     #schema["username"] = config.String()
    #     #schema["password"] = config.Secret()
    #     return schema

    def setup(self, registry):
        registry.add("http:app", {
            "name": self.ext_name,
            "factory": marceline_factory,
        })
