var helper = require("node-red-node-test-helper");
var lowerNode = require("../lower-case.js");

describe('lower-case Node', function () {

  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "n1", type: "lower-case", name: "test name" }];
    helper.load(lowerNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'test name');
      done();
    });
  });

  it('should make payload lower case', function (done) {
    var flow = [{ id: "n1", type: "lower-case", name: "test name",wires:[["n2"]] },
    { id: "n2", type: "helper" }];
    helper.load(lowerNode, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        msg.should.have.property('payload', 'uppercase');
        done();
      });
      n1.receive({ payload: "UpperCase" });
    });
  });
  
  it('should return an error if msg.payload === "Error"', function (done) {
    var flow = [{ id: "n1", type: "lower-case", name: "test name",wires:[["n2"]] },
    { id: "n2", type: "helper" }];
    helper.load(lowerNode, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n1.receive({ payload: "Error" });
      helper.log().called.should.be.true()
      console.log(helper.log().args)
      var logEvents = helper.log().args.filter(function (evt) {
        return evt[0].type === 'lower-case'
      })
      console.log(logEvents[0][0])
      logEvents[0][0].should.have.property('msg', 'Error !')
      done()
    });
  });
});


// it('should return an error if the JSON-RPC 2.0 payload is not valid JSON', function (done) {
//   var flow = [
//     { id: 'n1', type: 'json-rpc-processor', name: 'json-rpc-processor', wires: [ [], ['n2'] ] },
//     { id: 'n2', type: 'helper' }
//   ]
//   helper.load(jsonRpcNode, flow, function () {
//     var n2 = helper.getNode('n2')
//     var n1 = helper.getNode('n1')
//     n2.on('input', function (msg) {
//       try {
//         msg.payload.should.have.property('jsonrpc', '2.0')
//         msg.payload.should.have.property('id', null)
//         msg.payload.error.should.have.property('code', -32700)
//         msg.payload.error.should.have.property('message', 'Parse error')
//       } catch (error) {
//         done(error)
//       }
//     })
//     n1.receive({ payload: '{{}}' })
//     helper.log().called.should.be.true()
    // var logEvents = helper.log().args.filter(function (evt) {
    //   return evt[0].type === 'json-rpc-processor'
    // })
//     var err = logEvents[0][0]
//     try {
//       err.msg.should.match(/^json-rpc-processor error: Parse error: /)
//       done()
//     } catch (error) {
//       done(error)
//     }
//   })
// })