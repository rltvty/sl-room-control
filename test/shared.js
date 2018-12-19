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

describe('getValueFromMap', function() {
    it('should return a value or null', function() {
        shared.getValueFromMap({'normal': 0, 'lbr_source': 0.5, 'floor_monitor': 1}, 'normal').should.equal(0);
        should.equal(shared.getValueFromMap({'normal': 0, 'lbr_source': 0.5, 'floor_monitor': 1}, 'taco'), null);
        shared.getValueFromMap({'off': 0, 'on': 1}, 'on').should.equal(1);
        shared.getValueFromMap({'blue': 0, 'white': 1}, 'blue').should.equal(0);
    })
});

describe('getActualValueFromCommandValue', function() {
    describe('type: delay ms', function () {
        it('should return the proper string representation', function () {
            shared.getActualValueFromCommandValue('delay', 0).should.equal('0 ms');
            shared.getActualValueFromCommandValue('delay', 0.1585366129875183).should.equal('79.3 ms');
            shared.getActualValueFromCommandValue('delay', 0.5121951103210449).should.equal('256.1 ms');
            shared.getActualValueFromCommandValue('delay', 0.6341463327407837).should.equal('317.1 ms');
            shared.getActualValueFromCommandValue('delay', 0.7621951103210449).should.equal('381.1 ms');
            shared.getActualValueFromCommandValue('delay', 0.9085365533828735).should.equal('454.3 ms');
            shared.getActualValueFromCommandValue('delay', 1).should.equal('500 ms');
        })
    });
    describe('type: eq band freq in Hz (parametric & notch)', function () {
        it('should return the proper string representation', function () {
            shared.getActualValueFromCommandValue('eq_freq', 0).should.equal('20 Hz');
            shared.getActualValueFromCommandValue('eq_freq', 0.05945947393774986).should.equal('30.16 Hz');
            shared.getActualValueFromCommandValue('eq_freq', 0.13513511419296265).should.equal('50.88 Hz');
            shared.getActualValueFromCommandValue('eq_freq', 0.24864859879016876).should.equal('111.5 Hz');
            shared.getActualValueFromCommandValue('eq_freq', 0.5027027130126953).should.equal( '645.1 Hz');
            shared.getActualValueFromCommandValue('eq_freq', 0.6108108162879944).should.equal('1.36 kHz');
            shared.getActualValueFromCommandValue('eq_freq', 0.7351351976394653).should.equal('3.21 kHz');
            shared.getActualValueFromCommandValue('eq_freq', 0.875675618648529).should.equal('8.49 kHz');
            shared.getActualValueFromCommandValue('eq_freq', 0.9675673842430115).should.equal('16.02 kHz');
            shared.getActualValueFromCommandValue('eq_freq', 1).should.equal('20 kHz');
        });
    });
    describe('type: parametric eq gain in dB', function () {
        it('should return the proper string representation', function () {
            shared.getActualValueFromCommandValue('para_gain', 0).should.equal('-15 dB');
            shared.getActualValueFromCommandValue('para_gain', 0.05405407026410103).should.equal('-13.38 dB');
            shared.getActualValueFromCommandValue('para_gain', 0.2432432472705841).should.equal('-7.7 dB');
            shared.getActualValueFromCommandValue('para_gain', 0.3837837874889374).should.equal('-3.49 dB');
            shared.getActualValueFromCommandValue('para_gain', 0.45945945382118225).should.equal('-1.22 dB');
            shared.getActualValueFromCommandValue('para_gain', 0.5).should.equal('0 dB');
            shared.getActualValueFromCommandValue('para_gain', 0.5945945978164673).should.equal('2.84 dB');
            shared.getActualValueFromCommandValue('para_gain', 0.6972972750663757).should.equal('5.92 dB');
            shared.getActualValueFromCommandValue('para_gain', 0.8270270228385925).should.equal('9.81 dB');
            shared.getActualValueFromCommandValue('para_gain', 0.9621621370315552).should.equal('13.86 dB');
            shared.getActualValueFromCommandValue('para_gain', 1).should.equal('15 dB');
        });
    });
});

describe('getCommandValueFromActualValue', function() {
    describe('type: delay ms', function () {
        it('should return the proper float value', function () {
            shared.getCommandValueFromActualValue('delay', '-10 ms').should.equal(0);
            shared.getCommandValueFromActualValue('delay', '0 ms').should.equal(0);
            shared.getCommandValueFromActualValue('delay', '79.3 ms').should.equal(0.15860000252723694);
            shared.getCommandValueFromActualValue('delay', '256.1 ms').should.equal(0.5121999979019165);
            shared.getCommandValueFromActualValue('delay', '317.1 ms').should.equal(0.6341999769210815);
            shared.getCommandValueFromActualValue('delay', '381.1 ms').should.equal(0.7621999979019165);
            shared.getCommandValueFromActualValue('delay', '454.3 ms').should.equal(0.9085999727249146);
            shared.getCommandValueFromActualValue('delay', '500 ms').should.equal(1);
            shared.getCommandValueFromActualValue('delay', '750 ms').should.equal(1);
        })
    });
    describe('type: eq band freq in Hz (parametric & notch)', function () {
        it('should return the proper float value', function () {
            shared.getCommandValueFromActualValue('eq_freq', '10 Hz').should.equal(0);
            shared.getCommandValueFromActualValue('eq_freq', '20 Hz').should.equal(0);
            shared.getCommandValueFromActualValue('eq_freq', '30.16 Hz').should.equal(0.059447795152664185);
            shared.getCommandValueFromActualValue('eq_freq', '50.88 Hz').should.equal(0.135128453373909);
            shared.getCommandValueFromActualValue('eq_freq', '111.5 Hz').should.equal(0.24866747856140137);
            shared.getCommandValueFromActualValue('eq_freq', '645.1 Hz').should.equal(0.5027023553848267);
            shared.getCommandValueFromActualValue('eq_freq', '1.36 kHz').should.equal(0.6106378436088562);
            shared.getCommandValueFromActualValue('eq_freq', '3.21 kHz').should.equal(0.734919548034668);
            shared.getCommandValueFromActualValue('eq_freq', '8.49 kHz').should.equal(0.8756746649742126);
            shared.getCommandValueFromActualValue('eq_freq', '16.02 kHz').should.equal(0.9675630927085876);
            shared.getCommandValueFromActualValue('eq_freq', '20 kHz').should.equal(0.9996751546859741);
            shared.getCommandValueFromActualValue('eq_freq', '30 kHz').should.equal(1);
        });
    });
    describe('type: parametric eq gain in dB', function () {
        it('should return the proper string representation', function () {
            shared.getCommandValueFromActualValue('para_gain', '-15 dB').should.equal(0);
            shared.getCommandValueFromActualValue('para_gain', '-13.38 dB').should.equal(0.05400000140070915);
            shared.getCommandValueFromActualValue('para_gain', '-7.7 dB').should.equal(0.2433333396911621);
            shared.getCommandValueFromActualValue('para_gain', '-3.49 dB').should.equal(0.38366666436195374);
            shared.getCommandValueFromActualValue('para_gain', '-1.22 dB').should.equal(0.4593333303928375);
            shared.getCommandValueFromActualValue('para_gain', '0 dB').should.equal(0.5);
            shared.getCommandValueFromActualValue('para_gain', '2.84 dB').should.equal(0.5946666598320007);
            shared.getCommandValueFromActualValue('para_gain', '5.92 dB').should.equal(0.6973333358764648);
            shared.getCommandValueFromActualValue('para_gain', '9.81 dB').should.equal(0.8270000219345093);
            shared.getCommandValueFromActualValue('para_gain', '13.86 dB').should.equal(0.9620000123977661);
            shared.getCommandValueFromActualValue('para_gain', '15 dB').should.equal(1);
        });
    });
});
