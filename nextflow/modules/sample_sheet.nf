process SAMPLE_SHEET{
    tag "sample_sheet" 
    container "python:3.9.19-bullseye"
    label "sample_sheet"

    input:
    path(inputs)
    path(sample_sheet)
    path(sample_sheet_config)

    output:
    tuple val(sample), path("${sample}.txt")
    
    script:
    """
    prepare_samplesheet.py ${sample_sheet_config} ${sample_sheet} ${inputs}  
    """
}