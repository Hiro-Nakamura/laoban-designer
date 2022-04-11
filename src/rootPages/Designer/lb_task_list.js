/*
 * lb_task_list
 *
 * Manage the Task List
 *
 */
import FUIClass from "./lb_class";
import UI_COMMON_LIST from "./lb_common_list";
// import UIListNewQuery from "./lb_task_list_newTask";

export default function (AB) {
   const UIClass = FUIClass(AB);
   // var L = UIClass.L();
   class Laoban_Tab_Task_List extends UIClass {
      constructor() {
         super("lb_task_list");

         // {ui_common_list} instance to display a list of our objects.
         this.ListComponent = UI_COMMON_LIST(AB, {
            idBase: this.ids.component,
            labels: {
               addNew: "Add new task",
               confirmDeleteTitle: "Delete Task",
               title: "Tasks",
               searchPlaceholder: "Task name",
            },
            // we can overrid the default template like this:
            // templateListItem:
            //    "<div class='ab-object-list-item'>#label##warnings#{common.iconGear}</div>",
            menu: {
               copy: false,
               exclude: false,
            },
         });
         // this.AddForm = UIListNewQuery(AB);
      }

      // Our webix UI definition:
      ui() {
         return this.ListComponent.ui();
      }

      // Our init() function for setting up our UI
      async init(LB) {
         this.LB = LB;

         this.on("addNew", (selectNew) => {
            // if we receive a signal to add a new Query from another source
            this.clickNewTask(selectNew);
         });

         var allInits = [];
         allInits.push(this.ListComponent.init(AB));

         this.ListComponent.on("selected", (item) => {
            this.emit("selected", item);
         });

         this.ListComponent.on("addNew", (selectNew) => {
            this.clickNewTask(selectNew);
         });

         this.ListComponent.on("deleted", (item) => {
            this.emit("deleted", item);
         });

         // this.ListComponent.on("exclude", (item) => {
         //    this.exclude(item);
         // });

         //
         // Add Form
         //
         // allInits.push(this.AddForm.init(AB));

         // this.AddForm.on("cancel", () => {
         //    this.AddForm.hide();
         // });

         // this.AddForm.on("save", (q /*, select */) => {
         //    // the AddForm already takes care of updating the
         //    // CurrentApplication.

         //    // we just need to update our list of objects
         //    this.applicationLoad(this.CurrentApplication);

         //    // if (select) {
         //    this.ListComponent.select(q.id);
         //    // }
         // });

         var DC = LB.dcTasks;
         if (!DC) {
            this.LB.AB.notify.developer(
               new Error("Could not find Laoban Tasks DataCollection.")
            );
         } else {
            DC.loadData();
            DC.on("loadData", () => {
               var data = DC.__dataCollection.find(() => true);
               data.forEach((d) => {
                  d.label = d[LB.fieldTaskName.columnName];
               });
               this.ListComponent.dataLoad(data);
            });
         }

         await Promise.all(allInits);
      }

      // warningsRefresh() {
      //    if (this.CurrentApplication) {
      //       let selectedItem = this.ListComponent.selectedItem();
      //       this.ListComponent.dataLoad(
      //          this.CurrentApplication?.queriesIncluded()
      //       );
      //       this.ListComponent.selectItem(selectedItem.id);
      //    }
      // }

      /**
       * @function clickNewTask
       * Manages initiating the transition to the new Process Popup window
       */
      clickNewTask(/* selectNew */) {
         // show the new popup
         this.AddForm.show();
      }

      /*
       * @function exclude
       * the list component notified us of an exclude action and which
       * item was chosen.
       *
       * perform the removal and update the UI.
       */
      // async exclude(item) {
      //    this.ListComponent.busy();
      //    var app = this.CurrentApplication;
      //    await app.queryRemove(item);
      //    this.ListComponent.dataLoad(app.queriesIncluded());

      //    // this will clear the  workspace
      //    this.emit("selected", null);
      // }

      ready() {
         this.ListComponent.ready();
      }

      select(item) {
         this.ListComponent.select(item.id);
      }
   }

   return new Laoban_Tab_Task_List();
}
