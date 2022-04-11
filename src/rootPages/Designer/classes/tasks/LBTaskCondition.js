// LBTaskCondition
//
// A type of task that also includes a condition element.
//
//
import LBTask from "../LBTask";

// this Task's unique task key
// var _key = 'condition';

export default class LBTaskCondition extends LBTask {
   // static get key() { return _key; }
   // static get name() { return "Seq"; }

   constructor(attributes, LBApp, _key) {
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
      this.cond = attributes.cond || "";
   }

   ///
   /// Instance Methods
   ///

   /**
    * name
    * return a display name appropriate for this task
    */
   name(key) {
      var name = super.name(key);
      if (this.cond && this.cond.length > 0) {
         name += " (" + this.cond + ")";
      }
      return name;
   }

   /**
    * properties
    * return an obj hash of fields and common property types for our tasks.
    * the base LBTask defines 2 common properties: .prio and .phase
    * @return {obj}
    */
   properties() {
      var prop = super.properties();

      // add our condition element
      prop.cond = {
         type: "condition",
      };

      return prop;
   }

   /**
    * save
    * take the data returned from the property editor and save it to this obj
    * @param {obj} data
    */
   save(data) {
      super.save(data);
      this.cond = data.cond;
   }

   /**
    * propertyData
    * create an obj hash of values to populate our property editor:
    * @return {obj}
    */
   propertyData() {
      var data = super.propertyData();
      data.cond = this.cond || "";
      return data;
   }
}
