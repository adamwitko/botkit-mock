'use strict';
const assert = require('assert');
const Botmock = require('../lib/Botmock');

describe('test default response for actions', ()=>{
    beforeEach(()=>{
        this.controller = Botmock({
            debug: false,
        });

        this.bot = this.controller.spawn({type: 'slack'});
    });

    it('should return data.ok for users.list call', (done)=>{
        this.bot.api.callAPI('users.list', {}, (err, data)=>{
            assert.equal(data.ok, true)
            done();
        })
    });

    it('should return data.ok for channels.info call', (done)=>{
        this.bot.api.callAPI('channels.info', {channel: 'C0VHNJ7MF'}, (err, data)=>{
            assert.equal(data.ok, true)
            done();
        })
    });
});

describe('change api data for action with overriding', ()=>{
    beforeEach((done)=>{
        this.controller = Botmock({
            debug: false,
        });
        this.bot = this.controller.spawn({type: 'slack'});

        this.bot.api.setData('users.list', {members: [{id: '2'}]});
        this.bot.api.setData('channels.info', {channel1: {id: '2'}});
        done();
    });

    it('should return newly changed api data in users.list call', (done)=>{
        this.bot.api.callAPI('users.list', {}, (err, data)=>{
            assert.equal(data.members[0]['id'], '2')
            done();
        })
    });

    it('should return newly changed api data in channels.info call', (done)=>{
        this.bot.api.callAPI('channels.info', {channel: 'channel1'}, (err, data)=>{
            assert.equal(data.id, '2')
            done();
        })
    });
});

describe('change api data for action with extending', ()=>{
    beforeEach((done)=>{
        this.controller = Botmock({
            debug: false,
        });
        this.bot = this.controller.spawn({type: 'slack'});

        let temp = this.bot.api.getData('users.list');
        temp['members'].push({id: '3'});
        this.bot.api.setData('users.list', temp);

        temp = this.bot.api.getData('channels.info');
        temp['channel1'] = {};
        temp['channel1'].new_field = '3';
        this.bot.api.setData('channels.info', temp);
        done();
    });

    it('users.list call', (done)=>{
        this.bot.api.callAPI('users.list', {}, (err, data)=>{
            assert.equal(data.members[1]['id'], '3')
            done()
        });
    });

    it('channels.info call', (done)=>{
        this.bot.api.callAPI('channels.info', {channel: 'channel1'}, (err, data)=>{
            assert.equal(data.new_field, '3')
            done()
        })
    });
});

