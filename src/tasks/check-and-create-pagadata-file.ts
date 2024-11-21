
import * as fs from 'fs';
import * as recast from 'recast';
import { visit } from 'ast-types';
import * as babelParser from '@babel/parser';
import path from 'path';
import * as t from '@babel/types';
import 'dotenv/config';


export function checkAndCreatePagedataFile(sourceCode: string, filePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const directory = path.dirname(filePath);
    const pagedataDirPath = path.join(directory, 'pagedata');
    if (fs.existsSync(pagedataDirPath)) {
      if (fs.statSync(pagedataDirPath).isDirectory()) {
        console.log(`Pagedata-Verzeichnis gefunden in: ${directory}`);
        createPagedataFile(pagedataDirPath).then(resolve).catch(reject);
      }
    } else {
      resolve();
    }
  });
}

// Function for creating `pagedata.ts` in a directory
function createPagedataFile(filePath: string): Promise<void> {
  const pagedataFilePath = path.join(filePath, 'pagedata.ts');
  console.warn(pagedataFilePath)
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(pagedataFilePath)) {
      console.log(`pagedata.ts existiert bereits in: ${filePath}`);
      resolve();
      return;
    } else {
      const pagedataDeLocation = path.join(filePath, 'pagedata', 'pagedata-de.ts');
      if (!fs.existsSync(pagedataDeLocation)) {
        console.log("File doesn't exist: " + pagedataDeLocation);
        resolve();
        return;
      }

      const sourceCode = fs.readFileSync(pagedataDeLocation, 'utf8');
      const ast = parseTS(sourceCode);

      let extendsClassName: string | null = null;
      let classBody: any = null;
      const imports: any[] = [];

      visit(ast, {
        visitImportDeclaration(nodePath) {
          const importNode = nodePath.node;
          if (importNode.source.value !== './pagedata') {
            imports.push(importNode); 
          }
          this.traverse(nodePath);
        },
        visitClassDeclaration(nodePath) {
          const node = nodePath.node;
          if (node.superClass && t.isIdentifier(node.superClass)) {
            extendsClassName = node.superClass.name; 
            classBody = node.body.body; 
          }
          this.traverse(nodePath);
        }
      });

      if (!extendsClassName || !classBody) {
        console.error("Klassendeklaration oder Superclass-Deklaration nicht gefunden oder unvollständig.");
        reject(new Error("Klassendeklaration oder Superclass-Deklaration nicht gefunden oder unvollständig."));
        return;
      }

     
      const newClassDeclaration = t.classDeclaration(
          t.identifier(extendsClassName),
          null, 
          t.classBody(classBody),
          []
      );

     
      const exportPagedataConst = t.exportNamedDeclaration(
          t.variableDeclaration('const', [
            t.variableDeclarator(
                t.identifier('pagedata'),
                t.newExpression(t.identifier(extendsClassName), [])
            )
          ]), []
      );

      // Create program node that contains the import instructions, class declaration and export instructions
      const newProgram = t.program([...imports, newClassDeclaration, exportPagedataConst]);

      // Generate the resulting code
      const output = recast.print(newProgram).code;

      // Write generated code in `pagedata.ts`.
      try {
        fs.writeFileSync(pagedataFilePath, output, 'utf8');
        console.log(`pagedata.ts erfolgreich erstellt in: ${pagedataFilePath}`);
      } catch (e) {
        console.error('Fehler beim Erstellen von pagedata.ts:', e);
        reject(e);
        return;
      }

      // Delete old `pagedata`-directory
      const oldPagedataPath = path.join(filePath, 'pagedata');
      try {
        fs.rmSync(oldPagedataPath, {recursive: true, force: true});
        console.log(`${oldPagedataPath} is deleted!`);
      } catch (err) {
        console.error(`Error while deleting ${oldPagedataPath}.`);
        console.error(err);
        reject(err);
        return;
      }

      resolve();
    }
  });
}
  
  function parseTS(sourceCode: string) {
    const ast = recast.parse(sourceCode, {
      parser: {
        parse(source: string) {
          return babelParser.parse(source, {
            sourceType: "module",
            plugins: [
              "typescript",
            ]
          });
        }
      }
    });
    return ast;
  }