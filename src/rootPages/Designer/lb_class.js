/*
 * ui_class
 *
 * A common UI object for our UI pages.
 *

 */

var myClass = null;
// {singleton}
// we will want to call this factory fn() repeatedly in our imports,
// but we only want to define 1 Class reference.

export default function (AB) {
   if (!myClass) {
      myClass = class UI extends AB.ClassUI {
         constructor(...params) {
            super(...params);

            this.AB = AB;
            // {ABFactory}
            // Our common ABFactory for our application.

         }

         static L() {
            return function (...params) {
               return AB.Multilingual.labelPlugin("LB", ...params);
            };
         }


         /**
          * @method refreshWarnings()
          * reset the warnings on the provided ABObject and then start propogating
          * the "warnings" display updates.
          */
         warningsRefresh(/* ABObject */) {
            // ABObject.warningsEval();
            // this.emit("warnings");
         }

         /**
          * @method warningsPropogate()
          * If any of the passed in ui elements issue a "warnings" event, we will
          * propogate that upwards.
          */
         warningsPropogate(elements = []) {
            elements.forEach((e) => {
               e.on("warnings", () => {
                  this.emit("warnings");
               });
            });
         }
      };
   }

   return myClass;
}
