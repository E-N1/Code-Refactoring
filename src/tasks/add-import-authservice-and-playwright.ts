import * as babelParser from '@babel/parser';
import * as recast from 'recast';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import 'dotenv/config';




export function addImportAuthServiceAndPlaywright(sourceCode: string, filePath: string): string {
  
  // Parse with Babel parser
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
  // Adding import instructions
  traverse(ast, {
    Program(path) {
      const imports = [
        t.importDeclaration(
          [t.importSpecifier(t.identifier('Page'), t.identifier('Page'))],
          t.stringLiteral('@playwright/test')
        ),
        t.importDeclaration(
          [t.importSpecifier(t.identifier('AuthService'), t.identifier('AuthService'))],
          t.stringLiteral('@services/auth-service/auth.service')
        )
      ];

      imports.forEach(importDeclaration => {
        const existingImport = path.node.body.find(node =>
          t.isImportDeclaration(node) && node.source.value === importDeclaration.source.value
        );
        if (!existingImport) {
          path.node.body.unshift(importDeclaration);
        }
      });
    }
  });

  // Generate the modified code
  const modifiedCode = recast.print(ast).code;
  return modifiedCode;
}