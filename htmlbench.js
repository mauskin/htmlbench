// HTML Elements factory.

// Tries to have similar interface to what browser has with DOM, but
// implements only a portion that is useful in server context.

// The only function that is being exported return an Element object.
// Converting it to string will return its HTML representation.

function empty() {
    return Object.create(null);
}

function populate(array, object = empty(), value = true) {
    array.forEach(function (name) {
        object[name] = value;
    });
    return object;
}

const void_elements = populate([
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
    "param", "source", "track", "wbr"
]);

// Turns an object holding attributes into an attributes string.

function stringify_atts(container) {
    if (Object.keys(container).length === 0) {
        return "";
    }
    return Object.keys(container).reduce(
        function (first, second) {
            first += ` ${second}="${container[second]}"`;
            return first;
        },
        ""
    );
}

// Turns an element into HTML string.

function stringify(element) {
    return function () {
        const attributes = stringify_atts(element.attributes);
        return `<${element.name}${attributes}>` + (
            void_elements[element.name]
            ? ""
            : `${element.children.join()}</${element.name}>`
        );
    };
}

// Normal HTML elements may contain ASCII alfanumerics and must not start with a
// digit.

const rg_element_name = /^[a-zA-Z][0-9a-zA-Z]/;

function create(name) {
    if (!(rg_element_name).test(name)) {
        throw new Error("Bad symbols in the name");
    }
    const element = empty();
    const attributes = {};
    const children = [];

    element.name = name.toLowerCase();
    element.attributes = attributes;
    element.children = children;

    element.valueOf = stringify(element);

    return Object.freeze(element);
}

export default Object.freeze(create);
