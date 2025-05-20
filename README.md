# mopidy-marceline

[![Latest PyPI version](https://img.shields.io/pypi/v/mopidy-marceline)](https://pypi.org/p/mopidy-marceline)
[![CI build status](https://img.shields.io/github/actions/workflow/status/ttoino/mopidy-marceline/ci.yml)](https://github.com/ttoino/mopidy-marceline/actions/workflows/ci.yml)
[![Test coverage](https://img.shields.io/codecov/c/gh/ttoino/mopidy-marceline)](https://codecov.io/gh/ttoino/mopidy-marceline)

Mopidy extension with stylish frontend for controlling playback and browsing

## Installation

Install by running:

```sh
python3 -m pip install mopidy-marceline
```

See https://mopidy.com/ext/marceline/ for alternative installation methods.

## Configuration

Before starting Mopidy, you must add configuration for
mopidy-marceline to your Mopidy configuration file:

```ini
[marceline]
# TODO: Add example of extension config
```

## Project resources

- [Source code](https://github.com/ttoino/mopidy-marceline)
- [Issues](https://github.com/ttoino/mopidy-marceline/issues)
- [Releases](https://github.com/ttoino/mopidy-marceline/releases)

## Development

### Set up development environment

Clone the repo using, e.g. using [gh](https://cli.github.com/):

```sh
gh repo clone ttoino/mopidy-marceline
```

Enter the directory, and install dependencies using [uv](https://docs.astral.sh/uv/):

```sh
cd mopidy-marceline/
uv sync
```

### Running tests

To run all tests and linters in isolated environments, use
[tox](https://tox.wiki/):

```sh
tox
```

To only run tests, use [pytest](https://pytest.org/):

```sh
pytest
```

To format the code, use [ruff](https://docs.astral.sh/ruff/):

```sh
ruff format .
```

To check for lints with ruff, run:

```sh
ruff check .
```

To check for type errors, use [pyright](https://microsoft.github.io/pyright/):

```sh
pyright .
```

### Setup before first release

Before the first release, you must [enable trusted publishing on
PyPI](https://docs.pypi.org/trusted-publishers/creating-a-project-through-oidc/)
so that the `release.yml` GitHub Action can create the PyPI project and publish
releases to PyPI.

When following the instructions linked above, use the following values in the
form at PyPI:

- Publisher: GitHub
- PyPI project name: `mopidy-marceline`
- Owner: `ttoino`
- Repository name: `mopidy-marceline`
- Workflow name: `release.yml`
- Environment name: `pypi` (must match environment name in `release.yml`)

### Making a release

To make a release to PyPI, go to the project's [GitHub releases
page](https://github.com/ttoino/mopidy-marceline/releases)
and click the "Draft a new release" button.

In the "choose a tag" dropdown, select the tag you want to release or create a
new tag, e.g. `v0.1.0`. Add a title, e.g. `v0.1.0`, and a description of the changes.

Decide if the release is a pre-release (alpha, beta, or release candidate) or
should be marked as the latest release, and click "Publish release".

Once the releease is created, the `release.yml` GitHub Action will automatically
build and publish the release to
[PyPI](https://pypi.org/project/mopidy-marceline/).

## Credits

- Original author: [João Pereira](https://github.com/ttoino)
- Current maintainer: [João Pereira](https://github.com/ttoino)
- [Contributors](https://github.com/ttoino/mopidy-marceline/graphs/contributors)
