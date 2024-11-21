
import * as recast from 'recast';
import { visit } from 'ast-types';
import * as babelParser from '@babel/parser';


export function removeAllImplements(sourceCode: string, filePath: string): string {
  // Parse mit Babel-Parser
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
    visitClassDeclaration(path) {
      var node = path.node;
      if (node.body) {
        node.implements = [];
      }
      this.traverse(path);
    }
  });
  const output = recast.print(ast).code;
  return output;


}