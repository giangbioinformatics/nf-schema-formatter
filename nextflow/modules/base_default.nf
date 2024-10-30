process BASE_DEFAULT {
    tag "default ${sample}" 

    input:
    tuple val(sample), path(file)

    output:
    tuple val(sample), path("${sample}.txt")

    container 'python:3.9.19-slim'

    conda 'anaconda::python=3.9.19'

    script:
    """
    touch ${sample}.txt
    """
}