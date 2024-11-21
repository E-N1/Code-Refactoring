import {promises as fs} from 'fs'
import path from "path";
import {Task} from "./tasks/entities/task";
import {tasks} from "./tasks/entities/tasks";
import {Config} from "./config";

export class MigrationEngine {
    fileCounter = 0;

    constructor(public config: Config, public featureFlags: Record<Task, boolean>) {
    }

    public async run(): Promise<void> {
        try {
            const targetDir = this.config.codeLocation;
            await this.processFilesInDirectory(targetDir);

            console.log('\nVerarbeitung abgeschlossen');
            console.log(`Es wurden \x1b[32m${this.fileCounter}\x1b[0m Dateien verändert`);
        } catch (err) {
            console.error('Fehler beim Verarbeiten der Dateien:', err);
        }
    }

    private async processFile(filePath: string): Promise<void> {
        let sourceCode;

        // Read the file
        console.log(`Beginne Verarbeitung der Datei: ${filePath}`);
        try {
            sourceCode = await fs.readFile(filePath, 'utf8');
            console.log(filePath + "\nDatei gelesen, bearbeite Inhalt\n");
        } catch (err) {
            console.error('Fehler beim Verarbeiten der Datei:', err);
            throw err;
        }

        // Execute all tasks on the source code
        for (const [taskKey, isEnabled] of Object.entries(this.featureFlags)) {
            if(isEnabled) {
                if (Task.hasOwnProperty(taskKey)) {
                    const task = Task[taskKey as keyof typeof Task];
                    console.log(`Task: ${task} ausgeführt`);
                    sourceCode = tasks[taskKey](sourceCode, filePath);
                    
                }
            }
        }

        // Write the modified code back to the file
        // When not returns an empty string
        if(sourceCode !== "") {
            try {
                await fs.writeFile(filePath, sourceCode, 'utf8');
                console.log(`Datei erfolgreich geschrieben: ${filePath}`);
            } catch (err) {
                console.error('Fehler beim Verarbeiten der Datei:', err);
                throw err;
            }
        }
    }

    private async processFilesInDirectory(directory: string): Promise<void> {
        console.log(`Verarbeite Verzeichnis: ${directory}`);

        try {
            const files = await fs.readdir(directory);

            const promises = files.map(async file => {
                const fullPath = path.join(directory, file);
                const fileStat = await fs.lstat(fullPath);

                if (fileStat.isDirectory()) {
                    await this.processFilesInDirectory(fullPath);
                } else if (this.config.processAll || this.shouldProcessFile(fullPath)) {
                    this.fileCounter++;
                    await this.processFile(fullPath);
                }
            });

            await Promise.all(promises);
        } catch (err) {
            console.error(`Fehler beim Verarbeiten des Verzeichnisses: ${directory}`, err);
            throw err;
        }
    }

    /**
     * Determines whether a file should be processed based on its file path.
     * @param filePath - The file path to check.
     * @returns A boolean indicating whether the file should be processed.
     */
    private shouldProcessFile(filePath: string): boolean {
        return this.config.fileExtensions.some(ext => filePath.endsWith(ext));
    }
}