var should = require('should'),
    sinon = require('sinon');

describe('Picture Controller Tests:', function(){
    describe('Post', function(){
        it('Should not allow an empty username on a post', function(){

            var Picture = function(picture){};

            var dataManager = {
                setPostedPicture : function(){},
                saveData : function(){
                    res.status(201);
                }
            }

            var S3 = {
                getImage : function(uri){dataManager.saveData()}
            };

            var req = {
                body:{
                    Uri: 'https://test.com'
                }
            }

            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }

            var bookController = require('../Controllers/pictureController')(Picture, S3, dataManager);
            bookController.post(req, res);

            res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0][0]);
            res.send.calledWith('UserName is required').should.equal(true);
        })
    })
})