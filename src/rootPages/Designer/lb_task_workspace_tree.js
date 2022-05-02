/*
 * lb_task_workspace_tree
 *
 * Manage the Task Tree disgram.
 *
 */
import FUIClass from "./lb_class";

export default function (AB) {
   const UIClass = FUIClass(AB);
   const L = UIClass.L();

   class LBTaskWorkspaceTree extends UIClass {
      /**
       * @param {object} ??
       */
      constructor() {
         super("lb_task_workspace_tree", {
            labelTask: "",
            // nothingSelected: "",
            tree: "",
            buttonSave: "",
         });

         this.RootTask = null;

         this.CurrentTask = null;
      }

      // The DataTable that displays our object:
      // var DataTable = new ABWorkspaceDatatable(App);

      // Our webix UI definition:
      ui() {
         var ids = this.ids;

         return {
            id: ids.component,
            rows: [
               {
                  id: ids.toolbar,
                  view: "toolbar",
                  cols: [
                     {
                        id: ids.labelTask,
                        view: "label",
                        label: "[Task]",
                     },
                  ],
               },
               {
                  id: ids.tree,
                  view: "tree",
                  type: "lineTree",
                  drag: true,
                  template:
                     "{common.icon()}{common.folder()} #value# <span class='del_me webix_icon fa-trash pull-right'></span>",
                  data: [],
                  onClick: {
                     del_me: (ev, id) => {
                        this.deleteItem(ev, id);
                        return false;
                     },
                  },
                  on: {
                     onBeforeDrop: (context, e) => {
                        // context.from   :  the webix object the item came from
                        // context.start  :  id of the item being dropped (the task .key)
                        // context.target :  id of the item being dropped ON
                        // context.to     :  the webix object of the item being dropped ON

                        // IF this was our own Drag N Drop:
                        if (context.from == $$(ids.tree)) {
                           // if they are just making a normal move:
                           if (!e.shiftKey) {
                              // just do the default Webix thang
                              return;
                           }

                           // else they want to drop and make current element
                           // a child:

                           var droppedTask = this.RootTask.taskByID(
                              context.start
                           );
                           let dropTarget = this.RootTask.taskByID(
                              context.target
                           );

                           this.moveToChild(dropTarget, droppedTask);

                           // end this here:
                           // and return false to prevent the normal reordering
                           return false;
                        }

                        //// Otherwise we are dropping a New Task:

                        // get the data of what is being dragged
                        // create a new instance of that task
                        var newTask = this.LB.newTask({ key: context.start });

                        if (this.RootTask == null) {
                           this.RootTask = newTask;
                           this.loadTaskList();

                           // make sure our overlay is hidden:
                           $$(ids.tree).hideOverlay();
                        } else {
                           // store this new Task UNDER the current dropTarget
                           // this just gets the task in the RootTask tree structure
                           let dropTarget = this.RootTask.taskByID(
                              context.target
                           );

                           // if we didn't find a matching dropTarget
                           // then they dropped this onto the Tree obj even though
                           // there is already a Root Task.
                           if (!dropTarget) {
                              var rootID = $$(ids.tree).getFirstId();
                              // console.log("rootID:", rootID);
                              dropTarget = this.RootTask.taskByID(rootID);

                              if (!dropTarget) {
                                 console.error("BAILING!!!!");
                                 // have no idea!!!  Bail!!!
                                 return false;
                              }
                           }

                           // make sure to save newTask in our current tree
                           dropTarget.childTask(newTask);

                           // the Tree list will organize them and later when we
                           // try to save the data, we will decode the Tree and
                           // get the proper structure back out:

                           // normal Tree Behavior is that if we drop a task onto another,
                           // it becomes a sibling of that task.  However, if we hold [shift]
                           // and the dropTarget supports children, add this as a last child
                           if (!e.shiftKey || !dropTarget.hasChildren()) {
                              // normal behavior
                              this.addSibling(dropTarget, newTask);
                           } else {
                              // add this as a Child:
                              this.addChild(dropTarget, newTask);
                           }
                        }

                        // return false to prevent actually moving the element to this display
                        return false; //block the default behavior of event (cancels dropping)
                     }, // onBeforeDrop()
                     onItemClick: (id /*, e, node */) => {
                        var task = this.RootTask.taskByID(id);
                        // console.error(".onItemClick()", task);
                        this.emit("selected", task);
                     },
                  },
               },
               {
                  view: "button",
                  type: "form",
                  id: ids.buttonSave,
                  css: "webix_primary",
                  value: L("Save Changes"),

                  click: () => {
                     this.taskSave();
                  },
               },
            ],
         };
      }

      // Our init() function for setting up our UI
      init(LB) {
         this.LB = LB;

         // make sure the Tree list can show an overlay box:
         webix.extend($$(this.ids.tree), webix.OverlayBox);
      }

      // our internal business logic

      /**
       * @function addChild()
       *
       * Add a LBTask as a Child to the given dropTarget.
       * @param {LBTask} dropTarget  The LBTask that an item was dropped ON
       * @param {LBTask} newTask     The instance of a LBTask to add
       */
      addChild(dropTarget, newTask) {
         var TreeList = $$(this.ids.tree);

         var parID = dropTarget.id;

         // try to find LAST child:
         var childID = TreeList.getFirstChildId(parID);

         // if this is the 1st child of this entry, just add it:
         if (!childID) {
            TreeList.add(newTask.treeData(), 0, parID);
         } else {
            // try to find LAST child:
            var nextChild = TreeList.getNextSiblingId(childID);
            while (nextChild) {
               childID = nextChild;
               nextChild = TreeList.getNextSiblingId(childID);
            }

            // at this point, childID should be last one:
            var pos = TreeList.getBranchIndex(childID, parID);
            TreeList.add(newTask.treeData(), pos + 1, parID);
         }
      }

      /**
       * @function addSibling()
       *
       * Add a LBTask as a Sibling to the given dropTarget.
       * @param {LBTask} dropTarget  The LBTask that an item was dropped ON
       * @param {LBTask} newTask     The instance of a LBTask to add
       */
      addSibling(dropTarget, newTask) {
         var TreeList = $$(this.ids.tree);
         var parID = TreeList.getParentId(dropTarget.id);
         var pos = TreeList.getBranchIndex(dropTarget.id, parID);
         TreeList.add(newTask.treeData(), pos + 1, parID);
      }

      taskSave() {
         const CurrentTask = this.CurrentTask;
         if (CurrentTask != null) {
            // signal that we are about to save the current Task
            // this allows property editor to commit current values.
            this.emit("beforeTaskSave");

            var objData = "";
            if (this.RootTask) {
               this.reorderTasks(); // this makes sure RootTask is now in the proper order
               objData = this.RootTask.toObj();
            }

            CurrentTask[this.LB.fieldTaskData.columnName] =
               JSON.stringify(objData);

            // Call server to rename
            var Model = this.LB.dcTasks.datasource.model();
            Model.update(CurrentTask.id, CurrentTask)
               // .then( () => {})
               .catch(() => {
                  webix.alert({
                     text: "Unable to save our Task data:",
                  });
               });
         }
      }

      /**
       * @function clearTaskList()
       *
       * Clear the Task List.
       */
      clearTaskList() {
         // $$(ids.tree).define('data', []);
         // $$(ids.tree).refresh();

         $$(this.ids.tree).clearAll();

         // display "drop new task here"
         // $$(ids.nothingSelected).show();
         $$(this.ids.tree).showOverlay(
            "<div class='drop-zone'><div>" +
               L("Drop a task here.") +
               "</div></div>"
         );
      }

      /**
       * @function deleteItem()
       *
       * Remove a Task from our tree.
       * @param {event} ev
       * @param {string} id  the id of the row where we clicked the delete
       */
      deleteItem(ev, id) {
         var TreeList = $$(this.ids.tree);

         // // grab current item.
         // var task = TreeList.getItem(id);

         // mark current and all children with CSS
         function markDeep(id) {
            TreeList.addCss(id, "lb-task-del-confirm");
            var currChildID = TreeList.getFirstChildId(id);
            while (currChildID) {
               markDeep(currChildID);
               currChildID = TreeList.getNextSiblingId(currChildID);
            }
         }

         function removeDeep(id) {
            TreeList.removeCss(id, "lb-task-del-confirm");
            var currChildID = TreeList.getFirstChildId(id);
            while (currChildID) {
               removeDeep(currChildID);
               currChildID = TreeList.getNextSiblingId(currChildID);
            }
         }

         // start by marking all the entries with our css
         markDeep(id);

         // confirm desire to delete
         webix.confirm({
            title: L("Delete Task?"),
            message: L(
               "Are you sure you want to delete this Task and ALL it's subtasks?"
            ),
            callback: (result) => {
               if (result) {
                  // if yes, then remove item from the tree:
                  TreeList.remove(id);
               } else {
                  // else remove our CSS additions:
                  removeDeep(id);
               }
            },
         });
      }

      /**
       * @function taskLoad()
       *
       * Initialize the Task Workspace with the provided Task.
       *
       * @param {Task} task     current ABObject instance we are working with.
       */
      taskLoad(task) {
         var CurrentTask = this.CurrentTask;

         // be sure to save the previous data:
         if (CurrentTask != null && CurrentTask != task) {
            this.taskSave();
            // // signal that we are about to save the current Task
            // // this allows property editor to commit current values.
            // this.emit("beforeTaskSave");

            // var objData = "";
            // if (this.RootTask) {
            //    this.reorderTasks(); // this makes sure RootTask is now in the proper order
            //    objData = this.RootTask.toObj();
            // }

            // CurrentTask[this.LB.fieldTaskData.columnName] =
            //    JSON.stringify(objData);

            // // Call server to rename
            // var Model = this.LB.dcTasks.dataSource.model;
            // Model.update(CurrentTask.id, CurrentTask)
            //    // .then( () => {})
            //    .catch(() => {
            //       webix.alert({
            //          text: "Unable to save our Task data:",
            //       });
            //    });
         }

         // switch to current task
         this.CurrentTask = task;

         var $labelTask = $$(this.ids.labelTask);
         $labelTask.define("label", task[this.LB.fieldTaskName.columnName]);
         $labelTask.refresh();

         // get task's saved data & convert to JSON
         var taskData = this.CurrentTask[this.LB.fieldTaskData.columnName];
         var jsonTaskData = taskData;
         if (typeof taskData == "string") {
            if (taskData && taskData != '""') {
               jsonTaskData = JSON.parse(taskData);
            } else {
               jsonTaskData = null;
            }
         }

         // if we have a valid object with a .key field:
         if (
            jsonTaskData &&
            typeof jsonTaskData == "object" &&
            jsonTaskData.key
         ) {
            // create a new LBTask from json data
            this.RootTask = this.LB.newTask(jsonTaskData);
            this.loadTaskList();
         } else {
            this.RootTask = null;
            this.clearTaskList();
         }
      }

      /**
       * @function loadTaskList()
       *
       * Populate the Task Tree from the specified RootTask
       */
      loadTaskList() {
         if (!this.RootTask) return;

         var TreeList = $$(this.ids.tree);
         TreeList.clearAll();

         //                 var treeData = [RootTask.treeData()];
         // console.error('!!! treeData:', JSON.stringify(treeData));

         // display treeData in our Tree list
         TreeList.parse([this.RootTask.treeData()]);

         TreeList.hideOverlay();
         TreeList.show();
      }

      moveToChild(dropTarget, droppedTask) {
         var TreeList = $$(this.ids.tree);

         var listAdds = [];

         // add the first droptTask:
         listAdds.push({ parent: dropTarget.id, child: droppedTask.id });

         var processChildren = (current) => {
            var childID = TreeList.getFirstChildId(current.id);
            while (childID) {
               listAdds.push({ parent: current.id, child: childID });

               var Child = this.RootTask.taskByID(childID);
               processChildren(Child);

               childID = TreeList.getNextSiblingId(childID);
            }
         };
         processChildren(droppedTask);

         // first remove droppedTask from where it is:
         TreeList.remove(droppedTask.id);

         listAdds.forEach((pc) => {
            var Parent = this.RootTask.taskByID(pc.parent);
            var Child = this.RootTask.taskByID(pc.child);
            this.addChild(Parent, Child);
         });
      }

      reorderTasks() {
         // var oldRoot = this.RootTask;

         var TreeList = $$(this.ids.tree);
         var listAdds = [];

         var TreeRoot = this.RootTask.taskByID(TreeList.getFirstId());
         let processChildren = (current) => {
            var childID = TreeList.getFirstChildId(current.id);
            while (childID) {
               var Child = this.RootTask.taskByID(childID);
               listAdds.push({ parent: current, child: Child });

               processChildren(Child);

               childID = TreeList.getNextSiblingId(childID);
            }
         };
         processChildren(TreeRoot);

         // now listAdds is an array of proper LBTask connections, in order:
         this.RootTask.resetTaskStructure();

         listAdds.forEach((l) => {
            l.parent.childTask(l.child);
         });

         this.RootTask = TreeRoot;
      }

      /**
       * @function rowAdd()
       *
       * When our [add row] button is pressed, alert our DataTable
       * component to add a row.
       */
      rowAdd() {
         // DataTable.addRow();
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      updateTask(LBTask) {
         var data = LBTask.treeData();
         var TreeList = $$(this.ids.tree);
         if (TreeList.exists(LBTask.id)) {
            TreeList.updateItem(LBTask.id, data);
         }

         // $$(ids.tree).refresh();
      }
   }

   return new LBTaskWorkspaceTree();
}
