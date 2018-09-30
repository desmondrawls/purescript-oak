(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],2:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":5}],3:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":38}],4:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":4}],6:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],7:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":12}],8:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":35}],9:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":20}],10:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":15}],11:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":26,"is-object":6}],12:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":24,"../vnode/is-vnode.js":27,"../vnode/is-vtext.js":28,"../vnode/is-widget.js":29,"./apply-properties":11,"global/document":3}],13:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],14:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":29,"../vnode/vpatch.js":32,"./apply-properties":11,"./update-widget":16}],15:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":12,"./dom-index":13,"./patch-op":14,"global/document":3,"x-is-array":36}],16:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":29}],17:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],18:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":2}],19:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],20:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":25,"../vnode/is-vhook":26,"../vnode/is-vnode":27,"../vnode/is-vtext":28,"../vnode/is-widget":29,"../vnode/vnode.js":31,"../vnode/vtext.js":33,"./hooks/ev-hook.js":18,"./hooks/soft-set-hook.js":19,"./parse-tag.js":21,"x-is-array":36}],21:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":1}],22:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],23:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":17,"./index.js":20,"./svg-attribute-namespace":22,"x-is-array":36}],24:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":25,"./is-vnode":27,"./is-vtext":28,"./is-widget":29}],25:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],26:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],27:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":30}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":30}],29:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],30:[function(require,module,exports){
module.exports = "2"

},{}],31:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":25,"./is-vhook":26,"./is-vnode":27,"./is-widget":29,"./version":30}],32:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":30}],33:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":30}],34:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":26,"is-object":6}],35:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":24,"../vnode/is-thunk":25,"../vnode/is-vnode":27,"../vnode/is-vtext":28,"../vnode/is-widget":29,"../vnode/vpatch":32,"./diff-props":34,"x-is-array":36}],36:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],37:[function(require,module,exports){
// Generated by purs bundle 0.11.7
var PS = {};
(function(exports) {
    "use strict";

  exports.arrayApply = function (fs) {
    return function (xs) {
      var l = fs.length;
      var k = xs.length;
      var result = new Array(l*k);
      var n = 0;
      for (var i = 0; i < l; i++) {
        var f = fs[i];
        for (var j = 0; j < k; j++) {
          result[n++] = f(xs[j]);
        }
      }
      return result;
    };
  };
})(PS["Control.Apply"] = PS["Control.Apply"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Semigroupoid = function (compose) {
      this.compose = compose;
  };
  var semigroupoidFn = new Semigroupoid(function (f) {
      return function (g) {
          return function (x) {
              return f(g(x));
          };
      };
  });
  var compose = function (dict) {
      return dict.compose;
  };
  exports["compose"] = compose;
  exports["Semigroupoid"] = Semigroupoid;
  exports["semigroupoidFn"] = semigroupoidFn;
})(PS["Control.Semigroupoid"] = PS["Control.Semigroupoid"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var Category = function (Semigroupoid0, id) {
      this.Semigroupoid0 = Semigroupoid0;
      this.id = id;
  };
  var id = function (dict) {
      return dict.id;
  };
  var categoryFn = new Category(function () {
      return Control_Semigroupoid.semigroupoidFn;
  }, function (x) {
      return x;
  });
  exports["Category"] = Category;
  exports["id"] = id;
  exports["categoryFn"] = categoryFn;
})(PS["Control.Category"] = PS["Control.Category"] || {});
(function(exports) {
    "use strict";

  exports.arrayMap = function (f) {
    return function (arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
    "use strict";

  exports.unit = {};
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function(exports) {
    "use strict";

  exports.showIntImpl = function (n) {
    return n.toString();
  };
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Show"];     
  var Show = function (show) {
      this.show = show;
  };                                                 
  var showInt = new Show($foreign.showIntImpl);
  var show = function (dict) {
      return dict.show;
  };
  exports["Show"] = Show;
  exports["show"] = show;
  exports["showInt"] = showInt;
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Unit"];
  var Data_Show = PS["Data.Show"];
  exports["unit"] = $foreign.unit;
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];        
  var Functor = function (map) {
      this.map = map;
  };
  var map = function (dict) {
      return dict.map;
  };                                                                                             
  var functorArray = new Functor($foreign.arrayMap);
  exports["Functor"] = Functor;
  exports["map"] = map;
  exports["functorArray"] = functorArray;
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];        
  var Apply = function (Functor0, apply) {
      this.Functor0 = Functor0;
      this.apply = apply;
  }; 
  var applyArray = new Apply(function () {
      return Data_Functor.functorArray;
  }, $foreign.arrayApply);
  var apply = function (dict) {
      return dict.apply;
  };
  exports["Apply"] = Apply;
  exports["apply"] = apply;
  exports["applyArray"] = applyArray;
})(PS["Control.Apply"] = PS["Control.Apply"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Applicative = function (Apply0, pure) {
      this.Apply0 = Apply0;
      this.pure = pure;
  };
  var pure = function (dict) {
      return dict.pure;
  };
  var liftA1 = function (dictApplicative) {
      return function (f) {
          return function (a) {
              return Control_Apply.apply(dictApplicative.Apply0())(pure(dictApplicative)(f))(a);
          };
      };
  }; 
  var applicativeArray = new Applicative(function () {
      return Control_Apply.applyArray;
  }, function (x) {
      return [ x ];
  });
  exports["Applicative"] = Applicative;
  exports["pure"] = pure;
  exports["liftA1"] = liftA1;
  exports["applicativeArray"] = applicativeArray;
})(PS["Control.Applicative"] = PS["Control.Applicative"] || {});
(function(exports) {
    "use strict";

  exports.arrayBind = function (arr) {
    return function (f) {
      var result = [];
      for (var i = 0, l = arr.length; i < l; i++) {
        Array.prototype.push.apply(result, f(arr[i]));
      }
      return result;
    };
  };
})(PS["Control.Bind"] = PS["Control.Bind"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Bind = function (Apply0, bind) {
      this.Apply0 = Apply0;
      this.bind = bind;
  }; 
  var bindArray = new Bind(function () {
      return Control_Apply.applyArray;
  }, $foreign.arrayBind);
  var bind = function (dict) {
      return dict.bind;
  };
  exports["Bind"] = Bind;
  exports["bind"] = bind;
  exports["bindArray"] = bindArray;
})(PS["Control.Bind"] = PS["Control.Bind"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Monad = function (Applicative0, Bind1) {
      this.Applicative0 = Applicative0;
      this.Bind1 = Bind1;
  };
  var ap = function (dictMonad) {
      return function (f) {
          return function (a) {
              return Control_Bind.bind(dictMonad.Bind1())(f)(function (v) {
                  return Control_Bind.bind(dictMonad.Bind1())(a)(function (v1) {
                      return Control_Applicative.pure(dictMonad.Applicative0())(v(v1));
                  });
              });
          };
      };
  };
  exports["Monad"] = Monad;
  exports["ap"] = ap;
})(PS["Control.Monad"] = PS["Control.Monad"] || {});
(function(exports) {
    "use strict";

  exports.pureE = function (a) {
    return function () {
      return a;
    };
  };

  exports.bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var otherwise = true;
  exports["otherwise"] = otherwise;
})(PS["Data.Boolean"] = PS["Data.Boolean"] || {});
(function(exports) {
    "use strict";

  exports.refEq = function (r1) {
    return function (r2) {
      return r1 === r2;
    };
  };
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Eq"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Eq = function (eq) {
      this.eq = eq;
  };                                    
  var eqInt = new Eq($foreign.refEq);
  var eq = function (dict) {
      return dict.eq;
  };
  exports["Eq"] = Eq;
  exports["eq"] = eq;
  exports["eqInt"] = eqInt;
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
(function(exports) {
    "use strict";

  exports.unsafeCompareImpl = function (lt) {
    return function (eq) {
      return function (gt) {
        return function (x) {
          return function (y) {
            return x < y ? lt : x === y ? eq : gt;
          };
        };
      };
    };
  };
})(PS["Data.Ord.Unsafe"] = PS["Data.Ord.Unsafe"] || {});
(function(exports) {
    "use strict";

  exports.concatString = function (s1) {
    return function (s2) {
      return s1 + s2;
    };
  };
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Semigroup = function (append) {
      this.append = append;
  }; 
  var semigroupString = new Semigroup($foreign.concatString);
  var append = function (dict) {
      return dict.append;
  };
  exports["Semigroup"] = Semigroup;
  exports["append"] = append;
  exports["semigroupString"] = semigroupString;
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Eq = PS["Data.Eq"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];        
  var LT = (function () {
      function LT() {

      };
      LT.value = new LT();
      return LT;
  })();
  var GT = (function () {
      function GT() {

      };
      GT.value = new GT();
      return GT;
  })();
  var EQ = (function () {
      function EQ() {

      };
      EQ.value = new EQ();
      return EQ;
  })();
  exports["LT"] = LT;
  exports["GT"] = GT;
  exports["EQ"] = EQ;
})(PS["Data.Ordering"] = PS["Data.Ordering"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Ord.Unsafe"];
  var Data_Ordering = PS["Data.Ordering"];        
  var unsafeCompare = $foreign.unsafeCompareImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value);
  exports["unsafeCompare"] = unsafeCompare;
})(PS["Data.Ord.Unsafe"] = PS["Data.Ord.Unsafe"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Ord"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Ord_Unsafe = PS["Data.Ord.Unsafe"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Ord = function (Eq0, compare) {
      this.Eq0 = Eq0;
      this.compare = compare;
  };                                
  var ordInt = new Ord(function () {
      return Data_Eq.eqInt;
  }, Data_Ord_Unsafe.unsafeCompare);
  var compare = function (dict) {
      return dict.compare;
  };
  exports["Ord"] = Ord;
  exports["compare"] = compare;
  exports["ordInt"] = ordInt;
})(PS["Data.Ord"] = PS["Data.Ord"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Function = PS["Data.Function"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Monoid = function (Semigroup0, mempty) {
      this.Semigroup0 = Semigroup0;
      this.mempty = mempty;
  };                 
  var monoidString = new Monoid(function () {
      return Data_Semigroup.semigroupString;
  }, "");  
  var mempty = function (dict) {
      return dict.mempty;
  };
  exports["Monoid"] = Monoid;
  exports["mempty"] = mempty;
  exports["monoidString"] = monoidString;
})(PS["Data.Monoid"] = PS["Data.Monoid"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.Eff"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];        
  var monadEff = new Control_Monad.Monad(function () {
      return applicativeEff;
  }, function () {
      return bindEff;
  });
  var bindEff = new Control_Bind.Bind(function () {
      return applyEff;
  }, $foreign.bindE);
  var applyEff = new Control_Apply.Apply(function () {
      return functorEff;
  }, Control_Monad.ap(monadEff));
  var applicativeEff = new Control_Applicative.Applicative(function () {
      return applyEff;
  }, $foreign.pureE);
  var functorEff = new Data_Functor.Functor(Control_Applicative.liftA1(applicativeEff));
  exports["functorEff"] = functorEff;
  exports["applyEff"] = applyEff;
  exports["applicativeEff"] = applicativeEff;
  exports["bindEff"] = bindEff;
  exports["monadEff"] = monadEff;
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
    "use strict";

  exports.newSTRef = function (val) {
    return function () {
      return { value: val };
    };
  };

  exports.readSTRef = function (ref) {
    return function () {
      return ref.value;
    };
  };

  exports.writeSTRef = function (ref) {
    return function (a) {
      return function () {
        return ref.value = a; // eslint-disable-line no-return-assign
      };
    };
  };
})(PS["Control.Monad.ST"] = PS["Control.Monad.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.ST"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  exports["newSTRef"] = $foreign.newSTRef;
  exports["readSTRef"] = $foreign.readSTRef;
  exports["writeSTRef"] = $foreign.writeSTRef;
})(PS["Control.Monad.ST"] = PS["Control.Monad.ST"] || {});
(function(exports) {
    "use strict";

  //------------------------------------------------------------------------------
  // Array creation --------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.range = function (start) {
    return function (end) {
      var step = start > end ? -1 : 1;
      var result = new Array(step * (end - start) + 1);
      var i = start, n = 0;
      while (i !== end) {
        result[n++] = i;
        i += step;
      }
      result[n] = i;
      return result;
    };
  };   

  //------------------------------------------------------------------------------
  // Array size ------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.length = function (xs) {
    return xs.length;
  };

  //------------------------------------------------------------------------------
  // Indexed operations ----------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.indexImpl = function (just) {
    return function (nothing) {
      return function (xs) {
        return function (i) {
          return i < 0 || i >= xs.length ? nothing :  just(xs[i]);
        };
      };
    };
  };

  exports.concat = function (xss) {
    if (xss.length <= 10000) {
      // This method is faster, but it crashes on big arrays.
      // So we use it when can and fallback to simple variant otherwise.
      return Array.prototype.concat.apply([], xss);
    }

    var result = [];
    for (var i = 0, l = xss.length; i < l; i++) {
      var xs = xss[i];
      for (var j = 0, m = xs.length; j < m; j++) {
        result.push(xs[j]);
      }
    }
    return result;
  };

  exports.filter = function (f) {
    return function (xs) {
      return xs.filter(f);
    };
  };

  //------------------------------------------------------------------------------
  // Subarrays -------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.slice = function (s) {
    return function (e) {
      return function (l) {
        return l.slice(s, e);
      };
    };
  };

  exports.take = function (n) {
    return function (l) {
      return n < 1 ? [] : l.slice(0, n);
    };
  };
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
    "use strict";

  exports.foldrArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };

  exports.foldlArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
    "use strict";

  exports.topInt = 2147483647;
  exports.bottomInt = -2147483648;
})(PS["Data.Bounded"] = PS["Data.Bounded"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Bounded"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Unit = PS["Data.Unit"];        
  var Bounded = function (Ord0, bottom, top) {
      this.Ord0 = Ord0;
      this.bottom = bottom;
      this.top = top;
  };
  var top = function (dict) {
      return dict.top;
  };                                            
  var boundedInt = new Bounded(function () {
      return Data_Ord.ordInt;
  }, $foreign.bottomInt, $foreign.topInt);
  var bottom = function (dict) {
      return dict.bottom;
  };
  exports["Bounded"] = Bounded;
  exports["bottom"] = bottom;
  exports["top"] = top;
  exports["boundedInt"] = boundedInt;
})(PS["Data.Bounded"] = PS["Data.Bounded"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Nothing = (function () {
      function Nothing() {

      };
      Nothing.value = new Nothing();
      return Nothing;
  })();
  var Just = (function () {
      function Just(value0) {
          this.value0 = value0;
      };
      Just.create = function (value0) {
          return new Just(value0);
      };
      return Just;
  })();
  var maybe = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Nothing) {
                  return v;
              };
              if (v2 instanceof Just) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Maybe line 219, column 1 - line 219, column 51: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var fromMaybe = function (a) {
      return maybe(a)(Control_Category.id(Control_Category.categoryFn));
  };
  var fromJust = function (dictPartial) {
      return function (v) {
          var __unused = function (dictPartial1) {
              return function ($dollar35) {
                  return $dollar35;
              };
          };
          return __unused(dictPartial)((function () {
              if (v instanceof Just) {
                  return v.value0;
              };
              throw new Error("Failed pattern match at Data.Maybe line 270, column 1 - line 270, column 46: " + [ v.constructor.name ]);
          })());
      };
  };
  exports["Nothing"] = Nothing;
  exports["Just"] = Just;
  exports["maybe"] = maybe;
  exports["fromMaybe"] = fromMaybe;
  exports["fromJust"] = fromJust;
})(PS["Data.Maybe"] = PS["Data.Maybe"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Foldable"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Endo = PS["Data.Monoid.Endo"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Foldable = function (foldMap, foldl, foldr) {
      this.foldMap = foldMap;
      this.foldl = foldl;
      this.foldr = foldr;
  };
  var foldr = function (dict) {
      return dict.foldr;
  };
  var foldl = function (dict) {
      return dict.foldl;
  };
  var intercalate = function (dictFoldable) {
      return function (dictMonoid) {
          return function (sep) {
              return function (xs) {
                  var go = function (v) {
                      return function (x) {
                          if (v.init) {
                              return {
                                  init: false,
                                  acc: x
                              };
                          };
                          return {
                              init: false,
                              acc: Data_Semigroup.append(dictMonoid.Semigroup0())(v.acc)(Data_Semigroup.append(dictMonoid.Semigroup0())(sep)(x))
                          };
                      };
                  };
                  return (foldl(dictFoldable)(go)({
                      init: true,
                      acc: Data_Monoid.mempty(dictMonoid)
                  })(xs)).acc;
              };
          };
      };
  }; 
  var foldMapDefaultR = function (dictFoldable) {
      return function (dictMonoid) {
          return function (f) {
              return foldr(dictFoldable)(function (x) {
                  return function (acc) {
                      return Data_Semigroup.append(dictMonoid.Semigroup0())(f(x))(acc);
                  };
              })(Data_Monoid.mempty(dictMonoid));
          };
      };
  };
  var foldableArray = new Foldable(function (dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
  }, $foreign.foldlArray, $foreign.foldrArray);
  var foldMap = function (dict) {
      return dict.foldMap;
  };
  exports["Foldable"] = Foldable;
  exports["foldr"] = foldr;
  exports["foldl"] = foldl;
  exports["foldMap"] = foldMap;
  exports["foldMapDefaultR"] = foldMapDefaultR;
  exports["intercalate"] = intercalate;
  exports["foldableArray"] = foldableArray;
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
    "use strict";

  // jshint maxparams: 3

  exports.traverseArrayImpl = function () {
    function Cont(fn) {
      this.fn = fn;
    }

    var emptyList = {};

    var ConsCell = function (head, tail) {
      this.head = head;
      this.tail = tail;
    };

    function consList(x) {
      return function (xs) {
        return new ConsCell(x, xs);
      };
    }

    function listToArray(list) {
      var arr = [];
      var xs = list;
      while (xs !== emptyList) {
        arr.push(xs.head);
        xs = xs.tail;
      }
      return arr;
    }

    return function (apply) {
      return function (map) {
        return function (pure) {
          return function (f) {
            var buildFrom = function (x, ys) {
              return apply(map(consList)(f(x)))(ys);
            };

            var go = function (acc, currentLen, xs) {
              if (currentLen === 0) {
                return acc;
              } else {
                var last = xs[currentLen - 1];
                return new Cont(function () {
                  return go(buildFrom(last, acc), currentLen - 1, xs);
                });
              }
            };

            return function (array) {
              var result = go(pure(emptyList), array.length, array);
              while (result instanceof Cont) {
                result = result.fn();
              }

              return map(listToArray)(result);
            };
          };
        };
      };
    };
  }();
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Traversable"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Traversable_Accum = PS["Data.Traversable.Accum"];
  var Data_Traversable_Accum_Internal = PS["Data.Traversable.Accum.Internal"];
  var Prelude = PS["Prelude"];        
  var Traversable = function (Foldable1, Functor0, sequence, traverse) {
      this.Foldable1 = Foldable1;
      this.Functor0 = Functor0;
      this.sequence = sequence;
      this.traverse = traverse;
  };
  var traverse = function (dict) {
      return dict.traverse;
  }; 
  var sequenceDefault = function (dictTraversable) {
      return function (dictApplicative) {
          return traverse(dictTraversable)(dictApplicative)(Control_Category.id(Control_Category.categoryFn));
      };
  };
  var traversableArray = new Traversable(function () {
      return Data_Foldable.foldableArray;
  }, function () {
      return Data_Functor.functorArray;
  }, function (dictApplicative) {
      return sequenceDefault(traversableArray)(dictApplicative);
  }, function (dictApplicative) {
      return $foreign.traverseArrayImpl(Control_Apply.apply(dictApplicative.Apply0()))(Data_Functor.map((dictApplicative.Apply0()).Functor0()))(Control_Applicative.pure(dictApplicative));
  });
  var sequence = function (dict) {
      return dict.sequence;
  };
  exports["Traversable"] = Traversable;
  exports["traverse"] = traverse;
  exports["sequence"] = sequence;
  exports["sequenceDefault"] = sequenceDefault;
  exports["traversableArray"] = traversableArray;
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Biapplicative = PS["Control.Biapplicative"];
  var Control_Biapply = PS["Control.Biapply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifoldable = PS["Data.Bifoldable"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Bitraversable = PS["Data.Bitraversable"];
  var Data_BooleanAlgebra = PS["Data.BooleanAlgebra"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_Distributive = PS["Data.Distributive"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];
  var Type_Equality = PS["Type.Equality"];        
  var Tuple = (function () {
      function Tuple(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Tuple.create = function (value0) {
          return function (value1) {
              return new Tuple(value0, value1);
          };
      };
      return Tuple;
  })();
  exports["Tuple"] = Tuple;
})(PS["Data.Tuple"] = PS["Data.Tuple"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Array"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Array_ST = PS["Data.Array.ST"];
  var Data_Array_ST_Iterator = PS["Data.Array.ST.Iterator"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];
  var index = $foreign.indexImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  exports["index"] = index;
  exports["range"] = $foreign.range;
  exports["length"] = $foreign.length;
  exports["concat"] = $foreign.concat;
  exports["filter"] = $foreign.filter;
  exports["take"] = $foreign.take;
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
    "use strict";

  exports.runFn3 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return fn(a, b, c);
        };
      };
    };
  };
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Function.Uncurried"];
  var Data_Unit = PS["Data.Unit"];        
  var runFn1 = function (f) {
      return f;
  };
  exports["runFn1"] = runFn1;
  exports["runFn3"] = $foreign.runFn3;
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function(exports) {
    "use strict";

  // module Data.Int

  exports.fromNumberImpl = function (just) {
    return function (nothing) {
      return function (n) {
        /* jshint bitwise: false */
        return (n | 0) === n ? just(n) : nothing;
      };
    };
  };

  exports.toNumber = function (n) {
    return n;
  };
})(PS["Data.Int"] = PS["Data.Int"] || {});
(function(exports) {
  /* globals exports */
  "use strict";         

  exports.infinity = Infinity;
})(PS["Global"] = PS["Global"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Global"];
  exports["infinity"] = $foreign.infinity;
})(PS["Global"] = PS["Global"] || {});
(function(exports) {
    "use strict";        

  exports.floor = Math.floor;
})(PS["Math"] = PS["Math"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Math"];
  exports["floor"] = $foreign.floor;
})(PS["Math"] = PS["Math"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Int"];
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_DivisionRing = PS["Data.DivisionRing"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Field = PS["Data.Field"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Int_Bits = PS["Data.Int.Bits"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Global = PS["Global"];
  var $$Math = PS["Math"];
  var Prelude = PS["Prelude"];      
  var fromNumber = $foreign.fromNumberImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
  var unsafeClamp = function (x) {
      if (x === Global.infinity) {
          return 0;
      };
      if (x === -Global.infinity) {
          return 0;
      };
      if (x >= $foreign.toNumber(Data_Bounded.top(Data_Bounded.boundedInt))) {
          return Data_Bounded.top(Data_Bounded.boundedInt);
      };
      if (x <= $foreign.toNumber(Data_Bounded.bottom(Data_Bounded.boundedInt))) {
          return Data_Bounded.bottom(Data_Bounded.boundedInt);
      };
      if (Data_Boolean.otherwise) {
          return Data_Maybe.fromMaybe(0)(fromNumber(x));
      };
      throw new Error("Failed pattern match at Data.Int line 64, column 1 - line 64, column 29: " + [ x.constructor.name ]);
  };
  var floor = function ($24) {
      return unsafeClamp($$Math.floor($24));
  };
  exports["fromNumber"] = fromNumber;
  exports["floor"] = floor;
})(PS["Data.Int"] = PS["Data.Int"] || {});
(function(exports) {exports.runCmdImpl = function(handler) {
    return function(command) {
      return function() {
        command(handler);
      };
    };
  };
})(PS["Oak"] = PS["Oak"] || {});
(function(exports) {exports.noneImpl = function() {
  };
})(PS["Oak.Cmd"] = PS["Oak.Cmd"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Oak.Cmd"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];                                                                         
  var none = $foreign.noneImpl;
  exports["none"] = none;
})(PS["Oak.Cmd"] = PS["Oak.Cmd"] || {});
(function(exports) {exports.getElementByIdImpl = function(id) {
    return function() {
      var container = document.getElementById(id);
      if (container == null) {
        throw(new Error("Unable to find element with ID: " + id));
      };

      return container;
    };
  };

  exports.appendChildNodeImpl = function(container) {
    return function(rootNode) {
      return function() {
        container.appendChild(rootNode);
      };
    };
  };
})(PS["Oak.Document"] = PS["Oak.Document"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Oak.Document"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Prelude = PS["Prelude"];        
  var getElementById = Data_Function_Uncurried.runFn1($foreign.getElementByIdImpl);
  var appendChildNode = function (element) {
      return function (rootNode) {
          return $foreign.appendChildNodeImpl(element)(rootNode);
      };
  };
  exports["appendChildNode"] = appendChildNode;
  exports["getElementById"] = getElementById;
})(PS["Oak.Document"] = PS["Oak.Document"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var StyleAttribute = (function () {
      function StyleAttribute(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      StyleAttribute.create = function (value0) {
          return function (value1) {
              return new StyleAttribute(value0, value1);
          };
      };
      return StyleAttribute;
  })();
  var backgroundColor = function (val) {
      return new StyleAttribute("background-color", val);
  };
  exports["StyleAttribute"] = StyleAttribute;
  exports["backgroundColor"] = backgroundColor;
})(PS["Oak.Css"] = PS["Oak.Css"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Category = PS["Control.Category"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
  var Present = function (present) {
      this.present = present;
  };
  var presentString = new Present(Control_Category.id(Control_Category.categoryFn));
  var presentInt = new Present(Data_Show.show(Data_Show.showInt));        
  var present = function (dict) {
      return dict.present;
  };
  exports["present"] = present;
  exports["Present"] = Present;
  exports["presentString"] = presentString;
  exports["presentInt"] = presentInt;
})(PS["Oak.Html.Present"] = PS["Oak.Html.Present"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Semigroup = PS["Data.Semigroup"];
  var Oak_Css = PS["Oak.Css"];
  var Oak_Html_Present = PS["Oak.Html.Present"];
  var Prelude = PS["Prelude"];        
  var BooleanAttribute = (function () {
      function BooleanAttribute(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      BooleanAttribute.create = function (value0) {
          return function (value1) {
              return new BooleanAttribute(value0, value1);
          };
      };
      return BooleanAttribute;
  })();
  var DataAttribute = (function () {
      function DataAttribute(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      DataAttribute.create = function (value0) {
          return function (value1) {
              return new DataAttribute(value0, value1);
          };
      };
      return DataAttribute;
  })();
  var EventHandler = (function () {
      function EventHandler(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      EventHandler.create = function (value0) {
          return function (value1) {
              return new EventHandler(value0, value1);
          };
      };
      return EventHandler;
  })();
  var KeyPressEventHandler = (function () {
      function KeyPressEventHandler(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      KeyPressEventHandler.create = function (value0) {
          return function (value1) {
              return new KeyPressEventHandler(value0, value1);
          };
      };
      return KeyPressEventHandler;
  })();
  var SimpleAttribute = (function () {
      function SimpleAttribute(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      SimpleAttribute.create = function (value0) {
          return function (value1) {
              return new SimpleAttribute(value0, value1);
          };
      };
      return SimpleAttribute;
  })();
  var StringEventHandler = (function () {
      function StringEventHandler(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      StringEventHandler.create = function (value0) {
          return function (value1) {
              return new StringEventHandler(value0, value1);
          };
      };
      return StringEventHandler;
  })();
  var Style = (function () {
      function Style(value0) {
          this.value0 = value0;
      };
      Style.create = function (value0) {
          return new Style(value0);
      };
      return Style;
  })();
  var y = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("y", Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var x = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("x", Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var width = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("width", Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var style = function (attrs) {
      return new Style(attrs);
  };
  var r = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("r", Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var height = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("height", Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var fill = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("fill", Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var cy = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("cy", Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var cx = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("cx", Oak_Html_Present.present(dictPresent)(val));
      };
  };
  exports["BooleanAttribute"] = BooleanAttribute;
  exports["DataAttribute"] = DataAttribute;
  exports["EventHandler"] = EventHandler;
  exports["KeyPressEventHandler"] = KeyPressEventHandler;
  exports["SimpleAttribute"] = SimpleAttribute;
  exports["StringEventHandler"] = StringEventHandler;
  exports["Style"] = Style;
  exports["style"] = style;
  exports["cx"] = cx;
  exports["cy"] = cy;
  exports["fill"] = fill;
  exports["height"] = height;
  exports["r"] = r;
  exports["width"] = width;
  exports["x"] = x;
  exports["y"] = y;
})(PS["Oak.Html.Attribute"] = PS["Oak.Html.Attribute"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Oak_Html_Attribute = PS["Oak.Html.Attribute"];
  var Oak_Html_Present = PS["Oak.Html.Present"];        
  var Text = (function () {
      function Text(value0) {
          this.value0 = value0;
      };
      Text.create = function (value0) {
          return new Text(value0);
      };
      return Text;
  })();
  var Tag = (function () {
      function Tag(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      Tag.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new Tag(value0, value1, value2);
              };
          };
      };
      return Tag;
  })();
  var Svg = (function () {
      function Svg(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      Svg.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new Svg(value0, value1, value2);
              };
          };
      };
      return Svg;
  })();
  var text = function (dictPresent) {
      return function (val) {
          return new Text(Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var svg = function (attrs) {
      return function (children) {
          return new Svg("svg", attrs, children);
      };
  };
  var rect = function (attrs) {
      return function (children) {
          return new Svg("rect", attrs, children);
      };
  };
  var div = function (attrs) {
      return function (children) {
          return new Tag("div", attrs, children);
      };
  };
  var circle = function (attrs) {
      return function (children) {
          return new Svg("circle", attrs, children);
      };
  };
  exports["Text"] = Text;
  exports["Tag"] = Tag;
  exports["Svg"] = Svg;
  exports["text"] = text;
  exports["circle"] = circle;
  exports["div"] = div;
  exports["rect"] = rect;
  exports["svg"] = svg;
})(PS["Oak.Html"] = PS["Oak.Html"] || {});
(function(exports) {
  var h =require("virtual-dom/h");
  var svg =require("virtual-dom/virtual-hyperscript/svg");
  var diff =require("virtual-dom/diff");
  var patch =require("virtual-dom/patch");
  var createElement =require("virtual-dom/create-element"); 

  // foreign import createRootNodeImpl :: ∀ e.
  //   Fn1 Tree (Eff ( createRootNode :: NODE | e ) Node)
  exports.createRootNodeImpl = function(tree) {
      return createElement(tree);
  };


  // foreign import textImpl :: ∀ e.
  //   Fn1 String (Eff e Tree)
  exports.textImpl = function(str) {
    return function() {
      return str;
    };
  };

  // foreign import renderImpl :: ∀ msg h e model.
  //   Fn3
  //     String
  //     NativeAttrs
  //     ( Eff ( st :: ST h | e ) (Array Tree) )
  //     ( Eff ( st :: ST h | e ) Tree )
  exports.renderImpl = function(tagName, attrs, childrenEff) {
    return function() {
      var children = childrenEff();
      return h(tagName, attrs, children);
    };
  };

  // foreign import svgImpl :: ∀ msg h e model.
  //   Fn3
  //     String
  //     NativeAttrs
  //     ( Eff ( st :: ST h | e ) (Array Tree) )
  //     ( Eff ( st :: ST h | e ) Tree )
  exports.svgImpl = function(tagName, attrs, childrenEff) {
    return function() {
      var children = childrenEff();
      return svg(tagName, attrs, children);
    };
  };

  // foreign import patchImpl :: ∀ e h.
  //   Fn3 Tree Tree Node Eff ( st :: ST h | e ) Node
  exports.patchImpl = function(newTree, oldTree, rootNode) {
    return function() {
      var patches = diff(oldTree, newTree);
      var newRoot = patch(rootNode, patches);
      return newRoot;
    };
  };


  // foreign import concatHandlerFunImpl :: ∀ eff event.
  //   Fn3 String (event -> eff) NativeAttrs NativeAttrs
  exports.concatHandlerFunImpl = function(name, msgHandler, rest) {
    var result = Object.assign({}, rest);
    result[name] = function(event) {
      msgHandler(event)();
    };
    return result;
  };

  // foreign import concatEventTargetValueHandlerFunImpl :: ∀ eff event.
  //   Fn3 String (event -> eff) NativeAttrs NativeAttrs
  exports.concatEventTargetValueHandlerFunImpl = function(name, msgHandler, rest) {
    var result = Object.assign({}, rest);
    result[name] = function(event) {
      msgHandler(String(event.target.value))();
    };
    return result;
  };


  // foreign import concatSimpleAttrImpl :: ∀ eff event.
  //   Fn3 String String NativeAttrs NativeAttrs
  exports.concatSimpleAttrImpl = function(name, value, rest) {
    var result = Object.assign({}, rest);
    result[name] = value;
    return result;
  };


  // foreign import concatBooleanAttrImpl ::
  //   Fn3 String Boolean NativeAttrs NativeAttrs
  exports.concatBooleanAttrImpl = function(name, b, rest) {
    if(b) {
      var result = Object.assign({}, rest);
      result[name] = name;
      return result;
    } else {
      return rest;
    };
  };


  // foreign import concatDataAttrImpl ::
  //   Fn3 String String NativeAttrs NativeAttrs
  exports.concatDataAttrImpl = function(name, val, rest) {
    var result = Object.assign({}, rest);
    var attributes = Object.assign({}, rest.attributes);
    attributes[name] = val;
    result.attributes = attributes;
    return result;
  };


  // foreign import emptyAttrs :: NativeAttrs
  exports.emptyAttrs = function() {
    return {};
  };
})(PS["Oak.VirtualDom.Native"] = PS["Oak.VirtualDom.Native"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Oak.VirtualDom.Native"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Oak_Document = PS["Oak.Document"];        
  var text = Data_Function_Uncurried.runFn1($foreign.textImpl);
  var svg = Data_Function_Uncurried.runFn3($foreign.svgImpl);
  var render = Data_Function_Uncurried.runFn3($foreign.renderImpl);
  var patch = Data_Function_Uncurried.runFn3($foreign.patchImpl);
  var createRootNode = Data_Function_Uncurried.runFn1($foreign.createRootNodeImpl);
  var concatSimpleAttr = Data_Function_Uncurried.runFn3($foreign.concatSimpleAttrImpl);
  var concatHandlerFun = Data_Function_Uncurried.runFn3($foreign.concatHandlerFunImpl);
  var concatEventTargetValueHandlerFun = Data_Function_Uncurried.runFn3($foreign.concatEventTargetValueHandlerFunImpl);
  var concatDataAttr = Data_Function_Uncurried.runFn3($foreign.concatDataAttrImpl);
  var concatBooleanAttr = Data_Function_Uncurried.runFn3($foreign.concatBooleanAttrImpl);
  exports["patch"] = patch;
  exports["createRootNode"] = createRootNode;
  exports["concatSimpleAttr"] = concatSimpleAttr;
  exports["concatBooleanAttr"] = concatBooleanAttr;
  exports["concatDataAttr"] = concatDataAttr;
  exports["concatHandlerFun"] = concatHandlerFun;
  exports["concatEventTargetValueHandlerFun"] = concatEventTargetValueHandlerFun;
  exports["text"] = text;
  exports["render"] = render;
  exports["svg"] = svg;
  exports["emptyAttrs"] = $foreign.emptyAttrs;
})(PS["Oak.VirtualDom.Native"] = PS["Oak.VirtualDom.Native"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Traversable = PS["Data.Traversable"];
  var Oak_Css = PS["Oak.Css"];
  var Oak_Document = PS["Oak.Document"];
  var Oak_Html = PS["Oak.Html"];
  var Oak_Html_Attribute = PS["Oak.Html.Attribute"];
  var Oak_VirtualDom_Native = PS["Oak.VirtualDom.Native"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var stringifyStyle = function (v) {
      return v.value0 + (":" + v.value1);
  };
  var stringifyStyles = function (attrs) {
      return Data_Foldable.intercalate(Data_Foldable.foldableArray)(Data_Monoid.monoidString)(";")(Data_Functor.map(Data_Functor.functorArray)(stringifyStyle)(attrs));
  };
  var patch = function (oldTree) {
      return function (newTree) {
          return function (maybeRoot) {
              var root = Data_Maybe.fromJust()(maybeRoot);
              return Oak_VirtualDom_Native.patch(oldTree)(newTree)(root);
          };
      };
  };
  var concatAttr = function (handler) {
      return function (v) {
          return function (attrs) {
              if (v instanceof Oak_Html_Attribute.EventHandler) {
                  return Oak_VirtualDom_Native.concatHandlerFun(v.value0)(function (v1) {
                      return handler(v.value1);
                  })(attrs);
              };
              if (v instanceof Oak_Html_Attribute.StringEventHandler) {
                  return Oak_VirtualDom_Native.concatEventTargetValueHandlerFun(v.value0)(function (e) {
                      return handler(v.value1(e));
                  })(attrs);
              };
              if (v instanceof Oak_Html_Attribute.SimpleAttribute) {
                  return Oak_VirtualDom_Native.concatSimpleAttr(v.value0)(v.value1)(attrs);
              };
              if (v instanceof Oak_Html_Attribute.Style) {
                  return Oak_VirtualDom_Native.concatSimpleAttr("style")(stringifyStyles(v.value0))(attrs);
              };
              if (v instanceof Oak_Html_Attribute.BooleanAttribute) {
                  return Oak_VirtualDom_Native.concatBooleanAttr(v.value0)(v.value1)(attrs);
              };
              if (v instanceof Oak_Html_Attribute.DataAttribute) {
                  return Oak_VirtualDom_Native.concatDataAttr(v.value0)(v.value1)(attrs);
              };
              if (v instanceof Oak_Html_Attribute.KeyPressEventHandler) {
                  return Oak_VirtualDom_Native.concatHandlerFun(v.value0)(function (e) {
                      return handler(v.value1(e));
                  })(attrs);
              };
              throw new Error("Failed pattern match at Oak.VirtualDom line 36, column 1 - line 40, column 21: " + [ handler.constructor.name, v.constructor.name, attrs.constructor.name ]);
          };
      };
  };
  var combineAttrs = function (attrs) {
      return function (handler) {
          return Data_Foldable.foldr(Data_Foldable.foldableArray)(concatAttr(handler))(Oak_VirtualDom_Native.emptyAttrs)(attrs);
      };
  };
  var render = function (h) {
      return function (v) {
          if (v instanceof Oak_Html.Tag) {
              return Oak_VirtualDom_Native.render(v.value0)(combineAttrs(v.value1)(h))(Data_Traversable.sequence(Data_Traversable.traversableArray)(Control_Monad_Eff.applicativeEff)(Data_Functor.map(Data_Functor.functorArray)(render(h))(v.value2)));
          };
          if (v instanceof Oak_Html.Svg) {
              return Oak_VirtualDom_Native.svg(v.value0)(combineAttrs(v.value1)(h))(Data_Traversable.sequence(Data_Traversable.traversableArray)(Control_Monad_Eff.applicativeEff)(Data_Functor.map(Data_Functor.functorArray)(render(h))(v.value2)));
          };
          if (v instanceof Oak_Html.Text) {
              return Oak_VirtualDom_Native.text(v.value0);
          };
          throw new Error("Failed pattern match at Oak.VirtualDom line 26, column 1 - line 29, column 37: " + [ h.constructor.name, v.constructor.name ]);
      };
  };
  exports["render"] = render;
  exports["concatAttr"] = concatAttr;
  exports["stringifyStyle"] = stringifyStyle;
  exports["stringifyStyles"] = stringifyStyles;
  exports["combineAttrs"] = combineAttrs;
  exports["patch"] = patch;
})(PS["Oak.VirtualDom"] = PS["Oak.VirtualDom"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Oak"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Maybe = PS["Data.Maybe"];
  var Oak_Cmd = PS["Oak.Cmd"];
  var Oak_Document = PS["Oak.Document"];
  var Oak_Html = PS["Oak.Html"];
  var Oak_VirtualDom = PS["Oak.VirtualDom"];
  var Oak_VirtualDom_Native = PS["Oak.VirtualDom.Native"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var RunningApp = (function () {
      function RunningApp(value0) {
          this.value0 = value0;
      };
      RunningApp.create = function (value0) {
          return new RunningApp(value0);
      };
      return RunningApp;
  })();
  var App = (function () {
      function App(value0) {
          this.value0 = value0;
      };
      App.create = function (value0) {
          return new App(value0);
      };
      return App;
  })();
  var runCmd = $foreign.runCmdImpl;
  var handler = function (ref) {
      return function (runningApp) {
          return function (msg) {
              return function __do() {
                  var v = Control_Monad_ST.readSTRef(ref)();
                  var oldTree = Data_Maybe.fromJust()(v.tree);
                  var root = Data_Maybe.fromJust()(v.root);
                  var newModel = runningApp.value0.update(msg)(v.model);
                  var cmd = runningApp.value0.next(msg)(newModel);
                  var v1 = Oak_VirtualDom.render(handler(ref)(runningApp))(runningApp.value0.view(newModel))();
                  var v2 = Oak_VirtualDom.patch(v1)(oldTree)(v.root)();
                  var newRuntime = {
                      root: new Data_Maybe.Just(v2),
                      tree: new Data_Maybe.Just(v1),
                      model: newModel
                  };
                  var v3 = runCmd(handler(ref)(runningApp))(cmd)();
                  return Control_Monad_ST.writeSTRef(ref)(newRuntime)();
              };
          };
      };
  };
  var runApp_ = function (v) {
      return function (flags) {
          var runningApp = {
              view: v.value0.view,
              next: v.value0.next,
              update: v.value0.update
          };
          var initialModel = v.value0.init(flags);
          return function __do() {
              var v1 = Control_Monad_ST.newSTRef({
                  tree: Data_Maybe.Nothing.value,
                  root: Data_Maybe.Nothing.value,
                  model: initialModel
              })();
              var v2 = Oak_VirtualDom.render(handler(v1)(new RunningApp(runningApp)))(runningApp.view(initialModel))();
              var rootNode = Oak_VirtualDom_Native.createRootNode(v2);
              var v3 = Control_Monad_ST.writeSTRef(v1)({
                  tree: new Data_Maybe.Just(v2),
                  root: new Data_Maybe.Just(rootNode),
                  model: initialModel
              })();
              return rootNode;
          };
      };
  };
  var runApp = function (app) {
      return function (flags) {
          return runApp_(app)(flags);
      };
  };
  var createApp = function (opts) {
      return new App({
          init: opts.init,
          view: opts.view,
          next: opts.next,
          update: opts.update
      });
  };
  exports["createApp"] = createApp;
  exports["runApp"] = runApp;
})(PS["Oak"] = PS["Oak"] || {});
(function(exports) {exports.mathRandom = function(msgCtor) {
    console.log("randomizing")
    return function(handler) {
      console.log("handling: ");
      console.log(handler);
      console.log("msgCtor: ", msgCtor);
      console.log("you get: ", msgCtor(Math.random()));
      handler(msgCtor(Math.random()))()
    }
  }
})(PS["Oak.Cmd.Random"] = PS["Oak.Cmd.Random"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Oak.Cmd.Random"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Oak_Cmd = PS["Oak.Cmd"];
  var Prelude = PS["Prelude"];
  var generate = function (msgCtor) {
      return $foreign.mathRandom(msgCtor);
  };
  exports["generate"] = generate;
})(PS["Oak.Cmd.Random"] = PS["Oak.Cmd.Random"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Oak_Html_Attribute = PS["Oak.Html.Attribute"];
  var onClick = function (msg) {
      return new Oak_Html_Attribute.EventHandler("onclick", msg);
  };
  exports["onClick"] = onClick;
})(PS["Oak.Html.Events"] = PS["Oak.Html.Events"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Data_Array = PS["Data.Array"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Int = PS["Data.Int"];
  var Data_List = PS["Data.List"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var $$Math = PS["Math"];
  var Oak = PS["Oak"];
  var Oak_Cmd = PS["Oak.Cmd"];
  var Oak_Cmd_Http = PS["Oak.Cmd.Http"];
  var Oak_Cmd_Random = PS["Oak.Cmd.Random"];
  var Oak_Css = PS["Oak.Css"];
  var Oak_Document = PS["Oak.Document"];
  var Oak_Html = PS["Oak.Html"];
  var Oak_Html_Attribute = PS["Oak.Html.Attribute"];
  var Oak_Html_Events = PS["Oak.Html.Events"];
  var Oak_Html_Present = PS["Oak.Html.Present"];
  var Prelude = PS["Prelude"];        
  var GetRandom = (function () {
      function GetRandom() {

      };
      GetRandom.value = new GetRandom();
      return GetRandom;
  })();
  var GotRandom = (function () {
      function GotRandom(value0) {
          this.value0 = value0;
      };
      GotRandom.create = function (value0) {
          return new GotRandom(value0);
      };
      return GotRandom;
  })();
  var squareView = function (v) {
      return Oak_Html.rect([ Oak_Html_Attribute.x(Oak_Html_Present.presentInt)(v.value0 - 30 | 0), Oak_Html_Attribute.y(Oak_Html_Present.presentInt)(v.value1 - 20 | 0), Oak_Html_Attribute.width(Oak_Html_Present.presentString)("80"), Oak_Html_Attribute.height(Oak_Html_Present.presentString)("80"), Oak_Html_Attribute.fill(Oak_Html_Present.presentString)("red") ])([  ]);
  };
  var spots = function (height) {
      return function (width) {
          return Control_Bind.bind(Control_Bind.bindArray)(Data_Array.range(1)(height))(function (v) {
              return Control_Bind.bind(Control_Bind.bindArray)(Data_Array.range(1)(width))(function (v1) {
                  return Control_Applicative.pure(Control_Applicative.applicativeArray)(new Data_Tuple.Tuple(v1, v));
              });
          });
      };
  };
  var oddPair = function (i) {
      return function (arr) {
          return function (backup) {
              var n = Data_Array.length(arr);
              var index = function (at) {
                  return Data_Maybe.maybe(backup)(Control_Category.id(Control_Category.categoryFn))(Data_Array.index(arr)(at));
              };
              return [ index(n - i | 0), index(i - 1 | 0) ];
          };
      };
  };
  var shuffle = function ($copy_v) {
      return function ($copy_deck) {
          var $tco_var_v = $copy_v;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v, deck) {
              if (v === 0) {
                  $tco_done = true;
                  return deck;
              };
              var subdecks = Control_Bind.bind(Control_Bind.bindArray)(Data_Array.range(1)(Data_Array.length(deck) / 2 | 0))(function (v1) {
                  return Control_Applicative.pure(Control_Applicative.applicativeArray)(oddPair(v1)(deck)(new Data_Tuple.Tuple(100, 100)));
              });
              $tco_var_v = v - 1 | 0;
              $copy_deck = Data_Array.concat(subdecks);
              return;
          };
          while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_v, $copy_deck);
          };
          return $tco_result;
      };
  };
  var next = function (v) {
      return function (v1) {
          if (v instanceof GetRandom) {
              return Oak_Cmd_Random.generate(GotRandom.create);
          };
          return Oak_Cmd.none;
      };
  };
  var init = function (v) {
      return {
          randomness: 50,
          height: 600,
          width: 1200,
          radius: 40,
          padding: 15,
          limit: 20
      };
  };
  var fits = function (radius) {
      return function (padding) {
          return function (v) {
              var space = 2 * (radius + padding | 0) | 0;
              return v.value1 % space === 0 && v.value0 % space === 0;
          };
      };
  };
  var select = function (radius) {
      return function (padding) {
          return function (limit) {
              return function (randomness) {
                  return function (domain) {
                      var quantity = randomness % limit;
                      return Data_Array.take(quantity)(shuffle(randomness)(Data_Array.filter(fits(radius)(padding))(domain)));
                  };
              };
          };
      };
  };
  var circleView = function (v) {
      return Oak_Html.circle([ Oak_Html_Attribute.cx(Oak_Html_Present.presentInt)(v.value0 - 30 | 0), Oak_Html_Attribute.cy(Oak_Html_Present.presentInt)(v.value1 - 20 | 0), Oak_Html_Attribute.r(Oak_Html_Present.presentString)("40"), Oak_Html_Attribute.fill(Oak_Html_Present.presentString)("red") ])([  ]);
  };
  var shapeView = function (randomness) {
      if (randomness % 2 === 0) {
          return circleView;
      };
      if (Data_Boolean.otherwise) {
          return squareView;
      };
      throw new Error("Failed pattern match at Main line 101, column 1 - line 101, column 48: " + [ randomness.constructor.name ]);
  };
  var centers = function (height) {
      return function (width) {
          return function (radius) {
              return function (padding) {
                  return function (limit) {
                      return function (randomness) {
                          return select(radius)(padding)(limit)(randomness)(spots(height)(width));
                      };
                  };
              };
          };
      };
  };
  var manyShapes = function (height) {
      return function (width) {
          return function (radius) {
              return function (padding) {
                  return function (limit) {
                      return function (randomness) {
                          return Data_Functor.map(Data_Functor.functorArray)(shapeView(randomness))(centers(height)(width)(radius)(padding)(limit)(randomness));
                      };
                  };
              };
          };
      };
  };
  var view = function (model) {
      var shapes = manyShapes(model.height)(model.width)(model.radius)(model.padding)(model.limit)(model.randomness);
      return Oak_Html.div([  ])([ Oak_Html.div([  ])([ Oak_Html.text(Oak_Html_Present.presentString)("The laws of physics are only patterns, beginning with quantities.") ]), Oak_Html.div([  ])([ Oak_Html.text(Oak_Html_Present.presentString)("The quantity: " + Data_Show.show(Data_Show.showInt)(Data_Array.length(shapes))) ]), Oak_Html.svg([ Oak_Html_Attribute.style([ Oak_Css.backgroundColor("blue") ]), Oak_Html_Attribute.height(Oak_Html_Present.presentInt)(600), Oak_Html_Attribute.width(Oak_Html_Present.presentInt)(1200), Oak_Html_Events.onClick(GetRandom.value) ])(shapes) ]);
  };
  var calc = function (randomness) {
      return Data_Int.floor(randomness * 100.0);
  };
  var update = function (v) {
      return function (model) {
          if (v instanceof GotRandom) {
              var $35 = {};
              for (var $36 in model) {
                  if ({}.hasOwnProperty.call(model, $36)) {
                      $35[$36] = model[$36];
                  };
              };
              $35.randomness = calc(v.value0);
              return $35;
          };
          return model;
      };
  };
  var app = Oak.createApp({
      init: init,
      view: view,
      update: update,
      next: next
  });
  var main = function __do() {
      var v = Oak.runApp(app)(Data_Unit.unit)();
      var v1 = Oak_Document.getElementById("app")();
      return Oak_Document.appendChildNode(v1)(v)();
  };
  exports["main"] = main;
})(PS["Main"] = PS["Main"] || {});
PS["Main"].main();

},{"virtual-dom/create-element":7,"virtual-dom/diff":8,"virtual-dom/h":9,"virtual-dom/patch":10,"virtual-dom/virtual-hyperscript/svg":23}],38:[function(require,module,exports){

},{}]},{},[37]);
