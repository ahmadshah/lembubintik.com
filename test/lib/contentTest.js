var should = require('should'),
    content = require('../../lib/content');

describe('Content', function() {
    describe('load', function() {
        it('should return array when file is found', function() {
            content.load('pages', 'about').should.be.an.Array.and.have.lengthOf(2);
            content.load('posts', 'orchestra/hello-world').should.be.an.Array.and.have.lengthOf(2);
        })

        it('should return false when file not found', function() {
            content.load('foo', 'foo-bar').should.be.false;
        })
    })

    describe('getMetadata', function() {
        it('should return object when parsing metadata', function() {
            var stub = content.load('pages', 'about');

            stub.should.be.an.Array.and.have.lengthOf(2);
            content.getMetadata(stub[0]).should.be.an.Object;
        })
    })
});
