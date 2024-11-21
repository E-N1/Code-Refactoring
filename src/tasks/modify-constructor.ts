import { visit } from 'ast-types';
import * as babelParser from '@babel/parser';
import * as recast from 'recast';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import 'dotenv/config';


export function modificationConstructor(sourceCode: string, filePath: string): string {
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
  traverse(ast, {   
    ClassMethod(methodPath) {
      if (methodPath.node.kind === "constructor") {
        const params = methodPath.node.params;
        let authServiceParamExists = false;

        for (let i = 0; i < params.length; i++) {
          const param = params[i];

          if (
            t.isIdentifier(param) &&
            param.name === 'pageConfig' &&
            param.typeAnnotation &&
            t.isTSTypeAnnotation(param.typeAnnotation) &&
            t.isTSTypeReference(param.typeAnnotation.typeAnnotation) &&
            t.isIdentifier(param.typeAnnotation.typeAnnotation.typeName) &&
            param.typeAnnotation.typeAnnotation.typeName.name === 'PageConfig'
          ) {
            param.name = 'page';
            param.typeAnnotation.typeAnnotation.typeName.name = 'Page';
          } else if (t.isTSParameterProperty(param)) {
            const parameter = param.parameter;

            if (
              t.isIdentifier(parameter) &&
              parameter.name === 'pageConfig' &&
              parameter.typeAnnotation &&
              t.isTSTypeAnnotation(parameter.typeAnnotation) &&
              t.isTSTypeReference(parameter.typeAnnotation.typeAnnotation) &&
              t.isIdentifier(parameter.typeAnnotation.typeAnnotation.typeName) &&
              parameter.typeAnnotation.typeAnnotation.typeName.name === 'PageConfig'
            ) {
              parameter.name = 'page';
              parameter.typeAnnotation.typeAnnotation.typeName.name = 'Page';
            } else if (
              t.isIdentifier(parameter) &&
              parameter.name === 'authService' &&
              parameter.typeAnnotation &&
              t.isTSTypeAnnotation(parameter.typeAnnotation) &&
              t.isTSTypeReference(parameter.typeAnnotation.typeAnnotation) &&
              t.isIdentifier(parameter.typeAnnotation.typeAnnotation.typeName) &&
              parameter.typeAnnotation.typeAnnotation.typeName.name === 'AuthService'
            ) {
              authServiceParamExists = true;
            }
          }
        }

        if (!authServiceParamExists) {
          const authServiceParam = t.tsParameterProperty(
            t.identifier('authService')
          );
          authServiceParam.accessibility = 'protected';
          authServiceParam.parameter.typeAnnotation = t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier('AuthService'))
          );
          params.push(authServiceParam);
          console.warn("AuthService parameter was missing in constructor. Added it.");
        }
    }
  }

  }); 

  

  const modifiedCode = recast.print(ast).code;
  return modifiedCode;
}