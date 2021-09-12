
%lex

%%

\s+                     /* skip */
"-"?[0-9]+"."[0-9]*     return 'FLOAT';
"-"?"."[0-9]+           return 'FLOAT';
"-"?[0-9]+              return 'INT';
"\""[^"]*"\""              return 'STRING';
//"\""(.|[^"])*"\""       return 'STRING';


"N;"    return 'NULL';

'O:'    return 'O:';
'a:'    return 'a:';
's:'    return 's:';
'i:'    return 'i:';
'd:'    return 'd:';

'{'     return '{';
'}'     return '}';
':'     return ':';
';'     return ';';


<<EOF>> return 'EOF';

/lex

%start ParseReplay

%%

ParseReplay
    : replay EOF   {return $$}
    ;

replay
    : object_t            {$$ = [$1];}
    | replay object_t     {$$ = $1.concat($2);}
    ;

object_t
    : 'O:' INT ':' STRING ':' INT ':' '{' kvPairs '}' {$$ = {key: $4, type: 'object', value: $9};}
    ;

array_t
    : 'a:' INT ':' '{' arrayElements '}'  {$$ = {type: 'array', value: $5};}
    ;

arrayElements
    : arrayElement                  {$$ = [$1];}
    | arrayElements arrayElement    {$$ = $1.concat($2);}
    ;

arrayElement
    : integer_t object_t   {$$ = $2;}
    ;

kvPairs
    : kvPair kvPairs_fuck_recursion  {a = [$1]; if($2) a=a.concat($2); $$ = a;}
    ;
kvPairs_fuck_recursion
    : kvPair kvPairs_fuck_recursion  {a = [$1]; if($2) a=a.concat($2); $$ = a;}
    | 
    ;

kvPair
    : string_t value    {$$ = {key: $1.value, type: $2.type, value: $2.value};}
    ;

value
    : string_t
    | nil_t
    | integer_t
    | float_t
    | array_t
    ;

string_t
    : 's:' INT ':' STRING ';'   {$$ = {type: 'string', value: $4.slice(1,-1)};}
    ;

integer_t
    : 'i:' INT ';'      {$$ = {type: 'int', value: parseInt($2)};}
    ;

float_t
    : 'd:' FLOAT ';'    {$$ = {type: 'float', value: parseFloat($2)};}
    | 'd:' INT ';'      {$$ = {type: 'float', value: parseFloat($2)};}
    ;

nil_t
    : NULL {$$ = {type: 'null', value: null};}
    ;

