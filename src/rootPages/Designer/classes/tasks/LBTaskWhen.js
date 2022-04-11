// LBTaskWhen
//
// A Seq task can manage a number of child tasks in SEQuence.
//
//
import LBTaskCondition from "./LBTaskCondition";

// this Task's unique task key
var _key = "when";

export default class LBTaskWhen extends LBTaskCondition {
   static get key() {
      return _key;
   }
   static get name() {
      return "When";
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
    * name
    * return a display name appropriate for this task
    */
   name() {
      return super.name("When");
   }

   /**
    * propertyDescription
    * return the description of this Task for your Property Editor.
    * @return {obj}
    */
   propertyDescription() {
      return "<b>When</b><br>Perform a child task as long as the condition is true.";
   }
}
