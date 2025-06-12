interface LabeledValue {
  label: string;
}
 
function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}
 
let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);

declare global {
    interface Window { MyNamespace: any; }
}

window.MyNamespace = window.MyNamespace || {};

(<any>window).MyNamespace

// same as:
(window as any).MyNamespace

///////////////////////////////////////

Globals are "evil" :) I think the best way to also have the portability is:

First you export the interface: (for example, ./custom.window.ts)

export interface CustomWindow extends Window {
    customAttribute: any;
}
Second, you import

import {CustomWindow} from './custom.window.ts';
Third, cast the global variable window with CustomWindow:

declare let window: CustomWindow;
In this way you also don't have a red line in a different IDE if you use it with existent attributes of the window object, so at the end try:

window.customAttribute = 'works';
window.location.href = '/works';

///////////////////////////////////////////////

If you need to extend the window object with a custom type that requires the use of import, you can use the following method:

window.d.ts

import MyInterface from './MyInterface';

declare global {
    interface Window {
        propName: MyInterface
    }
}
See Global Augmentation in the 'Declaration Merging' section of the Handbook.

///////////////////////////////////////////////////

Create a file called global.d.ts, e.g., /src/@types/global.d.ts, and then define an interface like:

interface Window {
  myLib: any
}
Reference: Global .d.ts

///////////////////////////////////////////////////

Most of the other answers are not perfect.

Some of them just suppress the type inference for show.
Some of the others only care about global variables as namespaces, but not as interfaces/classes
I also encountered a similar problem this morning. I tried so many "solutions" on Stack Overflow, but none of them produced absolutely no type errors and enabled triggering type jumping in the IDE (WebStorm or Visual Studio Code).

Finally, from Allow module definitions to be declared as global variables #3180

I found a reasonable solution to attach typings for a global variable that acts as interface/class and namespace both.

The example is below:

// typings.d.ts
declare interface Window {
    myNamespace?: MyNamespace & typeof MyNamespace
}

declare interface MyNamespace {
    somemethod?()
}

declare namespace MyNamespace {
    // ...
}
The code above merges the typings of namespace MyNamespace and interface MyNamespace into the global variable myNamespace (the property of window).

/////////////////////////////////////////////////////////

Or you could do:

let myWindow = window as any;

And then myWindow.myProp = 'my value';

https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
