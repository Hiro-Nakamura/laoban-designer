/*
 * lb_task_workspace_data_properties
 *
 * Manage the Task Tree disgram.
 *
 */
import FUIClass from "./lb_class";

export default function (AB) {
   const UIClass = FUIClass(AB);
   const uiConfig = AB.Config.uiSettings();
   // const L = UIClass.L();

   class LBTaskWorkspaceDataProperties extends UIClass {
      /**
       * @param {object} ??
       */
      constructor() {
         super("lb_task_workspace_data_properties");

         this.CurrentTask = null;
         this.CurrentLBTask = null;
         this.CurrentEditor = null;
      }

      // The DataTable that displays our object:
      // var DataTable = new ABWorkspaceDatatable(App);

      // Our webix UI definition:
      ui() {
         return {
            id: this.ids.component,
            rows: [
               {
                  maxHeight: uiConfig.xxxLargeSpacer,
                  hidden: uiConfig.hideMobile,
               },
               {
                  view: "label",
                  align: "center",
                  label: " this should be a Property List",
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
       *        current ABObject instance we are working with.
       */
      taskLoad(task) {
         this.CurrentTask = task;
      }

      lbTaskSelected(LBTask) {
         // save the current data:
         this.saveCurrentEditor();

         this.CurrentLBTask = LBTask;
         this.CurrentEditor = LBTask.propertyEditor();

         let $component = $$(this.ids.component);

         var allChildren = $component.getChildViews();
         var myCopy = [];
         allChildren.forEach((c) => {
            myCopy.push(c);
         });
         myCopy.forEach((c) => {
            $component.removeView(c);
         });

         $component.addView(this.CurrentEditor.ui());
         $component.addView({
            maxHeight: uiConfig.xxxLargeSpacer,
            hidden: uiConfig.hideMobile,
         });

         this.CurrentEditor.init(LBTask.propertyData());
      }

      /**
       * @function saveCurrentEditor()
       * Try to save the data in the property editor.
       * emit: 'taskUpdated', {LBTask}
       */
      saveCurrentEditor() {
         if (this.CurrentLBTask != null && this.CurrentEditor != null) {
            this.CurrentLBTask.save(this.CurrentEditor.getValues());
            this.emit("taskUpdated", this.CurrentLBTask);
         }
      }

      /**
       * @function show()
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }
   }

   return new LBTaskWorkspaceDataProperties();
}
