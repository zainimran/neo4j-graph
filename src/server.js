const neo4j = require('neo4j-driver').v1;

const user = 'neo4j';
const password = 'zain';
const uri = "bolt://localhost";

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

const socketio = require('socket.io');
const fs = require('fs');
const path = require('path');
const http = require('http');

var makeNodeResultPromise = (nodeName) => session.writeTransaction(t => {;
  var result = t.run(
    'CREATE (n:Node $props) \
    RETURN n.name AS node_name',
    {
      "props": {
        "name": nodeName,
      },
    },
  );
  return result;
})

var createLinkResultPromise = ([firstName, lastName]) => session.writeTransaction(t => {
  var result = t.run(
    'MATCH (a:Node), (b:Node) \
    WHERE a.name = $first_name AND b.name = $last_name \
    CREATE (a)-[r:LINK { linkName: a.name + "<->" + b.name}]->(b) \
    RETURN type(r), r.name AS link_name',
    {
      first_name: firstName,
      last_name: lastName,
    },
  );
  return result;
})

const server = http.createServer(async (request, response) =>
{
	try
	{
		response.end(await readFile(request.url.substr(1)));
	}
	catch(err)
	{
		response.end();
	}
});

const io = socketio(server);
clients = [];
io.sockets.on('connection', socket => {
	clients = [...clients, socket]
	socket.on('add_node', nodeName => {
    sender = socket.id
    let temp = makeNodeResultPromise(nodeName);
    temp.then(result => {
      session.close();
      driver.close();
    }).catch((error) => {
      console.error(error);
    });
  })

  socket.on('add_link', nodeNames => {
    sender = socket.id
    let temp = createLinkResultPromise(nodeNames);
    temp.then(result => {
      session.close();
      driver.close();
    }).catch((error) => {
      console.error(error);
    });
	})

	socket.on('disconnect', () => {
		dis = socket.id
		clients = clients.filter(s => s !== socket)
	})
})

server.listen(8000)