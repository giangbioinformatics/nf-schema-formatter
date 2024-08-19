# Nf-schema-formatter
Summary: My motivation is that I want to create the standard process to run nextflow on the HPC system. However,
nf-core tools seems to be overused with their relative function is more and more complicated, not really well support
to grow the bioinformatics community with standard procedure.

DONE:
+ Init the project
+ Create the python package call `nf-utils`
+ Add first function `schema format` to format the `nextflow.config` to be `params.json` to get the main parameters. Later it can lauch the web local
app to edit this `param.json` for basic set up of params for nextflow pipeline.
TODO:
+ Reorg the react js project build
+ Create the template for nextflow pipeline
+ Add validation for nextflow pipeline inputs
+ Add standard test (test workflow only)
+ Add GHA to allow publish to the pypi
+ Add detail documentation

# Development environment
+ npm v10.2.3
+ python3 3.12.2

# Install interative
```
python3 -m venv env
source env/bin/activate
pip install -e .
```

# Example run
Note: Activate your env first 
```
nf-utils schema format example/nextflow.config example
```
