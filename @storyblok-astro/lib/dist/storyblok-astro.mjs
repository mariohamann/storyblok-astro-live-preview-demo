function E(r, t, e) {
  const o = "virtual:storyblok-init", s = "\0" + o;
  return {
    name: "vite-plugin-storyblok-init",
    async resolveId(a) {
      if (a === o)
        return s;
    },
    async load(a) {
      if (a === s)
        return `
          import { storyblokInit, apiPlugin } from "@storyblok/js";
          const { storyblokApi } = storyblokInit({
            accessToken: "${r}",
            use: ${t ? "[]" : "[apiPlugin]"},
            apiOptions: ${JSON.stringify(e)},
          });
          export const storyblokApiInstance = storyblokApi;  
        `;
    }
  };
}
const T = /[\p{Lu}]/u, x = /[\p{Ll}]/u, k = /^[\p{Lu}](?![\p{Lu}])/gu, A = /([\p{Alpha}\p{N}_]|$)/u, b = /[_.\- ]+/, j = new RegExp("^" + b.source), $ = new RegExp(b.source + A.source, "gu"), v = new RegExp("\\d+" + A.source, "gu"), S = (r, t, e, o) => {
  let s = !1, a = !1, n = !1, c = !1;
  for (let l = 0; l < r.length; l++) {
    const i = r[l];
    c = l > 2 ? r[l - 3] === "-" : !0, s && T.test(i) ? (r = r.slice(0, l) + "-" + r.slice(l), s = !1, n = a, a = !0, l++) : a && n && x.test(i) && (!c || o) ? (r = r.slice(0, l - 1) + "-" + r.slice(l - 1), n = a, a = !1, s = !0) : (s = t(i) === i && e(i) !== i, n = a, a = e(i) === i && t(i) !== i);
  }
  return r;
}, R = (r, t) => (k.lastIndex = 0, r.replaceAll(k, (e) => t(e))), O = (r, t) => ($.lastIndex = 0, v.lastIndex = 0, r.replaceAll(v, (e, o, s) => ["_", "-"].includes(r.charAt(s + e.length)) ? e : t(e)).replaceAll($, (e, o) => t(o)));
function I(r, t) {
  if (!(typeof r == "string" || Array.isArray(r)))
    throw new TypeError("Expected the input to be `string | string[]`");
  if (t = {
    pascalCase: !1,
    preserveConsecutiveUppercase: !1,
    ...t
  }, Array.isArray(r) ? r = r.map((a) => a.trim()).filter((a) => a.length).join("-") : r = r.trim(), r.length === 0)
    return "";
  const e = t.locale === !1 ? (a) => a.toLowerCase() : (a) => a.toLocaleLowerCase(t.locale), o = t.locale === !1 ? (a) => a.toUpperCase() : (a) => a.toLocaleUpperCase(t.locale);
  return r.length === 1 ? b.test(r) ? "" : t.pascalCase ? o(r) : e(r) : (r !== e(r) && (r = S(r, e, o, t.preserveConsecutiveUppercase)), r = r.replace(j, ""), r = t.preserveConsecutiveUppercase ? R(r, e) : e(r), t.pascalCase && (r = o(r.charAt(0)) + r.slice(1)), O(r, o));
}
function N(r, t, e, o) {
  const s = "virtual:storyblok-components", a = "\0" + s;
  return {
    name: "vite-plugin-storyblok-components",
    async resolveId(n) {
      if (n === s)
        return a;
    },
    async load(n) {
      if (n === a) {
        const c = [], l = [];
        for await (const [g, f] of Object.entries(t)) {
          const d = await this.resolve(
            "/" + r + "/" + f + ".astro"
          );
          if (d)
            c.push(`import ${I(g)} from "${d.id}"`);
          else if (e)
            l.push(g);
          else
            throw new Error(
              `Component could not be found for blok "${g}"! Does "${"/" + r + "/" + f}.astro" exist?`
            );
        }
        let i = "";
        if (e)
          if (i = ",FallbackComponent", o) {
            const g = await this.resolve(
              "/" + r + "/" + o + ".astro"
            );
            if (!g)
              throw new Error(
                `Custom fallback component could not be found. Does "${"/" + r + "/" + o}.astro" exist?`
              );
            c.push(
              `import FallbackComponent from "${g.id}"`
            );
          } else
            c.push(
              "import FallbackComponent from '@storyblok/astro/FallbackComponent.astro'"
            );
        if (Object.values(t).length)
          return `${c.join(";")};export default {${Object.keys(t).filter((g) => !l.includes(g)).map((g) => I(g)).join(",")}${i}}`;
        if (e)
          return `${c[0]}; export default {${i.replace(",", "")}}`;
        throw new Error(
          `Currently, no Storyblok components are registered in astro.config.mjs.
Please register your components or enable the fallback component.
Detailed information can be found here: https://github.com/storyblok/storyblok-astro`
        );
      }
    }
  };
}
function L(r) {
  const t = "virtual:storyblok-options", e = "\0" + t;
  return {
    name: "vite-plugin-storyblok-options",
    async resolveId(o) {
      if (o === t)
        return e;
    },
    async load(o) {
      if (o === e)
        return `export default ${JSON.stringify(r)}`;
    }
  };
}
let w = !1;
const C = [], M = (r) => new Promise((t, e) => {
  if (typeof window > "u" || (window.storyblokRegisterEvent = (s) => {
    if (window.location === window.parent.location) {
      console.warn("You are not in Draft Mode or in the Visual Editor.");
      return;
    }
    w ? s() : C.push(s);
  }, document.getElementById("storyblok-javascript-bridge")))
    return;
  const o = document.createElement("script");
  o.async = !0, o.src = r, o.id = "storyblok-javascript-bridge", o.onerror = (s) => e(s), o.onload = (s) => {
    C.forEach((a) => a()), w = !0, t(s);
  }, document.getElementsByTagName("head")[0].appendChild(o);
});
var P = Object.defineProperty, _ = (r, t, e) => t in r ? P(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, p = (r, t, e) => (_(r, typeof t != "symbol" ? t + "" : t, e), e);
class z {
  constructor() {
    p(this, "isCDNUrl", (t = "") => t.indexOf("/cdn/") > -1), p(this, "getOptionsPage", (t, e = 25, o = 1) => ({
      ...t,
      per_page: e,
      page: o
    })), p(this, "delay", (t) => new Promise((e) => setTimeout(e, t))), p(this, "arrayFrom", (t = 0, e) => [...Array(t)].map(e)), p(this, "range", (t = 0, e = t) => {
      const o = Math.abs(e - t) || 0, s = t < e ? 1 : -1;
      return this.arrayFrom(o, (a, n) => n * s + t);
    }), p(this, "asyncMap", async (t, e) => Promise.all(t.map(e))), p(this, "flatMap", (t = [], e) => t.map(e).reduce((o, s) => [...o, ...s], [])), p(this, "escapeHTML", function(t) {
      const e = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }, o = /[&<>"']/g, s = RegExp(o.source);
      return t && s.test(t) ? t.replace(o, (a) => e[a]) : t;
    });
  }
  /**
   * @method stringify
   * @param  {Object} params
   * @param  {String} prefix
   * @param  {Boolean} isArray
   * @return {String} Stringified object
   */
  stringify(t, e, o) {
    const s = [];
    for (const a in t) {
      if (!Object.prototype.hasOwnProperty.call(t, a))
        continue;
      const n = t[a], c = o ? "" : encodeURIComponent(a);
      let l;
      typeof n == "object" ? l = this.stringify(
        n,
        e ? e + encodeURIComponent("[" + c + "]") : c,
        Array.isArray(n)
      ) : l = (e ? e + encodeURIComponent("[" + c + "]") : c) + "=" + encodeURIComponent(n), s.push(l);
    }
    return s.join("&");
  }
  /**
   * @method getRegionURL
   * @param  {String} regionCode region code, could be eu, us or cn
   * @return {String} The base URL of the region
   */
  getRegionURL(t) {
    const e = "api.storyblok.com", o = "api-us.storyblok.com", s = "app.storyblokchina.cn";
    switch (t) {
      case "us":
        return o;
      case "cn":
        return s;
      default:
        return e;
    }
  }
}
const U = function(r, t) {
  const e = {};
  for (const o in r) {
    const s = r[o];
    t.indexOf(o) > -1 && s !== null && (e[o] = s);
  }
  return e;
}, D = (r) => r === "email", B = () => ({
  singleTag: "hr"
}), q = () => ({
  tag: "blockquote"
}), F = () => ({
  tag: "ul"
}), J = (r) => ({
  tag: [
    "pre",
    {
      tag: "code",
      attrs: r.attrs
    }
  ]
}), K = () => ({
  singleTag: "br"
}), V = (r) => ({
  tag: `h${r.attrs.level}`
}), H = (r) => ({
  singleTag: [
    {
      tag: "img",
      attrs: U(r.attrs, ["src", "alt", "title"])
    }
  ]
}), G = () => ({
  tag: "li"
}), W = () => ({
  tag: "ol"
}), Y = () => ({
  tag: "p"
}), Q = (r) => ({
  tag: [
    {
      tag: "span",
      attrs: {
        "data-type": "emoji",
        "data-name": r.attrs.name,
        emoji: r.attrs.emoji
      }
    }
  ]
}), X = () => ({
  tag: "b"
}), Z = () => ({
  tag: "strike"
}), ee = () => ({
  tag: "u"
}), te = () => ({
  tag: "strong"
}), re = () => ({
  tag: "code"
}), oe = () => ({
  tag: "i"
}), se = (r) => {
  const t = new z().escapeHTML, e = { ...r.attrs }, { linktype: o = "url" } = r.attrs;
  if (e.href && (e.href = t(r.attrs.href || "")), D(o) && (e.href = `mailto:${e.href}`), e.anchor && (e.href = `${e.href}#${e.anchor}`, delete e.anchor), e.custom) {
    for (const s in e.custom)
      e[s] = e.custom[s];
    delete e.custom;
  }
  return {
    tag: [
      {
        tag: "a",
        attrs: e
      }
    ]
  };
}, ae = (r) => ({
  tag: [
    {
      tag: "span",
      attrs: r.attrs
    }
  ]
}), ne = () => ({
  tag: "sub"
}), le = () => ({
  tag: "sup"
}), ie = (r) => ({
  tag: [
    {
      tag: "span",
      attrs: r.attrs
    }
  ]
}), ce = (r) => {
  var t;
  return (t = r.attrs) != null && t.color ? {
    tag: [
      {
        tag: "span",
        attrs: {
          style: `background-color:${r.attrs.color};`
        }
      }
    ]
  } : {
    tag: ""
  };
}, ge = (r) => {
  var t;
  return (t = r.attrs) != null && t.color ? {
    tag: [
      {
        tag: "span",
        attrs: {
          style: `color:${r.attrs.color}`
        }
      }
    ]
  } : {
    tag: ""
  };
}, ue = {
  nodes: {
    horizontal_rule: B,
    blockquote: q,
    bullet_list: F,
    code_block: J,
    hard_break: K,
    heading: V,
    image: H,
    list_item: G,
    ordered_list: W,
    paragraph: Y,
    emoji: Q
  },
  marks: {
    bold: X,
    strike: Z,
    underline: ee,
    strong: te,
    code: re,
    italic: oe,
    link: se,
    styled: ae,
    subscript: ne,
    superscript: le,
    anchor: ie,
    highlight: ce,
    textStyle: ge
  }
}, pe = function(r) {
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, e = /[&<>"']/g, o = RegExp(e.source);
  return r && o.test(r) ? r.replace(e, (s) => t[s]) : r;
};
class fe {
  constructor(t) {
    p(this, "marks"), p(this, "nodes"), t || (t = ue), this.marks = t.marks || [], this.nodes = t.nodes || [];
  }
  addNode(t, e) {
    this.nodes[t] = e;
  }
  addMark(t, e) {
    this.marks[t] = e;
  }
  render(t, e = { optimizeImages: !1 }) {
    if (t && t.content && Array.isArray(t.content)) {
      let o = "";
      return t.content.forEach((s) => {
        o += this.renderNode(s);
      }), e.optimizeImages ? this.optimizeImages(o, e.optimizeImages) : o;
    }
    return console.warn(
      `The render method must receive an Object with a "content" field.
			The "content" field must be an array of nodes as the type ISbRichtext.
			ISbRichtext:
				content?: ISbRichtext[]
				marks?: ISbRichtext[]
				attrs?: any
				text?: string
				type: string
				
				Example:
				{
					content: [
						{
							content: [
								{
									text: 'Hello World',
									type: 'text'
								}
							],
							type: 'paragraph'
						}
					],
					type: 'doc'
				}`
    ), "";
  }
  optimizeImages(t, e) {
    let o = 0, s = 0, a = "", n = "";
    typeof e != "boolean" && (typeof e.width == "number" && e.width > 0 && (a += `width="${e.width}" `, o = e.width), typeof e.height == "number" && e.height > 0 && (a += `height="${e.height}" `, s = e.height), (e.loading === "lazy" || e.loading === "eager") && (a += `loading="${e.loading}" `), typeof e.class == "string" && e.class.length > 0 && (a += `class="${e.class}" `), e.filters && (typeof e.filters.blur == "number" && e.filters.blur >= 0 && e.filters.blur <= 100 && (n += `:blur(${e.filters.blur})`), typeof e.filters.brightness == "number" && e.filters.brightness >= -100 && e.filters.brightness <= 100 && (n += `:brightness(${e.filters.brightness})`), e.filters.fill && (e.filters.fill.match(/[0-9A-Fa-f]{6}/g) || e.filters.fill === "transparent") && (n += `:fill(${e.filters.fill})`), e.filters.format && ["webp", "png", "jpeg"].includes(e.filters.format) && (n += `:format(${e.filters.format})`), typeof e.filters.grayscale == "boolean" && e.filters.grayscale && (n += ":grayscale()"), typeof e.filters.quality == "number" && e.filters.quality >= 0 && e.filters.quality <= 100 && (n += `:quality(${e.filters.quality})`), e.filters.rotate && [90, 180, 270].includes(e.filters.rotate) && (n += `:rotate(${e.filters.rotate})`), n.length > 0 && (n = "/filters" + n))), a.length > 0 && (t = t.replace(/<img/g, `<img ${a.trim()}`));
    const c = o > 0 || s > 0 || n.length > 0 ? `${o}x${s}${n}` : "";
    return t = t.replace(
      /a.storyblok.com\/f\/(\d+)\/([^.]+)\.(gif|jpg|jpeg|png|tif|tiff|bmp)/g,
      `a.storyblok.com/f/$1/$2.$3/m/${c}`
    ), typeof e != "boolean" && (e.sizes || e.srcset) && (t = t.replace(/<img.*?src=["|'](.*?)["|']/g, (l) => {
      var i, g;
      const f = l.match(
        /a.storyblok.com\/f\/(\d+)\/([^.]+)\.(gif|jpg|jpeg|png|tif|tiff|bmp)/g
      );
      if (f && f.length > 0) {
        const d = {
          srcset: (i = e.srcset) == null ? void 0 : i.map((u) => {
            if (typeof u == "number")
              return `//${f}/m/${u}x0${n} ${u}w`;
            if (typeof u == "object" && u.length === 2) {
              let m = 0, y = 0;
              return typeof u[0] == "number" && (m = u[0]), typeof u[1] == "number" && (y = u[1]), `//${f}/m/${m}x${y}${n} ${m}w`;
            }
          }).join(", "),
          sizes: (g = e.sizes) == null ? void 0 : g.map((u) => u).join(", ")
        };
        let h = "";
        return d.srcset && (h += `srcset="${d.srcset}" `), d.sizes && (h += `sizes="${d.sizes}" `), l.replace(/<img/g, `<img ${h.trim()}`);
      }
      return l;
    })), t;
  }
  renderNode(t) {
    const e = [];
    t.marks && t.marks.forEach((s) => {
      const a = this.getMatchingMark(s);
      a && a.tag !== "" && e.push(this.renderOpeningTag(a.tag));
    });
    const o = this.getMatchingNode(t);
    return o && o.tag && e.push(this.renderOpeningTag(o.tag)), t.content ? t.content.forEach((s) => {
      e.push(this.renderNode(s));
    }) : t.text ? e.push(pe(t.text)) : o && o.singleTag ? e.push(this.renderTag(o.singleTag, " /")) : o && o.html ? e.push(o.html) : t.type === "emoji" && e.push(this.renderEmoji(t)), o && o.tag && e.push(this.renderClosingTag(o.tag)), t.marks && t.marks.slice(0).reverse().forEach((s) => {
      const a = this.getMatchingMark(s);
      a && a.tag !== "" && e.push(this.renderClosingTag(a.tag));
    }), e.join("");
  }
  renderTag(t, e) {
    return t.constructor === String ? `<${t}${e}>` : t.map((o) => {
      if (o.constructor === String)
        return `<${o}${e}>`;
      {
        let s = `<${o.tag}`;
        if (o.attrs)
          for (const a in o.attrs) {
            const n = o.attrs[a];
            n !== null && (s += ` ${a}="${n}"`);
          }
        return `${s}${e}>`;
      }
    }).join("");
  }
  renderOpeningTag(t) {
    return this.renderTag(t, "");
  }
  renderClosingTag(t) {
    return t.constructor === String ? `</${t}>` : t.slice(0).reverse().map((e) => e.constructor === String ? `</${e}>` : `</${e.tag}>`).join("");
  }
  getMatchingNode(t) {
    const e = this.nodes[t.type];
    if (typeof e == "function")
      return e(t);
  }
  getMatchingMark(t) {
    const e = this.marks[t.type];
    if (typeof e == "function")
      return e(t);
  }
  renderEmoji(t) {
    if (t.attrs.emoji)
      return t.attrs.emoji;
    const e = [
      {
        tag: "img",
        attrs: {
          src: t.attrs.fallbackImage,
          draggable: "false",
          loading: "lazy",
          align: "absmiddle"
        }
      }
    ];
    return this.renderTag(e, " /");
  }
}
const ke = (r) => {
  if (typeof r != "object" || typeof r._editable > "u")
    return {};
  const t = JSON.parse(
    r._editable.replace(/^<!--#storyblok#/, "").replace(/-->$/, "")
  );
  return t ? {
    "data-blok-c": JSON.stringify(t),
    "data-blok-uid": t.id + "-" + t.uid
  } : {};
};
let de, he = "https://app.storyblok.com/f/storyblok-v2-latest.js";
const me = (r, t) => {
  r.addNode("blok", (e) => {
    let o = "";
    return e.attrs.body.forEach((s) => {
      o += t(s.component, s);
    }), {
      html: o
    };
  });
}, be = (r) => !r || !(r != null && r.content.some((t) => t.content || t.type === "blok" || t.type === "horizontal_rule")), ye = (r, t, e) => {
  let o = e || de;
  if (!o) {
    console.error(
      "Please initialize the Storyblok SDK before calling the renderRichText function"
    );
    return;
  }
  return be(r) ? "" : (t && (o = new fe(t.schema), t.resolver && me(o, t.resolver)), o.render(r));
}, $e = () => M(he);
function ve() {
  return globalThis.storyblokApiInstance || console.error("storyblokApiInstance has not been initialized correctly"), globalThis.storyblokApiInstance;
}
function Ie(r, t) {
  const e = globalThis.storyblokApiInstance.richTextResolver;
  if (!e) {
    console.error(
      "Please initialize the Storyblok SDK before calling the renderRichText function"
    );
    return;
  }
  return ye(r, t, e);
}
function we(r) {
  const t = {
    useCustomApi: !1,
    bridge: !0,
    componentsDir: "src",
    enableFallbackComponent: !1,
    ...r
  };
  return {
    name: "@storyblok/astro",
    hooks: {
      "astro:config:setup": ({ injectScript: e, updateConfig: o }) => {
        if (o({
          vite: {
            plugins: [
              E(
                t.accessToken,
                t.useCustomApi,
                t.apiOptions
              ),
              N(
                t.componentsDir,
                t.components,
                t.enableFallbackComponent,
                t.customFallbackComponent
              ),
              L(t)
            ]
          }
        }), e(
          "page-ssr",
          `
          import { storyblokApiInstance } from "virtual:storyblok-init";
          globalThis.storyblokApiInstance = storyblokApiInstance;
          `
        ), t.bridge) {
          let s = "";
          if (typeof t.bridge == "object") {
            const a = { ...t.bridge };
            s = `const storyblokInstance = new StoryblokBridge(${JSON.stringify(
              a
            )});`;
          } else
            s = "const storyblokInstance = new StoryblokBridge()";
          e(
            "page",
            `/*
              import { loadStoryblokBridge } from "@storyblok/astro";
              loadStoryblokBridge().then(() => {
                const { StoryblokBridge, location } = window;
                ${s}

                storyblokInstance.on(["published", "change"], (event) => {
                  if (!event.slugChanged) {
                    location.reload(true);
                  } 
                });
              });
            */`
          );
        }
      }
    }
  };
}
export {
  fe as RichTextResolver,
  ue as RichTextSchema,
  we as default,
  $e as loadStoryblokBridge,
  Ie as renderRichText,
  ke as storyblokEditable,
  ve as useStoryblokApi
};
