import * as recast from 'recast';
import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import 'dotenv/config';


export function visitToGotTo(sourceCode: string, filePath: string): string {
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
  
  
  
// Change from page.visit to=> page.goto
// TODO, not working
traverse(ast, {
    CallExpression(path) {
      const { node } = path;
      
      // Searches for CallExpressions that match 'page.visit'
      if (
        t.isMemberExpression(node.callee) &&
        t.isIdentifier(node.callee.object, { name: 'page' }) &&
        t.isIdentifier(node.callee.property, { name: 'visit' })
      ) {
        // Changes the function name from 'visit' to 'goto'
        node.callee.property.name = 'goto';
      }
    },
  });
  
    const output = recast.print(ast).code;
    return output;
  
  
  }