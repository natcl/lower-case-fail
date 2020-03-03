module.exports = function(RED) {
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg, send, done) {
            if (msg.payload === 'Error') {
              if (done) {
                done('Error !')
              } else {
                node.error('Error !', msg)
              }              
            } else {
              msg.payload = msg.payload.toLowerCase();
              if (send && done) {
                send(msg);
                done();
              } else {
                node.send(msg);
              }
            }
        });
    }
    RED.nodes.registerType("lower-case",LowerCaseNode);
}