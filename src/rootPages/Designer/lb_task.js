/*
 * lb_task
 *
 * Display the Query Tab UI:
 *
 */
import FUIClass from "./lb_class";
import FTask_List from "./lb_task_list";
import FTask_Workspace from "./lb_task_workspace";

export default function (AB) {
   const UIClass = FUIClass(AB);
   const TaskList = FTask_List(AB);
   const TaskWorkspace = FTask_Workspace(AB);

   class Laoban_Tab_Task extends UIClass {
      //.extend(idBase, function(App) {

      constructor() {
         super("lb_task");
      }

      ui() {
         // Our webix UI definition:
         return {
            id: this.ids.component,
            margin: 10,
            cols: [TaskList.ui(), { view: "resizer" }, TaskWorkspace.ui()],
         };
      }

      // Our init() function for setting up our UI
      init(LB) {
         this.LB = LB;

         TaskWorkspace.init(LB);
         TaskList.init(LB);
         TaskList.on("selected", (item) => {
            this.taskSelected(item);
         });

         TaskList.on("taskDeleted", () => {
            TaskWorkspace.clearWorkspace();
         });
      }

      // our internal business logic
      taskSelected(task) {
         TaskWorkspace.taskLoad(task);
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
   return new Laoban_Tab_Task();
}
