import * as recast from 'recast';
import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import 'dotenv/config';



export function changeConstructor(sourceCode: string, filePath: string): string {
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


    // Changing the construktor from pageConfig : PageConfig to page : Page
    traverse(ast, {
        ClassDeclaration(classPath) {
            classPath.traverse({
                ClassMethod(methodPath) {
                    if (methodPath.node.kind === "constructor") {
                        const params = methodPath.node.params;
    
                        // Run through the parameters of the constructor
                        for (let i = 0; i < params.length; i++) {
                            const param = params[i];
    
                            // Check whether the parameter is an identifier and has the name pageConfig
                            if (
                                t.isIdentifier(param) &&
                                param.name === 'pageConfig' &&
                                param.typeAnnotation &&
                                t.isTSTypeAnnotation(param.typeAnnotation) &&
                                t.isTSTypeReference(param.typeAnnotation.typeAnnotation) &&
                                t.isIdentifier(param.typeAnnotation.typeAnnotation.typeName) &&
                                param.typeAnnotation.typeAnnotation.typeName.name === 'PageConfig'
                            ) {
                                // Changes the parameter name and type
                                param.name = 'page';
                                param.typeAnnotation.typeAnnotation.typeName.name = 'Page';
                            } else if (t.isTSParameterProperty(param)){
                                const parameter = param.parameter;
    
                                // Check whether the parameter is a TSParameterProperty and has the name pageConfig
                                if (
                                    t.isIdentifier(parameter) &&
                                    parameter.name === 'pageConfig' &&
                                    parameter.typeAnnotation &&
                                    t.isTSTypeAnnotation(parameter.typeAnnotation) &&
                                    t.isTSTypeReference(parameter.typeAnnotation.typeAnnotation) &&
                                    t.isIdentifier(parameter.typeAnnotation.typeAnnotation.typeName) &&
                                    parameter.typeAnnotation.typeAnnotation.typeName.name === 'PageConfig'
                                ) {
                                    // Changes the parameter name and type
                                    parameter.name = 'page';
                                    parameter.typeAnnotation.typeAnnotation.typeName.name = 'Page';
                                
                                  }
  
                            }
                        }
                        // Run through the body of the constructor and edit all occurrences of 'pageConfig'
                        methodPath.traverse({
                            Identifier(innerPath) {
                                if (innerPath.node.name === 'pageConfig') {
                                    innerPath.node.name = 'page';
                                }
                            }
                        });
                    }
                }
            });
        }
    });


  const output = recast.print(ast).code;
  return output;


}