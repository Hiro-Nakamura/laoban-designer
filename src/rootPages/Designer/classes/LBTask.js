// LBTask
//
// A task is a basic Action you want a character to perform.
//
//

const ListSeparator = "|";

export default class LBTask {
   constructor(attributes, LB, key) {
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
      // save this for user later:
      this.LB = LB;

      this.id = attributes.id || this.LB.AB.jobID(10);
      // {string} a unique id for this task
      // NOTE: these only have to be unique within the task definition.
      // we can live with the smaller string size.

      this.key = attributes.key || key;
      this.parent = null; // should get set after the parent creates it's child

      // initialize our tasks:
      this._tasks = [];
      if (Array.isArray(attributes.tasks) && attributes.tasks.length > 0) {
         attributes.tasks.forEach((t) => {
            var newTask = this.LB.newTask(t);
            if (newTask) {
               this.childTask(newTask);
            }
         });
      }

      // common parameters
      this.prio = attributes.prio || null;
      this.phase = attributes.phase || null;

      // initialize ourself according to our properties:
      var properties = this.properties();
      for (var p in properties) {
         if (properties[p].type != "comment") {
            this[p] = attributes[p];
         }
      }

      this.LBScribe = null;
      // {lb_task_workspace.LBScribe}
      // the PakScribe connection to our running Bot in the game.
      // the bot can report back different information useful for
      // our task building
   }

   ///
   /// Static Methods
   ///
   /// Available to the Class level object.  These methods are not dependent
   /// on the instance values of the Application.
   ///

   // static newTask(taskDescription) {
   // 	return LBTaskManager.newTask(taskDescription.key, taskDescription);
   // }

   ///
   /// Persistance Methods
   ///

   /**
    * toObj
    * return a json data structure for storing our task into the DB
    * @return {json}
    */
   toObj() {
      var obj = {
         id: this.id,
         key: this.key,
         tasks: [],
      };

      var properties = this.properties();
      for (var p in properties) {
         if (properties[p].type != "comment") {
            obj[p] = this[p];
         }
      }

      this._tasks.forEach((t) => {
         obj.tasks.push(t.toObj());
      });

      return obj;
   }

   /**
    * treeData
    * return a data structure Webix can interpret in their tree display.
    * @return {json}
    */
   treeData() {
      var treeObj = {
         id: this.id,
         value: this.name(),
         // use .settings.open  to keep track of visual display and toggle if tree node is open
         open: true,
      };

      if (this._tasks.length > 0) {
         treeObj.data = [];
         this._tasks.forEach((t) => {
            treeObj.data.push(t.treeData());
         });
      }

      return treeObj;
   }

   ///
   /// Instance Methods
   ///

   /**
    * childTask
    * save the provided task as a "child" to this one.
    * @param {LBTask} task
    */
   childTask(task) {
      task.parent = this;
      this._tasks.push(task);
   }

   /**
    * hasChildren
    * return True if this task supports child tasks. False otherwise
    * @return {bool}
    */
   hasChildren() {
      return true;
   }

   /**
    * name
    * return a display name appropriate for this task
    */
   name(label) {
      if (this.prio != null && this.prio != "") {
         label = "[" + this.prio + "] " + label;
      }

      if (this.phase != null && this.phase != "") {
         label += ' : phase{"' + this.phase + '"}';
      }
      return label; // child objects should override this.
   }

   /**
    * resetTaskStructure
    * disconnect all embedded tasks.
    */
   resetTaskStructure() {
      this._tasks.forEach((t) => {
         t.resetTaskStructure();
      });
      this.parent = null;
      this._tasks = [];
   }

   /**
    * taskByID
    * return the LBTask that has the given id
    * should be called from the RootTask in order to search the whole
    * task implementation.
    * @param {string} id
    * @return {LBTask}  or null if no task found.
    */
   taskByID(id) {
      if (id == this.id) {
         return this;
      }

      var foundChild = null;
      for (var i = 0; i < this._tasks.length; i++) {
         var t = this._tasks[i];
         foundChild = t.taskByID(id);

         if (foundChild) {
            return foundChild;
         }
      }

      // if we get here, there wasn't a child by that id:
      return null;
   }

   ////
   //// Property Editor
   ////

   /**
    * propertyDescription
    * return the description of this Task for your Property Editor.
    * @return {obj}
    */
   propertyDescription() {
      return "<b>LBTask</b><br>we forgot to override propertyDescription().";
   }

   /**
    * properties
    * return an obj hash of fields and common property types for our tasks.
    * the base LBTask defines 2 common properties: .prio and .phase
    * @return {obj}
    */
   properties() {
      return {
         title: {
            type: "comment",
            template: this.propertyDescription(),
         },
         prio: {
            type: "int",
            default: null,
         },
         phase: {
            type: "string",
            default: null,
         },
      };
   }

   /**
    * save
    * take the data returned from the property editor and save it to this obj
    * @param {obj} data
    */
   save(data) {
      this.prio = data.prio;
      if (this.prio == 0 || this.prio == "0") this.prio = null;

      this.phase = data.phase || null;

      // step through our properties and save any relevant data:
      var properties = this.properties();
      for (var p in properties) {
         if (properties[p].type != "comment") {
            this[p] = data[p];
         }
      }
   }

   /**
    * propertyData
    * create an obj hash of values to populate our property editor:
    * @return {obj}
    */
   propertyData() {
      var data = {
         prio: this.prio,
         phase: this.phase,
      };

      // step through our properties and save any relevant data:
      var properties = this.properties();
      for (var p in properties) {
         if (properties[p].type != "comment") {
            data[p] = this[p];
         }
      }

      return data;
   }

   /**
    * propertyEditor
    * return a webix component to display in the property Editor.
    * @param {LBScribe} LBScribe
    *        the connection to our PakScribe bot.
    */
   propertyEditor(LBScribe) {
      this.LBScribe = LBScribe;
      if (!this._editor) {
         var properties = this.properties();

         var ids = {};

         var ui = {
            rows: [],
         };

         var _logic = {};

         for (var p in properties) {
            ui.rows.push(this.propertyElement(p, ids, properties[p], _logic));
         }
         ui.rows.push({});

         var init = (data) => {
            for (var d in data) {
               if (ids[d]) {
                  this.propertySetValue(d, ids, properties[d], data[d]);
               }
            }
         };

         // package this in our UI Component format:
         this._editor = {
            ui: () => ui,
            init: init,

            ids: ids,
            getValues: () => {
               return this.propertyGetValues(ids, properties);
            },
         };
      }

      return this._editor;
   }

   /**
    * propertyElement
    * return a webix ui definition for a single property definition.
    */
   propertyElement(name, ids, definition, _logic) {
      var ele = null;

      var config = {
         widthButton: 25,
      };

      // for all types except 'comment' create an id[name]:
      if (definition.type != "comment") {
         ids[name] = `${name}-${this.LB.AB.jobID()}`;
      }

      switch (definition.type) {
         case "bool":
            ele = {
               id: ids[name],
               view: "checkbox",
               labelRight: definition.label || name,
               value: 1,
            };
            break;

         case "comment":
            ele = {
               template: definition.template,
               autoheight: true,
            };
            break;

         case "distance":
         case "int":
            ele = {
               id: ids[name],
               name: name,
               view: "counter",
               label: definition.label || name,
               step: 1,
               value: definition.default,
               min: definition.min || 0,
               max: definition.max || 100,
            };
            break;

         case "string":
            ele = {
               id: ids[name],
               name: name,
               view: "text",
               label: definition.label || name,
               value: definition.default,
            };
            break;

         case "condition":
         case "equation":
            ele = {
               id: ids[name],
               name: name,
               view: "text",
               label: definition.label || name,
               value: "",
            };
            break;

         case "location":
            this.logicAddUnitLocation(_logic);
            this.logicAddUnitTargetLocation(_logic);

            ele = {
               cols: [
                  {
                     id: ids[name],
                     name: name,
                     view: "text",
                     label: definition.label || name,
                     value: "",
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-male",
                     width: config.widthButton,
                     click: function () {
                        _logic.unitLocation(ids[name]);
                     },
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-bullseye",
                     width: config.widthButton,
                     click: function () {
                        _logic.unitTargetLocation(ids[name]);
                     },
                  },
               ],
            };
            break;

         case "locationlist":
            this.logicAddUnitLocation(_logic);
            this.logicAddUnitTargetLocation(_logic);

            ele = {
               cols: [
                  {
                     id: ids[name],
                     name: name,
                     view: "multicombo",
                     label: definition.label || name,
                     value: "",
                     options: [],
                     separator: ListSeparator,
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-male",
                     width: config.widthButton,
                     click: function () {
                        _logic.unitLocation(ids[name]);
                     },
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-bullseye",
                     width: config.widthButton,
                     click: function () {
                        _logic.unitTargetLocation(ids[name]);
                     },
                  },
               ],
            };
            break;

         case "name":
            this.logicAddUnitTargetName(_logic);

            ele = {
               cols: [
                  {
                     id: ids[name],
                     name: name,
                     view: "text",
                     label: definition.label || name,
                     value: "",
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-bullseye",
                     width: config.widthButton,
                     click: function () {
                        _logic.unitTargetName(ids[name]);
                     },
                  },
               ],
            };
            break;

         case "namelist":
            this.logicAddEnterValue(_logic);
            this.logicAddUnitTargetName(_logic);

            ele = {
               cols: [
                  {
                     id: ids[name],
                     name: name,
                     view: "multicombo",
                     label: definition.label || name,
                     value: "",
                     options: [],
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-font",
                     width: config.widthButton,
                     click: function () {
                        _logic.enterValue(ids[name]);
                     },
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-bullseye",
                     width: config.widthButton,
                     click: function () {
                        _logic.unitTargetName(ids[name]);
                     },
                  },
               ],
            };

            break;

         case "itemlist":
            this.logicAddEnterValue(_logic);
            // this.logicAddUnitItems(_logic);

            ele = {
               cols: [
                  {
                     id: ids[name],
                     name: name,
                     view: "multicombo",
                     label: definition.label || name,
                     value: "",
                     options: [],
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-font",
                     width: config.widthButton,
                     click: function () {
                        _logic.enterValue(ids[name]);
                     },
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-male",
                     width: config.widthButton,
                     click: function () {
                        _logic.unitItemPopup(ids[name]);
                     },
                  },
               ],
            };

            break;
      }

      return ele;
   }

   propertySetValue(name, ids, definition, value) {
      if (value) {
         switch (definition.type) {
            case "locationlist":
            case "namelist":
            case "itemlist":
               // these are multicombo boxes:
               var options = [];
               var hash = {};
               value.split(ListSeparator).forEach((v) => {
                  hash[v] = v;
               });
               Object.keys(hash).forEach((k) => {
                  options.push({ id: k, value: k });
               });

               var element = $$(ids[name]);
               if (element) {
                  element.define("options", options);
                  element.setValue(value);
                  element.refresh();
               }
               break;

            default:
               $$(ids[name]).setValue(value);
               break;
         }
      }
   }

   propertyGetValues(ids /*, properties */) {
      var data = {};
      for (var i in ids) {
         data[i] = $$(ids[i]).getValue();
      }
      return data;
   }

   logicUtilGetListOptions(ele) {
      var o = [];
      var eleID = ele.getFirstId();
      while (eleID) {
         o.push(ele.getItem(eleID));
         eleID = ele.getNextId(eleID);
      }
      return o;
   }

   logicUtilAddToCombo(value, ele) {
      var currValue = ele.getValue();
      if (currValue == "") currValue = [];
      else currValue = currValue.split(ListSeparator);

      var options = this.logicUtilGetListOptions(ele.getList());

      options.push({ id: value, value: value });

      currValue.push(value);
      currValue = currValue.join(ListSeparator);
      ele.define("options", options);
      ele.setValue(currValue);
      ele.refresh();
   }

   logicUtilAddTargetData(key, ele) {
      if (!this.LBScribe) {
         webix.alert("No Connection to our PakBot");
         return;
      }

      if (!this.LBScribe.isConnected) {
         webix.alert("PakBot is not currently connected");
         return;
      }

      this.LBScribe.query(key).then((newValue) => {
         // we can store target data into multicombo boxes
         if (ele.config.view == "multicombo") {
            // if a multicombo view, then ADD the current data value to
            // our current list.

            this.logicUtilAddToCombo(newValue, ele);
         } else {
            // or simple textboxes
            // if a textbox, replace our textbox with the value:

            ele.setValue(newValue);
         }
      });
   }

   logicAddEnterValue(_logic) {
      if (!_logic.enterValue) {
         _logic.enterValue = (id) => {
            var ele = $$(id);

            var uid = webix.uid();
            var textID = "text" + uid;

            var ui = {
               view: "popup",
               id: uid,
               body: {
                  rows: [
                     {
                        id: textID,
                        name: name,
                        view: "text",
                        value: "",
                     },
                     {
                        cols: [
                           {
                              view: "button",
                              id: "buttonCancel" + uid,
                              value: "cancel",
                              click: () => {
                                 $$(uid).hide();
                              },
                           },
                           {
                              view: "button",
                              id: "buttonSave" + uid,
                              value: "save",
                              on: {
                                 onItemClick: () => {
                                    var newValue = $$(textID).getValue();

                                    if (ele.config.view == "multicombo") {
                                       // if a multicombo view, then ADD the current data value to
                                       // our current list.

                                       this.logicUtilAddToCombo(newValue, ele);
                                    } else {
                                       // or simple textboxes
                                       // if a textbox, replace our textbox with the value:

                                       ele.setValue(newValue);
                                    }

                                    $$(uid).hide();
                                 },
                              },
                           },
                        ],
                     },
                  ],
               },
            };

            webix.ui(ui).show(ele.getNode());
            $$(textID).focus();
            $$(textID).attachEvent("onKeyPress", function (code, e) {
               if (e.code == "Enter") {
                  $$("buttonSave" + uid).callEvent("onItemClick");
               }
            });
         };
      } // end if !enterValue
   } // end logicAddEnterValue()

   logicAddUnitTargetName(_logic) {
      if (!_logic.unitTargetName) {
         _logic.unitTargetName = (id) => {
            var ele = $$(id);

            this.logicUtilAddTargetData("targetName", ele);
         }; // end unitTargetName()
      } // end if !unitTargetName
   } // end logicAddUnitTargetName()

   logicAddUnitLocation(_logic) {
      if (!_logic.unitLocation) {
         _logic.unitLocation = (id) => {
            var ele = $$(id);

            this.logicUtilAddTargetData("location", ele);
         }; // end unitTargetName()
      } // end if !unitTargetName
   } // end logicAddUnitTargetName()

   logicAddUnitTargetLocation(_logic) {
      if (!_logic.unitTargetLocation) {
         _logic.unitTargetLocation = (id) => {
            var ele = $$(id);

            this.logicUtilAddTargetData("targetLocation", ele);
         }; // end unitTargetName()
      } // end if !unitTargetName
   } // end logicAddUnitTargetName()
}
