# html-bench

Generate HTML using common interface when there’s no browser around. If you have
a browser probably you’re better off with DOM.

Add html-bench module to you source and use the only function it exports to
create HTML elements objects.

    import create_element from "./htmlbench.js";
    const meta_description = create_element("meta");

Use attributes property to set element’s properties. It’s just an objects and
all the usual tools to manipulate an object in JavaScript apply.

    meta_description.attributes.name = "description";
    meta_description.attributes.content = "html-bench generates HTML elements.";

If there’s already data in another object just copy it.

    Object.assign(
        meta_description.attributes,
        {
            name: "description",
            content: "html-bench generates HTML elements."
        }
    );

The element’s object is frozen. You cannot assign whatever to attributes
property. Other than that all valid names will be assigned to the element.

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

By that point it is clear that html-bench elements lack any invented interface.
Instead they lazily rely on existing JavaScript objects. It would be fitting
then to not have define a method to turn them to a string.

    return String(meta_description); // <meta name="description" content="html-bench generates HTML elements.">