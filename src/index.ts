import 'dotenv/config';
import {MigrationEngine} from "./migration-engine";
import {config, featureFlags} from "./currentConfig";

const migrationEngine = new MigrationEngine(config, featureFlags);
migrationEngine.run();