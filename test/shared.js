var should = require('should');
var shared = require('../shared.js');

describe('getCommand()', function() {
    it('should a crazy hex string', function() {
        shared.getCommand("Speaker/line/ch1/eq/eqgain4", Buffer.from("b0f80a3f", "hex").readFloatLE(0)).toString("hex").should.equal("554300012800505666006400537065616b65722f6c696e652f6368312f65712f65716761696e34000000b0f80a3f");
        shared.getCommand("Speaker/line/ch1/eq/eqfreq4", Buffer.from("80aaeb3e", "hex").readFloatLE(0)).toString("hex").should.equal( "554300012800505666006400537065616b65722f6c696e652f6368312f65712f6571667265713400000080aaeb3e");
        shared.getCommand("Speaker/line/ch1/limit/threshold", Buffer.from("64703e3f", "hex").readFloatLE(0)).toString("hex").should.equal( "554300012d00505666006400537065616b65722f6c696e652f6368312f6c696d69742f7468726573686f6c6400000064703e3f");
        shared.getCommand("Speaker/wink", 1).toString("hex").should.equal( "554300011900505666006400537065616b65722f77696e6b0000000000803f");
        shared.getCommand("Speaker/wink", 0).toString("hex").should.equal( "554300011900505666006400537065616b65722f77696e6b00000000000000");
        shared.getCommand("Speaker/remote_lim_on", 1).toString("hex").should.equal( "554300012200505666006400537065616b65722f72656d6f74655f6c696d5f6f6e0000000000803f");
        shared.getCommand("Speaker/line/ch1/volume", Buffer.from("e963303f", "hex").readFloatLE(0)).toString("hex").should.equal( "554300012400505666006400537065616b65722f6c696e652f6368312f766f6c756d65000000e963303f");
        shared.getCommand("Speaker/line/ch1/volume_enable", 1).toString("hex").should.equal( "554300012b00505666006400537065616b65722f6c696e652f6368312f766f6c756d655f656e61626c650000000000803f");
    });
});

describe('getValueOrError', function() {
    it('should return a value or an instance of Error', function() {
        shared.getValueOrError({}, 'taco', null).should.be.an.instanceOf(Error);
        shared.getValueOrError({ 'freq' : '10' }, 'freq', '20-20000').should.be.an.instanceOf(Error);
        shared.getValueOrError({ 'freq' : '56' }, 'freq', '20-20000').should.equal( '56');
        shared.getValueOrError({ 'band' : '9' }, 'band', '1..8').should.be.an.instanceOf(Error);
        shared.getValueOrError({ contour: 'normal' }, 'contour', ['normal', 'not-normal']).should.equal( 'normal');
        shared.getValueOrError({ feeling: 'sad' }, 'feeling', ['happy', 'okay']).should.be.an.instanceOf(Error);
        shared.getValueOrError({ height: 'giant' }, 'height', 'tall/short/normal').should.be.an.instanceOf(Error);
        shared.getValueOrError({ build: 'thin' }, 'build', 'thin/athletic').should.equal( 'thin');
    });
});

