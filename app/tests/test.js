define([], function(){
  describe("This is a test run", function(){

    it("true should be true", function(){
      expect(true).toBe(true);
    });

    it("fails should be false", function(){
      expect(false).toBe(false);
    });
  });
});