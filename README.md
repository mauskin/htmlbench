# htmlbench

Generate HTML using common interface when there’s no browser around. If you have
a browser probably you’re better off with DOM.

Add htmlbench module to you source and use the only function it exports to
create objects for HTML elements.

    import create_element from "./htmlbench.js";
    const meta_description = create_element("meta");

Use `attributes` property to set element’s attributes. It is just an object and
all the usual tools to manipulate an object in JavaScript do apply. Assign it
directly.

    meta_description.attributes.name = "description";
    meta_description.attributes.content = "html-bench generates HTML elements.";

Or copy it from another object.

    Object.assign(
        meta_description.attributes,
        {
            name: "description",
            content: "html-bench generates HTML elements."
        }
    );

The element’s object is frozen. You cannot assign whatever to attributes
property. Other than that all valid names will be attached to the element.

Manipulating children is as easy as manipulating an array. Frankly it is exactly
that.

    const a_list = [
        "define what you want",
        "glance over the steps",
        "start walking"
    ];
    const list = create_element("ol");
    list.children.concat(list.map(function (text) {
        const list_item = create_element("li");
        list_item.children.push(text);
        return list_item;
    });

Remember that HTML void elements couldn’t have children hence they lack the
property.

By that point it is clear that htmlbench elements lack any invented interface.
Instead they rely on existing JavaScript objects. It would be fitting to not have
a defined method to turn them to a string.

    return String(meta_description); // <meta name="description" content="html-bench generates HTML elements.">
