 
var operators;

function precendence(token){
 switch(token){
   case '⊢': return 0;
   case '→': return 1;
   case '∨': return 2;
   case '∧': return 3;
   case '¬': return 4;
   //case '(': return 5;
   
 }  
 return 98;
}

function isDelimiter(token){
   switch(token){
   case '⊢': return true;
   case '→': return true;
   case '∨': return true;
   case '∧': return true;
   case '¬': return true;
   //case '(': return 5;
    }  
  return false;
}

function evalBrakcets(str){
  var pointer = 1;
  var count = 1;
  while(pointer < str.length){
   if(string.charAt(pointer) == ')'){
     count--;
     if(count == 0){
      return substring(currentString, index, pointer); 
     }
   }
   else if(str.charAt(pointer) == '('){
      count++;
   }
   pointer++;
  }
  throw new SyntaxError("Missing closing bracket");
}

function parse(str){
 return eval( str.replace(/\s+/g, '') );
}

function eval(str){
  var root;
  var index=0;
  var prec=99;
  var highestIndex = 0;
  if(nextToken(str,0).length == str.length){
   return new Variable(str);
  }
  
  while(index < str.length){
    if(precendence(nextToken(str,index)) < prec){
      //console.log(nextToken(str,index) + " has prec " + precendence(nextToken(str,index)));
      prec = precendence(nextToken(str,index));
      highestIndex = index;
    }
    index+=nextToken(str,index).length;
  }
  root = new Operator(str.charAt(highestIndex));
  root.left = eval(str.substring(0,highestIndex));
  root.right = eval(str.substring(highestIndex+1, str.length));
  return root;
}


function nextToken(str,i){
  var index = i;
  var length = 0;
  if(isDelimiter(str.charAt(index))){
   return str.charAt(index); 
  }
  while(!isDelimiter(str.charAt(index)) && index < str.length){
    length++;
    index++;
  }
  return str.substring(index-length,index);
}

var Rule = function(above, below){
  this.above = above;
  this.below = below;
}

var Expression = function(ovs){
 this.ovs=ovs; 
}

Expression.prototype.equals = function(other){
 if(!(other instanceof Expression)){
  return false; 
 }
 else if(other.ovs.length != this.ovs.length){
   return false;
 }
 else{
  var i;
  for(i=0; i < this.ovs.length; i++){
   if(!this.ovs[i].equals(other.ovs[i])){
    return false; 
   }
  }
  return true;
 }
}

var OV = function(value){
 this.value=value; 
}

OV.prototype.equals = function(other){
  if(!(other instanceof OV)){
  return false; 
 }
 else{
  return this.value == other.value;
 }
}

function Operator(value){
 OV.call(this,value); 
 this.left;
 this.right;
}

function Variable(value){
 OV.call(this,value); 
}

Operator.prototype = Object.create(OV.prototype);
Variable.prototype = Object.create(OV.prototype);


Operator.prototype.equals = function(other){
   if(!(other instanceof Operator)){
  return false; 
 }
 else{
  return this.value == other.value;
 }
}
Variable.prototype.equals = function(other){
  if(!(other instanceof Variable)){
  return false; 
 }
 else{
  return this.value == other.value;
 }
}