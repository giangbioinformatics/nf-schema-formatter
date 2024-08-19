#!/usr/bin/env python
import typer
from nf_utils.schema.formatter import format_params_to_json

app = typer.Typer()
schema = typer.Typer()


@schema.command()
def format(
    nf_config_path: str = typer.Argument(
        help="The path to the nextflow.config file.",
    ),
    output_dir: str = typer.Argument(
        help="The output directory to save the JSON file.",
        default=".",
    ),
):
    """Formats parameters from  nf_config_path and writes them to output_dir"""
    format_params_to_json(nf_config_path, output_dir)


app.add_typer(schema, name="schema")

if __name__ == "__main__":
    app()
