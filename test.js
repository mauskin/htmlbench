import JSCheck from "./jscheck.js";
import createElement from "./htmlbench.js";

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


const jsc = JSCheck();

jsc.claim(
	"element name",
	function (verdict, value) {
		const rg_start_tag = /^<[a-z0-9]+>/;
		const rg_end_tag = /<\/[a-z0-9]+>$/;

		const result = String(createElement(value));

		return verdict(
			rg_start_tag.test(result) && 
			(
				void_elements[value.toLowerCase()] !== undefined ||
				rg_end_tag.test(result)
			)
		);
	},
	jsc.string(
		jsc.integer(1, 8),
		jsc.wun_of([
			jsc.character("a", "z"),
			jsc.character("A", "Z"),
			jsc.character("0", "9")
		])
	)
);

jsc.check({
	nr_trials: 100000,
	on_report: console.log
});
