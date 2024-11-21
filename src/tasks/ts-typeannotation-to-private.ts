import * as recast from 'recast';
import { visit } from 'ast-types';
import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import 'dotenv/config';


export function tsTypeAnnotationToPrivate(sourceCode: string, filePath: string): string {
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





  // Set all TSTypeAnnotation to private
  visit(ast, {
    visitClassBody(path) {
      path.node.body.forEach((classElement) => {
        if (t.isClassProperty(classElement) && classElement.typeAnnotation) {

          if (t.isTSTypeAnnotation(classElement.typeAnnotation)) {
            var typeAnnotation = classElement.typeAnnotation.typeAnnotation;

            if (t.isTSTypeReference(typeAnnotation)) {
              var typeName = typeAnnotation.typeName;

              if (t.isIdentifier(typeName) && typeName.name.includes('Component')) {

                // Set properties with `typeName` that contain `component` to `private
                classElement.accessibility = 'private';
                console.log("Zugriffsschutz auf private geändert: ", classElement.typeAnnotation.typeAnnotation.typeName.name);
                
                // Add 'Component' to the property name
                if (classElement.key && t.isIdentifier(classElement.key)) {
                  if(!classElement.key.name.includes("Component")) {
                      classElement.key.name += "Component";
                      console.log("'Component' am Ende der Variable einfügt: ", classElement.typeAnnotation.typeAnnotation.typeName.name)
                  }
              }
              }
            }
          }
        }
      });
      this.traverse(path);
    }
  });

  const output = recast.print(ast).code;
  return output;


}