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

// Turns object holding attributes into a string of attributes.

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
            element.children !== undefined
            ? `${element.children.join()}</${element.name}>`
            : ""
        );
    };
}

// Normal HTML elements may contain ASCII alfanumerics and must not start with a
// digit.

const rg_element_name = /^[a-zA-Z][0-9a-zA-Z]/;

const rg_custom_element_name = /^[a-z][\-.0-9_a-z\u{B7}\u{C0}-\u{D6}\u{D8}-\u{F6}\u{F8}-\u{37D}\u{37F}-\u{1FFF}\u{200C}-\u{200D}\u{203F}-\u{2040}\u{2070}-\u{218F}\u{2C00}-\u{2FEF}\u{3001}-\u{D7FF}\u{F900}-\u{FDCF}\u{FDF0}-\u{FFFD}\u{10000}-\u{EFFFF}]*$/u;

const reserved_names = populate([
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-src",
    "font-face-uri",
    "font-face-format",
    "font-face-name",
    "missing-glyph"
]);

function create(value) {
    const name = value.toLowerCase();
    if (
        reserved_names[name] !== undefined ||
        !(rg_element_name).test(name) ||
        !(rg_custom_element_name).test(name)
    ) {
        throw new Error("Bad name");
    }

    const element = empty();

    element.name = name;
    element.attributes = empty();

    if (void_elements[name] === undefined) {
        element.children = [];
    }

    element.valueOf = stringify(element);

    return Object.freeze(element);
}

export default Object.freeze(create);
