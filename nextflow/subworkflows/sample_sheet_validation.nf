include { SAMPLE_SHEET } from "../modules/sample_sheet.nf"
workflow SAMPLE_SHEET_VALIDATION {
    take:
        inputs_ch
        sample_sheet_ch
        sample_sheet_config_ch
    main:
        SAMPLE_SHEET(
            inputs_ch,
            sample_sheet_ch,
            sample_sheet_config_ch
        )
}