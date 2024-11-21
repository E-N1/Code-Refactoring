import * as recast from 'recast';
import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import 'dotenv/config';


export function changeToPagedata(sourceCode: string, filePath: string): string {
  // Parse with Babel-Parser
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



// Change this.pagedata to pagedata
traverse(ast, {
    // Check all instructions in the AST
    enter(path) {
      // If the instruction has a property call
      if (t.isMemberExpression(path.node) && 
          t.isThisExpression(path.node.object) && 
          t.isIdentifier(path.node.property, { name: "pagedata" })) {
  
        // Replace `this.pagedata` with `pagedata
        path.replaceWith(t.identifier("pagedata"));
        console.warn("this.pagedata zu pagedata geändert")
      }
    }
  });
  

  const output = recast.print(ast).code;
  return output;


}