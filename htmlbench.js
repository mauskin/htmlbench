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

function stringify(node) {
    return function () {
        const attributes = stringify_atts(node.attributes);
        return `<${node.tagName}${attributes}>` + (
            void_elements[node.tagName]
            ? ""
            : `${node.children.join()}</${node.tagName}>`
        );
    };
}

// Element instance constructor.

function create(name) {
    const node = empty();
    const attributes = {};
    const children = [];

    node.tagName = name.toLowerCase();
    node.attributes = attributes;
    node.children = children;

    node.valueOf = stringify(node);

    return Object.freeze(node);
}

export default Object.freeze(create);
