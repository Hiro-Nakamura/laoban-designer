/*
 * UI
 *
 * The central Controller for the LB->Designer.
 *
 */
import FUIClass from "./lb_class";
import LBApp from "./classes/LBApp";

import FLBTask from "./lb_task";
import FLBCommTest from "./lb_commtest";

export default function (AB) {
   LBApp.AB = AB;

   const UIClass = FUIClass(AB);
   const uiConfig = AB.Config.uiSettings();
   const TabTasks = FLBTask(AB);
   const TabCommTest = FLBCommTest(AB);

   var L = UIClass.L();

   class LB extends UIClass {
      constructor() {
         super("lb", {
            tabbar: "",
            tab_tasks: "",
            tab_commtest: "",
         });
         this.id = this.ids.component;
         this.icon = "connectdevelop";
      }

      label() {
         return L("Designer");
      }

      // return "popup" or "page"
      type() {
         return "page";
      }

      // Return any sub pages.
      pages() {
         return [];
      }

      /* mimic the ABPage.component() */
      component() {
         return {
            ui: this.ui(),
            init: () => {
               return this.init(AB);
            },
            onShow: () => {
               /* does anything special need to happen here? */
               this.show();
            },
         };
      }

      /* mimic ABPage.getUserAccess() */
      getUserAccess() {
         return 2;
      }

      ui() {
         var ids = this.ids;

         return {
            id: ids.component,
            cols: [
               // {
               //    width: App.config.mediumSpacer
               // },
               {
                  rows: [
                     {
                        view: "tabbar",
                        id: ids.tabbar,
                        value: ids.tab_tasks,
                        multiview: true,
                        fitBiggest: true,
                        options: [
                           {
                              id: ids.tab_tasks,
                              value: L("Tasks"),
                              width: uiConfig.tabWidthMedium,
                           },
                           {
                              id: ids.tab_commtest,
                              value: L("Comm Test"),
                              width: uiConfig.tabWidthMedium,
                           },
                           // {
                           //    id: ids.tab_interface,
                           //    value: labels.component.interfaceTitle,
                           //    width: App.config.tabWidthMedium
                           // }
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
                        cells: [
                           TabTasks.ui(),
                           TabCommTest.ui(),
                           // AppQueryWorkspace.ui,
                           // AppInterfaceWorkspace.ui
                        ],
                     },
                  ],
               },
               // {
               //    width: App.config.mediumSpacer
               // }
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         // perform an initial resize adjustment
         $$(this.ids.component).adjust();

         // get the actual objects for our settings:
         // var dc = AB.dataCollectionByID(LBApp.settings.lbTaskDS);
         // var fieldName = dc.datasource.fieldByID(
         //    LBApp.settings.laobanNamefield
         // );
         // var fieldTask = dc.datasource.fieldByID(
         //    LBApp.settings.laobanTaskfield
         // );

         // var NewObjectPage = this.Page.pages((p)=>{ return p.id == this.Page.settings.laobanNewTaskPage; })[0];

         // initialzie our Task Tab
         // TabTasks.init({
         //    // Page:Page,
         //    dataSource: dc,
         //    fieldName: fieldName,
         //    fieldTask: fieldTask,
         //    // pageNewTask: NewObjectPage
         // });

         await Promise.all([TabTasks.init(LBApp), TabCommTest.init(LBApp)]);
      }

      /**
       * isRoot()
       * indicates this is a RootPage.
       * @return {bool}
       */
      isRoot() {
         return true;
      }

      show() {
         super.show();
         TabTasks.show();
      }

      tabSwitch(tabID) {
         switch (tabID) {
            case this.ids.tab_tasks:
               TabTasks.show();
               break;

            case this.ids.tab_commtest:
               TabCommTest.show();
               break;
         }
      }
   }
   return new LB();
}
