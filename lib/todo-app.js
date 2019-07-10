/**
 * initial_model is a simple JavaScript Object with two keys and no methods.
 * it is used both as the "initial" model when mounting the Todo List App
 * and as the "reset" state when all todos are deleted at once.
 */
var initial_model = {
    todos: [], // empty array which we will fill shortly
    hash: "#/" // the hash in the url (for routing)
  }
  
/**
 * `update` transforms the `model` based on the `action`.
 * @param {String} action - the desired action to perform on the model.
 * @param {Object} model - the App's (current) model (or "state").
 * @param {String} data - data we want to "apply" to the item. e.g: item Title
 * @return {Object} new_model - the transformed model.
 */

function update(action, model, data) {
  var new_model = JSON.parse(JSON.stringify(model)) // "clone" the model
  switch(action) {                   // and an action (String) runs a switch
    case 'ADD':
      new_model.todos.push({
        id: model.todos.length + 1,
        title: data,
        done: false
      });
      break;
    
    case 'TOGGLE':
      const todo= new_model.todos[data - 1]
      todo.done = !todo.done
      break;

    default: // if action unrecognised or undefined,
      return model; // return model unmodified
  }   // see: https://softwareengineering.stackexchange.com/a/201786/211301
  return new_model;
}


/* if require is available, it means we are in Node.js Land i.e. testing! */
/* istanbul ignore next */
if (typeof require !== 'undefined' && this.window !== this) {
  var { a, button, div, empty, footer, input, h1, header, label, li, mount,
    route, section, span, strong, text, ul } = require('./elmish.js');
}

/**
 * `render_item` creates an DOM "tree" with a single Todo List Item
 * using the "elmish" DOM functions (`li`, `div`, `input`, `label` and `button`)
 * returns an `<li>` HTML element with a nested `<div>` which in turn has the:
 *   `<input type=checkbox>` which lets users to "Toggle" the status of the item
 *   `<label>` which displays the Todo item text (`title`) in a `<text>` node
 *   `<button class="destroy">` lets people "delete" a todo item.
 * see: https://github.com/dwyl/learn-elm-architecture-in-javascript/issues/52
 * @param  {Object} item the todo item object
 * @return {Object} <li> DOM Tree which is nested in the <ul>.
 * @example
 * // returns <li> DOM element with <div>, <input>. <label> & <button> nested
 * var DOM = render_item({id: 1, title: "Build Todo List App", done: false});
 */
function render_item(item) {
  return (
    li([
      "data-id=" + item.id,
      "id=" + item.id,
      item.done ? "class=completed" : ""
    ], [
      div(["class=view"], [
        input(["class=toggle", "type=checkbox",
          (item.done ? "checked=true" : "")], []),
        label([], [text(item.title)]),
        button(["class=destroy"])
      ]) // </div>
    ]) // </li>
  )
}

function render_main(model){
  return(
    section(["class= main", "style = display: block;"], [
      input(["id=toggle-all", "class=toggle=all", "type=checkbox"], []),
      label(["for=toggle-all"], [ text("Mark all as complete") ]),
      ul(["class=todo-list"],
        model.todos.map(function(item) {return render_item(item) })
      ) // </ul>
    ]) // </section>
  )
}


/**
 * 'render_footer' renders the '<footer class="footer">' of the Todo List App
 * which contains count of items to (still) to be done and and '<ul>' "menu"
 * with links to filter which todo items appear in the list view.
 * @param {Object} model - the App's (current) model (or "state").
 * @return {Object} <section> DOM Tree which containing the <footer> element.
 * @example
 * // returns <footer> DOM element with other DOM elements nested:
 * var DOM = render_footer(model);
 */

function render_footer(model) {
  var count = model.todos.filter(
    function(i) { return i.done === false}
  ).length.toString();

  var left = (" item" + (model.todos.length > 1 ? 's' : '') + " left")
  //console.log('left: '+left)

  return (
    footer(["class=footer", "style=display: block;"], [
      span(["class=todo-count", "id=count"], [
        strong(count),
        text(left)
      ]),
      ul(["class=filters"], [
        li([], [
          a(["href=#/", "class=selected"], [text("All")])
        ]),
        li([], [
          a(["href=#/active"], [text("Active")])
        ]),
        li([], [
          a(["href=#/completed"], [text("Completed")])
        ])
      ]), // </ul>
      button(["class=clear-completed", "style=display:block;"],
        [text("Clear completed")]
      )
    ])
  )
}

/**
 * 'view' renders the entire Todo List App
 * which contains count of items to (still) to be done and a '<ul>' "menu"
 * with links to filter which todo items appear in the list view.
 * @param {Object} model - the App's (current) model (or "state").
 * @return {Object} <section> DOM Tree which containing all other DOM elements.
 * @example
 * // returns <section class= "todo-app"> DOM element with other DOM els nest:
 * var DOM = view(model); 
 */

function view(model) {
  return(
    section(["class=todo-app"],[
      header(["class=header"], [
        h1([], [
          text("todos")
        ]),
        input([
          "id=new-todo",
          "class=new-todo",
          "placeholder=What needs to be done?",
          "autofocus"
        ], [])
      ]),
      render_main(model),
      render_footer(model)
    ])
  );
}


  /* module.exports is needed to run the functions using Node.js for testing! */
  /* istanbul ignore next */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      model: initial_model,
      update: update,
      render_item: render_item,
      render_main: render_main,
      render_footer: render_footer,
      view: view
    }
  }