#!/usr/bin/env nextflow
nextflow.enable.dsl = 2
// modules and subworkflows
include { SAMPLE_SHEET_VALIDATION } from "./subworkflows/sample_sheet_validation.nf"

// inputs
inputs_ch = Channel.fromPath("data")
sample_sheet_ch = Channel.fromPath("data/samplesheet.csv")
sample_sheet_config_ch = Channel.fromPath("conf/samplesheet_config.json")
workflow {
    main:
        SAMPLE_SHEET_VALIDATION(
            inputs_ch,
            sample_sheet_ch,
            sample_sheet_config_ch
        )
}