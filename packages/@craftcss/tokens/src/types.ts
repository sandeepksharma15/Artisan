export type TokenPrimitive = string | number;

export type TokenNode = {
  [key: string]: TokenPrimitive | TokenNode;
};

export interface TokenModel {
  primitive: TokenNode;
  semantic: TokenNode;
  component: TokenNode;
  theme: Record<
    string,
    {
      semantic?: TokenNode;
      component?: TokenNode;
    }
  >;
}

export interface TokenValidationResult {
  ok: boolean;
  errors: string[];
}
