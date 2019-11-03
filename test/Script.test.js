const { expect } = require('chai');
const { Script } = require('../lib/Script');

describe('Script', function () {
  describe('owoify', function () {
    beforeEach(function () {
      this.script = new Script('');
    });

    it('should turn Sue into Suwu', function () {
      return expect(this.script.owoify('Sue Sakamoto')).to.eql('Suwu Sakamoto');
    });

    it('should turn r to w', function () {
      return expect(this.script.owoify('Toroko')).to.eql('Towoko');
    });

    it('should turn R to W', function () {
      return expect(this.script.owoify('TOROKO')).to.eql('TOWOKO');
    });

    it('should turn n+vowel to ny+vowel', function () {
      return expect(this.script.owoify('snore')).to.eql('snyowe');
    });

    it('should turn -ove into -uv', function () {
      return expect(this.script.owoify('love')).to.eql('wuv');
    });
  });
});
