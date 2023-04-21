/* eslint-disable */
import { expect } from 'chai';
const utils = require('../src/utils/index')
const waterMark = require('../src/water-mark')
const { getFormateDate, renderUrl, extend, isIPhone, isOpenConsole, myLocalStorage, SAVE_KEY, SAVE_END_HASH_KEY } = utils;
const config = require('../src/configs')
const { WATER_VERSION } = config
describe('utils', function () {
    beforeEach(function () {
        myLocalStorage.set('__test', '__test')
    })
    it('getFormateDate', function () {
        expect(getFormateDate()).to.be.a('string');
        expect(getFormateDate()).to.include('2018');
        expect(getFormateDate()).to.have.lengthOf(8)
    });

    it('renderUrl', function () {
        expect(renderUrl({ a: 1, b: 2 })).to.be.equal('a=1&b=2')
        expect(renderUrl({ a: 1 })).to.be.equal('a=1')
    });

    it('extend', function () {
        expect(extend({}, { a: 1 }, { b: 2 })).to.deep.equal({ a: 1, b: 2 })
        expect(extend({}, { a: 1 }, { b: 2, c: 3 })).to.deep.equal({ a: 1, b: 2, c: 3 })
        expect(extend({ a: 2 })).to.deep.equal({ a: 2 })
    });

    it('isIPhone', function () {
        expect(isIPhone).to.be.equal(false)
    });

    it('isOpenConsole', function () {
        expect(isOpenConsole()).to.be.equal(false)
    });

    it('myLocalStorage', function () {
        expect(myLocalStorage.get('__test')).to.be.equal('__test')
    });
});

describe('water-mark', function () {
    before(() => {
        waterMark({
            systemId: '012d',
            //当前用户ID
            userId: 'xiongjiang_test01'
        })
    })

    it('water mark not null' + WATER_VERSION, function () {
        expect(waterMark).to.be.not.null
        expect(waterMark).to.be.an('function')
    });

    it('water mark version' + WATER_VERSION, function () {
        expect(waterMark.version).to.be.equal(WATER_VERSION);
    });

    it('water mark element-length', function (done) {
        this.timeout(5000);
        setTimeout(function () {
            expect(document.querySelectorAll('.water-animated').length).to.be.equal(2);
            done();
        }, 2000);
    });

    it('water mark hashEnd', function (done) {
        this.timeout(5000);
        setTimeout(function () {
            const hashEnd = localStorage.getItem(SAVE_END_HASH_KEY);
            expect(document.querySelectorAll('.water-animated').length).to.be.equal(2);
            expect(hashEnd).to.be.string;
            expect(hashEnd).to.be.length.above(30);
            done();
        }, 2000);
    });

    it('water mark hashVal', function (done) {
        this.timeout(10000);
        setTimeout(function () {
            const hashVal = localStorage.getItem(SAVE_KEY);
            expect(hashVal).to.be.not.null;
            expect(hashVal).to.be.string;
            expect(hashVal).to.include('xiongjiang_test01')
            expect(hashVal).to.include('012d')
            done();
        }, 2000);
    });

})
