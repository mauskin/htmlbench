// htmlbench — HTML elements factory.

// Exports a function that given an element name produces an object that when
// being converted to string turn to valid HTML.

// The object returned by the factory one or two properties.

// Attributes property is an object whose keys are mapped to attribute names
// values to values, such that “{name: "content"}” turns into “name="content"”.

// Where applicable htmlbench object might have a children property. It is an
// array whose elements are converted to strings, such that
// “[humanSoundingGreeting, ", human!"]” turns into “<span>Ahoy</span>, human!”.

// htmlbench will try its best to produce valid HTML but there’s only that much
// it could do. It won’t allow void elements to have children. Invalid names
// will throw “Bad name.” string. Invalid attribute names will be skipped.
// Children are converted to strings therefore be sure that objects that are
// included define their own _valueOf_ method.

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

const lower_alfa = "a-z";
const upper_alfa = "A-Z";
const digit = "0-9";
const alfa = lower_alfa + upper_alfa;
const alfanumeric = alfa + digit;

const space = "\u{0020}";
const double_quote = "\u{0022}";
const single_quote = "\u{0027}";
const quotes = double_quote + single_quote;
const greater_than = "\u{003E}";
const less_than = "\u{003C}";
const slash = "\u{002F}";
const equals = "\u{003D}";
const control = "\u{0000}-\u{001F}\u{007F}-\u{009F}";
const noncharacter = [
    "\u{FDD0}-\u{FDEF}", "\u{FFFE}", "\u{FFFF}", "\u{1FFFE}", "\u{1FFFF}",
    "\u{2FFFE}", "\u{2FFFF}", "\u{3FFFE}", "\u{3FFFF}", "\u{4FFFE}",
    "\u{4FFFF}", "\u{5FFFE}", "\u{5FFFF}", "\u{6FFFE}", "\u{6FFFF}",
    "\u{7FFFE}", "\u{7FFFF}", "\u{8FFFE}", "\u{8FFFF}", "\u{9FFFE}",
    "\u{9FFFF}", "\u{AFFFE}", "\u{AFFFF}", "\u{BFFFE}", "\u{BFFFF}",
    "\u{CFFFE}", "\u{CFFFF}", "\u{DFFFE}", "\u{DFFFF}", "\u{EFFFE}",
    "\u{EFFFF}", "\u{FFFFE}", "\u{FFFFF}"
].join();

const rg_element_name = new RegExp(`^[${alfa}][${alfanumeric}]*$`, "u");

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

const rg_attribute_name_donts = new RegExp(
    (
        "[" + control + space + quotes + greater_than + slash + equals +
        noncharacter + "]"
    ),
    "u"
);

// Turns object holding attributes into a string of attributes.

function stringify_atts(container) {
    if (Object.keys(container).length === 0) {
        return "";
    }
    return Object.keys(container).filter(function (name) {
        return !rg_attribute_name_donts.test(name);
    }).reduce(
        function (first, second) {
            first += ` ${second}="${container[second]}"`;
            return first;
        },
        ""
    );
}

// Turns an element object into HTML string.

function stringify(element) {
    return function () {
        const start_tag = (
            less_than +
            element.name +
            stringify_atts(element.attributes) +
            greater_than
        );
        if (element.children === undefined) {
            return start_tag;
        }

        const escaped = element.children.map(function (child) {
            return (
                typeof child === "object"
                ? child
                : String(child).replaceAll(greater_than, "&gt;")
            );
        });

        return (
            start_tag +
            escaped.join() +
            "</" + element.name + ">"
        );
    };
}

// Normal HTML elements may contain ASCII alfanumerics and must not start with a
// digit.

export default Object.freeze(function create(
    proposed_name
) {
    const name = proposed_name.toLowerCase();
    if (
        reserved_names[name] !== undefined ||
        !(rg_element_name).test(name) ||
        !(rg_custom_element_name).test(name)
    ) {
        throw "Bad name.";
    }

    const element = empty();

    element.name = name;
    element.attributes = empty();

    if (void_elements[name] === undefined) {
        element.children = [];
    }

    element.valueOf = stringify(element);

    return Object.freeze(element);
});
