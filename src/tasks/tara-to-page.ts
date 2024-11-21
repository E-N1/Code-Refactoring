import * as recast from 'recast';
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import 'dotenv/config';


export function taraToPage(sourceCode: string, filePath: string): string {
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

traverse(ast, {
    Identifier(path) {
      if (path.node.name === 'tara') {
        path.node.name = 'page';
        console.warn("tara to page")
      }
    },
  });

  const output = recast.print(ast).code;
  return output;


}