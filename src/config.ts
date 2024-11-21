/**
 * Represents the configuration options for the migration engine.
 * @property {string} codeLocation - The location of the code.
 * @property {string[]} fileExtensions - An array of file extensions.
 * @property {string[]} deleteExtensions - An array of file extensions to be deleted.
 * @property {boolean} processAll - Indicates whether to process all files.
 */
export interface Config {
    codeLocation: string;
    fileExtensions: string[];
    deleteExtensions: string[];
    processAll: boolean;
}