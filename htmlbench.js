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

// TODO(kirill): Check again if the list is full.
const normal_elements = populate([
    "a", "abbr", "address", "article", "aside", "audio", "b", "bdi", "bdo",
    "blockquote", "body", "button", "canvas", "caption", "cite", "code",
    "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog",
    "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer",
    "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup",
    "html", "i", "iframe", "ins", "kbd", "label", "legend", "li", "main", "map",
    "mark", "menu", "meter", "nav", "noscript", "object", "ol", "optgroup",
    "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt",
    "ruby", "s", "samp", "script", "section", "select", "slot", "small", "span",
    "strong", "style", "summary", "table", "tbody", "td", "template",
    "textarea", "tfoot", "th", "thead", "time", "title", "tr", "u", "ul", "var",
    "video"
]);

const void_elements = populate([
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
    "param", "source", "track", "wbr"
]);

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
            if (typeof child === "object") {
                return child;
            }

            let result = String(child);
            result = result.replaceAll(greater_than, "&gt;")
            result = result.replaceAll(less_than, "&lt;")
            return result;
        });

        return (
            start_tag +
            escaped.join() +
            less_than + slash + element.name + greater_than
        );
    };
}

export default Object.freeze(function create(
    proposed_name
) {
    const name = proposed_name.toLowerCase();
    if (
        normal_elements[name] === undefined &&
        void_elements[name] === undefined
    ) {
        throw "Bad name.";
    }

    const element = {
        name,
        attributes: empty()
    };

    Object.defineProperty(
        element,
        "toString",
        {
            value: stringify(element),
            enumerable: false,
            configurable: false,
            writable: false
        }
    );

    if (void_elements[name] === undefined) {
        element.children = [];
    }

    return Object.freeze(element);
});
