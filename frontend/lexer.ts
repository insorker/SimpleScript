export enum TokenType {
  Number,
  Identifier,
  Equals,
  OpenParen, CloseParen,
  BinaryOperator,
  Let,

  EOF,
}

const KEYWORDS: Record<string, TokenType> = {
  'let': TokenType.Let,
}

export interface Token {
  value: string,
  type: TokenType,
}

function token(value: string = "", type: TokenType) {
  return { value, type }
}

function isaplpha(src: string) {
  return src.toUpperCase() != src.toLowerCase()
}

function isint(src: string) {
  const c = src.charCodeAt(0);
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

  return (c >= bounds[0] && c <= bounds[1]);
}

function isskippable(src: string) {
  return src == ' ' || src == '\n' || src == '\t';
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split('');

  // Build each token while end of file
  while (src.length > 0) {
    if (src[0] == '(') {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ')') {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/' || src[0] == '%') {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == '=') {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else {
      // Handle multicharacter tokens

      // Build number token
      if (isint(src[0])) {
        let num = "";
        while (src.length > 0 && isint(src[0])) {
          num += src.shift();
        }

        tokens.push(token(num, TokenType.Number));
      } else if (isaplpha(src[0])) {
        let ident = ""; // 
        while (src.length > 0 && isaplpha(src[0])) {
          ident += src.shift();
        }

        // check for reserved keywords
        const reserved = KEYWORDS[ident];
        if (reserved == undefined) {
          tokens.push(token(ident, TokenType.Identifier));
        }
        else {
          tokens.push(token(ident, reserved)); 
        }
      } else if (isskippable(src[0])) {
        src.shift();
      } else {
        console.log('Unrecognized character found in source: ', src[0]);
        Deno.exit(0);
      }
    }
  }

  tokens.push(token('EndOfFile', TokenType.EOF));
  return tokens;
}

// const source = await Deno.readTextFile('./test.txt')
// for (const token of tokenize(source)) {
//   console.log(token)
// }