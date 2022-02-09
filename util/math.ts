import {
  derivative,
  parse,
  sqrt,
  square,
  add,
  simplify,
  OperatorNode,
  SymbolNode,
} from "mathjs";

function parseTex(expr: string) {
  const label_list = [];
  let i = 0;
  while (i < expr.length) {
    let label = "";
    if (expr[i] == "\\") {
      label = expr[i];
      i++;
    }
  }
}

function propagate(expr: string) {
  expr = simplify(expr).toString();
  const node = parse(expr);
  const symbol_list: any = new Set();

  node.traverse(function (node, path, parent) {
    switch (node.type) {
      case "SymbolNode":
        if (node.name != "e") {
          symbol_list.add(node.name);
        }
        break;
      default:
        break;
    }
  });

  let result = "";
  let idx = 0;
  for (let symbol of symbol_list.keys()) {
    const d = derivative(expr, symbol);
    if (d.toString() == "0") {
      idx++;
      continue;
    } else if (d.toString() == "1") {
      result += `\\sigma_{${symbol}}^2`;
    } else {
      result += `\\left(${d.toTex()}\\right)^2\\sigma_{${symbol}}^2`;
    }

    if (idx != symbol_list.size - 1) {
      result += " + ";
    }
    idx++;
  }
  result = "\\sqrt{" + result + "}";
  result = result.replaceAll("\\_", "_");
  return result;
}

export default propagate;
