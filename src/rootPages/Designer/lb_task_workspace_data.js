/*
 * lb_task_workspace_data
 *
 * Manage the Task elements and properties workspace.
 *
 */
import FUIClass from "./lb_class";
import FLBTaskList from "./lb_task_workspace_data_tasklist";
import FLBProperties from "./lb_task_workspace_data_properties";

export default function (AB) {
   const UIClass = FUIClass(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = UIClass.L();

   // The DataTable that displays our object:
   const TaskList = new FLBTaskList(AB);
   const Properties = new FLBProperties(AB);

   class LBTaskWorkspaceData extends UIClass {
      /**
       * @param {object} ??
       */
      constructor() {
         super("lb_task_workspace_data", {
            tabbar: "",
            tabTasks: "",
            tabProperties: "",
         });

         this.CurrentTask = null;

         // var labels = {
         //    common: App.labels,
         //    component: {
         //       selectTask: L("laoban.task.selectTask", "*Drop a task here."),

         //       tabTask: L("laoban.task.tabTask", "*Tasks"),
         //       tabProperties: L("laoban.task.tabProperties", "*Properties"),

         //       // // formHeader: L('ab.application.form.header', "*Application Info"),
         //       // deleteSelected: L('ab.object.toolbar.deleteRecords', "*Delete records"),
         //       // hideFields: L('ab.object.toolbar.hideFields', "*Hide fields"),
         //       // massUpdate: L('ab.object.toolbar.massUpdate', "*Edit records"),
         //       // filterFields: L('ab.object.toolbar.filterFields', "*Add filters"),
         //       // sortFields: L('ab.object.toolbar.sortFields', "*Apply sort"),
         //       // frozenColumns: L('ab.object.toolbar.frozenColumns', "*Frozen fields"),
         //       // defineLabel: L('ab.object.toolbar.defineLabel', "*Define label"),
         //       // permission: L('ab.object.toolbar.permission', "*Permission"),
         //       // addFields: L('ab.object.toolbar.addFields', "*Add field"),
         //       // "export": L('ab.object.toolbar.export', "*Export"),
         //       // confirmDeleteTitle : L('ab.object.delete.title', "*Delete data field"),
         //       // confirmDeleteMessage : L('ab.object.delete.message', "*Do you want to delete <b>{0}</b>?")
         //    },
         // };
      }

      // Our webix UI definition:
      ui() {
         const ids = this.ids;

         return {
            id: ids.component,
            rows: [
               {
                  view: "tabbar",
                  id: ids.tabbar,
                  value: ids.tabTasks,
                  multiview: true,
                  fitBiggest: true,
                  options: [
                     {
                        id: ids.tabTasks,
                        value: L("Tasks"),
                        width: uiConfig.tabWidthMedium,
                     },
                     {
                        id: ids.tabProperties,
                        value: L("Properties"),
                        width: uiConfig.tabWidthMedium,
                     },
                  ],
                  on: {
                     onChange: (idNew, idOld) => {
                        if (idNew != idOld) {
                           this.tabSwitch(idNew, idOld);
                        }
                     },
                  },
               },
               {
                  id: ids.workspace,
                  cells: [TaskList.ui(), Properties.ui()],
               },
            ],
         };
      }

      // Our init() function for setting up our UI
      init(LB) {
         this.LB = LB;

         // webix.extend($$(ids.form), webix.ProgressBar);
         TaskList.init(LB);
         Properties.init(LB);

         // pass on the 'taskUpdated' event:
         Properties.on("taskUpdated", (LBTask) => {
            this.emit("taskUpdated", LBTask);
         });
      }

      /**
       * @function beforeTaskSave
       * called when the Task List is changing tasks and we need to alert the
       * Property Editor to save it's current state.
       */
      beforeTaskSave() {
         Properties.saveCurrentEditor();
      }

      /**
       * @function clearWorkspace()
       * Clear the query workspace.
       */
      clearWorkspace() {}

      /**
       * @function taskLoad()
       * Initialize the Task Workspace with the provided Task.
       * @param {LBTask} task
       *        current LBTask instance we are working with.
       */
      taskLoad(task) {
         $$(this.ids.tabbar).setValue(this.ids.tabTasks);
         Properties.taskLoad(task);
      }

      /**
       * @function lbTaskSelected()
       * Pass the selected LBTask on to the Properties Tab.
       * @param {LBTask} LBTask
       */
      lbTaskSelected(LBTask) {
         // show the Properties TAB:
         $$(this.ids.tabbar).setValue(this.ids.tabProperties);
         Properties.lbTaskSelected(LBTask);
      }

      /**
       * @function show()
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      /**
       * @function tabSwitch
       * Every time a tab switch happens, decide which workspace to show.
       * @param {string} idTab
       *        the id of the tab that was changed to.
       * @param {string} idOld
       *        the previous tab id
       */
      tabSwitch(idTab /*, idOld */) {
         switch (idTab) {
            // Task List Tab
            case this.ids.tabTasks:
               TaskList.show();
               break;

            // Interface Workspace Tab
            case this.ids.tabProperties:
               Properties.show();
               break;
         }
      }
   }

   return new LBTaskWorkspaceData();
}
