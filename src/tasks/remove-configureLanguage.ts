import * as recast from 'recast';
import { visit } from 'ast-types';
import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import 'dotenv/config';


export function removeConfigureLanguage(sourceCode: string, filePath: string): string {
  var ast = recast.parse(sourceCode, {
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



  visit(ast, {
    visitClassBody(path) {
        const node = path.node;
        if(node.body) {
            node.body = node.body.filter((classElement) => {
                if (t.isClassMethod(classElement) && classElement.key.name === 'configureLanguage') {
                    return false;
                }
                return true;
            });
        }
        this.traverse(path);
    }
});


  const output = recast.print(ast).code;
  return output;


}