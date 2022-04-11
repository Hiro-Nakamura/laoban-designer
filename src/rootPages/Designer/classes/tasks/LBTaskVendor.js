// LBTaskVendor
//
// A Vendor task will loot any mobs nearby.
//
// Vendor
// {
//     $NPC = "William MacGregor";
//     $Protected = ["Hearthstone","Briarthorn", "Swiftthistle", "Arrow", "Potion", "Cloth", "Skinning", "Pick", "Light Leather", "Ore", "Malachite",  "okra", "Snout", "Eye", "Liver", "Stringy",  "Milk", "Meat", "Jerky"];
//     $Location = [ -10659, 996.851, 33.085];
//     $SellGrey  = true;
//     $SellWhite = true;
//     $SellGreen = false;
// }

import LBTask from "../LBTask";

// this Task's unique task key
var _key = "vendor";

export default class LBTaskVendor extends LBTask {
   static get key() {
      return _key;
   }
   static get name() {
      return "Vendor";
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
      return super.name("Vendor");
   }

   /**
    * propertyDescription
    * return the description of this Task for your Property Editor.
    * @return {obj}
    */
   propertyDescription() {
      return "<b>Vendor</b><br>Sell off any items to a vendor.";
   }

   /**
    * properties
    * return an obj hash of fields and common property types for our tasks.
    * the base LBTask defines 2 common properties: .prio and .phase
    * @return {obj}
    */
   properties() {
      var prop = super.properties();

      // $NPC = "William MacGregor";
      prop.npc = {
         type: "name",
      };

      // $Location = [ -10659, 996.851, 33.085];
      prop.location = {
         type: "location",
      };

      // $Protected = ["Hearthstone","Briarthorn", "Swiftthistle", "Arrow", "Potion", "Cloth", "Skinning", "Pick", "Light Leather", "Ore", "Malachite",  "okra", "Snout", "Eye", "Liver", "Stringy",  "Milk", "Meat", "Jerky"];
      prop.protect = {
         type: "itemlist",
      };

      // $SellGrey  = true;
      prop.sellgrey = {
         type: "bool",
         label: "Sell Grey",
      };

      // $SellWhite = true;
      prop.sellwhite = {
         type: "bool",
         label: "Sell White",
      };

      // $SellGreen = false;
      prop.sellgreen = {
         type: "bool",
         label: "Sell Green",
      };

      return prop;
   }
}
