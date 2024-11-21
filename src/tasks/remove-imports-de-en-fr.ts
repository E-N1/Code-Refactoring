import * as recast from 'recast';
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import 'dotenv/config';


export function removeImportsDeEnFr(sourceCode: string, filePath: string): string {
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




// Remove all imports of pagedata-de, pagedata-en, pagedata-fr
traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      if (
        source === './pagedata/pagedata-de' ||
        source === './pagedata/pagedata-en' ||
        source === './pagedata/pagedata-fr'
      ) {
        path.remove();
        console.warn("Import removed: ", source);
      }
    }
  });
  


  const output = recast.print(ast).code;
  return output;


}