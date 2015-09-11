describe("Test getVariable 01", function() {
    var V1;
    var V2;
    var V3;
    var check = true;
    beforeEach(function() {
        V1 = parse("A ∧ B");
        V2 = getVariables(V1);
       // console.log(V2);
        V3 = ["A","B"];
        for(var i = 0; i<V3.length; i++){
            if(V3[i] != V2[i]){
                check = false;
            }
        }
    });

    it("A AND B should have variables A and B", function() {
        expect(check).toBe(true);
    });
});

describe("Test getVariable 02", function() {
    var V1;
    var V2;
    var V3;
    var check = true;
    beforeEach(function() {
        V1 = parse("(A∨B)∧(A∨C) ⊢ A∨B∧C");
        //console.log(V1);
        V2 = getVariables(V1);
        //console.log(V2);
        V3 = ["A","B","C"];
        for(var i = 0; i<V3.length; i++){
            if(V3[i] != V2[i]){
                check = false;
            }
        }
    });

    it("(A∨B)∧(A∨C) ⊢ A∨B∧C should have variables A, B, and C. Got "+V2+" instead.", function() {
        expect(check).toBe(true);
    });
});

describe("Test removeDuplicate", function() {
    var V1;
    var V2;
    var V3;
    var check = true;
    beforeEach(function() {
        V1 = ["A","B","B","C","C"];
        V2 = removeDuplicates(V1);
        V3 = ["A","B","C"];
        for(var i = 0; i < V3.length; i++){
            if(V3[i] != V2[i]){
                check = false;
            }
        }
    });

    it("[A,B,B,C,C] should leave [A,B,C] after removing duplicates", function() {
        expect(check).toBe(true);
    });
});

describe("Test contains", function() {
    var V1;
    beforeEach(function() {
        V1 = ["A","B","C"];
    });

    it("[A,B,C] should contain A", function() {
        expect(contains(V1,"A")).toBe(true);
    });
    
    it("[A,B,C] should not contain D", function() {
        expect(contains(V1,"D")).toBe(false);
    });
});

describe("Test canSnap", function() {
  var rule;
  var expression;
    it("B→C ⊢ (A∨B)→(A∨C) should snap into ⊢A→B", function() {
      rule = parse("⊢A→B");
      expression = parse("B→C ⊢ (A∨B)→(A∨C)");
      expect(canSnap(rule,expression)).toBe(true);
    });
      
    it("A ⊢ ¬¬A should snap into ⊢¬A", function() {
      var rule = parse("⊢¬A");
      var expression = parse("A ⊢ ¬¬A");
      expect(canSnap(rule,expression)).toBe(true);
    });
      
    it("⊢ (A→B→C)→(A→B)→A→C should not snap into ⊢A∨B", function() {
      var rule = parse("⊢A∨B");
      var expression = parse("⊢ (A→B→C)→(A→B)→A→C");
      expect(canSnap(rule,expression)).toBe(false);
      
    });
    it("⊢A→B should snap into A∧(B→C) ⊢ (A→B)→C", function() {
	var question = parse("A∧(B→C) ⊢ (A→B)→C");
	var rule = parse("⊢A→B");
        expect(canSnap(rule,question)).toBe(true);
    });
    
    it("⊢A∧B should snap into A∨B→C ⊢ (A→C)∧(B→C)", function() {
	var question = parse("A∨B→C ⊢ (A→C)∧(B→C)");
	var rule = parse("⊢A∧B");
        expect(canSnap(rule,question)).toBe(true);
    });
    
    it("⊢A→B should not snap into A∨B→C ⊢ (A→C)∧(B→C)", function() {
	var question = parse("A∨B→C ⊢ (A→C)∧(B→C)");
	var rule = parse("⊢A→B");
        expect(canSnap(rule,question)).toBe(false);
    });
});    
    
describe("Multiplication", function() {
    it("10*1 should be 10", function() {
        expect(10*1).toBe(10);
    });
});

describe("Test contains", function() {
    var V1 = ["A","B","C"];
    it("[A,B,C] should contain A", function() {
        expect(contains(V1,"A")).toBe(true);
    });
});

describe("Test canSnap", function() {
    
});