# awbw replay parser


# awbw replay format

all key value pairs, delimited by ;

each turn is stored on a separate line as an object

one of my older replays (2018) is missing the first turn of the first day for some reason

### types

s:5:"units" = s for string, 5 is length of string excluding quotation marks, then the string in quotation
i:8000 = integer with value 8000
d:4.4000000000000004 = 64 bit float
O:8:"awbwUnit":25:{ = object with 8 character long name with 25 elements, name does not have to be unique
a:51:{ = array with 51 elements
N = null? found stuff like s:4:"turn";N;

### examples

```
s:5:"units";a:51:{
    i:0;O:8:"awbwUnit":25:{...}
    i:1;O:8:"awbwUnit":25:{...}
    ...
```
an array with 5 character long name "units" and 51 elements.
element (index) 0 of array is an object with 8 character long name and 25 elements
then a list of key value pairs, i:1;O8 ... etc.

```
s:2:"id";i:64305958;
```
key with 2 character long name and integer value 64305958

example object:
```
O:8:"awbwUnit":25:{
    s:2:"id";i:64305958;
    s:8:"games_id";i:275976;
    s:10:"players_id";i:757473;
    s:4:"name";s:8:"Anti-Air";
    s:15:"movement_points";i:6;
    s:6:"vision";i:2;
    s:4:"fuel";i:60;
    s:13:"fuel_per_turn";i:0;
    s:8:"sub_dive";s:1:"N";
    s:4:"ammo";i:9;
    s:11:"short_range";i:0;
    s:10:"long_range";i:0;
    s:13:"second_weapon";s:1:"N";
    s:6:"symbol";s:1:"I";
    s:4:"cost";i:8000;
    s:13:"movement_type";s:1:"T";
    s:1:"x";i:10;
    s:1:"y";i:7;
    s:5:"moved";i:0;
    s:7:"capture";i:0;
    s:5:"fired";i:0;
    s:10:"hit_points";d:4;
    s:15:"cargo1_units_id";i:0;
    s:15:"cargo2_units_id";i:0;
    s:7:"carried";s:1:"N";
}
```

### beeeg josh

format of each turn, stored in one gigantic object blob on each line. todo write parser for this format
