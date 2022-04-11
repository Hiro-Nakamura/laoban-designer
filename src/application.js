import DesignerFactory from "./rootPages/Designer/lb.js";
export default function (AB) {
   var Designer = DesignerFactory(AB);

   var application = {
      id: "LB",
      label: "LB", // How to get Multilingual?
      icon: "fa-puzzle-piece",
      // {string} the AB.Multilingual.Label(Key)
      isPlugin: true,

      pages: function () {
         // Return the Root Pages required to
         return this._pages;
      },
      _pages: [Designer],
      // init: function (AB) {
      //    debugger;
      //    this._pages.forEach((p) => {
      //       p.init(AB);
      //    });
      // },
      datacollectionsIncluded: () => {
         // return [];
         var myDCs = [];
         return AB.datacollections((d) => myDCs.indexOf(d.id) > -1);
      },
   };
   // Each Page connect back to the application
   Designer.application = application;
   return application;
}
