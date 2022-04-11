// LBTaskMail
//
// A Mail task will mail items to a specific player.
//
// Mail
// {
//     $Location = [9849.2, 959.49, 1306.74];
//     $To = "Gringoht";
//     $Items = ["Malachite", "Tigerseye", "Cloth", "Light Leather", "Ore"];
//     $Protected = ["hearth", "potion", "bandage"];
//     $MailGreens = true; // Mail all green items to alt
//     $MailBlues = true; // Mail all blue items to alt
//     $MailEpics = false; // Keep epics in your bag and don't send
//     $MinFreeBagSlots = 2;
// }
//
import LBTask from "../LBTask";

// this Task's unique task key
var _key = "mail";

export default class LBTaskMail extends LBTask {
   static get key() {
      return _key;
   }
   static get name() {
      return "Mail";
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
      return super.name("Mail");
   }

   /**
    * propertyDescription
    * return the description of this Task for your Property Editor.
    * @return {obj}
    */
   propertyDescription() {
      return "<b>Mail</b><br>Mail items to other characters.";
   }

   /**
    * properties
    * return an obj hash of fields and common property types for our tasks.
    * the base LBTask defines 2 common properties: .prio and .phase
    * @return {obj}
    */
   properties() {
      var prop = super.properties();

      // $Location = [9849.2, 959.49, 1306.74];
      prop.location = {
         type: "location",
      };

      // $To = "Gringoht";
      prop.to = {
         type: "name",
      };

      // $Items = ["Malachite", "Tigerseye", "Cloth", "Light Leather", "Ore"];
      prop.items = {
         type: "itemlist",
      };

      // $Protected = ["hearth", "potion", "bandage"];
      prop.protect = {
         type: "itemlist",
         label: "protected",
      };

      // $MailGreens = true; // Mail all green items to alt
      prop.mailgreens = {
         type: "bool",
      };

      // $MailBlues = true; // Mail all blue items to alt
      prop.mailblues = {
         type: "bool",
      };

      // $MailEpics = false; // Keep epics in your bag and don't send
      prop.mailepics = {
         type: "bool",
      };

      // $MinFreeBagSlots = 2;
      prop.minfreebagslots = {
         type: "int",
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
