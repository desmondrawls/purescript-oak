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
    "use strict";

  exports.unit = {};
})(PS["Data.Unit"] = PS["Data.Unit"] || {});
(function(exports) {
    "use strict";

  exports.showIntImpl = function (n) {
    return n.toString();
  };

  exports.showStringImpl = function (s) {
    var l = s.length;
    return "\"" + s.replace(
      /[\0-\x1F\x7F"\\]/g, // eslint-disable-line no-control-regex
      function (c, i) {
        switch (c) {
          case "\"":
          case "\\":
            return "\\" + c;
          case "\x07": return "\\a";
          case "\b": return "\\b";
          case "\f": return "\\f";
          case "\n": return "\\n";
          case "\r": return "\\r";
          case "\t": return "\\t";
          case "\v": return "\\v";
        }
        var k = i + 1;
        var empty = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
        return "\\" + c.charCodeAt(0).toString(10) + empty;
      }
    ) + "\"";
  };

  exports.showArrayImpl = function (f) {
    return function (xs) {
      var ss = [];
      for (var i = 0, l = xs.length; i < l; i++) {
        ss[i] = f(xs[i]);
      }
      return "[" + ss.join(",") + "]";
    };
  };
})(PS["Data.Show"] = PS["Data.Show"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Show"];     
  var Show = function (show) {
      this.show = show;
  };
  var showString = new Show($foreign.showStringImpl);
  var showInt = new Show($foreign.showIntImpl);
  var show = function (dict) {
      return dict.show;
  };
  var showArray = function (dictShow) {
      return new Show($foreign.showArrayImpl(show(dictShow)));
  };
  exports["Show"] = Show;
  exports["show"] = show;
  exports["showInt"] = showInt;
  exports["showString"] = showString;
  exports["showArray"] = showArray;
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

  exports.concatArray = function (xs) {
    return function (ys) {
      if (xs.length === 0) return ys;
      if (ys.length === 0) return xs;
      return xs.concat(ys);
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
  var semigroupArray = new Semigroup($foreign.concatArray);
  var append = function (dict) {
      return dict.append;
  };
  exports["Semigroup"] = Semigroup;
  exports["append"] = append;
  exports["semigroupString"] = semigroupString;
  exports["semigroupArray"] = semigroupArray;
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
  var Control_Category = PS["Control.Category"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var flip = function (f) {
      return function (b) {
          return function (a) {
              return f(a)(b);
          };
      };
  };
  var $$const = function (a) {
      return function (v) {
          return a;
      };
  };
  exports["flip"] = flip;
  exports["const"] = $$const;
})(PS["Data.Function"] = PS["Data.Function"] || {});
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
  var $$void = function (dictFunctor) {
      return map(dictFunctor)(Data_Function["const"](Data_Unit.unit));
  };                                                                                             
  var functorArray = new Functor($foreign.arrayMap);
  exports["Functor"] = Functor;
  exports["map"] = map;
  exports["void"] = $$void;
  exports["functorArray"] = functorArray;
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Functor = PS["Data.Functor"];
  var Data_Semigroup = PS["Data.Semigroup"];        
  var Alt = function (Functor0, alt) {
      this.Functor0 = Functor0;
      this.alt = alt;
  };                                                       
  var alt = function (dict) {
      return dict.alt;
  };
  exports["Alt"] = Alt;
  exports["alt"] = alt;
})(PS["Control.Alt"] = PS["Control.Alt"] || {});
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
  var unless = function (dictApplicative) {
      return function (v) {
          return function (v1) {
              if (!v) {
                  return v1;
              };
              if (v) {
                  return pure(dictApplicative)(Data_Unit.unit);
              };
              throw new Error("Failed pattern match at Control.Applicative line 62, column 1 - line 62, column 65: " + [ v.constructor.name, v1.constructor.name ]);
          };
      };
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
  exports["unless"] = unless;
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
  var Discard = function (discard) {
      this.discard = discard;
  };
  var discard = function (dict) {
      return dict.discard;
  }; 
  var bindArray = new Bind(function () {
      return Control_Apply.applyArray;
  }, $foreign.arrayBind);
  var bind = function (dict) {
      return dict.bind;
  };
  var bindFlipped = function (dictBind) {
      return Data_Function.flip(bind(dictBind));
  };
  var composeKleisliFlipped = function (dictBind) {
      return function (f) {
          return function (g) {
              return function (a) {
                  return bindFlipped(dictBind)(f)(g(a));
              };
          };
      };
  };
  var composeKleisli = function (dictBind) {
      return function (f) {
          return function (g) {
              return function (a) {
                  return bind(dictBind)(f(a))(g);
              };
          };
      };
  };
  var discardUnit = new Discard(function (dictBind) {
      return bind(dictBind);
  });
  exports["Bind"] = Bind;
  exports["bind"] = bind;
  exports["bindFlipped"] = bindFlipped;
  exports["Discard"] = Discard;
  exports["discard"] = discard;
  exports["composeKleisli"] = composeKleisli;
  exports["composeKleisliFlipped"] = composeKleisliFlipped;
  exports["bindArray"] = bindArray;
  exports["discardUnit"] = discardUnit;
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

  exports.runPure = function (f) {
    return f();
  };
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
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
  exports["runPure"] = $foreign.runPure;
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
    "use strict";

  exports.message = function (e) {
    return e.message;
  };

  exports.catchException = function (c) {
    return function (t) {
      return function () {
        try {
          return t();
        } catch (e) {
          if (e instanceof Error || Object.prototype.toString.call(e) === "[object Error]") {
            return c(e)();
          } else {
            return c(new Error(e.toString()))();
          }
        }
      };
    };
  };
})(PS["Control.Monad.Eff.Exception"] = PS["Control.Monad.Eff.Exception"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Category = PS["Control.Category"];        
  var Bifunctor = function (bimap) {
      this.bimap = bimap;
  };
  var bimap = function (dict) {
      return dict.bimap;
  };
  var lmap = function (dictBifunctor) {
      return function (f) {
          return bimap(dictBifunctor)(f)(Control_Category.id(Control_Category.categoryFn));
      };
  };
  exports["bimap"] = bimap;
  exports["Bifunctor"] = Bifunctor;
  exports["lmap"] = lmap;
})(PS["Data.Bifunctor"] = PS["Data.Bifunctor"] || {});
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
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Data_Functor = PS["Data.Functor"];        
  var Plus = function (Alt0, empty) {
      this.Alt0 = Alt0;
      this.empty = empty;
  };       
  var empty = function (dict) {
      return dict.empty;
  };
  exports["Plus"] = Plus;
  exports["empty"] = empty;
})(PS["Control.Plus"] = PS["Control.Plus"] || {});
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
  var isNothing = maybe(true)(Data_Function["const"](false));
  var functorMaybe = new Data_Functor.Functor(function (v) {
      return function (v1) {
          if (v1 instanceof Just) {
              return new Just(v(v1.value0));
          };
          return Nothing.value;
      };
  });
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
  exports["isNothing"] = isNothing;
  exports["fromJust"] = fromJust;
  exports["functorMaybe"] = functorMaybe;
})(PS["Data.Maybe"] = PS["Data.Maybe"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Prelude = PS["Prelude"];        
  var Newtype = function (unwrap, wrap) {
      this.unwrap = unwrap;
      this.wrap = wrap;
  };
  var wrap = function (dict) {
      return dict.wrap;
  };
  var unwrap = function (dict) {
      return dict.unwrap;
  };
  exports["unwrap"] = unwrap;
  exports["wrap"] = wrap;
  exports["Newtype"] = Newtype;
})(PS["Data.Newtype"] = PS["Data.Newtype"] || {});
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
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifoldable = PS["Data.Bifoldable"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Bitraversable = PS["Data.Bitraversable"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
  var Left = (function () {
      function Left(value0) {
          this.value0 = value0;
      };
      Left.create = function (value0) {
          return new Left(value0);
      };
      return Left;
  })();
  var Right = (function () {
      function Right(value0) {
          this.value0 = value0;
      };
      Right.create = function (value0) {
          return new Right(value0);
      };
      return Right;
  })();
  var functorEither = new Data_Functor.Functor(function (v) {
      return function (v1) {
          if (v1 instanceof Left) {
              return new Left(v1.value0);
          };
          if (v1 instanceof Right) {
              return new Right(v(v1.value0));
          };
          throw new Error("Failed pattern match at Data.Either line 36, column 1 - line 36, column 45: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var either = function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return v(v2.value0);
              };
              if (v2 instanceof Right) {
                  return v1(v2.value0);
              };
              throw new Error("Failed pattern match at Data.Either line 229, column 1 - line 229, column 64: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  };
  var bifunctorEither = new Data_Bifunctor.Bifunctor(function (v) {
      return function (v1) {
          return function (v2) {
              if (v2 instanceof Left) {
                  return new Left(v(v2.value0));
              };
              if (v2 instanceof Right) {
                  return new Right(v1(v2.value0));
              };
              throw new Error("Failed pattern match at Data.Either line 43, column 1 - line 43, column 45: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
          };
      };
  });
  var applyEither = new Control_Apply.Apply(function () {
      return functorEither;
  }, function (v) {
      return function (v1) {
          if (v instanceof Left) {
              return new Left(v.value0);
          };
          if (v instanceof Right) {
              return Data_Functor.map(functorEither)(v.value0)(v1);
          };
          throw new Error("Failed pattern match at Data.Either line 79, column 1 - line 79, column 41: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var applicativeEither = new Control_Applicative.Applicative(function () {
      return applyEither;
  }, Right.create);
  exports["Left"] = Left;
  exports["Right"] = Right;
  exports["either"] = either;
  exports["functorEither"] = functorEither;
  exports["bifunctorEither"] = bifunctorEither;
  exports["applyEither"] = applyEither;
  exports["applicativeEither"] = applicativeEither;
})(PS["Data.Either"] = PS["Data.Either"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Exception"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
  var $$try = function (action) {
      return $foreign.catchException(function ($0) {
          return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Either.Left.create($0));
      })(Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Either.Right.create)(action));
  };
  exports["try"] = $$try;
  exports["message"] = $foreign.message;
})(PS["Control.Monad.Eff.Exception"] = PS["Control.Monad.Eff.Exception"] || {});
(function(exports) {
    "use strict";

  exports.runEffFn1 = function runEffFn1(fn) {
    return function(a) {
      return function() {
        return fn(a);
      };
    };
  };
})(PS["Control.Monad.Eff.Uncurried"] = PS["Control.Monad.Eff.Uncurried"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.Eff.Uncurried"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  exports["runEffFn1"] = $foreign.runEffFn1;
})(PS["Control.Monad.Eff.Uncurried"] = PS["Control.Monad.Eff.Uncurried"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var MonadThrow = function (Monad0, throwError) {
      this.Monad0 = Monad0;
      this.throwError = throwError;
  };
  var throwError = function (dict) {
      return dict.throwError;
  };
  exports["throwError"] = throwError;
  exports["MonadThrow"] = MonadThrow;
})(PS["Control.Monad.Error.Class"] = PS["Control.Monad.Error.Class"] || {});
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
  var snd = function (v) {
      return v.value1;
  };                                                                                                    
  var fst = function (v) {
      return v.value0;
  };
  exports["Tuple"] = Tuple;
  exports["fst"] = fst;
  exports["snd"] = snd;
})(PS["Data.Tuple"] = PS["Data.Tuple"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad = PS["Control.Monad"];
  var Control_Monad_Cont_Class = PS["Control.Monad.Cont.Class"];
  var Control_Monad_Eff_Class = PS["Control.Monad.Eff.Class"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Reader_Class = PS["Control.Monad.Reader.Class"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Monad_State_Class = PS["Control.Monad.State.Class"];
  var Control_Monad_Trans_Class = PS["Control.Monad.Trans.Class"];
  var Control_Monad_Writer_Class = PS["Control.Monad.Writer.Class"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Tuple = PS["Data.Tuple"];
  var Prelude = PS["Prelude"];        
  var ExceptT = function (x) {
      return x;
  };
  var runExceptT = function (v) {
      return v;
  }; 
  var mapExceptT = function (f) {
      return function (v) {
          return f(v);
      };
  };
  var functorExceptT = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return mapExceptT(Data_Functor.map(dictFunctor)(Data_Functor.map(Data_Either.functorEither)(f)));
      });
  };
  var monadExceptT = function (dictMonad) {
      return new Control_Monad.Monad(function () {
          return applicativeExceptT(dictMonad);
      }, function () {
          return bindExceptT(dictMonad);
      });
  };
  var bindExceptT = function (dictMonad) {
      return new Control_Bind.Bind(function () {
          return applyExceptT(dictMonad);
      }, function (v) {
          return function (k) {
              return Control_Bind.bind(dictMonad.Bind1())(v)(Data_Either.either(function ($97) {
                  return Control_Applicative.pure(dictMonad.Applicative0())(Data_Either.Left.create($97));
              })(function (a) {
                  var v1 = k(a);
                  return v1;
              }));
          };
      });
  };
  var applyExceptT = function (dictMonad) {
      return new Control_Apply.Apply(function () {
          return functorExceptT(((dictMonad.Bind1()).Apply0()).Functor0());
      }, Control_Monad.ap(monadExceptT(dictMonad)));
  };
  var applicativeExceptT = function (dictMonad) {
      return new Control_Applicative.Applicative(function () {
          return applyExceptT(dictMonad);
      }, function ($98) {
          return ExceptT(Control_Applicative.pure(dictMonad.Applicative0())(Data_Either.Right.create($98)));
      });
  };
  var monadThrowExceptT = function (dictMonad) {
      return new Control_Monad_Error_Class.MonadThrow(function () {
          return monadExceptT(dictMonad);
      }, function ($102) {
          return ExceptT(Control_Applicative.pure(dictMonad.Applicative0())(Data_Either.Left.create($102)));
      });
  };
  exports["ExceptT"] = ExceptT;
  exports["runExceptT"] = runExceptT;
  exports["mapExceptT"] = mapExceptT;
  exports["functorExceptT"] = functorExceptT;
  exports["applyExceptT"] = applyExceptT;
  exports["applicativeExceptT"] = applicativeExceptT;
  exports["bindExceptT"] = bindExceptT;
  exports["monadExceptT"] = monadExceptT;
  exports["monadThrowExceptT"] = monadThrowExceptT;
})(PS["Control.Monad.Except.Trans"] = PS["Control.Monad.Except.Trans"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad = PS["Control.Monad"];
  var Data_BooleanAlgebra = PS["Data.BooleanAlgebra"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Field = PS["Data.Field"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
  var Identity = function (x) {
      return x;
  };
  var newtypeIdentity = new Data_Newtype.Newtype(function (n) {
      return n;
  }, Identity);
  var functorIdentity = new Data_Functor.Functor(function (f) {
      return function (v) {
          return f(v);
      };
  });
  var applyIdentity = new Control_Apply.Apply(function () {
      return functorIdentity;
  }, function (v) {
      return function (v1) {
          return v(v1);
      };
  });
  var bindIdentity = new Control_Bind.Bind(function () {
      return applyIdentity;
  }, function (v) {
      return function (f) {
          return f(v);
      };
  });
  var applicativeIdentity = new Control_Applicative.Applicative(function () {
      return applyIdentity;
  }, Identity);
  var monadIdentity = new Control_Monad.Monad(function () {
      return applicativeIdentity;
  }, function () {
      return bindIdentity;
  });
  exports["Identity"] = Identity;
  exports["newtypeIdentity"] = newtypeIdentity;
  exports["functorIdentity"] = functorIdentity;
  exports["applyIdentity"] = applyIdentity;
  exports["applicativeIdentity"] = applicativeIdentity;
  exports["bindIdentity"] = bindIdentity;
  exports["monadIdentity"] = monadIdentity;
})(PS["Data.Identity"] = PS["Data.Identity"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Either = PS["Data.Either"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Newtype = PS["Data.Newtype"];
  var Prelude = PS["Prelude"];                                                           
  var runExcept = function ($0) {
      return Data_Newtype.unwrap(Data_Identity.newtypeIdentity)(Control_Monad_Except_Trans.runExceptT($0));
  };
  var mapExcept = function (f) {
      return Control_Monad_Except_Trans.mapExceptT(function ($1) {
          return Data_Identity.Identity(f(Data_Newtype.unwrap(Data_Identity.newtypeIdentity)($1)));
      });
  };
  exports["runExcept"] = runExcept;
  exports["mapExcept"] = mapExcept;
})(PS["Control.Monad.Except"] = PS["Control.Monad.Except"] || {});
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
  // Zipping ---------------------------------------------------------------------
  //------------------------------------------------------------------------------

  exports.zipWith = function (f) {
    return function (xs) {
      return function (ys) {
        var l = xs.length < ys.length ? xs.length : ys.length;
        var result = new Array(l);
        for (var i = 0; i < l; i++) {
          result[i] = f(xs[i])(ys[i]);
        }
        return result;
      };
    };
  };
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
    "use strict";

  exports.unfoldrArrayImpl = function (isNothing) {
    return function (fromJust) {
      return function (fst) {
        return function (snd) {
          return function (f) {
            return function (b) {
              var result = [];
              var value = b;
              while (true) { // eslint-disable-line no-constant-condition
                var maybe = f(value);
                if (isNothing(maybe)) return result;
                var tuple = fromJust(maybe);
                result.push(fst(tuple));
                value = snd(tuple);
              }
            };
          };
        };
      };
    };
  };
})(PS["Data.Unfoldable"] = PS["Data.Unfoldable"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Unfoldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var Unfoldable = function (unfoldr) {
      this.unfoldr = unfoldr;
  };
  var unfoldr = function (dict) {
      return dict.unfoldr;
  };
  var unfoldableArray = new Unfoldable($foreign.unfoldrArrayImpl(Data_Maybe.isNothing)(Data_Maybe.fromJust())(Data_Tuple.fst)(Data_Tuple.snd));
  exports["Unfoldable"] = Unfoldable;
  exports["unfoldr"] = unfoldr;
  exports["unfoldableArray"] = unfoldableArray;
})(PS["Data.Unfoldable"] = PS["Data.Unfoldable"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_FoldableWithIndex = PS["Data.FoldableWithIndex"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semigroup_Foldable = PS["Data.Semigroup.Foldable"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_TraversableWithIndex = PS["Data.TraversableWithIndex"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_Unfoldable1 = PS["Data.Unfoldable1"];
  var Prelude = PS["Prelude"];        
  var NonEmpty = (function () {
      function NonEmpty(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      NonEmpty.create = function (value0) {
          return function (value1) {
              return new NonEmpty(value0, value1);
          };
      };
      return NonEmpty;
  })();
  var singleton = function (dictPlus) {
      return function (a) {
          return new NonEmpty(a, Control_Plus.empty(dictPlus));
      };
  };
  var showNonEmpty = function (dictShow) {
      return function (dictShow1) {
          return new Data_Show.Show(function (v) {
              return "(NonEmpty " + (Data_Show.show(dictShow)(v.value0) + (" " + (Data_Show.show(dictShow1)(v.value1) + ")")));
          });
      };
  };
  var functorNonEmpty = function (dictFunctor) {
      return new Data_Functor.Functor(function (f) {
          return function (v) {
              return new NonEmpty(f(v.value0), Data_Functor.map(dictFunctor)(f)(v.value1));
          };
      });
  };
  exports["NonEmpty"] = NonEmpty;
  exports["singleton"] = singleton;
  exports["showNonEmpty"] = showNonEmpty;
  exports["functorNonEmpty"] = functorNonEmpty;
})(PS["Data.NonEmpty"] = PS["Data.NonEmpty"] || {});
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
  exports["range"] = $foreign.range;
  exports["length"] = $foreign.length;
  exports["zipWith"] = $foreign.zipWith;
})(PS["Data.Array"] = PS["Data.Array"] || {});
(function(exports) {
    "use strict";

  exports.toForeign = function (value) {
    return value;
  };

  exports.unsafeFromForeign = function (value) {
    return value;
  };

  exports.typeOf = function (value) {
    return typeof value;
  };

  exports.tagOf = function (value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };

  exports.isNull = function (value) {
    return value === null;
  };

  exports.isUndefined = function (value) {
    return value === undefined;
  };

  exports.isArray = Array.isArray || function (value) {
    return Object.prototype.toString.call(value) === "[object Array]";
  };
})(PS["Data.Foreign"] = PS["Data.Foreign"] || {});
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
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Comonad = PS["Control.Comonad"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Control_MonadPlus = PS["Control.MonadPlus"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_FoldableWithIndex = PS["Data.FoldableWithIndex"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semigroup_Foldable = PS["Data.Semigroup.Foldable"];
  var Data_Semigroup_Traversable = PS["Data.Semigroup.Traversable"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_TraversableWithIndex = PS["Data.TraversableWithIndex"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Prelude = PS["Prelude"];        
  var Nil = (function () {
      function Nil() {

      };
      Nil.value = new Nil();
      return Nil;
  })();
  var Cons = (function () {
      function Cons(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Cons.create = function (value0) {
          return function (value1) {
              return new Cons(value0, value1);
          };
      };
      return Cons;
  })();
  var NonEmptyList = function (x) {
      return x;
  };
  var foldableList = new Data_Foldable.Foldable(function (dictMonoid) {
      return function (f) {
          return Data_Foldable.foldl(foldableList)(function (acc) {
              return function ($158) {
                  return Data_Semigroup.append(dictMonoid.Semigroup0())(acc)(f($158));
              };
          })(Data_Monoid.mempty(dictMonoid));
      };
  }, function (f) {
      var go = function ($copy_b) {
          return function ($copy_v) {
              var $tco_var_b = $copy_b;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(b, v) {
                  if (v instanceof Nil) {
                      $tco_done = true;
                      return b;
                  };
                  if (v instanceof Cons) {
                      $tco_var_b = f(b)(v.value0);
                      $copy_v = v.value1;
                      return;
                  };
                  throw new Error("Failed pattern match at Data.List.Types line 81, column 12 - line 83, column 30: " + [ v.constructor.name ]);
              };
              while (!$tco_done) {
                  $tco_result = $tco_loop($tco_var_b, $copy_v);
              };
              return $tco_result;
          };
      };
      return go;
  }, function (f) {
      return function (b) {
          var rev = Data_Foldable.foldl(foldableList)(Data_Function.flip(Cons.create))(Nil.value);
          return function ($159) {
              return Data_Foldable.foldl(foldableList)(Data_Function.flip(f))(b)(rev($159));
          };
      };
  });
  var functorList = new Data_Functor.Functor(function (f) {
      return Data_Foldable.foldr(foldableList)(function (x) {
          return function (acc) {
              return new Cons(f(x), acc);
          };
      })(Nil.value);
  });
  var functorNonEmptyList = Data_NonEmpty.functorNonEmpty(functorList);
  var semigroupList = new Data_Semigroup.Semigroup(function (xs) {
      return function (ys) {
          return Data_Foldable.foldr(foldableList)(Cons.create)(ys)(xs);
      };
  });
  var showList = function (dictShow) {
      return new Data_Show.Show(function (v) {
          if (v instanceof Nil) {
              return "Nil";
          };
          return "(" + (Data_Foldable.intercalate(foldableList)(Data_Monoid.monoidString)(" : ")(Data_Functor.map(functorList)(Data_Show.show(dictShow))(v)) + " : Nil)");
      });
  };
  var showNonEmptyList = function (dictShow) {
      return new Data_Show.Show(function (v) {
          return "(NonEmptyList " + (Data_Show.show(Data_NonEmpty.showNonEmpty(dictShow)(showList(dictShow)))(v) + ")");
      });
  }; 
  var applyList = new Control_Apply.Apply(function () {
      return functorList;
  }, function (v) {
      return function (v1) {
          if (v instanceof Nil) {
              return Nil.value;
          };
          if (v instanceof Cons) {
              return Data_Semigroup.append(semigroupList)(Data_Functor.map(functorList)(v.value0)(v1))(Control_Apply.apply(applyList)(v.value1)(v1));
          };
          throw new Error("Failed pattern match at Data.List.Types line 120, column 1 - line 120, column 33: " + [ v.constructor.name, v1.constructor.name ]);
      };
  });
  var applyNonEmptyList = new Control_Apply.Apply(function () {
      return functorNonEmptyList;
  }, function (v) {
      return function (v1) {
          return new Data_NonEmpty.NonEmpty(v.value0(v1.value0), Data_Semigroup.append(semigroupList)(Control_Apply.apply(applyList)(v.value1)(new Cons(v1.value0, Nil.value)))(Control_Apply.apply(applyList)(new Cons(v.value0, v.value1))(v1.value1)));
      };
  });                                              
  var altList = new Control_Alt.Alt(function () {
      return functorList;
  }, Data_Semigroup.append(semigroupList));
  var plusList = new Control_Plus.Plus(function () {
      return altList;
  }, Nil.value);
  var applicativeNonEmptyList = new Control_Applicative.Applicative(function () {
      return applyNonEmptyList;
  }, function ($168) {
      return NonEmptyList(Data_NonEmpty.singleton(plusList)($168));
  });
  exports["Nil"] = Nil;
  exports["Cons"] = Cons;
  exports["NonEmptyList"] = NonEmptyList;
  exports["showList"] = showList;
  exports["semigroupList"] = semigroupList;
  exports["functorList"] = functorList;
  exports["foldableList"] = foldableList;
  exports["applyList"] = applyList;
  exports["altList"] = altList;
  exports["plusList"] = plusList;
  exports["showNonEmptyList"] = showNonEmptyList;
  exports["functorNonEmptyList"] = functorNonEmptyList;
  exports["applyNonEmptyList"] = applyNonEmptyList;
  exports["applicativeNonEmptyList"] = applicativeNonEmptyList;
})(PS["Data.List.Types"] = PS["Data.List.Types"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Lazy = PS["Control.Lazy"];
  var Control_Monad_Rec_Class = PS["Control.Monad.Rec.Class"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];                                                   
  var uncons = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof Data_List_Types.Cons) {
          return new Data_Maybe.Just({
              head: v.value0,
              tail: v.value1
          });
      };
      throw new Error("Failed pattern match at Data.List line 259, column 1 - line 259, column 66: " + [ v.constructor.name ]);
  };
  var toUnfoldable = function (dictUnfoldable) {
      return Data_Unfoldable.unfoldr(dictUnfoldable)(function (xs) {
          return Data_Functor.map(Data_Maybe.functorMaybe)(function (rec) {
              return new Data_Tuple.Tuple(rec.head, rec.tail);
          })(uncons(xs));
      });
  };
  var tail = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof Data_List_Types.Cons) {
          return new Data_Maybe.Just(v.value1);
      };
      throw new Error("Failed pattern match at Data.List line 245, column 1 - line 245, column 43: " + [ v.constructor.name ]);
  };
  var singleton = function (a) {
      return new Data_List_Types.Cons(a, Data_List_Types.Nil.value);
  };
  var $$null = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return true;
      };
      return false;
  };
  var head = function (v) {
      if (v instanceof Data_List_Types.Nil) {
          return Data_Maybe.Nothing.value;
      };
      if (v instanceof Data_List_Types.Cons) {
          return new Data_Maybe.Just(v.value0);
      };
      throw new Error("Failed pattern match at Data.List line 230, column 1 - line 230, column 22: " + [ v.constructor.name ]);
  };
  var fromFoldable = function (dictFoldable) {
      return Data_Foldable.foldr(dictFoldable)(Data_List_Types.Cons.create)(Data_List_Types.Nil.value);
  };
  exports["toUnfoldable"] = toUnfoldable;
  exports["fromFoldable"] = fromFoldable;
  exports["singleton"] = singleton;
  exports["null"] = $$null;
  exports["head"] = head;
  exports["tail"] = tail;
  exports["uncons"] = uncons;
})(PS["Data.List"] = PS["Data.List"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_NonEmpty = PS["Data.NonEmpty"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semigroup_Foldable = PS["Data.Semigroup.Foldable"];
  var Data_Semigroup_Traversable = PS["Data.Semigroup.Traversable"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];
  var singleton = function ($160) {
      return Data_List_Types.NonEmptyList(Data_NonEmpty.singleton(Data_List_Types.plusList)($160));
  };
  exports["singleton"] = singleton;
})(PS["Data.List.NonEmpty"] = PS["Data.List.NonEmpty"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Foreign"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Monad_Error_Class = PS["Control.Monad.Error.Class"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Identity = PS["Data.Identity"];
  var Data_Int = PS["Data.Int"];
  var Data_List_NonEmpty = PS["Data.List.NonEmpty"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_String = PS["Data.String"];
  var Prelude = PS["Prelude"];        
  var ForeignError = (function () {
      function ForeignError(value0) {
          this.value0 = value0;
      };
      ForeignError.create = function (value0) {
          return new ForeignError(value0);
      };
      return ForeignError;
  })();
  var TypeMismatch = (function () {
      function TypeMismatch(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      TypeMismatch.create = function (value0) {
          return function (value1) {
              return new TypeMismatch(value0, value1);
          };
      };
      return TypeMismatch;
  })();
  var ErrorAtIndex = (function () {
      function ErrorAtIndex(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtIndex.create = function (value0) {
          return function (value1) {
              return new ErrorAtIndex(value0, value1);
          };
      };
      return ErrorAtIndex;
  })();
  var ErrorAtProperty = (function () {
      function ErrorAtProperty(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      ErrorAtProperty.create = function (value0) {
          return function (value1) {
              return new ErrorAtProperty(value0, value1);
          };
      };
      return ErrorAtProperty;
  })();
  var JSONError = (function () {
      function JSONError(value0) {
          this.value0 = value0;
      };
      JSONError.create = function (value0) {
          return new JSONError(value0);
      };
      return JSONError;
  })();
  var showForeignError = new Data_Show.Show(function (v) {
      if (v instanceof ForeignError) {
          return "(ForeignError " + (Data_Show.show(Data_Show.showString)(v.value0) + ")");
      };
      if (v instanceof ErrorAtIndex) {
          return "(ErrorAtIndex " + (Data_Show.show(Data_Show.showInt)(v.value0) + (" " + (Data_Show.show(showForeignError)(v.value1) + ")")));
      };
      if (v instanceof ErrorAtProperty) {
          return "(ErrorAtProperty " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + (Data_Show.show(showForeignError)(v.value1) + ")")));
      };
      if (v instanceof JSONError) {
          return "(JSONError " + (Data_Show.show(Data_Show.showString)(v.value0) + ")");
      };
      if (v instanceof TypeMismatch) {
          return "(TypeMismatch " + (Data_Show.show(Data_Show.showString)(v.value0) + (" " + (Data_Show.show(Data_Show.showString)(v.value1) + ")")));
      };
      throw new Error("Failed pattern match at Data.Foreign line 64, column 1 - line 64, column 47: " + [ v.constructor.name ]);
  });
  var fail = function ($121) {
      return Control_Monad_Error_Class.throwError(Control_Monad_Except_Trans.monadThrowExceptT(Data_Identity.monadIdentity))(Data_List_NonEmpty.singleton($121));
  };
  var readArray = function (value) {
      if ($foreign.isArray(value)) {
          return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))($foreign.unsafeFromForeign(value));
      };
      if (Data_Boolean.otherwise) {
          return fail(new TypeMismatch("array", $foreign.tagOf(value)));
      };
      throw new Error("Failed pattern match at Data.Foreign line 145, column 1 - line 145, column 42: " + [ value.constructor.name ]);
  };
  var unsafeReadTagged = function (tag) {
      return function (value) {
          if ($foreign.tagOf(value) === tag) {
              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))($foreign.unsafeFromForeign(value));
          };
          if (Data_Boolean.otherwise) {
              return fail(new TypeMismatch(tag, $foreign.tagOf(value)));
          };
          throw new Error("Failed pattern match at Data.Foreign line 104, column 1 - line 104, column 55: " + [ tag.constructor.name, value.constructor.name ]);
      };
  };                                            
  var readNumber = unsafeReadTagged("Number");
  var readInt = function (value) {
      var error = Data_Either.Left.create(Data_List_NonEmpty.singleton(new TypeMismatch("Int", $foreign.tagOf(value))));
      var fromNumber = function ($122) {
          return Data_Maybe.maybe(error)(Control_Applicative.pure(Data_Either.applicativeEither))(Data_Int.fromNumber($122));
      };
      return Control_Monad_Except.mapExcept(Data_Either.either(Data_Function["const"](error))(fromNumber))(readNumber(value));
  };
  var readString = unsafeReadTagged("String");
  exports["ForeignError"] = ForeignError;
  exports["TypeMismatch"] = TypeMismatch;
  exports["ErrorAtIndex"] = ErrorAtIndex;
  exports["ErrorAtProperty"] = ErrorAtProperty;
  exports["JSONError"] = JSONError;
  exports["unsafeReadTagged"] = unsafeReadTagged;
  exports["readString"] = readString;
  exports["readNumber"] = readNumber;
  exports["readInt"] = readInt;
  exports["readArray"] = readArray;
  exports["fail"] = fail;
  exports["showForeignError"] = showForeignError;
  exports["toForeign"] = $foreign.toForeign;
  exports["typeOf"] = $foreign.typeOf;
  exports["isNull"] = $foreign.isNull;
  exports["isUndefined"] = $foreign.isUndefined;
})(PS["Data.Foreign"] = PS["Data.Foreign"] || {});
(function(exports) {
    "use strict";

  exports._copyEff = function (m) {
    return function () {
      var r = {};
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r[k] = m[k];
        }
      }
      return r;
    };
  };

  exports.empty = {};

  exports.runST = function (f) {
    return f;
  };

  exports._foldM = function (bind) {
    return function (f) {
      return function (mz) {
        return function (m) {
          var acc = mz;
          function g(k) {
            return function (z) {
              return f(z)(k)(m[k]);
            };
          }
          for (var k in m) {
            if (hasOwnProperty.call(m, k)) {
              acc = bind(acc)(g(k));
            }
          }
          return acc;
        };
      };
    };
  };

  function toArrayWithKey(f) {
    return function (m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }
})(PS["Data.StrMap"] = PS["Data.StrMap"] || {});
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

  exports["new"] = function () {
    return {};
  };

  exports.poke = function (m) {
    return function (k) {
      return function (v) {
        return function () {
          m[k] = v;
          return m;
        };
      };
    };
  };
})(PS["Data.StrMap.ST"] = PS["Data.StrMap.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.StrMap.ST"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Maybe = PS["Data.Maybe"];
  exports["new"] = $foreign["new"];
  exports["poke"] = $foreign.poke;
})(PS["Data.StrMap.ST"] = PS["Data.StrMap.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.StrMap"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Array = PS["Data.Array"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_FoldableWithIndex = PS["Data.FoldableWithIndex"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Functor = PS["Data.Functor"];
  var Data_FunctorWithIndex = PS["Data.FunctorWithIndex"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_StrMap_ST = PS["Data.StrMap.ST"];
  var Data_Traversable = PS["Data.Traversable"];
  var Data_TraversableWithIndex = PS["Data.TraversableWithIndex"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Prelude = PS["Prelude"];                                   
  var thawST = $foreign._copyEff;
  var pureST = function (f) {
      return Control_Monad_Eff.runPure($foreign.runST(f));
  };
  var singleton = function (k) {
      return function (v) {
          return pureST(function __do() {
              var v1 = Data_StrMap_ST["new"]();
              return Data_StrMap_ST.poke(v1)(k)(v)();
          });
      };
  };
  var mutate = function (f) {
      return function (m) {
          return pureST(function __do() {
              var v = thawST(m)();
              var v1 = f(v)();
              return v;
          });
      };
  };
  var foldM = function (dictMonad) {
      return function (f) {
          return function (z) {
              return $foreign._foldM(Control_Bind.bind(dictMonad.Bind1()))(f)(Control_Applicative.pure(dictMonad.Applicative0())(z));
          };
      };
  };
  var union = function (m) {
      return mutate(function (s) {
          return Data_Functor["void"](Control_Monad_Eff.functorEff)(foldM(Control_Monad_Eff.monadEff)(Data_StrMap_ST.poke)(s)(m));
      });
  };
  exports["singleton"] = singleton;
  exports["union"] = union;
  exports["foldM"] = foldM;
  exports["thawST"] = thawST;
  exports["pureST"] = pureST;
  exports["empty"] = $foreign.empty;
})(PS["Data.StrMap"] = PS["Data.StrMap"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Array = PS["Data.Array"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Internal = PS["Data.Foreign.Internal"];
  var Data_Foreign_NullOrUndefined = PS["Data.Foreign.NullOrUndefined"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Identity = PS["Data.Identity"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Traversable = PS["Data.Traversable"];
  var Prelude = PS["Prelude"];        
  var Decode = function (decode) {
      this.decode = decode;
  };
  var Encode = function (encode) {
      this.encode = encode;
  };                                                     
  var intEncode = new Encode(Data_Foreign.toForeign);
  var intDecode = new Decode(Data_Foreign.readInt);                                                                                    
  var encode = function (dict) {
      return dict.encode;
  };
  var decode = function (dict) {
      return dict.decode;
  };                                                       
  var arrayEncode = function (dictEncode) {
      return new Encode(function ($12) {
          return Data_Foreign.toForeign(Data_Functor.map(Data_Functor.functorArray)(encode(dictEncode))($12));
      });
  };
  var arrayDecode = function (dictDecode) {
      return new Decode((function () {
          var readElement = function (i) {
              return function (value) {
                  return Control_Monad_Except.mapExcept(Data_Bifunctor.lmap(Data_Either.bifunctorEither)(Data_Functor.map(Data_List_Types.functorNonEmptyList)(Data_Foreign.ErrorAtIndex.create(i))))(decode(dictDecode)(value));
              };
          };
          var readElements = function (arr) {
              return Data_Traversable.sequence(Data_Traversable.traversableArray)(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_Array.zipWith(readElement)(Data_Array.range(0)(Data_Array.length(arr)))(arr));
          };
          return Control_Bind.composeKleisli(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign.readArray)(readElements);
      })());
  };
  exports["decode"] = decode;
  exports["encode"] = encode;
  exports["Decode"] = Decode;
  exports["Encode"] = Encode;
  exports["intDecode"] = intDecode;
  exports["arrayDecode"] = arrayDecode;
  exports["intEncode"] = intEncode;
  exports["arrayEncode"] = arrayEncode;
})(PS["Data.Foreign.Class"] = PS["Data.Foreign.Class"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var TaggedObject = (function () {
      function TaggedObject(value0) {
          this.value0 = value0;
      };
      TaggedObject.create = function (value0) {
          return new TaggedObject(value0);
      };
      return TaggedObject;
  })();
  exports["TaggedObject"] = TaggedObject;
})(PS["Data.Foreign.Generic.Types"] = PS["Data.Foreign.Generic.Types"] || {});
(function(exports) {
    "use strict";

  exports.unsafeReadPropImpl = function (f, s, key, value) {
    return value == null ? f : s(value[key]);
  };

  exports.unsafeHasOwnProperty = function (prop, value) {
    return Object.prototype.hasOwnProperty.call(value, prop);
  };

  exports.unsafeHasProperty = function (prop, value) {
    return prop in value;
  };
})(PS["Data.Foreign.Index"] = PS["Data.Foreign.Index"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Foreign.Index"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Identity = PS["Data.Identity"];
  var Data_List_NonEmpty = PS["Data.List.NonEmpty"];
  var Prelude = PS["Prelude"];        
  var Index = function (errorAt, hasOwnProperty, hasProperty, index) {
      this.errorAt = errorAt;
      this.hasOwnProperty = hasOwnProperty;
      this.hasProperty = hasProperty;
      this.index = index;
  };
  var unsafeReadProp = function (k) {
      return function (value) {
          return $foreign.unsafeReadPropImpl(Data_Foreign.fail(new Data_Foreign.TypeMismatch("object", Data_Foreign.typeOf(value))), Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity)), k, value);
      };
  };
  var readProp = unsafeReadProp;
  var index = function (dict) {
      return dict.index;
  }; 
  var hasPropertyImpl = function (v) {
      return function (value) {
          if (Data_Foreign.isNull(value)) {
              return false;
          };
          if (Data_Foreign.isUndefined(value)) {
              return false;
          };
          if (Data_Foreign.typeOf(value) === "object" || Data_Foreign.typeOf(value) === "function") {
              return $foreign.unsafeHasProperty(v, value);
          };
          return false;
      };
  };
  var hasProperty = function (dict) {
      return dict.hasProperty;
  };
  var hasOwnPropertyImpl = function (v) {
      return function (value) {
          if (Data_Foreign.isNull(value)) {
              return false;
          };
          if (Data_Foreign.isUndefined(value)) {
              return false;
          };
          if (Data_Foreign.typeOf(value) === "object" || Data_Foreign.typeOf(value) === "function") {
              return $foreign.unsafeHasOwnProperty(v, value);
          };
          return false;
      };
  };                                                                                                                             
  var indexString = new Index(Data_Foreign.ErrorAtProperty.create, hasOwnPropertyImpl, hasPropertyImpl, Data_Function.flip(readProp));
  var hasOwnProperty = function (dict) {
      return dict.hasOwnProperty;
  };
  var errorAt = function (dict) {
      return dict.errorAt;
  };
  exports["Index"] = Index;
  exports["readProp"] = readProp;
  exports["index"] = index;
  exports["hasProperty"] = hasProperty;
  exports["hasOwnProperty"] = hasOwnProperty;
  exports["errorAt"] = errorAt;
  exports["indexString"] = indexString;
})(PS["Data.Foreign.Index"] = PS["Data.Foreign.Index"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Maybe = PS["Data.Maybe"];
  var Product = (function () {
      function Product(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      Product.create = function (value0) {
          return function (value1) {
              return new Product(value0, value1);
          };
      };
      return Product;
  })();
  var Field = function (x) {
      return x;
  };
  var Constructor = function (x) {
      return x;
  };
  var Generic = function (from, to) {
      this.from = from;
      this.to = to;
  };
  var to = function (dict) {
      return dict.to;
  }; 
  var from = function (dict) {
      return dict.from;
  };
  exports["Generic"] = Generic;
  exports["to"] = to;
  exports["from"] = from;
  exports["Product"] = Product;
  exports["Constructor"] = Constructor;
  exports["Field"] = Field;
})(PS["Data.Generic.Rep"] = PS["Data.Generic.Rep"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Semigroup = PS["Data.Semigroup"];
  var Prelude = PS["Prelude"];
  var Unsafe_Coerce = PS["Unsafe.Coerce"];        
  var SProxy = (function () {
      function SProxy() {

      };
      SProxy.value = new SProxy();
      return SProxy;
  })();
  var IsSymbol = function (reflectSymbol) {
      this.reflectSymbol = reflectSymbol;
  };
  var reflectSymbol = function (dict) {
      return dict.reflectSymbol;
  };
  exports["IsSymbol"] = IsSymbol;
  exports["reflectSymbol"] = reflectSymbol;
  exports["SProxy"] = SProxy;
})(PS["Data.Symbol"] = PS["Data.Symbol"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_BooleanAlgebra = PS["Data.BooleanAlgebra"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_CommutativeRing = PS["Data.CommutativeRing"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];
  var $$Proxy = (function () {
      function $$Proxy() {

      };
      $$Proxy.value = new $$Proxy();
      return $$Proxy;
  })();
  exports["Proxy"] = $$Proxy;
})(PS["Type.Proxy"] = PS["Type.Proxy"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var Data_Foreign_Generic_Types = PS["Data.Foreign.Generic.Types"];
  var Data_Foreign_Index = PS["Data.Foreign.Index"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Generic_Rep = PS["Data.Generic.Rep"];
  var Data_Identity = PS["Data.Identity"];
  var Data_List = PS["Data.List"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_StrMap = PS["Data.StrMap"];
  var Data_Symbol = PS["Data.Symbol"];
  var Data_Unfoldable = PS["Data.Unfoldable"];
  var Prelude = PS["Prelude"];
  var Type_Proxy = PS["Type.Proxy"];        
  var GenericDecode = function (decodeOpts) {
      this.decodeOpts = decodeOpts;
  };
  var GenericEncode = function (encodeOpts) {
      this.encodeOpts = encodeOpts;
  };
  var GenericDecodeArgs = function (decodeArgs) {
      this.decodeArgs = decodeArgs;
  };
  var GenericEncodeArgs = function (encodeArgs) {
      this.encodeArgs = encodeArgs;
  };
  var GenericDecodeFields = function (decodeFields) {
      this.decodeFields = decodeFields;
  };
  var GenericEncodeFields = function (encodeFields) {
      this.encodeFields = encodeFields;
  };
  var GenericCountArgs = function (countArgs) {
      this.countArgs = countArgs;
  };
  var genericEncodeFieldsField = function (dictIsSymbol) {
      return function (dictEncode) {
          return new GenericEncodeFields(function (opts) {
              return function (v) {
                  var name = opts.fieldTransform(Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value));
                  return Data_StrMap.singleton(name)(Data_Foreign_Class.encode(dictEncode)(v));
              };
          });
      };
  }; 
  var genericEncodeArgsArgument = function (dictEncode) {
      return new GenericEncodeArgs(function (v) {
          return function (v1) {
              return Data_List.singleton(Data_Foreign_Class.encode(dictEncode)(v1));
          };
      });
  }; 
  var genericDecodeFieldsField = function (dictIsSymbol) {
      return function (dictDecode) {
          return new GenericDecodeFields(function (opts) {
              return function (x) {
                  var name = opts.fieldTransform(Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value));
                  return Data_Functor.map(Control_Monad_Except_Trans.functorExceptT(Data_Identity.functorIdentity))(Data_Generic_Rep.Field)(Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign_Index.index(Data_Foreign_Index.indexString)(x)(name))(function ($158) {
                      return Control_Monad_Except.mapExcept(Data_Bifunctor.lmap(Data_Either.bifunctorEither)(Data_Functor.map(Data_List_Types.functorNonEmptyList)(Data_Foreign.ErrorAtProperty.create(name))))(Data_Foreign_Class.decode(dictDecode)($158));
                  }));
              };
          });
      };
  }; 
  var genericDecodeArgsArgument = function (dictDecode) {
      return new GenericDecodeArgs(function (v) {
          return function (v1) {
              return function (v2) {
                  if (v2 instanceof Data_List_Types.Cons) {
                      return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Control_Monad_Except.mapExcept(Data_Bifunctor.lmap(Data_Either.bifunctorEither)(Data_Functor.map(Data_List_Types.functorNonEmptyList)(Data_Foreign.ErrorAtIndex.create(v1))))(Data_Foreign_Class.decode(dictDecode)(v2.value0)))(function (v3) {
                          return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))({
                              result: v3,
                              rest: v2.value1,
                              next: v1 + 1 | 0
                          });
                      });
                  };
                  return Data_Foreign.fail(new Data_Foreign.ForeignError("Not enough constructor arguments"));
              };
          };
      });
  };
  var genericCountArgsRec = new GenericCountArgs(function (v) {
      return new Data_Either.Right(1);
  });
  var genericCountArgsArgument = new GenericCountArgs(function (v) {
      return new Data_Either.Right(1);
  });
  var encodeOpts = function (dict) {
      return dict.encodeOpts;
  };
  var encodeFields = function (dict) {
      return dict.encodeFields;
  };
  var genericEncodeArgsRec = function (dictGenericEncodeFields) {
      return new GenericEncodeArgs(function (opts) {
          return function (v) {
              return Data_List.singleton(Data_Foreign.toForeign(encodeFields(dictGenericEncodeFields)(opts)(v)));
          };
      });
  };
  var genericEncodeFieldsProduct = function (dictGenericEncodeFields) {
      return function (dictGenericEncodeFields1) {
          return new GenericEncodeFields(function (opts) {
              return function (v) {
                  return Data_StrMap.union(encodeFields(dictGenericEncodeFields)(opts)(v.value0))(encodeFields(dictGenericEncodeFields1)(opts)(v.value1));
              };
          });
      };
  };
  var encodeArgs = function (dict) {
      return dict.encodeArgs;
  };
  var genericEncodeConstructor = function (dictIsSymbol) {
      return function (dictGenericEncodeArgs) {
          return new GenericEncode(function (opts) {
              return function (v) {
                  var unwrapArguments = function (v1) {
                      if (v1.length === 0) {
                          return Data_Maybe.Nothing.value;
                      };
                      if (v1.length === 1 && opts.unwrapSingleArguments) {
                          return new Data_Maybe.Just(v1[0]);
                      };
                      return new Data_Maybe.Just(Data_Foreign.toForeign(v1));
                  };
                  var encodeArgsArray = function ($159) {
                      return unwrapArguments(Data_List.toUnfoldable(Data_Unfoldable.unfoldableArray)(encodeArgs(dictGenericEncodeArgs)(opts)($159)));
                  };
                  var ctorName = Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value);
                  if (opts.unwrapSingleConstructors) {
                      return Data_Maybe.maybe(Data_Foreign.toForeign({}))(Data_Foreign.toForeign)(encodeArgsArray(v));
                  };
                  return Data_Foreign.toForeign(Data_StrMap.union(Data_StrMap.singleton(opts.sumEncoding.value0.tagFieldName)(Data_Foreign.toForeign(opts.sumEncoding.value0.constructorTagTransform(ctorName))))(Data_Maybe.maybe(Data_StrMap.empty)(Data_StrMap.singleton(opts.sumEncoding.value0.contentsFieldName))(encodeArgsArray(v))));
              };
          });
      };
  };
  var decodeOpts = function (dict) {
      return dict.decodeOpts;
  };
  var decodeFields = function (dict) {
      return dict.decodeFields;
  };
  var genericDecodeArgsRec = function (dictGenericDecodeFields) {
      return new GenericDecodeArgs(function (v) {
          return function (v1) {
              return function (v2) {
                  if (v2 instanceof Data_List_Types.Cons) {
                      return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Control_Monad_Except.mapExcept(Data_Bifunctor.lmap(Data_Either.bifunctorEither)(Data_Functor.map(Data_List_Types.functorNonEmptyList)(Data_Foreign.ErrorAtIndex.create(v1))))(decodeFields(dictGenericDecodeFields)(v)(v2.value0)))(function (v3) {
                          return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))({
                              result: v3,
                              rest: v2.value1,
                              next: v1 + 1 | 0
                          });
                      });
                  };
                  return Data_Foreign.fail(new Data_Foreign.ForeignError("Not enough constructor arguments"));
              };
          };
      });
  };
  var genericDecodeFieldsProduct = function (dictGenericDecodeFields) {
      return function (dictGenericDecodeFields1) {
          return new GenericDecodeFields(function (opts) {
              return function (x) {
                  return Control_Apply.apply(Control_Monad_Except_Trans.applyExceptT(Data_Identity.monadIdentity))(Data_Functor.map(Control_Monad_Except_Trans.functorExceptT(Data_Identity.functorIdentity))(Data_Generic_Rep.Product.create)(decodeFields(dictGenericDecodeFields)(opts)(x)))(decodeFields(dictGenericDecodeFields1)(opts)(x));
              };
          });
      };
  };
  var decodeArgs = function (dict) {
      return dict.decodeArgs;
  };
  var countArgs = function (dict) {
      return dict.countArgs;
  };
  var genericDecodeConstructor = function (dictIsSymbol) {
      return function (dictGenericDecodeArgs) {
          return function (dictGenericCountArgs) {
              return new GenericDecode(function (opts) {
                  return function (f) {
                      var numArgs = countArgs(dictGenericCountArgs)(Type_Proxy["Proxy"].value);
                      var readArguments = function (args) {
                          if (numArgs instanceof Data_Either.Left) {
                              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(numArgs.value0);
                          };
                          if (numArgs instanceof Data_Either.Right && (numArgs.value0 === 1 && opts.unwrapSingleArguments)) {
                              return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(decodeArgs(dictGenericDecodeArgs)(opts)(0)(Data_List.singleton(args)))(function (v) {
                                  return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Control_Applicative.unless(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_List["null"](v.rest))(Data_Foreign.fail(new Data_Foreign.ForeignError("Expected a single argument"))))(function () {
                                      return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(v.result);
                                  });
                              });
                          };
                          if (numArgs instanceof Data_Either.Right) {
                              return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign.readArray(args))(function (v) {
                                  return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(decodeArgs(dictGenericDecodeArgs)(opts)(0)(Data_List.fromFoldable(Data_Foldable.foldableArray)(v)))(function (v1) {
                                      return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Control_Applicative.unless(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(Data_List["null"](v1.rest))(Data_Foreign.fail(new Data_Foreign.ForeignError("Expected " + (Data_Show.show(Data_Show.showInt)(numArgs.value0) + " constructor arguments")))))(function () {
                                          return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(v1.result);
                                      });
                                  });
                              });
                          };
                          throw new Error("Failed pattern match at Data.Foreign.Generic.Class line 74, column 9 - line 86, column 24: " + [ numArgs.constructor.name ]);
                      };
                      var ctorName = Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value);
                      if (opts.unwrapSingleConstructors) {
                          return Data_Functor.map(Control_Monad_Except_Trans.functorExceptT(Data_Identity.functorIdentity))(Data_Generic_Rep.Constructor)(readArguments(f));
                      };
                      return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Control_Monad_Except.mapExcept(Data_Bifunctor.lmap(Data_Either.bifunctorEither)(Data_Functor.map(Data_List_Types.functorNonEmptyList)(Data_Foreign.ErrorAtProperty.create(opts.sumEncoding.value0.tagFieldName))))(Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign_Index.index(Data_Foreign_Index.indexString)(f)(opts.sumEncoding.value0.tagFieldName))(Data_Foreign.readString))(function (v) {
                          var expected = opts.sumEncoding.value0.constructorTagTransform(ctorName);
                          return Control_Bind.discard(Control_Bind.discardUnit)(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Control_Applicative.unless(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(v === expected)(Data_Foreign.fail(new Data_Foreign.ForeignError("Expected " + (Data_Show.show(Data_Show.showString)(expected) + " tag")))))(function () {
                              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(v);
                          });
                      })))(function (v) {
                          return Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Control_Monad_Except.mapExcept(Data_Bifunctor.lmap(Data_Either.bifunctorEither)(Data_Functor.map(Data_List_Types.functorNonEmptyList)(Data_Foreign.ErrorAtProperty.create(opts.sumEncoding.value0.contentsFieldName))))(Control_Bind.bind(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(Data_Foreign_Index.index(Data_Foreign_Index.indexString)(f)(opts.sumEncoding.value0.contentsFieldName))(readArguments)))(function (v1) {
                              return Control_Applicative.pure(Control_Monad_Except_Trans.applicativeExceptT(Data_Identity.monadIdentity))(v1);
                          });
                      });
                  };
              });
          };
      };
  };
  exports["countArgs"] = countArgs;
  exports["decodeArgs"] = decodeArgs;
  exports["decodeFields"] = decodeFields;
  exports["decodeOpts"] = decodeOpts;
  exports["encodeArgs"] = encodeArgs;
  exports["encodeFields"] = encodeFields;
  exports["encodeOpts"] = encodeOpts;
  exports["GenericDecode"] = GenericDecode;
  exports["GenericEncode"] = GenericEncode;
  exports["GenericDecodeArgs"] = GenericDecodeArgs;
  exports["GenericEncodeArgs"] = GenericEncodeArgs;
  exports["GenericDecodeFields"] = GenericDecodeFields;
  exports["GenericEncodeFields"] = GenericEncodeFields;
  exports["GenericCountArgs"] = GenericCountArgs;
  exports["genericDecodeConstructor"] = genericDecodeConstructor;
  exports["genericEncodeConstructor"] = genericEncodeConstructor;
  exports["genericDecodeArgsArgument"] = genericDecodeArgsArgument;
  exports["genericEncodeArgsArgument"] = genericEncodeArgsArgument;
  exports["genericDecodeArgsRec"] = genericDecodeArgsRec;
  exports["genericEncodeArgsRec"] = genericEncodeArgsRec;
  exports["genericDecodeFieldsField"] = genericDecodeFieldsField;
  exports["genericEncodeFieldsField"] = genericEncodeFieldsField;
  exports["genericDecodeFieldsProduct"] = genericDecodeFieldsProduct;
  exports["genericEncodeFieldsProduct"] = genericEncodeFieldsProduct;
  exports["genericCountArgsArgument"] = genericCountArgsArgument;
  exports["genericCountArgsRec"] = genericCountArgsRec;
})(PS["Data.Foreign.Generic.Class"] = PS["Data.Foreign.Generic.Class"] || {});
(function(exports) {
    "use strict";

  exports.parseJSONImpl = function (str) {
    return JSON.parse(str);
  };
})(PS["Data.Foreign.JSON"] = PS["Data.Foreign.JSON"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Foreign.JSON"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Control_Monad_Eff_Uncurried = PS["Control.Monad.Eff.Uncurried"];
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Bifunctor = PS["Data.Bifunctor"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Identity = PS["Data.Identity"];
  var Data_List_Types = PS["Data.List.Types"];
  var Prelude = PS["Prelude"];        
  var parseJSON = function ($0) {
      return Control_Monad_Except_Trans.ExceptT(Data_Identity.Identity(Data_Bifunctor.lmap(Data_Either.bifunctorEither)(function ($1) {
          return Control_Applicative.pure(Data_List_Types.applicativeNonEmptyList)(Data_Foreign.JSONError.create(Control_Monad_Eff_Exception.message($1)));
      })(Control_Monad_Eff.runPure(Control_Monad_Eff_Exception["try"](Control_Monad_Eff_Uncurried.runEffFn1($foreign.parseJSONImpl)($0))))));
  };
  exports["parseJSON"] = parseJSON;
})(PS["Data.Foreign.JSON"] = PS["Data.Foreign.JSON"] || {});
(function(exports) {
  /* globals exports, JSON */
  "use strict";

  // module Global.Unsafe

  exports.unsafeStringify = function (x) {
    return JSON.stringify(x);
  };
})(PS["Global.Unsafe"] = PS["Global.Unsafe"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Global.Unsafe"];
  exports["unsafeStringify"] = $foreign.unsafeStringify;
})(PS["Global.Unsafe"] = PS["Global.Unsafe"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Monad_Except_Trans = PS["Control.Monad.Except.Trans"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var Data_Foreign_Generic_Class = PS["Data.Foreign.Generic.Class"];
  var Data_Foreign_Generic_Types = PS["Data.Foreign.Generic.Types"];
  var Data_Foreign_JSON = PS["Data.Foreign.JSON"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Generic_Rep = PS["Data.Generic.Rep"];
  var Data_Identity = PS["Data.Identity"];
  var Global_Unsafe = PS["Global.Unsafe"];
  var Prelude = PS["Prelude"];        
  var genericEncode = function (dictGeneric) {
      return function (dictGenericEncode) {
          return function (opts) {
              return function ($10) {
                  return Data_Foreign_Generic_Class.encodeOpts(dictGenericEncode)(opts)(Data_Generic_Rep.from(dictGeneric)($10));
              };
          };
      };
  };
  var genericEncodeJSON = function (dictGeneric) {
      return function (dictGenericEncode) {
          return function (opts) {
              return function ($11) {
                  return Global_Unsafe.unsafeStringify(genericEncode(dictGeneric)(dictGenericEncode)(opts)($11));
              };
          };
      };
  };
  var genericDecode = function (dictGeneric) {
      return function (dictGenericDecode) {
          return function (opts) {
              return function ($12) {
                  return Data_Functor.map(Control_Monad_Except_Trans.functorExceptT(Data_Identity.functorIdentity))(Data_Generic_Rep.to(dictGeneric))(Data_Foreign_Generic_Class.decodeOpts(dictGenericDecode)(opts)($12));
              };
          };
      };
  };
  var genericDecodeJSON = function (dictGeneric) {
      return function (dictGenericDecode) {
          return function (opts) {
              return Control_Bind.composeKleisliFlipped(Control_Monad_Except_Trans.bindExceptT(Data_Identity.monadIdentity))(genericDecode(dictGeneric)(dictGenericDecode)(opts))(Data_Foreign_JSON.parseJSON);
          };
      };
  };
  var defaultOptions = {
      sumEncoding: new Data_Foreign_Generic_Types.TaggedObject({
          tagFieldName: "tag",
          contentsFieldName: "contents",
          constructorTagTransform: Control_Category.id(Control_Category.categoryFn)
      }),
      unwrapSingleConstructors: false,
      unwrapSingleArguments: true,
      fieldTransform: Control_Category.id(Control_Category.categoryFn)
  };
  exports["defaultOptions"] = defaultOptions;
  exports["genericDecode"] = genericDecode;
  exports["genericEncode"] = genericEncode;
  exports["genericDecodeJSON"] = genericDecodeJSON;
  exports["genericEncodeJSON"] = genericEncodeJSON;
})(PS["Data.Foreign.Generic"] = PS["Data.Foreign.Generic"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Generic_Rep = PS["Data.Generic.Rep"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Symbol = PS["Data.Symbol"];
  var Prelude = PS["Prelude"];        
  var GenericShow = function (genericShow$prime) {
      this["genericShow'"] = genericShow$prime;
  };
  var GenericShowArgs = function (genericShowArgs) {
      this.genericShowArgs = genericShowArgs;
  };
  var GenericShowFields = function (genericShowFields) {
      this.genericShowFields = genericShowFields;
  }; 
  var genericShowFieldsField = function (dictShow) {
      return function (dictIsSymbol) {
          return new GenericShowFields(function (v) {
              return [ Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value) + (": " + Data_Show.show(dictShow)(v)) ];
          });
      };
  };
  var genericShowFields = function (dict) {
      return dict.genericShowFields;
  };
  var genericShowFieldsProduct = function (dictGenericShowFields) {
      return function (dictGenericShowFields1) {
          return new GenericShowFields(function (v) {
              return Data_Semigroup.append(Data_Semigroup.semigroupArray)(genericShowFields(dictGenericShowFields)(v.value0))(genericShowFields(dictGenericShowFields1)(v.value1));
          });
      };
  };
  var genericShowArgsRec = function (dictGenericShowFields) {
      return new GenericShowArgs(function (v) {
          return [ "{ " + (Data_Foldable.intercalate(Data_Foldable.foldableArray)(Data_Monoid.monoidString)(", ")(genericShowFields(dictGenericShowFields)(v)) + " }") ];
      });
  }; 
  var genericShowArgsArgument = function (dictShow) {
      return new GenericShowArgs(function (v) {
          return [ Data_Show.show(dictShow)(v) ];
      });
  };
  var genericShowArgs = function (dict) {
      return dict.genericShowArgs;
  };
  var genericShowConstructor = function (dictGenericShowArgs) {
      return function (dictIsSymbol) {
          return new GenericShow(function (v) {
              var ctor = Data_Symbol.reflectSymbol(dictIsSymbol)(Data_Symbol.SProxy.value);
              var v1 = genericShowArgs(dictGenericShowArgs)(v);
              if (v1.length === 0) {
                  return ctor;
              };
              return "(" + (Data_Foldable.intercalate(Data_Foldable.foldableArray)(Data_Monoid.monoidString)(" ")(Data_Semigroup.append(Data_Semigroup.semigroupArray)([ ctor ])(v1)) + ")");
          });
      };
  };
  var genericShow$prime = function (dict) {
      return dict["genericShow'"];
  };
  var genericShow = function (dictGeneric) {
      return function (dictGenericShow) {
          return function (x) {
              return genericShow$prime(dictGenericShow)(Data_Generic_Rep.from(dictGeneric)(x));
          };
      };
  };
  exports["GenericShow"] = GenericShow;
  exports["genericShow"] = genericShow;
  exports["GenericShowArgs"] = GenericShowArgs;
  exports["genericShowArgs"] = genericShowArgs;
  exports["GenericShowFields"] = GenericShowFields;
  exports["genericShowFields"] = genericShowFields;
  exports["genericShowFieldsProduct"] = genericShowFieldsProduct;
  exports["genericShowConstructor"] = genericShowConstructor;
  exports["genericShowArgsArgument"] = genericShowArgsArgument;
  exports["genericShowArgsRec"] = genericShowArgsRec;
  exports["genericShowFieldsField"] = genericShowFieldsField;
})(PS["Data.Generic.Rep.Show"] = PS["Data.Generic.Rep.Show"] || {});
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
  var key_ = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("key", Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var id_ = function (dictPresent) {
      return function (val) {
          return new SimpleAttribute("id", Oak_Html_Present.present(dictPresent)(val));
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
  exports["id_"] = id_;
  exports["key_"] = key_;
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
(function(exports) {exports.fetchImpl = function(left, right, url, options, decoder) {
    return function(handler) {
      fetch(url, options).then(function(resp) {
        return resp.text();
      }).then(function(resp) {
        handler(decoder(right(resp)))();
      }).catch(function(err) {
        handler(decoder(left(String(err))))();
      });
    };
  };
})(PS["Oak.Cmd.Http"] = PS["Oak.Cmd.Http"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Monad_Except = PS["Control.Monad.Except"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign = PS["Data.Foreign"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var Data_Foreign_Generic = PS["Data.Foreign.Generic"];
  var Data_Foreign_Generic_Class = PS["Data.Foreign.Generic.Class"];
  var Data_Foreign_Generic_Types = PS["Data.Foreign.Generic.Types"];
  var Data_Function = PS["Data.Function"];
  var Data_Generic_Rep = PS["Data.Generic.Rep"];
  var Data_List_Types = PS["Data.List.Types"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
  var codingOptions = (function () {
      var $11 = {};
      for (var $12 in Data_Foreign_Generic.defaultOptions) {
          if ({}.hasOwnProperty.call(Data_Foreign_Generic.defaultOptions, $12)) {
              $11[$12] = Data_Foreign_Generic["defaultOptions"][$12];
          };
      };
      $11.unwrapSingleConstructors = true;
      return $11;
  })();
  var defaultDecode = function (dictGeneric) {
      return function (dictGenericDecode) {
          return Data_Foreign_Generic.genericDecode(dictGeneric)(dictGenericDecode)(codingOptions);
      };
  };
  var defaultEncode = function (dictGeneric) {
      return function (dictGenericEncode) {
          return Data_Foreign_Generic.genericEncode(dictGeneric)(dictGenericEncode)(codingOptions);
      };
  };
  var makeDecoder = function (dictGeneric) {
      return function (dictGenericDecode) {
          return function (dictDecode) {
              return function (json) {
                  var v = Control_Monad_Except.runExcept(Data_Foreign_Generic.genericDecodeJSON(dictGeneric)(dictGenericDecode)(codingOptions)(json));
                  if (v instanceof Data_Either.Left) {
                      return new Data_Either.Left(Data_Show.show(Data_List_Types.showNonEmptyList(Data_Foreign.showForeignError))(v.value0));
                  };
                  if (v instanceof Data_Either.Right) {
                      return new Data_Either.Right(v.value0);
                  };
                  throw new Error("Failed pattern match at Oak.Cmd.Http.Conversion line 58, column 3 - line 60, column 27: " + [ v.constructor.name ]);
              };
          };
      };
  };
  var makeEncoder = function (dictGeneric) {
      return function (dictGenericEncode) {
          return function (structured) {
              return Data_Foreign_Generic.genericEncodeJSON(dictGeneric)(dictGenericEncode)(codingOptions)(structured);
          };
      };
  };
  exports["defaultEncode"] = defaultEncode;
  exports["defaultDecode"] = defaultDecode;
  exports["makeEncoder"] = makeEncoder;
  exports["makeDecoder"] = makeDecoder;
})(PS["Oak.Cmd.Http.Conversion"] = PS["Oak.Cmd.Http.Conversion"] || {});
(function(exports) {// DUPLICATED FROM VIRTUALDOM/NATIVE.JS
  // foreign import concatOptionImpl :: ∀ eff event.
  //   Fn3 String String NativeOptions NativeOptions
  var concatOption = function(name, value, rest) {
    var result = Object.assign({}, rest);
    result[name] = value;
    return result;
  };
  exports.concatOptionImpl = concatOption;
  exports.concatNativeOptionsImpl = concatOption;


  // foreign import emptyOptions :: NativeOptions
  exports.emptyOptions = function() {
    return {};
  };
})(PS["Oak.Cmd.Http.Options"] = PS["Oak.Cmd.Http.Options"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Oak.Cmd.Http.Options"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Foreign_Generic_Class = PS["Data.Foreign.Generic.Class"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Generic_Rep = PS["Data.Generic.Rep"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Traversable = PS["Data.Traversable"];
  var Oak_Cmd_Http_Conversion = PS["Oak.Cmd.Http.Conversion"];
  var Prelude = PS["Prelude"];        
  var ApplicationJSON = (function () {
      function ApplicationJSON() {

      };
      ApplicationJSON.value = new ApplicationJSON();
      return ApplicationJSON;
  })();
  var Accept = (function () {
      function Accept(value0) {
          this.value0 = value0;
      };
      Accept.create = function (value0) {
          return new Accept(value0);
      };
      return Accept;
  })();
  var ContentType = (function () {
      function ContentType(value0) {
          this.value0 = value0;
      };
      ContentType.create = function (value0) {
          return new ContentType(value0);
      };
      return ContentType;
  })();
  var POST = (function () {
      function POST(value0) {
          this.value0 = value0;
      };
      POST.create = function (value0) {
          return new POST(value0);
      };
      return POST;
  })();
  var Headers = (function () {
      function Headers(value0) {
          this.value0 = value0;
      };
      Headers.create = function (value0) {
          return new Headers(value0);
      };
      return Headers;
  })();
  var showMediaType = new Data_Show.Show(function (v) {
      return "application/json; charset=utf-8";
  });
  var defaultHeaders = [ new Accept(ApplicationJSON.value) ];
  var defaultHeadersWithBody = Data_Semigroup.append(Data_Semigroup.semigroupArray)(defaultHeaders)([ new ContentType(ApplicationJSON.value) ]);
  var concatHeader = function (v) {
      return function (options) {
          if (v instanceof ContentType) {
              return $foreign.concatOptionImpl("Content-Type", Data_Show.show(showMediaType)(v.value0), options);
          };
          if (v instanceof Accept) {
              return $foreign.concatOptionImpl("Accept", Data_Show.show(showMediaType)(v.value0), options);
          };
          throw new Error("Failed pattern match at Oak.Cmd.Http.Options line 57, column 1 - line 60, column 21: " + [ v.constructor.name, options.constructor.name ]);
      };
  };
  var combineHeaders = function (headers) {
      return Data_Foldable.foldr(Data_Foldable.foldableArray)(concatHeader)($foreign.emptyOptions)(headers);
  };
  var concatOption = function (dictGeneric) {
      return function (dictGenericEncode) {
          return function (v) {
              return function (options) {
                  if (v instanceof POST) {
                      var postOptions = $foreign.concatOptionImpl("method", "POST", options);
                      return $foreign.concatOptionImpl("body", Oak_Cmd_Http_Conversion.makeEncoder(dictGeneric)(dictGenericEncode)(v.value0), postOptions);
                  };
                  if (v instanceof Headers) {
                      var nativeHeaders = combineHeaders(v.value0);
                      return $foreign.concatNativeOptionsImpl("headers", nativeHeaders, options);
                  };
                  return options;
              };
          };
      };
  };
  var combineOptions = function (dictGeneric) {
      return function (dictGenericEncode) {
          return function (options) {
              return Data_Foldable.foldr(Data_Foldable.foldableArray)(concatOption(dictGeneric)(dictGenericEncode))($foreign.emptyOptions)(options);
          };
      };
  };
  exports["ApplicationJSON"] = ApplicationJSON;
  exports["POST"] = POST;
  exports["Headers"] = Headers;
  exports["Accept"] = Accept;
  exports["ContentType"] = ContentType;
  exports["combineOptions"] = combineOptions;
  exports["defaultHeaders"] = defaultHeaders;
  exports["defaultHeadersWithBody"] = defaultHeadersWithBody;
  exports["showMediaType"] = showMediaType;
})(PS["Oak.Cmd.Http.Options"] = PS["Oak.Cmd.Http.Options"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Oak.Cmd.Http"];
  var Data_Either = PS["Data.Either"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var Data_Foreign_Generic_Class = PS["Data.Foreign.Generic.Class"];
  var Data_Function = PS["Data.Function"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Data_Generic_Rep = PS["Data.Generic.Rep"];
  var Data_Symbol = PS["Data.Symbol"];
  var Oak_Cmd = PS["Oak.Cmd"];
  var Oak_Cmd_Http_Conversion = PS["Oak.Cmd.Http.Conversion"];
  var Oak_Cmd_Http_Options = PS["Oak.Cmd.Http.Options"];
  var Prelude = PS["Prelude"];
  var fetch = function (dictGeneric) {
      return function (dictGenericDecode) {
          return function (dictDecode) {
              return function (dictGeneric1) {
                  return function (dictGenericEncode) {
                      return function (url) {
                          return function (options) {
                              return function (msgCtor) {
                                  var f = function (v) {
                                      if (v instanceof Data_Either.Left) {
                                          return msgCtor(new Data_Either.Left(v.value0));
                                      };
                                      if (v instanceof Data_Either.Right) {
                                          return msgCtor(Oak_Cmd_Http_Conversion.makeDecoder(dictGeneric)(dictGenericDecode)(dictDecode)(v.value0));
                                      };
                                      throw new Error("Failed pattern match at Oak.Cmd.Http line 92, column 5 - line 92, column 38: " + [ v.constructor.name ]);
                                  };
                                  return $foreign.fetchImpl(Data_Either.Left.create, Data_Either.Right.create, url, Oak_Cmd_Http_Options.combineOptions(dictGeneric1)(dictGenericEncode)(options), f);
                              };
                          };
                      };
                  };
              };
          };
      };
  };
  var post = function (dictGeneric) {
      return function (dictGenericDecode) {
          return function (dictDecode) {
              return function (dictGeneric1) {
                  return function (dictGenericEncode) {
                      return function (url) {
                          return function (body) {
                              return function (msgCtor) {
                                  return fetch(dictGeneric)(dictGenericDecode)(dictDecode)(dictGeneric1)(dictGenericEncode)(url)([ new Oak_Cmd_Http_Options.POST(body), new Oak_Cmd_Http_Options.Headers(Oak_Cmd_Http_Options.defaultHeadersWithBody) ])(msgCtor);
                              };
                          };
                      };
                  };
              };
          };
      };
  };
  exports["post"] = post;
})(PS["Oak.Cmd.Http"] = PS["Oak.Cmd.Http"] || {});
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
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_Eff_Exception = PS["Control.Monad.Eff.Exception"];
  var Data_Array = PS["Data.Array"];
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Either = PS["Data.Either"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Foreign_Class = PS["Data.Foreign.Class"];
  var Data_Foreign_Generic_Class = PS["Data.Foreign.Generic.Class"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Generic_Rep = PS["Data.Generic.Rep"];
  var Data_Generic_Rep_Show = PS["Data.Generic.Rep.Show"];
  var Data_Int = PS["Data.Int"];
  var Data_List = PS["Data.List"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Ring = PS["Data.Ring"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Show = PS["Data.Show"];
  var Data_Symbol = PS["Data.Symbol"];
  var Data_Tuple = PS["Data.Tuple"];
  var Data_Unit = PS["Data.Unit"];
  var $$Math = PS["Math"];
  var Oak = PS["Oak"];
  var Oak_Cmd = PS["Oak.Cmd"];
  var Oak_Cmd_Http = PS["Oak.Cmd.Http"];
  var Oak_Cmd_Http_Conversion = PS["Oak.Cmd.Http.Conversion"];
  var Oak_Cmd_Random = PS["Oak.Cmd.Random"];
  var Oak_Css = PS["Oak.Css"];
  var Oak_Document = PS["Oak.Document"];
  var Oak_Html = PS["Oak.Html"];
  var Oak_Html_Attribute = PS["Oak.Html.Attribute"];
  var Oak_Html_Events = PS["Oak.Html.Events"];
  var Oak_Html_Present = PS["Oak.Html.Present"];
  var Prelude = PS["Prelude"];
  var Quantities = PS["Quantities"];        
  var Center = (function () {
      function Center(value0) {
          this.value0 = value0;
      };
      Center.create = function (value0) {
          return new Center(value0);
      };
      return Center;
  })();
  var Centers = (function () {
      function Centers(value0) {
          this.value0 = value0;
      };
      Centers.create = function (value0) {
          return new Centers(value0);
      };
      return Centers;
  })();
  var GetRandom = (function () {
      function GetRandom() {

      };
      GetRandom.value = new GetRandom();
      return GetRandom;
  })();
  var GetCenters = (function () {
      function GetCenters(value0) {
          this.value0 = value0;
      };
      GetCenters.create = function (value0) {
          return new GetCenters(value0);
      };
      return GetCenters;
  })();
  var GotCenters = (function () {
      function GotCenters(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      GotCenters.create = function (value0) {
          return function (value1) {
              return new GotCenters(value0, value1);
          };
      };
      return GotCenters;
  })();
  var TransportModel = (function () {
      function TransportModel(value0) {
          this.value0 = value0;
      };
      TransportModel.create = function (value0) {
          return new TransportModel(value0);
      };
      return TransportModel;
  })();
  var update = function (v) {
      return function (model) {
          if (v instanceof GotCenters && v.value1 instanceof Data_Either.Right) {
              var $26 = {};
              for (var $27 in model) {
                  if ({}.hasOwnProperty.call(model, $27)) {
                      $26[$27] = model[$27];
                  };
              };
              $26.randomness = v.value0;
              $26.centers = v.value1.value0;
              return $26;
          };
          if (v instanceof GotCenters && v.value1 instanceof Data_Either.Left) {
              var $32 = {};
              for (var $33 in model) {
                  if ({}.hasOwnProperty.call(model, $33)) {
                      $32[$33] = model[$33];
                  };
              };
              $32.randomness = v.value0;
              $32.error = v.value1.value0;
              return $32;
          };
          return model;
      };
  };
  var spots = function (height) {
      return function (width) {
          return Control_Bind.bind(Control_Bind.bindArray)(Data_Array.range(1)(height))(function (v) {
              return Control_Bind.bind(Control_Bind.bindArray)(Data_Array.range(1)(width))(function (v1) {
                  return Control_Applicative.pure(Control_Applicative.applicativeArray)(new Center({
                      center_x: v1,
                      center_y: v
                  }));
              });
          });
      };
  };
  var positionAdjustment = 40;
  var init = function (v) {
      return {
          randomness: 50,
          height: 700,
          width: 1400,
          size: 40,
          padding: 15,
          limit: 10,
          centers: new Centers([  ]),
          error: ""
      };
  };
  var genericTransportModel = new Data_Generic_Rep.Generic(function (x) {
      return new Data_Generic_Rep.Product(x.value0.centers, new Data_Generic_Rep.Product(x.value0.limit, new Data_Generic_Rep.Product(x.value0.padding, new Data_Generic_Rep.Product(x.value0.randomness, x.value0.size))));
  }, function (x) {
      return new TransportModel({
          centers: x.value0,
          limit: x.value1.value0,
          padding: x.value1.value1.value0,
          randomness: x.value1.value1.value1.value0,
          size: x.value1.value1.value1.value1
      });
  });
  var genericCenters = new Data_Generic_Rep.Generic(function (x) {
      return x.value0;
  }, function (x) {
      return new Centers(x);
  });
  var genericCenter = new Data_Generic_Rep.Generic(function (x) {
      return new Data_Generic_Rep.Product(x.value0.center_x, x.value0.center_y);
  }, function (x) {
      return new Center({
          center_x: x.value0,
          center_y: x.value1
      });
  });
  var showCenter = new Data_Show.Show(Data_Generic_Rep_Show.genericShow(genericCenter)(Data_Generic_Rep_Show.genericShowConstructor(Data_Generic_Rep_Show.genericShowArgsRec(Data_Generic_Rep_Show.genericShowFieldsProduct(Data_Generic_Rep_Show.genericShowFieldsField(Data_Show.showInt)(new Data_Symbol.IsSymbol(function () {
      return "center_x";
  })))(Data_Generic_Rep_Show.genericShowFieldsField(Data_Show.showInt)(new Data_Symbol.IsSymbol(function () {
      return "center_y";
  })))))(new Data_Symbol.IsSymbol(function () {
      return "Center";
  }))));
  var showCenters = new Data_Show.Show(Data_Generic_Rep_Show.genericShow(genericCenters)(Data_Generic_Rep_Show.genericShowConstructor(Data_Generic_Rep_Show.genericShowArgsArgument(Data_Show.showArray(showCenter)))(new Data_Symbol.IsSymbol(function () {
      return "Centers";
  }))));
  var showTransportModel = new Data_Show.Show(Data_Generic_Rep_Show.genericShow(genericTransportModel)(Data_Generic_Rep_Show.genericShowConstructor(Data_Generic_Rep_Show.genericShowArgsRec(Data_Generic_Rep_Show.genericShowFieldsProduct(Data_Generic_Rep_Show.genericShowFieldsField(showCenters)(new Data_Symbol.IsSymbol(function () {
      return "centers";
  })))(Data_Generic_Rep_Show.genericShowFieldsProduct(Data_Generic_Rep_Show.genericShowFieldsField(Data_Show.showInt)(new Data_Symbol.IsSymbol(function () {
      return "limit";
  })))(Data_Generic_Rep_Show.genericShowFieldsProduct(Data_Generic_Rep_Show.genericShowFieldsField(Data_Show.showInt)(new Data_Symbol.IsSymbol(function () {
      return "padding";
  })))(Data_Generic_Rep_Show.genericShowFieldsProduct(Data_Generic_Rep_Show.genericShowFieldsField(Data_Show.showInt)(new Data_Symbol.IsSymbol(function () {
      return "randomness";
  })))(Data_Generic_Rep_Show.genericShowFieldsField(Data_Show.showInt)(new Data_Symbol.IsSymbol(function () {
      return "size";
  }))))))))(new Data_Symbol.IsSymbol(function () {
      return "TransportModel";
  }))));
  var factor = function (randomness) {
      return Data_Int.floor(randomness * 100.0);
  };
  var encodeCenter = new Data_Foreign_Class.Encode(Oak_Cmd_Http_Conversion.defaultEncode(genericCenter)(Data_Foreign_Generic_Class.genericEncodeConstructor(new Data_Symbol.IsSymbol(function () {
      return "Center";
  }))(Data_Foreign_Generic_Class.genericEncodeArgsRec(Data_Foreign_Generic_Class.genericEncodeFieldsProduct(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
      return "center_x";
  }))(Data_Foreign_Class.intEncode))(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
      return "center_y";
  }))(Data_Foreign_Class.intEncode))))));
  var encodeCenters = new Data_Foreign_Class.Encode(Oak_Cmd_Http_Conversion.defaultEncode(genericCenters)(Data_Foreign_Generic_Class.genericEncodeConstructor(new Data_Symbol.IsSymbol(function () {
      return "Centers";
  }))(Data_Foreign_Generic_Class.genericEncodeArgsArgument(Data_Foreign_Class.arrayEncode(encodeCenter)))));
  var encodeTransportModel = new Data_Foreign_Class.Encode(Oak_Cmd_Http_Conversion.defaultEncode(genericTransportModel)(Data_Foreign_Generic_Class.genericEncodeConstructor(new Data_Symbol.IsSymbol(function () {
      return "TransportModel";
  }))(Data_Foreign_Generic_Class.genericEncodeArgsRec(Data_Foreign_Generic_Class.genericEncodeFieldsProduct(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
      return "centers";
  }))(encodeCenters))(Data_Foreign_Generic_Class.genericEncodeFieldsProduct(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
      return "limit";
  }))(Data_Foreign_Class.intEncode))(Data_Foreign_Generic_Class.genericEncodeFieldsProduct(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
      return "padding";
  }))(Data_Foreign_Class.intEncode))(Data_Foreign_Generic_Class.genericEncodeFieldsProduct(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
      return "randomness";
  }))(Data_Foreign_Class.intEncode))(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
      return "size";
  }))(Data_Foreign_Class.intEncode)))))))));
  var decodeCenter = new Data_Foreign_Class.Decode(Oak_Cmd_Http_Conversion.defaultDecode(genericCenter)(Data_Foreign_Generic_Class.genericDecodeConstructor(new Data_Symbol.IsSymbol(function () {
      return "Center";
  }))(Data_Foreign_Generic_Class.genericDecodeArgsRec(Data_Foreign_Generic_Class.genericDecodeFieldsProduct(Data_Foreign_Generic_Class.genericDecodeFieldsField(new Data_Symbol.IsSymbol(function () {
      return "center_x";
  }))(Data_Foreign_Class.intDecode))(Data_Foreign_Generic_Class.genericDecodeFieldsField(new Data_Symbol.IsSymbol(function () {
      return "center_y";
  }))(Data_Foreign_Class.intDecode))))(Data_Foreign_Generic_Class.genericCountArgsRec)));
  var decodeCenters = new Data_Foreign_Class.Decode(Oak_Cmd_Http_Conversion.defaultDecode(genericCenters)(Data_Foreign_Generic_Class.genericDecodeConstructor(new Data_Symbol.IsSymbol(function () {
      return "Centers";
  }))(Data_Foreign_Generic_Class.genericDecodeArgsArgument(Data_Foreign_Class.arrayDecode(decodeCenter)))(Data_Foreign_Generic_Class.genericCountArgsArgument)));
  var next = function (v) {
      return function (v1) {
          if (v instanceof GetRandom) {
              return Oak_Cmd_Random.generate(GetCenters.create);
          };
          if (v instanceof GetCenters) {
              var rando = factor(v.value0);
              var domain = spots(v1.height)(v1.width);
              var body = new TransportModel({
                  size: v1.size,
                  padding: v1.padding,
                  limit: v1.limit,
                  randomness: v1.randomness,
                  centers: v1.centers
              });
              return Oak_Cmd_Http.post(genericCenters)(Data_Foreign_Generic_Class.genericDecodeConstructor(new Data_Symbol.IsSymbol(function () {
                  return "Centers";
              }))(Data_Foreign_Generic_Class.genericDecodeArgsArgument(Data_Foreign_Class.arrayDecode(decodeCenter)))(Data_Foreign_Generic_Class.genericCountArgsArgument))(decodeCenters)(genericTransportModel)(Data_Foreign_Generic_Class.genericEncodeConstructor(new Data_Symbol.IsSymbol(function () {
                  return "TransportModel";
              }))(Data_Foreign_Generic_Class.genericEncodeArgsRec(Data_Foreign_Generic_Class.genericEncodeFieldsProduct(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
                  return "centers";
              }))(encodeCenters))(Data_Foreign_Generic_Class.genericEncodeFieldsProduct(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
                  return "limit";
              }))(Data_Foreign_Class.intEncode))(Data_Foreign_Generic_Class.genericEncodeFieldsProduct(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
                  return "padding";
              }))(Data_Foreign_Class.intEncode))(Data_Foreign_Generic_Class.genericEncodeFieldsProduct(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
                  return "randomness";
              }))(Data_Foreign_Class.intEncode))(Data_Foreign_Generic_Class.genericEncodeFieldsField(new Data_Symbol.IsSymbol(function () {
                  return "size";
              }))(Data_Foreign_Class.intEncode))))))))("http://localhost:8080")(body)(GotCenters.create(rando));
          };
          return Oak_Cmd.none;
      };
  };
  var color = "red";
  var squareView = function (randomness) {
      return function (size) {
          return function (v) {
              var key = "square-" + Data_Show.show(Data_Show.showInt)(randomness);
              var dimension = Data_Show.show(Data_Show.showInt)(size + 20 | 0);
              return Oak_Html.rect([ Oak_Html_Attribute.key_(Oak_Html_Present.presentString)(key), Oak_Html_Attribute.x(Oak_Html_Present.presentInt)(v.value0.center_x - positionAdjustment | 0), Oak_Html_Attribute.y(Oak_Html_Present.presentInt)(v.value0.center_y - positionAdjustment | 0), Oak_Html_Attribute.width(Oak_Html_Present.presentString)(dimension), Oak_Html_Attribute.height(Oak_Html_Present.presentString)(dimension), Oak_Html_Attribute.fill(Oak_Html_Present.presentString)(color) ])([  ]);
          };
      };
  };
  var circleView = function (randomness) {
      return function (size) {
          return function (v) {
              var key = "circle-" + Data_Show.show(Data_Show.showInt)(randomness);
              return Oak_Html.circle([ Oak_Html_Attribute.key_(Oak_Html_Present.presentString)(key), Oak_Html_Attribute.cx(Oak_Html_Present.presentInt)(v.value0.center_x - positionAdjustment | 0), Oak_Html_Attribute.cy(Oak_Html_Present.presentInt)(v.value0.center_y - positionAdjustment | 0), Oak_Html_Attribute.r(Oak_Html_Present.presentString)(Data_Show.show(Data_Show.showInt)(size)), Oak_Html_Attribute.fill(Oak_Html_Present.presentString)(color) ])([  ]);
          };
      };
  };
  var shapeView = function (randomness) {
      return function (size) {
          if (randomness % 2 === 0) {
              return circleView(randomness)(size);
          };
          if (Data_Boolean.otherwise) {
              return squareView(randomness)(size);
          };
          throw new Error("Failed pattern match at Main line 143, column 1 - line 143, column 46: " + [ randomness.constructor.name, size.constructor.name ]);
      };
  };
  var manyShapes = function (v) {
      return Data_Functor.map(Data_Functor.functorArray)(shapeView(v.randomness)(v.size))(v.centers.value0);
  };
  var view = function (model) {
      var shapes = manyShapes(model);
      return Oak_Html.div([  ])([ Oak_Html.div([  ])([ Oak_Html.text(Oak_Html_Present.presentString)("The laws of physics are only patterns, beginning with quantities.") ]), Oak_Html.div([  ])([ Oak_Html.text(Oak_Html_Present.presentString)("The quantity: " + Data_Show.show(Data_Show.showInt)(Data_Array.length(shapes))) ]), Oak_Html.svg([ Oak_Html_Attribute.id_(Oak_Html_Present.presentString)("svg-" + Data_Show.show(Data_Show.showInt)(model.randomness)), Oak_Html_Attribute.key_(Oak_Html_Present.presentString)("svg-" + Data_Show.show(Data_Show.showInt)(model.randomness)), Oak_Html_Attribute.style([ Oak_Css.backgroundColor("blue") ]), Oak_Html_Attribute.height(Oak_Html_Present.presentInt)(model.height), Oak_Html_Attribute.width(Oak_Html_Present.presentInt)(model.width), Oak_Html_Events.onClick(GetRandom.value) ])(shapes) ]);
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
