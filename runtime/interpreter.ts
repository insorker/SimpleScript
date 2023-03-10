import { Stmt,NumericLiteral,Identifier,BinaryExpr,Program,VarDeclaration } from "../frontend/ast.ts";
import Environment from "./environment.ts";
import { eval_identifier,eval_binary_expr } from "./eval/expression.ts";
import { eval_program,eval_var_declaration } from "./eval/statement.ts";
import { RuntimeVal,MK_NUMBER } from "./values.ts";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return MK_NUMBER((astNode as NumericLiteral).value);
    case "Identifier":
      return eval_identifier(astNode as Identifier, env);
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, env);
    case "Program":
      return eval_program(astNode as Program, env);

    case "VarDeclaration":
      return eval_var_declaration(astNode as VarDeclaration, env);

    default:
      console.error("This AST Node has not yet been setup for interpretation.", astNode);
      Deno.exit(1);
  }
}