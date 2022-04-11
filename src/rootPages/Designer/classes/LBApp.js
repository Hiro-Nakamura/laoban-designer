// LBApp
//
// In order to prevent circular dependencies, we are including an LBApp that acts
// as a central object from which Tasks and other objects are created.
//
// This LBApp will be passed along to each object created and accessible to them.
//
//
import LBTaskManager from "./LBTaskManager";

class LBApp {
   constructor() {
      this.settings = {
         lbDCTask: "4ad79435-ab4e-4a94-b134-93cd793a94fc",
         // {string}  {uuid}
         // uuid of the Tasks Datacollection

         laobanFieldName: "c41ff8c5-60f4-455c-9532-48662a6a456a",
         // {string} {uuid}
         // uuid of the ABField that has the Task Name

         laobanFieldTaskData: "ceb19e49-1449-4887-913b-8ac9e8119140",
         // {string} {uuid}
         // uuid of the ABField that has the json data
      };
   }

   allTasks(fn) {
      return LBTaskManager.allTasks(fn);
   }

   newTask(data) {
      return LBTaskManager.newTask(data.key, data, this);
   }

   get dcTasks() {
      return this.AB.datacollectionByID(this.settings.lbDCTask);
   }

   get fieldTaskName() {
      return this.dcTasks.datasource.fieldByID(this.settings.laobanFieldName);
   }

   get fieldTaskData() {
      return this.dcTasks.datasource.fieldByID(
         this.settings.laobanFieldTaskData
      );
   }
}

export default new LBApp();
