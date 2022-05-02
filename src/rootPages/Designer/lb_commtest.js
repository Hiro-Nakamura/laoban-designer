/*
 * lb_commtest
 *
 * Display the Query Tab UI:
 *
 */
import FUIClass from "./lb_class";

export default function (AB) {
   const UIClass = FUIClass(AB);

   class Laoban_Tab_CommTest extends UIClass {
      //.extend(idBase, function(App) {

      constructor() {
         super("lb_commtest");
         this.room = null;
         this.clients = {
            /* client.id : {client} */
         };
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            margin: 10,
            rows: [
               {
                  view: "button",
                  label: "Create Room",
                  click: async () => {
                     this.room = await this.LB.AB.CommCenter.Room("lb-test");
                     console.log(this.room);
                     this.room.on("client", (client) => {
                        this.clients[client.id] = client;
                        client.on("data", (req) => {
                           console.log(`c[${client.id}] : ${req.data}`);
                        });

                        client.on("query", (req) => {
                           req.respond("Pong!");
                        });
                     });

                     this.room.on("data", (req) => {
                        console.log(`r[${this.room.clientID}] : ${req.data}`);
                     });
                  },
               },
               {
                  view: "button",
                  label: "Broadcast 'Hey'",
                  click: () => {
                     this.room.send("Hey");
                  },
               },
               {
                  view: "button",
                  label: "Room.Query(Ping)",
                  click: () => {
                     this.room.query("Ping").then((res) => {
                        console.log("Query Response:", res.data);
                     });
                  },
               },
               {},
               {
                  id: "socket-key",
                  view: "text",
                  value: " -- no key yet --",
               },
               {
                  view: "button",
                  label: "Create Socket Room",
                  click: async () => {
                     this.socket = await this.LB.AB.CommCenter.Socket(
                        "lb-test"
                     );
                     console.log(this.socket);
                     $$("socket-key").setValue(this.socket.key);

                     this.socket.on("client", (client) => {
                        console.log("new client:", client);
                        this.clients[client.id] = client;
                        client.on("data", (req) => {
                           console.log(`socket[${client.id}] : ${req.data}`);
                        });

                        client.on("query", (req) => {
                           req.respond("Pong!");
                        });
                     });

                     this.socket.on("data", (req) => {
                        console.log(
                           `socket room[${this.socket.clientID}] : ${req.data}`
                        );
                     });
                  },
               },
               {
                  view: "button",
                  label: "Broadcast 'Hey'",
                  click: () => {
                     this.socket.send("Hey");
                  },
               },
               {
                  view: "button",
                  label: "Room.Query(Ping)",
                  click: () => {
                     ["location", "targetLocation", "location"].forEach((c) => {
                        this.socket.query(c).then((res) => {
                           console.log("Query Response:", res.data);
                        });
                     });
                  },
               },
            ],
         };
      }

      // Our init() function for setting up our UI
      init(LB) {
         this.LB = LB;
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }
   }
   return new Laoban_Tab_CommTest();
}
