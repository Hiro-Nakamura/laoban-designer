// LBTaskQuestPickup
//
// A QuestPickup task will attempt to accept a quest.
//
//
import LBTask from "../LBTask";

// this Task's unique task key
var _key = "questpickup";

export default class LBTaskQuestPickup extends LBTask {
   static get key() {
      return _key;
   }
   static get name() {
      return "QuestPickup";
   }

   constructor(attributes, LBApp) {
      super(attributes, LBApp, _key);

      /*
Attributes:
{
	id: uuid(),			// unique reference for this task
	key: 'xxx', 		// a specific task key: used by LBTaskManager to create an instance of that LBTask

	parent:{LBTask},	// a reference to the parent task


	// a variable set of properties that can be defined/used by a task


	// a possible set of child tasks that fall under this task.
	// not all Tasks support children
	tasks:[			
		{LBTask}
	]
}
*/
   }

   ///
   /// Instance Methods
   ///

   /**
    * hasChildren
    * return True if this task supports child tasks. False otherwise
    * @return {bool}
    */
   hasChildren() {
      return false;
   }

   /**
    * name
    * return a display name appropriate for this task
    */
   name() {
      let name = "QuestPickup";
      if (this.QuestName != "") {
         name = `${name} (${this.QuestName})`;
      }
      if (this.ID != "") {
         name = `${name} [${this.ID}]`;
      }
      return super.name(name);
   }

   /**
    * propertyDescription
    * return the description of this Task for your Property Editor.
    * @return {obj}
    */
   propertyDescription() {
      return "<b>QuestPickup</b><br>Pickup a quest.";
   }

   /**
    * properties
    * return an obj hash of fields and common property types for our tasks.
    * the base LBTask defines 2 common properties: .prio and .phase
    * @return {obj}
    */
   properties() {
      var prop = super.properties();

      // we can gain quests from npc, object or items

      prop.QuestName = {
         // Quest Name
         type: "string",
      };

      prop.NPC = {
         // Name of NPC that gives quest
         type: "name",
      };

      prop.object = {
         // Name of Object that gives quest
         type: "string",
      };

      prop.item = {
         // Name of Item that gives quest
         type: "string",
      };

      prop.ID = {
         // the ID of the quest
         type: "string",
      };

      prop.location = {
         // Location where the Quest Giver is
         type: "location",
      };

      return prop;
   }

   /**
    * save
    * take the data returned from the property editor and save it to this obj
    * @param {obj} data
    */
   // save(data) {

   //     this.prio = data.prio;
   //     if ((this.prio == 0) || (this.prio == '0')) this.prio = null;

   //     this.phase = data.phase || null;
   // }

   /**
    * propertyData
    * create an obj hash of values to populate our property editor:
    * @return {obj}
    */
   // propertyData() {
   //     return {
   //         prio: this.prio,
   //         phase: this.phase
   //     }
   // }
}
