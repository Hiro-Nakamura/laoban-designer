/*
 * lb_task_workspace_data_taskList
 *
 * Manage the list of tasks.
 *
 */
import FUIClass from "./lb_class";

export default function (AB) {
   const UIClass = FUIClass(AB);
   const uiConfig = AB.Config.uiSettings();

   class LBTaskWorkspaceDataTaskList extends UIClass {
      /**
       * @param {object} ??
       */
      constructor() {
         super("lb_task_workspace_data_taskList", {
            list: "",
         });

         this.CurrentTask = null;
      }

      // Our webix UI definition:
      ui() {
         const ids = this.ids;

         return {
            id: ids.component,
            rows: [
               {
                  id: ids.list,
                  // view:"list",
                  view: "tree",
                  template: "#name#",
                  drag: "source",
                  data: [],
               },
               {
                  maxHeight: uiConfig.xxxLargeSpacer,
                  hidden: uiConfig.hideMobile,
               },
            ],
         };
      }

      // Our init() function for setting up our UI
      init(LB) {
         this.LB = LB;

         // webix.extend($$(ids.form), webix.ProgressBar);

         var listTasks = this.LB.allTasks();
         var taskEntries = [];
         listTasks.forEach((t) => {
            taskEntries.push({
               id: t.key,
               name: t.name,
               value: t.name,
               data: [],
            });
         });

         var TaskList = $$(this.ids.list);
         TaskList.define("data", taskEntries);
         TaskList.refresh();
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
         this.CurrentTask = task;
         // console.log("TaskList.editTask()", task);

         // var DataTable = $$(ids.datatable);
         // DataTable.clearAll();

         // // set columns:
         // var columns = query.columnHeaders(false, false);
         // DataTable.refreshColumns(columns);

         // // set data:
         // query.model().findAll()
         // .then((response)=>{
         //     response.data.forEach((d)=>{
         //         DataTable.add(d);
         //     })
         // })
         // .catch((err)=>{
         //     OP.Error.log('Error running Query:', {error:err, query:query});
         // })
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
   return new LBTaskWorkspaceDataTaskList();
}
