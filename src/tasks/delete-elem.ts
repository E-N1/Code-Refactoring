import * as recast from 'recast';
import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import 'dotenv/config';


export function deleteElem(sourceCode: string, filePath: string): string {
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



// Delete all '.elem' 
traverse(ast, {
    MemberExpression(path) {
      const { node } = path;
      
      if (t.isIdentifier(node.property, { name: 'elem' }) && !node.computed) {
        path.replaceWith(node.object);
        console.log(".elem entfernt")
      }
    },
  });

  const output = recast.print(ast).code;
  return output;


}