import {addImportPagedata} from "../add-import-pagedata-from-pagedata";
import {Task} from "./task";
import {modificationConstructor} from "../modify-constructor";
import {changeConstructor} from "../change-constructor";
import {clearConstructorAddSuper} from "../clear-constructor-add-super";
import {deleteAllFiles} from "../delete-all-files";
import {removeConfigureLanguage} from "../remove-configureLanguage";
import {checkAndCreatePagedataFile} from "../check-and-create-pagadata-file";
import {changeToPagedata} from "../change-to-pagedata";
import {waitToWaitForTimeout} from "../wait-to-waitForTimeout";
import {removeAllImplements} from "../remove-all-implements";
import {taraToPage} from "../tara-to-page";
import {visitToGotTo} from "../visit-to-goto";
import {deleteElem} from "../delete-elem";
import {tsTypeAnnotationToPrivate} from "../ts-typeannotation-to-private";
import {removeImportsDeEnFr} from "../remove-imports-de-en-fr";
import {addImportAuthServiceAndPlaywright} from "../add-import-authservice-and-playwright";

export const tasks = {
    [Task.AddPagedataImport]: addImportPagedata,
    [Task.ChangeConstructor]: changeConstructor,
    [Task.ChangeToPagedata]: changeToPagedata,
    [Task.CheckAndCreatePagedataFile]: checkAndCreatePagedataFile,
    [Task.ClearConstructorAddSuper]: clearConstructorAddSuper,
    [Task.DeleteAllFiles]: deleteAllFiles,
    [Task.DeleteElem]: deleteElem,
    [Task.ModifyConstructor]: modificationConstructor,
    [Task.RemoveAllImplements]: removeAllImplements,
    [Task.RemoveConfigureLanguage]: removeConfigureLanguage,
    [Task.RemovePagedataImports]: removeImportsDeEnFr,
    [Task.TaraToPage]: taraToPage,
    [Task.TypeAnnotationToPrivate]: tsTypeAnnotationToPrivate,
    [Task.VisitToGoto]: visitToGotTo,
    [Task.WaitToWaitForTimeout]: waitToWaitForTimeout,
    [Task.AddImportAuthServiceAndPlaywright]: addImportAuthServiceAndPlaywright
    
}