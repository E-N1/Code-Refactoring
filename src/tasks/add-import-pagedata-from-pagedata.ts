import * as recast from 'recast';
import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import 'dotenv/config';


export function addImportPagedata(sourceCode: string, filePath: string): string {
  console.warn('addImportPagedata');
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

  // add import pagedata from './pagedata'
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
  
      if (source.startsWith('./pagedata')) {
        const hasPagedataSpecifier = path.node.specifiers.some(specifier => 
          t.isImportSpecifier(specifier) && specifier.imported.name.startsWith('Pagedata')
        );
  
        if (hasPagedataSpecifier) {
          path.node.specifiers = [t.importSpecifier(t.identifier('pagedata'), t.identifier('pagedata'))];
          path.node.source = t.stringLiteral('./pagedata');
        }
      }
    }
  });
  

  const output = recast.print(ast).code;
  return output;


}