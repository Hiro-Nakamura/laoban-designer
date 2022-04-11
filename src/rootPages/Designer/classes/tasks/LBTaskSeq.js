// LBTaskSeq
//
// A Seq task can manage a number of child tasks in SEQuence.
//
//
import LBTask from "../LBTask";

// this Task's unique task key
var _key = "seq";

export default class LBTaskSeq extends LBTask {
   static get key() {
      return _key;
   }
   static get name() {
      return "Seq";
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
      return super.name("Seq");
   }

   /**
    * propertyDescription
    * return the description of this Task for your Property Editor.
    * @return {obj}
    */
   propertyDescription() {
      return "<b>Seq</b><br>Perform child tasks in sequence.";
   }

   /**
    * properties
    * return an obj hash of fields and common property types for our tasks.
    * the base LBTask defines 2 common properties: .prio and .phase
    * @return {obj}
    */
   // properties() {
   //     var prop = super.properties();

   //     // start with our Info, description.
   //     var myProp = {
   //         'title':{
   //                     type:'comment',
   //                     template: '<b>Seq</b><br>Perform child tasks in sequence.'
   //                 },
   //     };

   //     // add in the base items.
   //     for (var p in prop) {
   //         myProp[p] = prop[p];
   //     }

   //     return myProp;
   // }

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
