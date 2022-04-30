/*
 * LBTaskManager
 *
 * An interface for managing the different LBTasks available in our Designer.
 *
 */

var AllTaskClasses = [
   // require("./tasks/LBTaskCondition").default,
   require("./tasks/LBTaskPar").default,
   require("./tasks/LBTaskSeq").default,
   require("./tasks/LBTaskWhen").default,
   require("./tasks/LBTaskDefend").default,
   require("./tasks/LBTaskEquip").default,
   require("./tasks/LBTaskHarvest").default,
   require("./tasks/LBTaskHotspots").default,
   require("./tasks/LBTaskLoot").default,
   require("./tasks/LBTaskMail").default,
   require("./tasks/LBTaskPull").default,
   require("./tasks/LBTaskQuestGoal").default,
   require("./tasks/LBTaskQuestHandin").default,
   require("./tasks/LBTaskQuestPickup").default,
   require("./tasks/LBTaskRest").default,
   require("./tasks/LBTaskTrain").default,
   require("./tasks/LBTaskUntil").default,
   require("./tasks/LBTaskUseItem").default,
   require("./tasks/LBTaskVendor").default,
   require("./tasks/LBTaskWalk").default,
];

// import ABViewFormText from "./views/ABViewFormText"

/*
 * Views
 * A name => ABView  hash of the different ABViews available.
 */
var Tasks = {};
AllTaskClasses.forEach((TASK) => {
   Tasks[TASK.key] = TASK;
});

export default {
   /*
    * @function allViews
    * return all the currently defined LBTasks in an array.
    * @return [{LBTask},...]
    */
   allTasks: function (fn = () => true) {
      var tasks = [];
      for (var t in Tasks) {
         tasks.push(Tasks[t]);
      }
      return tasks.filter(fn);
   },

   /*
    * @function newTask
    * return an instance of an LBTask based upon the values.key value.
    * @return {ABView}
    */
   newTask: function (key, data, LBApp) {
      parent = parent || null;

      if (Tasks[key]) {
         return new Tasks[key](data, LBApp);
      } else {
         var err = new Error("unknown task key");
         LBApp.AB.notify.developer(err, { data });
         return null;
      }
   },
};
