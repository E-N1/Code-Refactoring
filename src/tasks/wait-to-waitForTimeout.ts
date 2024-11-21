import * as recast from 'recast';
import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import 'dotenv/config';



export function waitToWaitForTimeout(sourceCode: string, filePath: string): string {
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
  
  
  
// Change from page.wait to page.waitForTimeout
//  TODO, not working
traverse(ast, {
    ExpressionStatement(path) {
      const { node } = path;
      
      if (t.isCallExpression(node.expression)) {
        const { callee } = node.expression;
  
        // Searches for 'page.visit' CallExpressions and changes the function name to 'goto'
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object, { name: 'page' }) &&
          t.isIdentifier(callee.property, { name: 'visit' })
        ) {
          callee.property.name = 'goto';
        }
      }
    },
  });
  
  
    const output = recast.print(ast).code;
    return output;
  
  
  }