import 'dotenv/config';
import {Task} from "./tasks/entities/task";
import {Config} from "./config";

export const config: Config = {
    codeLocation: process.env.CODE_LOCATION || '',
    fileExtensions: (process.env.FILE_EXTENSIONS || '').split(','),
    deleteExtensions: (process.env.DELETE_EXTENSIONS || '').split(','),
    processAll: process.env.PROCESS_ALL === 'true'
};

export const featureFlags: Record<Task, boolean> = {
    [Task.AddPagedataImport]: false,
    [Task.ChangeConstructor]: false,
    [Task.ChangeToPagedata]: false,
    [Task.CheckAndCreatePagedataFile]: false,
    [Task.ClearConstructorAddSuper]: false,
    [Task.DeleteAllFiles]: false,
    [Task.DeleteElem]: false,
    [Task.RemoveAllImplements]: false,
    [Task.RemoveConfigureLanguage]: false,
    [Task.RemovePagedataImports]: false,
    [Task.TaraToPage]: false,
    [Task.TypeAnnotationToPrivate]: false,
    [Task.VisitToGoto]: false,
    [Task.WaitToWaitForTimeout]: false, 
    [Task.ModifyConstructor]: true, 
    [Task.AddImportAuthServiceAndPlaywright]: false
}