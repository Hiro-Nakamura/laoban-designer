/*
 * lb_task_workspace
 *
 * Manage the Task Workspace area.
 *
 */
import FUIClass from "./lb_class";

import FLBTaskTree from "./lb_task_workspace_tree";
import FLBData from "./lb_task_workspace_data";

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
            noSelection: "",
            selectedTask: "",
         });

         this.CurrentTask = null;
      }

      // Our webix UI definition:
      ui() {
         let ids = this.ids;

         return {
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
         };
      }

      // Our init() function for setting up our UI
      init(LB) {
         this.LB = LB;

         // webix.extend($$(ids.form), webix.ProgressBar);

         $$(this.ids.noSelection).show();
         TaskTree.init(LB);
         DataPanel.init(LB);

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
