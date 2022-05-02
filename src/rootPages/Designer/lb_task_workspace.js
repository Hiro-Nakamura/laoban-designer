/*
 * lb_task_workspace
 *
 * Manage the Task Workspace area.
 *
 */
import FUIClass from "./lb_class";

import FLBTaskTree from "./lb_task_workspace_tree";
import FLBData from "./lb_task_workspace_data";

var EventEmitter = require("events").EventEmitter;

class LBScribe extends EventEmitter {
   constructor(LB) {
      super();

      this.LB = LB;

      this.key = null;
      // {string} the unique connection string for a PakScribe to
      // connect to this App.

      this.client = null;
      // {CommCenterRoomSocket.Client}
      // the connection object that can communicate with our PakScribe

      this.LB.AB.CommCenter.Socket("lb-scribe").then((socket) => {
         this.socket = socket;

         this.key = this.socket.key;
         this.emit("key");

         this.socket.on("client", (client) => {
            console.log("new client:", client);
            this.client = client;
            this.emit("connected");

            client.on("disconnected", (req) => {
               console.log("... lost connection to PakScribe");
               this.emit("disconnected");
            });

            // client.on("query", (req) => {
            //    req.respond("Pong!");
            // });
         });

         // this.socket.on("data", (req) => {
         //    console.log(`socket room[${this.socket.clientID}] : ${req.data}`);
         // });
      });
   }

   get isConnected() {
      return this.client != null;
   }

   query(data) {
      if (!this.isConnected) {
         return Promise.reject(new Error("Not connected."));
      }
      return this.client.query(data).then((packet) => {
         return packet.data;
      });
   }
}

export default function (AB) {
   const UIClass = FUIClass(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = UIClass.L();

   // The Task Tree display
   const TaskTree = new FLBTaskTree(AB);
   const DataPanel = new FLBData(AB);

   class LBTaskWorkspace extends UIClass {
      /**
       * @param {object} ??
       */
      constructor() {
         super("lb_task_workspace", {
            toolbar: "",
            key: "",
            status: "",
            noSelection: "",
            selectedTask: "",
         });

         this.CurrentTask = null;
      }

      // Our webix UI definition:
      ui() {
         let ids = this.ids;

         return {
            rows: [
               {
                  id: ids.toolbar,
                  view: "toolbar",
                  css: "webix_dark",
                  cols: [
                     {
                        id: ids.key,
                        view: "text",
                        value: "",
                        readonly: true,
                     },
                     {
                        id: ids.status,
                        view: "text",
                        value: "disconnected",
                        readonly: true,
                        width: 100,
                     },
                  ],
               },
               {
                  view: "multiview",
                  id: ids.component,
                  rows: [
                     {
                        id: ids.noSelection,
                        rows: [
                           {
                              maxHeight: uiConfig.xxxLargeSpacer,
                              hidden: uiConfig.hideMobile,
                           },
                           {
                              view: "label",
                              align: "center",
                              label: L("Select Task"),
                           },
                           {
                              maxHeight: uiConfig.xxxLargeSpacer,
                              hidden: uiConfig.hideMobile,
                           },
                        ],
                     },
                     {
                        id: ids.selectedTask,
                        cols: [TaskTree.ui(), DataPanel.ui()],
                     },
                  ],
               },
            ],
         };
      }

      // Our init() function for setting up our UI
      init(LB) {
         this.LB = LB;

         // webix.extend($$(ids.form), webix.ProgressBar);
         this.LBScribe = new LBScribe(LB);
         this.LBScribe.on("key", () => {
            $$(this.ids.key).setValue(this.LBScribe.key);
         });
         this.LBScribe.on("connected", () => {
            let $status = $$(this.ids.status);
            $status.setValue("connected");
            webix.html.addCss($status.getNode(), "lb-scribe-connected");
         });
         this.LBScribe.on("disconnected", () => {
            let $status = $$(this.ids.status);
            $status.setValue("disconnected");
            webix.html.removeCss($status.getNode(), "lb-scribe-connected");
            webix.debug("lost connection to PakScribe");
         });

         $$(this.ids.noSelection).show();
         TaskTree.init(LB);
         DataPanel.init(LB, this.LBScribe);

         // // detect when a Task is selected in our Task Tree
         // // tell the DataPanel
         TaskTree.on("selected", (task) => {
            DataPanel.lbTaskSelected(task);
         });

         // // catch when the TaskTree is about to save a Task,
         // // and let the DataPanel know the properties need saving
         TaskTree.on("beforeTaskSave", () => {
            DataPanel.beforeTaskSave();
         });

         // // detect when the properties of a Task is updated:
         // // and tell the TaskTree to update
         DataPanel.on("taskUpdated", (task) => {
            TaskTree.updateTask(task);
         });
      }

      // our internal business logic

      /**
       * @function clearWorkspace()
       * Clear the query workspace.
       */
      clearWorkspace() {
         // NOTE: to clear a visual glitch when multiple views are updating
         // at one time ... stop the animation on this one:
         $$(this.ids.noSelection).show(false, false);
      }

      /**
       * @function editTask()
       * Initialize the Task Workspace with the provided Task.
       * @param {Task} task
       *        current ABObject instance we are working with.
       */
      taskLoad(task) {
         $$(this.ids.selectedTask).show();

         this.CurrentTask = task;

         TaskTree.taskLoad(task);
         DataPanel.taskLoad(task);
      }

      /**
       * @function show()
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      taskSelected(LBTask) {
         DataPanel.lbTaskSelected(LBTask);
      }
   }

   return new LBTaskWorkspace();
}
