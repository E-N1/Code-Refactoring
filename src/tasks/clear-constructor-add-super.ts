import * as recast from 'recast';
import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import 'dotenv/config';


export function clearConstructorAddSuper(sourceCode: string, filePath: string): string {
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
    ClassBody(path) {
      const components = new Map();
  
      let constructorIndex = path.node.body.findIndex(
        (member) => t.isClassMethod(member) && member.kind === 'constructor'
      );
  
      path.node.body.forEach((member) => {
        if (
          t.isClassProperty(member) &&
          member.key.name.includes('Component') &&
          member.typeAnnotation &&
          t.isTSTypeAnnotation(member.typeAnnotation) &&
          t.isTSTypeReference(member.typeAnnotation.typeAnnotation) &&
          t.isIdentifier(member.typeAnnotation.typeAnnotation.typeName) &&
          member.typeAnnotation.typeAnnotation.typeName.name.includes('Component')
        ) {
          const baseName = member.key.name.replace('Component', '');
          components.set(baseName, member);
        }
      });
  
      path.node.body.forEach((member) => {
        if (t.isClassMethod(member) && member.kind === 'get') {
          components.delete(member.key.name);
        }
      });
  
      components.forEach((member, baseName) => {
        const className = member.typeAnnotation.typeAnnotation.typeName.name;
        const getterMethod = t.classMethod(
          'get',
          t.identifier(baseName),
          [],
          t.blockStatement([
            t.expressionStatement(
              t.assignmentExpression(
                '??=',
                t.memberExpression(
                  t.thisExpression(),
                  t.identifier(member.key.name)
                ),
                t.newExpression(
                  t.identifier(className),
                  [
                    t.memberExpression(t.thisExpression(), t.identifier('page')),
                    t.memberExpression(t.thisExpression(), t.identifier('authService'))
                  ]
                )
              )
            ),
            t.returnStatement(
              t.memberExpression(t.thisExpression(), t.identifier(member.key.name))
            )
          ])
        );
  
        if (constructorIndex !== -1) {
          path.node.body.splice(constructorIndex + 1, 0, getterMethod);
        } else {
          path.node.body.push(getterMethod);
        }
      });
    },
  
    ClassMethod(path) {
      if (path.node.kind === 'constructor') {
        path.node.body.body = [
          t.expressionStatement(
            t.callExpression(
              t.super(),
              [t.identifier('page'), t.identifier('authService')]
            )
          )
        ];
  
        path.node.params = [
          t.tsParameterProperty(
            t.identifier('page'), 
            [], 
            t.tsTypeAnnotation(t.tsTypeReference(t.identifier('Page')))
          ),
          t.tsParameterProperty(
            t.identifier('authService'), 
            [], 
            t.tsTypeAnnotation(t.tsTypeReference(t.identifier('AuthService')))
          ),
        ];
  
        path.node.params[0].accessibility = 'protected';
        path.node.params[1].accessibility = 'protected';
        console.warn("clear-constructor-add-super.ts: constructor changed");

      }
    },
  });
  

  const output = recast.print(ast).code;
  return output;


}