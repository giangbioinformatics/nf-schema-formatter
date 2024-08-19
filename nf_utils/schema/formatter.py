import re
import json
import os
import logging
import webbrowser


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


def extract_params_block(file_path):
    with open(file_path, "r") as file:
        content = file.read()
    match = re.search(
        r"\bparams\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}", content, re.DOTALL
    )
    if not match:
        raise ValueError(
            "The 'params' section is missing or empty in the configuration file."
        )
    params_block = match.group(1).strip()
    return params_block


def parse_params_block(params_block):
    params_dict = {}
    lines = params_block.split("\n")
    for line in lines:
        param_dict = {}
        line = line.split("#")[0].strip()
        if "=" in line:
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            # boolean
            if value.lower() in ["true", "false"]:
                value = value.lower() == "true"
                param_dict["type"] = "boolean"
            # int
            elif value.isdigit():
                value = int(value)
                param_dict["type"] = "int"
            # float
            elif re.match(r"^-?\d+(?:\.\d+)?$", value):
                value = float(value)
                param_dict["type"] = "float"
            elif value == "null":
                param_dict["type"] = "string"
                param_dict["required"] = "true"
            # others
            if not param_dict.get("required"):
                param_dict["default"] = value
            params_dict[key] = param_dict

    return params_dict


def format_params_to_json(file_path: str, outdir: str):
    """It will check for the nextflow pipeline to set up the parameters and convert them to JSON.

    Args:
        file_path (str): The file path of the nextflow.config file.
        outdir (str): The output directory to save the JSON file.
    """
    if not file_path.endswith("nextflow.config"):
        logger.error("The file is not a nextflow.config file.")
        raise ValueError("The file is not a nextflow.config file.")
    if os.path.isfile(file_path) is False:
        logger.error(f"The file {file_path} does not exist.")
        raise ValueError(f"The file {file_path} does not exist.")
    if os.path.isdir(outdir) is False:
        logger.warning(f"The directory {outdir} does not exist.")
        os.makedirs(outdir)

    params_block = extract_params_block(file_path)
    params_dict = parse_params_block(params_block)
    params_json = json.dumps(params_dict, indent=4)

    with open(os.path.join(outdir, "params.json"), "w") as json_file:
        json_file.write(params_json)
    webbrowser.open(f"file://{os.path.abspath(outdir)}/params.json")

    logger.info(f"Parameters have been written to {outdir}/params.json")
