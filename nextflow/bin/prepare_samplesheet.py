#!/usr/bin/env python
import sys
import os
import json
import csv
import glob

def create_directory_structure(config_file, samplesheet_file, inputs_folder):
    # Load the JSON configuration
    with open(config_file, 'r') as f:
        config = json.load(f)

    # Read the samplesheet
    with open(samplesheet_file, 'r') as f:
        reader = csv.DictReader(f)
        samples = [row for row in reader]

    # Process each sample
    for sample in samples:
        group_name = sample['sample']

        # Create a unique directory for the group
        group_dir = os.path.join("sample",group_name)
        os.makedirs(group_dir, exist_ok=True)

        # Process parameters defined in the config
        for param_key, param_type in config['sample']['param'].items():
            if param_key in sample:
                # Determine the folder name based on the parameter
                folder_name = param_key.lower()
                folder_path = os.path.join(group_dir, folder_name)
                os.makedirs(folder_path, exist_ok=True)

                # Get the file or value and copy or create it in the folder
                param_value = sample[param_key]
                if param_type == 'file' and param_value:
                    # Copy the file to the appropriate folder
                    file_path = glob.glob(os.path.join(inputs_folder,"**", param_value), recursive=True)
                    file_path = file_path[0] if file_path else None
                    if os.path.exists(file_path):
                        new_file_path = os.path.join(folder_path, param_value)
                        os.system(f'ln -s {file_path} {new_file_path}')
                    else:
                        print(f"Warning: {file_path} does not exist!")
                elif param_type == 'string':
                    # Write the string value into a text file in the folder
                    with open(os.path.join(folder_path, 'value.txt'), 'w') as text_file:
                        text_file.write(param_value)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python script.py <config.json> <samplesheet.csv> <inputs_folder>")
        sys.exit(1)

    config_file = sys.argv[1]
    samplesheet_file = sys.argv[2]
    inputs_folder = sys.argv[3]

    create_directory_structure(config_file, samplesheet_file, inputs_folder)
