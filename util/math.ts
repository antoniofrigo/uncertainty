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

function getHash(idx: number) {
  return "zqzqz" + String.fromCharCode(65 + idx);
}

function parseTex(expr: string) {
  let new_expr = expr;
  const label_list = [];
  const first_regex = /\\[a-zA-Z0-9]*_{\\?[a-zA-Z0-9\\_]*}/gm;
  const second_regex = /\\[a-zA-Z0-9]*_\\?[a-zA-Z0-9]*/gm;
  const third_regex = /\\[a-zA-Z0-9]*/gm;

  const label_set = new Set();
  let i = 0;

  const first = [...new_expr.matchAll(first_regex)].map((match) => match[0]);
  for (const idx in first) {
    if (!label_set.has(first[idx])) {
      new_expr = new_expr.replaceAll(first[idx], getHash(i));
      label_list.push([first[idx], getHash(i)]);
      i++;
    }
  }

  const second = [...new_expr.matchAll(second_regex)].map((match) => match[0]);
  for (const idx in second) {
    if (!label_set.has(second[idx])) {
      new_expr = new_expr.replaceAll(second[idx], getHash(i));
      label_list.push([second[idx], getHash(i)]);
      i++;
    }
  }

  const third = [...new_expr.matchAll(third_regex)].map((match) => match[0]);
  for (const idx in third) {
    if (!label_set.has(third[idx])) {
      new_expr = new_expr.replaceAll(third[idx], getHash(i));
      label_list.push([third[idx], getHash(i)]);
      i++;
    }
  }

  return [new_expr, label_list];
}

function propagate(the_expr: string) {
  let [expr, label_list] = parseTex(the_expr);
  expr = simplify(expr as string).toString();
  const node = parse(expr);
  const symbol_list: any = new Set();

  node.traverse(function (node, path, parent) {
    switch (node.type) {
      case "SymbolNode":
        if (
          node.name != "e" &&
          node.name != "sin" &&
          node.name != "cos" &&
          node.name != "tan" &&
          node.name != "csc" &&
          node.name != "sec" &&
          node.name != "cot" &&
          node.name != "log" &&
          node.name != "asin" &&
          node.name != "acos" &&
          node.name != "atan" &&
          node.name != "asec" &&
          node.name != "acsc" &&
          node.name != "acot"
        ) {
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
  for (const idx in label_list as any[]) {
    result = result.replaceAll(label_list[idx][1], label_list[idx][0]);
  }
  result = result.replaceAll(/\\mathrm\{(.*?)\}/gm, " $1");

  if (result == "") {
    return "\\text{Quantity is exact}";
  }
  result = "\\sqrt{" + result + "}";
  result = result.replaceAll("\\_", "_");
  return result;
}

export default propagate;
