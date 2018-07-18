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
},{"min-document":139}],4:[function(require,module,exports){
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

},{"./vtree/diff.js":32}],9:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":19}],10:[function(require,module,exports){
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

},{"../vnode/is-vhook.js":23,"is-object":6}],12:[function(require,module,exports){
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

},{"../vnode/handle-thunk.js":21,"../vnode/is-vnode.js":24,"../vnode/is-vtext.js":25,"../vnode/is-widget.js":26,"./apply-properties":11,"global/document":3}],13:[function(require,module,exports){
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

},{"../vnode/is-widget.js":26,"../vnode/vpatch.js":29,"./apply-properties":11,"./update-widget":16}],15:[function(require,module,exports){
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

},{"./create-element":12,"./dom-index":13,"./patch-op":14,"global/document":3,"x-is-array":33}],16:[function(require,module,exports){
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

},{"../vnode/is-widget.js":26}],17:[function(require,module,exports){
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

},{"ev-store":2}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"../vnode/is-thunk":22,"../vnode/is-vhook":23,"../vnode/is-vnode":24,"../vnode/is-vtext":25,"../vnode/is-widget":26,"../vnode/vnode.js":28,"../vnode/vtext.js":30,"./hooks/ev-hook.js":17,"./hooks/soft-set-hook.js":18,"./parse-tag.js":20,"x-is-array":33}],20:[function(require,module,exports){
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

},{"browser-split":1}],21:[function(require,module,exports){
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

},{"./is-thunk":22,"./is-vnode":24,"./is-vtext":25,"./is-widget":26}],22:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],23:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],24:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":27}],25:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":27}],26:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],27:[function(require,module,exports){
module.exports = "2"

},{}],28:[function(require,module,exports){
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

},{"./is-thunk":22,"./is-vhook":23,"./is-vnode":24,"./is-widget":26,"./version":27}],29:[function(require,module,exports){
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

},{"./version":27}],30:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":27}],31:[function(require,module,exports){
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

},{"../vnode/is-vhook":23,"is-object":6}],32:[function(require,module,exports){
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

},{"../vnode/handle-thunk":21,"../vnode/is-thunk":22,"../vnode/is-vnode":24,"../vnode/is-vtext":25,"../vnode/is-widget":26,"../vnode/vpatch":29,"./diff-props":31,"x-is-array":33}],33:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],34:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Data_Functor = require("../Data.Functor");
var Data_Semigroup = require("../Data.Semigroup");
var Alt = function (Functor0, alt) {
    this.Functor0 = Functor0;
    this.alt = alt;
};
var altArray = new Alt(function () {
    return Data_Functor.functorArray;
}, Data_Semigroup.append(Data_Semigroup.semigroupArray));
var alt = function (dict) {
    return dict.alt;
};
module.exports = {
    Alt: Alt,
    alt: alt,
    altArray: altArray
};

},{"../Data.Functor":84,"../Data.Semigroup":107}],35:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Plus = require("../Control.Plus");
var Data_Functor = require("../Data.Functor");
var Alternative = function (Applicative0, Plus1) {
    this.Applicative0 = Applicative0;
    this.Plus1 = Plus1;
};
var alternativeArray = new Alternative(function () {
    return Control_Applicative.applicativeArray;
}, function () {
    return Control_Plus.plusArray;
});
module.exports = {
    Alternative: Alternative,
    alternativeArray: alternativeArray
};

},{"../Control.Alt":34,"../Control.Applicative":36,"../Control.Apply":38,"../Control.Plus":55,"../Data.Functor":84}],36:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Apply = require("../Control.Apply");
var Data_Functor = require("../Data.Functor");
var Data_Unit = require("../Data.Unit");
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
var when = function (dictApplicative) {
    return function (v) {
        return function (v1) {
            if (v) {
                return v1;
            };
            if (!v) {
                return pure(dictApplicative)(Data_Unit.unit);
            };
            throw new Error("Failed pattern match at Control.Applicative line 57, column 1 - line 57, column 63: " + [ v.constructor.name, v1.constructor.name ]);
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
var applicativeFn = new Applicative(function () {
    return Control_Apply.applyFn;
}, function (x) {
    return function (v) {
        return x;
    };
});
var applicativeArray = new Applicative(function () {
    return Control_Apply.applyArray;
}, function (x) {
    return [ x ];
});
module.exports = {
    Applicative: Applicative,
    pure: pure,
    liftA1: liftA1,
    unless: unless,
    when: when,
    applicativeFn: applicativeFn,
    applicativeArray: applicativeArray
};

},{"../Control.Apply":38,"../Data.Functor":84,"../Data.Unit":117}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Category = require("../Control.Category");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Apply = function (Functor0, apply) {
    this.Functor0 = Functor0;
    this.apply = apply;
};
var applyFn = new Apply(function () {
    return Data_Functor.functorFn;
}, function (f) {
    return function (g) {
        return function (x) {
            return f(x)(g(x));
        };
    };
});
var applyArray = new Apply(function () {
    return Data_Functor.functorArray;
}, $foreign.arrayApply);
var apply = function (dict) {
    return dict.apply;
};
var applyFirst = function (dictApply) {
    return function (a) {
        return function (b) {
            return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(Data_Function["const"])(a))(b);
        };
    };
};
var applySecond = function (dictApply) {
    return function (a) {
        return function (b) {
            return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(Data_Function["const"](Control_Category.id(Control_Category.categoryFn)))(a))(b);
        };
    };
};
var lift2 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return apply(dictApply)(Data_Functor.map(dictApply.Functor0())(f)(a))(b);
            };
        };
    };
};
var lift3 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return apply(dictApply)(apply(dictApply)(Data_Functor.map(dictApply.Functor0())(f)(a))(b))(c);
                };
            };
        };
    };
};
var lift4 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return function (d) {
                        return apply(dictApply)(apply(dictApply)(apply(dictApply)(Data_Functor.map(dictApply.Functor0())(f)(a))(b))(c))(d);
                    };
                };
            };
        };
    };
};
var lift5 = function (dictApply) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return function (d) {
                        return function (e) {
                            return apply(dictApply)(apply(dictApply)(apply(dictApply)(apply(dictApply)(Data_Functor.map(dictApply.Functor0())(f)(a))(b))(c))(d))(e);
                        };
                    };
                };
            };
        };
    };
};
module.exports = {
    Apply: Apply,
    apply: apply,
    applyFirst: applyFirst,
    applySecond: applySecond,
    lift2: lift2,
    lift3: lift3,
    lift4: lift4,
    lift5: lift5,
    applyFn: applyFn,
    applyArray: applyArray
};

},{"../Control.Category":43,"../Data.Function":81,"../Data.Functor":84,"./foreign":37}],39:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Biapply = require("../Control.Biapply");
var Biapplicative = function (Biapply0, bipure) {
    this.Biapply0 = Biapply0;
    this.bipure = bipure;
};
var bipure = function (dict) {
    return dict.bipure;
};
module.exports = {
    bipure: bipure,
    Biapplicative: Biapplicative
};

},{"../Control.Biapply":40}],40:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Category = require("../Control.Category");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Function = require("../Data.Function");
var Biapply = function (Bifunctor0, biapply) {
    this.Bifunctor0 = Bifunctor0;
    this.biapply = biapply;
};
var biapply = function (dict) {
    return dict.biapply;
};
var biapplyFirst = function (dictBiapply) {
    return function (a) {
        return function (b) {
            return biapply(dictBiapply)(Control_Category.id(Control_Category.categoryFn)(Data_Bifunctor.bimap(dictBiapply.Bifunctor0())(Data_Function["const"](Control_Category.id(Control_Category.categoryFn)))(Data_Function["const"](Control_Category.id(Control_Category.categoryFn))))(a))(b);
        };
    };
};
var biapplySecond = function (dictBiapply) {
    return function (a) {
        return function (b) {
            return biapply(dictBiapply)(Control_Category.id(Control_Category.categoryFn)(Data_Bifunctor.bimap(dictBiapply.Bifunctor0())(Data_Function["const"])(Data_Function["const"]))(a))(b);
        };
    };
};
var bilift2 = function (dictBiapply) {
    return function (f) {
        return function (g) {
            return function (a) {
                return function (b) {
                    return biapply(dictBiapply)(Control_Category.id(Control_Category.categoryFn)(Data_Bifunctor.bimap(dictBiapply.Bifunctor0())(f)(g))(a))(b);
                };
            };
        };
    };
};
var bilift3 = function (dictBiapply) {
    return function (f) {
        return function (g) {
            return function (a) {
                return function (b) {
                    return function (c) {
                        return biapply(dictBiapply)(biapply(dictBiapply)(Control_Category.id(Control_Category.categoryFn)(Data_Bifunctor.bimap(dictBiapply.Bifunctor0())(f)(g))(a))(b))(c);
                    };
                };
            };
        };
    };
};
module.exports = {
    biapply: biapply,
    Biapply: Biapply,
    biapplyFirst: biapplyFirst,
    biapplySecond: biapplySecond,
    bilift2: bilift2,
    bilift3: bilift3
};

},{"../Control.Category":43,"../Data.Bifunctor":63,"../Data.Function":81}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Category = require("../Control.Category");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_Unit = require("../Data.Unit");
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
var bindFn = new Bind(function () {
    return Control_Apply.applyFn;
}, function (m) {
    return function (f) {
        return function (x) {
            return f(m(x))(x);
        };
    };
});
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
var ifM = function (dictBind) {
    return function (cond) {
        return function (t) {
            return function (f) {
                return bind(dictBind)(cond)(function (cond$prime) {
                    if (cond$prime) {
                        return t;
                    };
                    return f;
                });
            };
        };
    };
};
var join = function (dictBind) {
    return function (m) {
        return bind(dictBind)(m)(Control_Category.id(Control_Category.categoryFn));
    };
};
module.exports = {
    Bind: Bind,
    bind: bind,
    bindFlipped: bindFlipped,
    Discard: Discard,
    discard: discard,
    join: join,
    composeKleisli: composeKleisli,
    composeKleisliFlipped: composeKleisliFlipped,
    ifM: ifM,
    bindFn: bindFn,
    bindArray: bindArray,
    discardUnit: discardUnit
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Category":43,"../Data.Function":81,"../Data.Functor":84,"../Data.Unit":117,"./foreign":41}],43:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Semigroupoid = require("../Control.Semigroupoid");
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
module.exports = {
    Category: Category,
    id: id,
    categoryFn: categoryFn
};

},{"../Control.Semigroupoid":56}],44:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Extend = require("../Control.Extend");
var Data_Functor = require("../Data.Functor");
var Comonad = function (Extend0, extract) {
    this.Extend0 = Extend0;
    this.extract = extract;
};
var extract = function (dict) {
    return dict.extract;
};
module.exports = {
    Comonad: Comonad,
    extract: extract
};

},{"../Control.Extend":46,"../Data.Functor":84}],45:[function(require,module,exports){
"use strict";

exports.arrayExtend = function(f) {
  return function(xs) {
    return xs.map(function (_, i, xs) {
      return f(xs.slice(i));
    });
  };
};

},{}],46:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Category = require("../Control.Category");
var Data_Functor = require("../Data.Functor");
var Data_Semigroup = require("../Data.Semigroup");
var Extend = function (Functor0, extend) {
    this.Functor0 = Functor0;
    this.extend = extend;
};
var extendFn = function (dictSemigroup) {
    return new Extend(function () {
        return Data_Functor.functorFn;
    }, function (f) {
        return function (g) {
            return function (w) {
                return f(function (w$prime) {
                    return g(Data_Semigroup.append(dictSemigroup)(w)(w$prime));
                });
            };
        };
    });
};
var extendArray = new Extend(function () {
    return Data_Functor.functorArray;
}, $foreign.arrayExtend);
var extend = function (dict) {
    return dict.extend;
};
var extendFlipped = function (dictExtend) {
    return function (w) {
        return function (f) {
            return extend(dictExtend)(f)(w);
        };
    };
};
var duplicate = function (dictExtend) {
    return extend(dictExtend)(Control_Category.id(Control_Category.categoryFn));
};
var composeCoKleisliFlipped = function (dictExtend) {
    return function (f) {
        return function (g) {
            return function (w) {
                return f(extend(dictExtend)(g)(w));
            };
        };
    };
};
var composeCoKleisli = function (dictExtend) {
    return function (f) {
        return function (g) {
            return function (w) {
                return g(extend(dictExtend)(f)(w));
            };
        };
    };
};
module.exports = {
    Extend: Extend,
    extend: extend,
    extendFlipped: extendFlipped,
    composeCoKleisli: composeCoKleisli,
    composeCoKleisliFlipped: composeCoKleisliFlipped,
    duplicate: duplicate,
    extendFn: extendFn,
    extendArray: extendArray
};

},{"../Control.Category":43,"../Data.Functor":84,"../Data.Semigroup":107,"./foreign":45}],47:[function(require,module,exports){
"use strict";

exports.showErrorImpl = function (err) {
  return err.stack || err.toString();
};

exports.error = function (msg) {
  return new Error(msg);
};

exports.message = function (e) {
  return e.message;
};

exports.name = function (e) {
  return e.name || "Error";
};

exports.stackImpl = function (just) {
  return function (nothing) {
    return function (e) {
      return e.stack ? just(e.stack) : nothing;
    };
  };
};

exports.throwException = function (e) {
  return function () {
    throw e;
  };
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

},{}],48:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Applicative = require("../Control.Applicative");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Either = require("../Data.Either");
var Data_Functor = require("../Data.Functor");
var Data_Maybe = require("../Data.Maybe");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var $$try = function (action) {
    return $foreign.catchException(function ($0) {
        return Control_Applicative.pure(Control_Monad_Eff.applicativeEff)(Data_Either.Left.create($0));
    })(Data_Functor.map(Control_Monad_Eff.functorEff)(Data_Either.Right.create)(action));
};
var $$throw = function ($1) {
    return $foreign.throwException($foreign.error($1));
};
var stack = $foreign.stackImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var showError = new Data_Show.Show($foreign.showErrorImpl);
module.exports = {
    stack: stack,
    "throw": $$throw,
    "try": $$try,
    showError: showError,
    error: $foreign.error,
    message: $foreign.message,
    name: $foreign.name,
    throwException: $foreign.throwException,
    catchException: $foreign.catchException
};

},{"../Control.Applicative":36,"../Control.Monad.Eff":50,"../Control.Semigroupoid":56,"../Data.Either":71,"../Data.Functor":84,"../Data.Maybe":89,"../Data.Show":111,"../Prelude":138,"./foreign":47}],49:[function(require,module,exports){
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

exports.untilE = function (f) {
  return function () {
    while (!f());
    return {};
  };
};

exports.whileE = function (f) {
  return function (a) {
    return function () {
      while (f()) {
        a();
      }
      return {};
    };
  };
};

exports.forE = function (lo) {
  return function (hi) {
    return function (f) {
      return function () {
        for (var i = lo; i < hi; i++) {
          f(i)();
        }
      };
    };
  };
};

exports.foreachE = function (as) {
  return function (f) {
    return function () {
      for (var i = 0, l = as.length; i < l; i++) {
        f(as[i])();
      }
    };
  };
};

},{}],50:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Data_Functor = require("../Data.Functor");
var Data_Monoid = require("../Data.Monoid");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Unit = require("../Data.Unit");
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
var semigroupEff = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(Control_Apply.lift2(applyEff)(Data_Semigroup.append(dictSemigroup)));
};
var monoidEff = function (dictMonoid) {
    return new Data_Monoid.Monoid(function () {
        return semigroupEff(dictMonoid.Semigroup0());
    }, Control_Applicative.pure(applicativeEff)(Data_Monoid.mempty(dictMonoid)));
};
module.exports = {
    semigroupEff: semigroupEff,
    monoidEff: monoidEff,
    functorEff: functorEff,
    applyEff: applyEff,
    applicativeEff: applicativeEff,
    bindEff: bindEff,
    monadEff: monadEff,
    runPure: $foreign.runPure,
    untilE: $foreign.untilE,
    whileE: $foreign.whileE,
    forE: $foreign.forE,
    foreachE: $foreign.foreachE
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Monad":53,"../Data.Functor":84,"../Data.Monoid":96,"../Data.Semigroup":107,"../Data.Unit":117,"./foreign":49}],51:[function(require,module,exports){
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

exports.modifySTRef = function (ref) {
  return function (f) {
    return function () {
      return ref.value = f(ref.value); // eslint-disable-line no-return-assign
    };
  };
};

exports.writeSTRef = function (ref) {
  return function (a) {
    return function () {
      return ref.value = a; // eslint-disable-line no-return-assign
    };
  };
};

exports.runST = function (f) {
  return f;
};

},{}],52:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var pureST = function (st) {
    return Control_Monad_Eff.runPure($foreign.runST(st));
};
module.exports = {
    pureST: pureST,
    newSTRef: $foreign.newSTRef,
    readSTRef: $foreign.readSTRef,
    modifySTRef: $foreign.modifySTRef,
    writeSTRef: $foreign.writeSTRef,
    runST: $foreign.runST
};

},{"../Control.Monad.Eff":50,"./foreign":51}],53:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Data_Functor = require("../Data.Functor");
var Data_Unit = require("../Data.Unit");
var Monad = function (Applicative0, Bind1) {
    this.Applicative0 = Applicative0;
    this.Bind1 = Bind1;
};
var whenM = function (dictMonad) {
    return function (mb) {
        return function (m) {
            return Control_Bind.bind(dictMonad.Bind1())(mb)(function (v) {
                return Control_Applicative.when(dictMonad.Applicative0())(v)(m);
            });
        };
    };
};
var unlessM = function (dictMonad) {
    return function (mb) {
        return function (m) {
            return Control_Bind.bind(dictMonad.Bind1())(mb)(function (v) {
                return Control_Applicative.unless(dictMonad.Applicative0())(v)(m);
            });
        };
    };
};
var monadFn = new Monad(function () {
    return Control_Applicative.applicativeFn;
}, function () {
    return Control_Bind.bindFn;
});
var monadArray = new Monad(function () {
    return Control_Applicative.applicativeArray;
}, function () {
    return Control_Bind.bindArray;
});
var liftM1 = function (dictMonad) {
    return function (f) {
        return function (a) {
            return Control_Bind.bind(dictMonad.Bind1())(a)(function (v) {
                return Control_Applicative.pure(dictMonad.Applicative0())(f(v));
            });
        };
    };
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
module.exports = {
    Monad: Monad,
    liftM1: liftM1,
    ap: ap,
    whenM: whenM,
    unlessM: unlessM,
    monadFn: monadFn,
    monadArray: monadArray
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Data.Functor":84,"../Data.Unit":117}],54:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Monad = require("../Control.Monad");
var Control_Plus = require("../Control.Plus");
var Data_Functor = require("../Data.Functor");
var Data_Unit = require("../Data.Unit");
var MonadZero = function (Alternative1, Monad0) {
    this.Alternative1 = Alternative1;
    this.Monad0 = Monad0;
};
var monadZeroArray = new MonadZero(function () {
    return Control_Alternative.alternativeArray;
}, function () {
    return Control_Monad.monadArray;
});
var guard = function (dictMonadZero) {
    return function (v) {
        if (v) {
            return Control_Applicative.pure((dictMonadZero.Alternative1()).Applicative0())(Data_Unit.unit);
        };
        if (!v) {
            return Control_Plus.empty((dictMonadZero.Alternative1()).Plus1());
        };
        throw new Error("Failed pattern match at Control.MonadZero line 54, column 1 - line 54, column 52: " + [ v.constructor.name ]);
    };
};
module.exports = {
    MonadZero: MonadZero,
    guard: guard,
    monadZeroArray: monadZeroArray
};

},{"../Control.Alt":34,"../Control.Alternative":35,"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Monad":53,"../Control.Plus":55,"../Data.Functor":84,"../Data.Unit":117}],55:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Data_Functor = require("../Data.Functor");
var Plus = function (Alt0, empty) {
    this.Alt0 = Alt0;
    this.empty = empty;
};
var plusArray = new Plus(function () {
    return Control_Alt.altArray;
}, [  ]);
var empty = function (dict) {
    return dict.empty;
};
module.exports = {
    Plus: Plus,
    empty: empty,
    plusArray: plusArray
};

},{"../Control.Alt":34,"../Data.Functor":84}],56:[function(require,module,exports){
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
var composeFlipped = function (dictSemigroupoid) {
    return function (f) {
        return function (g) {
            return compose(dictSemigroupoid)(g)(f);
        };
    };
};
module.exports = {
    compose: compose,
    Semigroupoid: Semigroupoid,
    composeFlipped: composeFlipped,
    semigroupoidFn: semigroupoidFn
};

},{}],57:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Category = require("../Control.Category");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Bifunctor_Clown = require("../Data.Bifunctor.Clown");
var Data_Bifunctor_Flip = require("../Data.Bifunctor.Flip");
var Data_Bifunctor_Joker = require("../Data.Bifunctor.Joker");
var Data_Bifunctor_Product = require("../Data.Bifunctor.Product");
var Data_Bifunctor_Wrap = require("../Data.Bifunctor.Wrap");
var Data_Foldable = require("../Data.Foldable");
var Data_Function = require("../Data.Function");
var Data_Monoid = require("../Data.Monoid");
var Data_Monoid_Conj = require("../Data.Monoid.Conj");
var Data_Monoid_Disj = require("../Data.Monoid.Disj");
var Data_Monoid_Dual = require("../Data.Monoid.Dual");
var Data_Monoid_Endo = require("../Data.Monoid.Endo");
var Data_Newtype = require("../Data.Newtype");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Unit = require("../Data.Unit");
var Prelude = require("../Prelude");
var Bifoldable = function (bifoldMap, bifoldl, bifoldr) {
    this.bifoldMap = bifoldMap;
    this.bifoldl = bifoldl;
    this.bifoldr = bifoldr;
};
var bifoldr = function (dict) {
    return dict.bifoldr;
};
var bitraverse_ = function (dictBifoldable) {
    return function (dictApplicative) {
        return function (f) {
            return function (g) {
                return bifoldr(dictBifoldable)(function ($97) {
                    return Control_Apply.applySecond(dictApplicative.Apply0())(f($97));
                })(function ($98) {
                    return Control_Apply.applySecond(dictApplicative.Apply0())(g($98));
                })(Control_Applicative.pure(dictApplicative)(Data_Unit.unit));
            };
        };
    };
};
var bifor_ = function (dictBifoldable) {
    return function (dictApplicative) {
        return function (t) {
            return function (f) {
                return function (g) {
                    return bitraverse_(dictBifoldable)(dictApplicative)(f)(g)(t);
                };
            };
        };
    };
};
var bisequence_ = function (dictBifoldable) {
    return function (dictApplicative) {
        return bitraverse_(dictBifoldable)(dictApplicative)(Control_Category.id(Control_Category.categoryFn))(Control_Category.id(Control_Category.categoryFn));
    };
};
var bifoldl = function (dict) {
    return dict.bifoldl;
};
var bifoldableJoker = function (dictFoldable) {
    return new Bifoldable(function (dictMonoid) {
        return function (v) {
            return function (r) {
                return function (v1) {
                    return Data_Foldable.foldMap(dictFoldable)(dictMonoid)(r)(v1);
                };
            };
        };
    }, function (v) {
        return function (r) {
            return function (u) {
                return function (v1) {
                    return Data_Foldable.foldl(dictFoldable)(r)(u)(v1);
                };
            };
        };
    }, function (v) {
        return function (r) {
            return function (u) {
                return function (v1) {
                    return Data_Foldable.foldr(dictFoldable)(r)(u)(v1);
                };
            };
        };
    });
};
var bifoldableClown = function (dictFoldable) {
    return new Bifoldable(function (dictMonoid) {
        return function (l) {
            return function (v) {
                return function (v1) {
                    return Data_Foldable.foldMap(dictFoldable)(dictMonoid)(l)(v1);
                };
            };
        };
    }, function (l) {
        return function (v) {
            return function (u) {
                return function (v1) {
                    return Data_Foldable.foldl(dictFoldable)(l)(u)(v1);
                };
            };
        };
    }, function (l) {
        return function (v) {
            return function (u) {
                return function (v1) {
                    return Data_Foldable.foldr(dictFoldable)(l)(u)(v1);
                };
            };
        };
    });
};
var bifoldMapDefaultR = function (dictBifoldable) {
    return function (dictMonoid) {
        return function (f) {
            return function (g) {
                return bifoldr(dictBifoldable)(function ($99) {
                    return Data_Semigroup.append(dictMonoid.Semigroup0())(f($99));
                })(function ($100) {
                    return Data_Semigroup.append(dictMonoid.Semigroup0())(g($100));
                })(Data_Monoid.mempty(dictMonoid));
            };
        };
    };
};
var bifoldMapDefaultL = function (dictBifoldable) {
    return function (dictMonoid) {
        return function (f) {
            return function (g) {
                return bifoldl(dictBifoldable)(function (m) {
                    return function (a) {
                        return Data_Semigroup.append(dictMonoid.Semigroup0())(m)(f(a));
                    };
                })(function (m) {
                    return function (b) {
                        return Data_Semigroup.append(dictMonoid.Semigroup0())(m)(g(b));
                    };
                })(Data_Monoid.mempty(dictMonoid));
            };
        };
    };
};
var bifoldMap = function (dict) {
    return dict.bifoldMap;
};
var bifoldableFlip = function (dictBifoldable) {
    return new Bifoldable(function (dictMonoid) {
        return function (r) {
            return function (l) {
                return function (v) {
                    return bifoldMap(dictBifoldable)(dictMonoid)(l)(r)(v);
                };
            };
        };
    }, function (r) {
        return function (l) {
            return function (u) {
                return function (v) {
                    return bifoldl(dictBifoldable)(l)(r)(u)(v);
                };
            };
        };
    }, function (r) {
        return function (l) {
            return function (u) {
                return function (v) {
                    return bifoldr(dictBifoldable)(l)(r)(u)(v);
                };
            };
        };
    });
};
var bifoldableWrap = function (dictBifoldable) {
    return new Bifoldable(function (dictMonoid) {
        return function (l) {
            return function (r) {
                return function (v) {
                    return bifoldMap(dictBifoldable)(dictMonoid)(l)(r)(v);
                };
            };
        };
    }, function (l) {
        return function (r) {
            return function (u) {
                return function (v) {
                    return bifoldl(dictBifoldable)(l)(r)(u)(v);
                };
            };
        };
    }, function (l) {
        return function (r) {
            return function (u) {
                return function (v) {
                    return bifoldr(dictBifoldable)(l)(r)(u)(v);
                };
            };
        };
    });
};
var bifoldlDefault = function (dictBifoldable) {
    return function (f) {
        return function (g) {
            return function (z) {
                return function (p) {
                    return Data_Newtype.unwrap(Data_Monoid_Endo.newtypeEndo)(Data_Newtype.unwrap(Data_Monoid_Dual.newtypeDual)(bifoldMap(dictBifoldable)(Data_Monoid_Dual.monoidDual(Data_Monoid_Endo.monoidEndo))(function ($101) {
                        return Data_Monoid_Dual.Dual(Data_Monoid_Endo.Endo(Data_Function.flip(f)($101)));
                    })(function ($102) {
                        return Data_Monoid_Dual.Dual(Data_Monoid_Endo.Endo(Data_Function.flip(g)($102)));
                    })(p)))(z);
                };
            };
        };
    };
};
var bifoldrDefault = function (dictBifoldable) {
    return function (f) {
        return function (g) {
            return function (z) {
                return function (p) {
                    return Data_Newtype.unwrap(Data_Monoid_Endo.newtypeEndo)(bifoldMap(dictBifoldable)(Data_Monoid_Endo.monoidEndo)(function ($103) {
                        return Data_Monoid_Endo.Endo(f($103));
                    })(function ($104) {
                        return Data_Monoid_Endo.Endo(g($104));
                    })(p))(z);
                };
            };
        };
    };
};
var bifoldableProduct = function (dictBifoldable) {
    return function (dictBifoldable1) {
        return new Bifoldable(function (dictMonoid) {
            return function (l) {
                return function (r) {
                    return function (v) {
                        return Data_Semigroup.append(dictMonoid.Semigroup0())(bifoldMap(dictBifoldable)(dictMonoid)(l)(r)(v.value0))(bifoldMap(dictBifoldable1)(dictMonoid)(l)(r)(v.value1));
                    };
                };
            };
        }, function (l) {
            return function (r) {
                return function (u) {
                    return function (m) {
                        return bifoldlDefault(bifoldableProduct(dictBifoldable)(dictBifoldable1))(l)(r)(u)(m);
                    };
                };
            };
        }, function (l) {
            return function (r) {
                return function (u) {
                    return function (m) {
                        return bifoldrDefault(bifoldableProduct(dictBifoldable)(dictBifoldable1))(l)(r)(u)(m);
                    };
                };
            };
        });
    };
};
var bifold = function (dictBifoldable) {
    return function (dictMonoid) {
        return bifoldMap(dictBifoldable)(dictMonoid)(Control_Category.id(Control_Category.categoryFn))(Control_Category.id(Control_Category.categoryFn));
    };
};
var biany = function (dictBifoldable) {
    return function (dictBooleanAlgebra) {
        return function (p) {
            return function (q) {
                return function ($105) {
                    return Data_Newtype.unwrap(Data_Monoid_Disj.newtypeDisj)(bifoldMap(dictBifoldable)(Data_Monoid_Disj.monoidDisj(dictBooleanAlgebra.HeytingAlgebra0()))(function ($106) {
                        return Data_Monoid_Disj.Disj(p($106));
                    })(function ($107) {
                        return Data_Monoid_Disj.Disj(q($107));
                    })($105));
                };
            };
        };
    };
};
var biall = function (dictBifoldable) {
    return function (dictBooleanAlgebra) {
        return function (p) {
            return function (q) {
                return function ($108) {
                    return Data_Newtype.unwrap(Data_Monoid_Conj.newtypeConj)(bifoldMap(dictBifoldable)(Data_Monoid_Conj.monoidConj(dictBooleanAlgebra.HeytingAlgebra0()))(function ($109) {
                        return Data_Monoid_Conj.Conj(p($109));
                    })(function ($110) {
                        return Data_Monoid_Conj.Conj(q($110));
                    })($108));
                };
            };
        };
    };
};
module.exports = {
    bifoldMap: bifoldMap,
    bifoldl: bifoldl,
    bifoldr: bifoldr,
    Bifoldable: Bifoldable,
    bifoldrDefault: bifoldrDefault,
    bifoldlDefault: bifoldlDefault,
    bifoldMapDefaultR: bifoldMapDefaultR,
    bifoldMapDefaultL: bifoldMapDefaultL,
    bifold: bifold,
    bitraverse_: bitraverse_,
    bifor_: bifor_,
    bisequence_: bisequence_,
    biany: biany,
    biall: biall,
    bifoldableClown: bifoldableClown,
    bifoldableJoker: bifoldableJoker,
    bifoldableFlip: bifoldableFlip,
    bifoldableProduct: bifoldableProduct,
    bifoldableWrap: bifoldableWrap
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Category":43,"../Control.Semigroupoid":56,"../Data.Bifunctor.Clown":58,"../Data.Bifunctor.Flip":59,"../Data.Bifunctor.Joker":60,"../Data.Bifunctor.Product":61,"../Data.Bifunctor.Wrap":62,"../Data.Foldable":78,"../Data.Function":81,"../Data.Monoid":96,"../Data.Monoid.Conj":91,"../Data.Monoid.Disj":92,"../Data.Monoid.Dual":93,"../Data.Monoid.Endo":94,"../Data.Newtype":98,"../Data.Semigroup":107,"../Data.Unit":117,"../Prelude":138}],58:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Clown = function (x) {
    return x;
};
var showClown = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Clown " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var ordClown = function (dictOrd) {
    return dictOrd;
};
var newtypeClown = new Data_Newtype.Newtype(function (n) {
    return n;
}, Clown);
var functorClown = new Data_Functor.Functor(function (v) {
    return function (v1) {
        return v1;
    };
});
var eqClown = function (dictEq) {
    return dictEq;
};
var bifunctorClown = function (dictFunctor) {
    return new Data_Bifunctor.Bifunctor(function (f) {
        return function (v) {
            return function (v1) {
                return Data_Functor.map(dictFunctor)(f)(v1);
            };
        };
    });
};
var biapplyClown = function (dictApply) {
    return new Control_Biapply.Biapply(function () {
        return bifunctorClown(dictApply.Functor0());
    }, function (v) {
        return function (v1) {
            return Control_Apply.apply(dictApply)(v)(v1);
        };
    });
};
var biapplicativeClown = function (dictApplicative) {
    return new Control_Biapplicative.Biapplicative(function () {
        return biapplyClown(dictApplicative.Apply0());
    }, function (a) {
        return function (v) {
            return Control_Applicative.pure(dictApplicative)(a);
        };
    });
};
module.exports = {
    Clown: Clown,
    newtypeClown: newtypeClown,
    eqClown: eqClown,
    ordClown: ordClown,
    showClown: showClown,
    functorClown: functorClown,
    bifunctorClown: bifunctorClown,
    biapplyClown: biapplyClown,
    biapplicativeClown: biapplicativeClown
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Biapplicative":39,"../Control.Biapply":40,"../Data.Bifunctor":63,"../Data.Eq":73,"../Data.Functor":84,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Show":111,"../Prelude":138}],59:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Flip = function (x) {
    return x;
};
var showFlip = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Flip " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var ordFlip = function (dictOrd) {
    return dictOrd;
};
var newtypeFlip = new Data_Newtype.Newtype(function (n) {
    return n;
}, Flip);
var functorFlip = function (dictBifunctor) {
    return new Data_Functor.Functor(function (f) {
        return function (v) {
            return Data_Bifunctor.lmap(dictBifunctor)(f)(v);
        };
    });
};
var eqFlip = function (dictEq) {
    return dictEq;
};
var bifunctorFlip = function (dictBifunctor) {
    return new Data_Bifunctor.Bifunctor(function (f) {
        return function (g) {
            return function (v) {
                return Data_Bifunctor.bimap(dictBifunctor)(g)(f)(v);
            };
        };
    });
};
var biapplyFlip = function (dictBiapply) {
    return new Control_Biapply.Biapply(function () {
        return bifunctorFlip(dictBiapply.Bifunctor0());
    }, function (v) {
        return function (v1) {
            return Control_Biapply.biapply(dictBiapply)(v)(v1);
        };
    });
};
var biapplicativeFlip = function (dictBiapplicative) {
    return new Control_Biapplicative.Biapplicative(function () {
        return biapplyFlip(dictBiapplicative.Biapply0());
    }, function (a) {
        return function (b) {
            return Control_Biapplicative.bipure(dictBiapplicative)(b)(a);
        };
    });
};
module.exports = {
    Flip: Flip,
    newtypeFlip: newtypeFlip,
    eqFlip: eqFlip,
    ordFlip: ordFlip,
    showFlip: showFlip,
    functorFlip: functorFlip,
    bifunctorFlip: bifunctorFlip,
    biapplyFlip: biapplyFlip,
    biapplicativeFlip: biapplicativeFlip
};

},{"../Control.Biapplicative":39,"../Control.Biapply":40,"../Data.Bifunctor":63,"../Data.Eq":73,"../Data.Functor":84,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Show":111,"../Prelude":138}],60:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Joker = function (x) {
    return x;
};
var showJoker = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Joker " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var ordJoker = function (dictOrd) {
    return dictOrd;
};
var newtypeJoker = new Data_Newtype.Newtype(function (n) {
    return n;
}, Joker);
var functorJoker = function (dictFunctor) {
    return new Data_Functor.Functor(function (g) {
        return function (v) {
            return Data_Functor.map(dictFunctor)(g)(v);
        };
    });
};
var eqJoker = function (dictEq) {
    return dictEq;
};
var bifunctorJoker = function (dictFunctor) {
    return new Data_Bifunctor.Bifunctor(function (v) {
        return function (g) {
            return function (v1) {
                return Data_Functor.map(dictFunctor)(g)(v1);
            };
        };
    });
};
var biapplyJoker = function (dictApply) {
    return new Control_Biapply.Biapply(function () {
        return bifunctorJoker(dictApply.Functor0());
    }, function (v) {
        return function (v1) {
            return Control_Apply.apply(dictApply)(v)(v1);
        };
    });
};
var biapplicativeJoker = function (dictApplicative) {
    return new Control_Biapplicative.Biapplicative(function () {
        return biapplyJoker(dictApplicative.Apply0());
    }, function (v) {
        return function (b) {
            return Control_Applicative.pure(dictApplicative)(b);
        };
    });
};
module.exports = {
    Joker: Joker,
    newtypeJoker: newtypeJoker,
    eqJoker: eqJoker,
    ordJoker: ordJoker,
    showJoker: showJoker,
    functorJoker: functorJoker,
    bifunctorJoker: bifunctorJoker,
    biapplyJoker: biapplyJoker,
    biapplicativeJoker: biapplicativeJoker
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Biapplicative":39,"../Control.Biapply":40,"../Data.Bifunctor":63,"../Data.Eq":73,"../Data.Functor":84,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Show":111,"../Prelude":138}],61:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Eq = require("../Data.Eq");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
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
var showProduct = function (dictShow) {
    return function (dictShow1) {
        return new Data_Show.Show(function (v) {
            return "(Product " + (Data_Show.show(dictShow)(v.value0) + (" " + (Data_Show.show(dictShow1)(v.value1) + ")")));
        });
    };
};
var eqProduct = function (dictEq) {
    return function (dictEq1) {
        return new Data_Eq.Eq(function (x) {
            return function (y) {
                return Data_Eq.eq(dictEq)(x.value0)(y.value0) && Data_Eq.eq(dictEq1)(x.value1)(y.value1);
            };
        });
    };
};
var ordProduct = function (dictOrd) {
    return function (dictOrd1) {
        return new Data_Ord.Ord(function () {
            return eqProduct(dictOrd.Eq0())(dictOrd1.Eq0());
        }, function (x) {
            return function (y) {
                var v = Data_Ord.compare(dictOrd)(x.value0)(y.value0);
                if (v instanceof Data_Ordering.LT) {
                    return Data_Ordering.LT.value;
                };
                if (v instanceof Data_Ordering.GT) {
                    return Data_Ordering.GT.value;
                };
                return Data_Ord.compare(dictOrd1)(x.value1)(y.value1);
            };
        });
    };
};
var bifunctorProduct = function (dictBifunctor) {
    return function (dictBifunctor1) {
        return new Data_Bifunctor.Bifunctor(function (f) {
            return function (g) {
                return function (v) {
                    return new Product(Data_Bifunctor.bimap(dictBifunctor)(f)(g)(v.value0), Data_Bifunctor.bimap(dictBifunctor1)(f)(g)(v.value1));
                };
            };
        });
    };
};
var biapplyProduct = function (dictBiapply) {
    return function (dictBiapply1) {
        return new Control_Biapply.Biapply(function () {
            return bifunctorProduct(dictBiapply.Bifunctor0())(dictBiapply1.Bifunctor0());
        }, function (v) {
            return function (v1) {
                return new Product(Control_Biapply.biapply(dictBiapply)(v.value0)(v1.value0), Control_Biapply.biapply(dictBiapply1)(v.value1)(v1.value1));
            };
        });
    };
};
var biapplicativeProduct = function (dictBiapplicative) {
    return function (dictBiapplicative1) {
        return new Control_Biapplicative.Biapplicative(function () {
            return biapplyProduct(dictBiapplicative.Biapply0())(dictBiapplicative1.Biapply0());
        }, function (a) {
            return function (b) {
                return new Product(Control_Biapplicative.bipure(dictBiapplicative)(a)(b), Control_Biapplicative.bipure(dictBiapplicative1)(a)(b));
            };
        });
    };
};
module.exports = {
    Product: Product,
    eqProduct: eqProduct,
    ordProduct: ordProduct,
    showProduct: showProduct,
    bifunctorProduct: bifunctorProduct,
    biapplyProduct: biapplyProduct,
    biapplicativeProduct: biapplicativeProduct
};

},{"../Control.Biapplicative":39,"../Control.Biapply":40,"../Data.Bifunctor":63,"../Data.Eq":73,"../Data.HeytingAlgebra":86,"../Data.Ord":102,"../Data.Ordering":103,"../Data.Semigroup":107,"../Data.Show":111,"../Prelude":138}],62:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Biapplicative = require("../Control.Biapplicative");
var Control_Biapply = require("../Control.Biapply");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Wrap = function (x) {
    return x;
};
var showWrap = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Wrap " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var ordWrap = function (dictOrd) {
    return dictOrd;
};
var newtypeWrap = new Data_Newtype.Newtype(function (n) {
    return n;
}, Wrap);
var functorWrap = function (dictBifunctor) {
    return new Data_Functor.Functor(function (f) {
        return function (v) {
            return Data_Bifunctor.rmap(dictBifunctor)(f)(v);
        };
    });
};
var eqWrap = function (dictEq) {
    return dictEq;
};
var bifunctorWrap = function (dictBifunctor) {
    return new Data_Bifunctor.Bifunctor(function (f) {
        return function (g) {
            return function (v) {
                return Data_Bifunctor.bimap(dictBifunctor)(f)(g)(v);
            };
        };
    });
};
var biapplyWrap = function (dictBiapply) {
    return new Control_Biapply.Biapply(function () {
        return bifunctorWrap(dictBiapply.Bifunctor0());
    }, function (v) {
        return function (v1) {
            return Control_Biapply.biapply(dictBiapply)(v)(v1);
        };
    });
};
var biapplicativeWrap = function (dictBiapplicative) {
    return new Control_Biapplicative.Biapplicative(function () {
        return biapplyWrap(dictBiapplicative.Biapply0());
    }, function (a) {
        return function (b) {
            return Control_Biapplicative.bipure(dictBiapplicative)(a)(b);
        };
    });
};
module.exports = {
    Wrap: Wrap,
    newtypeWrap: newtypeWrap,
    eqWrap: eqWrap,
    ordWrap: ordWrap,
    showWrap: showWrap,
    functorWrap: functorWrap,
    bifunctorWrap: bifunctorWrap,
    biapplyWrap: biapplyWrap,
    biapplicativeWrap: biapplicativeWrap
};

},{"../Control.Biapplicative":39,"../Control.Biapply":40,"../Data.Bifunctor":63,"../Data.Eq":73,"../Data.Functor":84,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Show":111,"../Prelude":138}],63:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Category = require("../Control.Category");
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
var rmap = function (dictBifunctor) {
    return bimap(dictBifunctor)(Control_Category.id(Control_Category.categoryFn));
};
module.exports = {
    bimap: bimap,
    Bifunctor: Bifunctor,
    lmap: lmap,
    rmap: rmap
};

},{"../Control.Category":43}],64:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Category = require("../Control.Category");
var Data_Bifoldable = require("../Data.Bifoldable");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Bifunctor_Clown = require("../Data.Bifunctor.Clown");
var Data_Bifunctor_Flip = require("../Data.Bifunctor.Flip");
var Data_Bifunctor_Joker = require("../Data.Bifunctor.Joker");
var Data_Bifunctor_Product = require("../Data.Bifunctor.Product");
var Data_Bifunctor_Wrap = require("../Data.Bifunctor.Wrap");
var Data_Functor = require("../Data.Functor");
var Data_Traversable = require("../Data.Traversable");
var Prelude = require("../Prelude");
var Bitraversable = function (Bifoldable1, Bifunctor0, bisequence, bitraverse) {
    this.Bifoldable1 = Bifoldable1;
    this.Bifunctor0 = Bifunctor0;
    this.bisequence = bisequence;
    this.bitraverse = bitraverse;
};
var bitraverse = function (dict) {
    return dict.bitraverse;
};
var lfor = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (t) {
            return function (f) {
                return bitraverse(dictBitraversable)(dictApplicative)(f)(Control_Applicative.pure(dictApplicative))(t);
            };
        };
    };
};
var ltraverse = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (f) {
            return bitraverse(dictBitraversable)(dictApplicative)(f)(Control_Applicative.pure(dictApplicative));
        };
    };
};
var rfor = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (t) {
            return function (f) {
                return bitraverse(dictBitraversable)(dictApplicative)(Control_Applicative.pure(dictApplicative))(f)(t);
            };
        };
    };
};
var rtraverse = function (dictBitraversable) {
    return function (dictApplicative) {
        return bitraverse(dictBitraversable)(dictApplicative)(Control_Applicative.pure(dictApplicative));
    };
};
var bitraversableJoker = function (dictTraversable) {
    return new Bitraversable(function () {
        return Data_Bifoldable.bifoldableJoker(dictTraversable.Foldable1());
    }, function () {
        return Data_Bifunctor_Joker.bifunctorJoker(dictTraversable.Functor0());
    }, function (dictApplicative) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Bifunctor_Joker.Joker)(Data_Traversable.sequence(dictTraversable)(dictApplicative)(v));
        };
    }, function (dictApplicative) {
        return function (v) {
            return function (r) {
                return function (v1) {
                    return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Bifunctor_Joker.Joker)(Data_Traversable.traverse(dictTraversable)(dictApplicative)(r)(v1));
                };
            };
        };
    });
};
var bitraversableClown = function (dictTraversable) {
    return new Bitraversable(function () {
        return Data_Bifoldable.bifoldableClown(dictTraversable.Foldable1());
    }, function () {
        return Data_Bifunctor_Clown.bifunctorClown(dictTraversable.Functor0());
    }, function (dictApplicative) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Bifunctor_Clown.Clown)(Data_Traversable.sequence(dictTraversable)(dictApplicative)(v));
        };
    }, function (dictApplicative) {
        return function (l) {
            return function (v) {
                return function (v1) {
                    return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Bifunctor_Clown.Clown)(Data_Traversable.traverse(dictTraversable)(dictApplicative)(l)(v1));
                };
            };
        };
    });
};
var bisequenceDefault = function (dictBitraversable) {
    return function (dictApplicative) {
        return bitraverse(dictBitraversable)(dictApplicative)(Control_Category.id(Control_Category.categoryFn))(Control_Category.id(Control_Category.categoryFn));
    };
};
var bisequence = function (dict) {
    return dict.bisequence;
};
var bitraversableFlip = function (dictBitraversable) {
    return new Bitraversable(function () {
        return Data_Bifoldable.bifoldableFlip(dictBitraversable.Bifoldable1());
    }, function () {
        return Data_Bifunctor_Flip.bifunctorFlip(dictBitraversable.Bifunctor0());
    }, function (dictApplicative) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Bifunctor_Flip.Flip)(bisequence(dictBitraversable)(dictApplicative)(v));
        };
    }, function (dictApplicative) {
        return function (r) {
            return function (l) {
                return function (v) {
                    return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Bifunctor_Flip.Flip)(bitraverse(dictBitraversable)(dictApplicative)(l)(r)(v));
                };
            };
        };
    });
};
var bitraversableProduct = function (dictBitraversable) {
    return function (dictBitraversable1) {
        return new Bitraversable(function () {
            return Data_Bifoldable.bifoldableProduct(dictBitraversable.Bifoldable1())(dictBitraversable1.Bifoldable1());
        }, function () {
            return Data_Bifunctor_Product.bifunctorProduct(dictBitraversable.Bifunctor0())(dictBitraversable1.Bifunctor0());
        }, function (dictApplicative) {
            return function (v) {
                return Control_Apply.apply(dictApplicative.Apply0())(Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Bifunctor_Product.Product.create)(bisequence(dictBitraversable)(dictApplicative)(v.value0)))(bisequence(dictBitraversable1)(dictApplicative)(v.value1));
            };
        }, function (dictApplicative) {
            return function (l) {
                return function (r) {
                    return function (v) {
                        return Control_Apply.apply(dictApplicative.Apply0())(Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Bifunctor_Product.Product.create)(bitraverse(dictBitraversable)(dictApplicative)(l)(r)(v.value0)))(bitraverse(dictBitraversable1)(dictApplicative)(l)(r)(v.value1));
                    };
                };
            };
        });
    };
};
var bitraversableWrap = function (dictBitraversable) {
    return new Bitraversable(function () {
        return Data_Bifoldable.bifoldableWrap(dictBitraversable.Bifoldable1());
    }, function () {
        return Data_Bifunctor_Wrap.bifunctorWrap(dictBitraversable.Bifunctor0());
    }, function (dictApplicative) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Bifunctor_Wrap.Wrap)(bisequence(dictBitraversable)(dictApplicative)(v));
        };
    }, function (dictApplicative) {
        return function (l) {
            return function (r) {
                return function (v) {
                    return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Bifunctor_Wrap.Wrap)(bitraverse(dictBitraversable)(dictApplicative)(l)(r)(v));
                };
            };
        };
    });
};
var bitraverseDefault = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (f) {
            return function (g) {
                return function (t) {
                    return bisequence(dictBitraversable)(dictApplicative)(Data_Bifunctor.bimap(dictBitraversable.Bifunctor0())(f)(g)(t));
                };
            };
        };
    };
};
var bifor = function (dictBitraversable) {
    return function (dictApplicative) {
        return function (t) {
            return function (f) {
                return function (g) {
                    return bitraverse(dictBitraversable)(dictApplicative)(f)(g)(t);
                };
            };
        };
    };
};
module.exports = {
    Bitraversable: Bitraversable,
    bitraverse: bitraverse,
    bisequence: bisequence,
    bitraverseDefault: bitraverseDefault,
    bisequenceDefault: bisequenceDefault,
    ltraverse: ltraverse,
    rtraverse: rtraverse,
    bifor: bifor,
    lfor: lfor,
    rfor: rfor,
    bitraversableClown: bitraversableClown,
    bitraversableJoker: bitraversableJoker,
    bitraversableFlip: bitraversableFlip,
    bitraversableProduct: bitraversableProduct,
    bitraversableWrap: bitraversableWrap
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Category":43,"../Data.Bifoldable":57,"../Data.Bifunctor":63,"../Data.Bifunctor.Clown":58,"../Data.Bifunctor.Flip":59,"../Data.Bifunctor.Joker":60,"../Data.Bifunctor.Product":61,"../Data.Bifunctor.Wrap":62,"../Data.Functor":84,"../Data.Traversable":115,"../Prelude":138}],65:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var otherwise = true;
module.exports = {
    otherwise: otherwise
};

},{}],66:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Unit = require("../Data.Unit");
var BooleanAlgebra = function (HeytingAlgebra0) {
    this.HeytingAlgebra0 = HeytingAlgebra0;
};
var booleanAlgebraUnit = new BooleanAlgebra(function () {
    return Data_HeytingAlgebra.heytingAlgebraUnit;
});
var booleanAlgebraFn = function (dictBooleanAlgebra) {
    return new BooleanAlgebra(function () {
        return Data_HeytingAlgebra.heytingAlgebraFunction(dictBooleanAlgebra.HeytingAlgebra0());
    });
};
var booleanAlgebraBoolean = new BooleanAlgebra(function () {
    return Data_HeytingAlgebra.heytingAlgebraBoolean;
});
module.exports = {
    BooleanAlgebra: BooleanAlgebra,
    booleanAlgebraBoolean: booleanAlgebraBoolean,
    booleanAlgebraUnit: booleanAlgebraUnit,
    booleanAlgebraFn: booleanAlgebraFn
};

},{"../Data.HeytingAlgebra":86,"../Data.Unit":117}],67:[function(require,module,exports){
"use strict";

exports.topInt = 2147483647;
exports.bottomInt = -2147483648;

exports.topChar = String.fromCharCode(65535);
exports.bottomChar = String.fromCharCode(0);

exports.topNumber = Number.POSITIVE_INFINITY;
exports.bottomNumber = Number.NEGATIVE_INFINITY;

},{}],68:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Unit = require("../Data.Unit");
var Bounded = function (Ord0, bottom, top) {
    this.Ord0 = Ord0;
    this.bottom = bottom;
    this.top = top;
};
var top = function (dict) {
    return dict.top;
};
var boundedUnit = new Bounded(function () {
    return Data_Ord.ordUnit;
}, Data_Unit.unit, Data_Unit.unit);
var boundedOrdering = new Bounded(function () {
    return Data_Ord.ordOrdering;
}, Data_Ordering.LT.value, Data_Ordering.GT.value);
var boundedNumber = new Bounded(function () {
    return Data_Ord.ordNumber;
}, $foreign.bottomNumber, $foreign.topNumber);
var boundedInt = new Bounded(function () {
    return Data_Ord.ordInt;
}, $foreign.bottomInt, $foreign.topInt);
var boundedChar = new Bounded(function () {
    return Data_Ord.ordChar;
}, $foreign.bottomChar, $foreign.topChar);
var boundedBoolean = new Bounded(function () {
    return Data_Ord.ordBoolean;
}, false, true);
var bottom = function (dict) {
    return dict.bottom;
};
module.exports = {
    Bounded: Bounded,
    bottom: bottom,
    top: top,
    boundedBoolean: boundedBoolean,
    boundedInt: boundedInt,
    boundedChar: boundedChar,
    boundedOrdering: boundedOrdering,
    boundedUnit: boundedUnit,
    boundedNumber: boundedNumber
};

},{"../Data.Ord":102,"../Data.Ordering":103,"../Data.Unit":117,"./foreign":67}],69:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Data_Ring = require("../Data.Ring");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var CommutativeRing = function (Ring0) {
    this.Ring0 = Ring0;
};
var commutativeRingUnit = new CommutativeRing(function () {
    return Data_Ring.ringUnit;
});
var commutativeRingNumber = new CommutativeRing(function () {
    return Data_Ring.ringNumber;
});
var commutativeRingInt = new CommutativeRing(function () {
    return Data_Ring.ringInt;
});
var commutativeRingFn = function (dictCommutativeRing) {
    return new CommutativeRing(function () {
        return Data_Ring.ringFn(dictCommutativeRing.Ring0());
    });
};
module.exports = {
    CommutativeRing: CommutativeRing,
    commutativeRingInt: commutativeRingInt,
    commutativeRingNumber: commutativeRingNumber,
    commutativeRingUnit: commutativeRingUnit,
    commutativeRingFn: commutativeRingFn
};

},{"../Data.Ring":105,"../Data.Semiring":109,"../Data.Unit":117}],70:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Ring = require("../Data.Ring");
var Data_Semiring = require("../Data.Semiring");
var DivisionRing = function (Ring0, recip) {
    this.Ring0 = Ring0;
    this.recip = recip;
};
var recip = function (dict) {
    return dict.recip;
};
var rightDiv = function (dictDivisionRing) {
    return function (a) {
        return function (b) {
            return Data_Semiring.mul((dictDivisionRing.Ring0()).Semiring0())(a)(recip(dictDivisionRing)(b));
        };
    };
};
var leftDiv = function (dictDivisionRing) {
    return function (a) {
        return function (b) {
            return Data_Semiring.mul((dictDivisionRing.Ring0()).Semiring0())(recip(dictDivisionRing)(b))(a);
        };
    };
};
var divisionringNumber = new DivisionRing(function () {
    return Data_Ring.ringNumber;
}, function (x) {
    return 1.0 / x;
});
module.exports = {
    DivisionRing: DivisionRing,
    recip: recip,
    leftDiv: leftDiv,
    rightDiv: rightDiv,
    divisionringNumber: divisionringNumber
};

},{"../Data.EuclideanRing":75,"../Data.Ring":105,"../Data.Semiring":109}],71:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Extend = require("../Control.Extend");
var Control_Monad = require("../Control.Monad");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Bifoldable = require("../Data.Bifoldable");
var Data_Bifunctor = require("../Data.Bifunctor");
var Data_Bitraversable = require("../Data.Bitraversable");
var Data_Bounded = require("../Data.Bounded");
var Data_Eq = require("../Data.Eq");
var Data_Foldable = require("../Data.Foldable");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Show = require("../Data.Show");
var Data_Traversable = require("../Data.Traversable");
var Prelude = require("../Prelude");
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
var showEither = function (dictShow) {
    return function (dictShow1) {
        return new Data_Show.Show(function (v) {
            if (v instanceof Left) {
                return "(Left " + (Data_Show.show(dictShow)(v.value0) + ")");
            };
            if (v instanceof Right) {
                return "(Right " + (Data_Show.show(dictShow1)(v.value0) + ")");
            };
            throw new Error("Failed pattern match at Data.Either line 160, column 1 - line 160, column 61: " + [ v.constructor.name ]);
        });
    };
};
var note$prime = function (f) {
    return Data_Maybe["maybe'"](function ($171) {
        return Left.create(f($171));
    })(Right.create);
};
var note = function (a) {
    return Data_Maybe.maybe(new Left(a))(Right.create);
};
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
var invariantEither = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorEither));
var fromRight = function (dictPartial) {
    return function (v) {
        var __unused = function (dictPartial1) {
            return function ($dollar62) {
                return $dollar62;
            };
        };
        return __unused(dictPartial)((function () {
            if (v instanceof Right) {
                return v.value0;
            };
            throw new Error("Failed pattern match at Data.Either line 252, column 1 - line 252, column 52: " + [ v.constructor.name ]);
        })());
    };
};
var fromLeft = function (dictPartial) {
    return function (v) {
        var __unused = function (dictPartial1) {
            return function ($dollar66) {
                return $dollar66;
            };
        };
        return __unused(dictPartial)((function () {
            if (v instanceof Left) {
                return v.value0;
            };
            throw new Error("Failed pattern match at Data.Either line 247, column 1 - line 247, column 51: " + [ v.constructor.name ]);
        })());
    };
};
var foldableEither = new Data_Foldable.Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            if (v instanceof Left) {
                return Data_Monoid.mempty(dictMonoid);
            };
            if (v instanceof Right) {
                return f(v.value0);
            };
            throw new Error("Failed pattern match at Data.Either line 184, column 1 - line 184, column 47: " + [ f.constructor.name, v.constructor.name ]);
        };
    };
}, function (v) {
    return function (z) {
        return function (v1) {
            if (v1 instanceof Left) {
                return z;
            };
            if (v1 instanceof Right) {
                return v(z)(v1.value0);
            };
            throw new Error("Failed pattern match at Data.Either line 184, column 1 - line 184, column 47: " + [ v.constructor.name, z.constructor.name, v1.constructor.name ]);
        };
    };
}, function (v) {
    return function (z) {
        return function (v1) {
            if (v1 instanceof Left) {
                return z;
            };
            if (v1 instanceof Right) {
                return v(v1.value0)(z);
            };
            throw new Error("Failed pattern match at Data.Either line 184, column 1 - line 184, column 47: " + [ v.constructor.name, z.constructor.name, v1.constructor.name ]);
        };
    };
});
var traversableEither = new Data_Traversable.Traversable(function () {
    return foldableEither;
}, function () {
    return functorEither;
}, function (dictApplicative) {
    return function (v) {
        if (v instanceof Left) {
            return Control_Applicative.pure(dictApplicative)(new Left(v.value0));
        };
        if (v instanceof Right) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Right.create)(v.value0);
        };
        throw new Error("Failed pattern match at Data.Either line 200, column 1 - line 200, column 53: " + [ v.constructor.name ]);
    };
}, function (dictApplicative) {
    return function (v) {
        return function (v1) {
            if (v1 instanceof Left) {
                return Control_Applicative.pure(dictApplicative)(new Left(v1.value0));
            };
            if (v1 instanceof Right) {
                return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Right.create)(v(v1.value0));
            };
            throw new Error("Failed pattern match at Data.Either line 200, column 1 - line 200, column 53: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
});
var extendEither = new Control_Extend.Extend(function () {
    return functorEither;
}, function (v) {
    return function (v1) {
        if (v1 instanceof Left) {
            return new Left(v1.value0);
        };
        return new Right(v(v1));
    };
});
var eqEither = function (dictEq) {
    return function (dictEq1) {
        return new Data_Eq.Eq(function (x) {
            return function (y) {
                if (x instanceof Left && y instanceof Left) {
                    return Data_Eq.eq(dictEq)(x.value0)(y.value0);
                };
                if (x instanceof Right && y instanceof Right) {
                    return Data_Eq.eq(dictEq1)(x.value0)(y.value0);
                };
                return false;
            };
        });
    };
};
var ordEither = function (dictOrd) {
    return function (dictOrd1) {
        return new Data_Ord.Ord(function () {
            return eqEither(dictOrd.Eq0())(dictOrd1.Eq0());
        }, function (x) {
            return function (y) {
                if (x instanceof Left && y instanceof Left) {
                    return Data_Ord.compare(dictOrd)(x.value0)(y.value0);
                };
                if (x instanceof Left) {
                    return Data_Ordering.LT.value;
                };
                if (y instanceof Left) {
                    return Data_Ordering.GT.value;
                };
                if (x instanceof Right && y instanceof Right) {
                    return Data_Ord.compare(dictOrd1)(x.value0)(y.value0);
                };
                throw new Error("Failed pattern match at Data.Either line 176, column 8 - line 176, column 64: " + [ x.constructor.name, y.constructor.name ]);
            };
        });
    };
};
var eq1Either = function (dictEq) {
    return new Data_Eq.Eq1(function (dictEq1) {
        return Data_Eq.eq(eqEither(dictEq)(dictEq1));
    });
};
var ord1Either = function (dictOrd) {
    return new Data_Ord.Ord1(function () {
        return eq1Either(dictOrd.Eq0());
    }, function (dictOrd1) {
        return Data_Ord.compare(ordEither(dictOrd)(dictOrd1));
    });
};
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
var hush = either(Data_Function["const"](Data_Maybe.Nothing.value))(Data_Maybe.Just.create);
var isLeft = either(Data_Function["const"](true))(Data_Function["const"](false));
var isRight = either(Data_Function["const"](false))(Data_Function["const"](true));
var choose = function (dictAlt) {
    return function (a) {
        return function (b) {
            return Control_Alt.alt(dictAlt)(Data_Functor.map(dictAlt.Functor0())(Left.create)(a))(Data_Functor.map(dictAlt.Functor0())(Right.create)(b));
        };
    };
};
var boundedEither = function (dictBounded) {
    return function (dictBounded1) {
        return new Data_Bounded.Bounded(function () {
            return ordEither(dictBounded.Ord0())(dictBounded1.Ord0());
        }, new Left(Data_Bounded.bottom(dictBounded)), new Right(Data_Bounded.top(dictBounded1)));
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
var bifoldableEither = new Data_Bifoldable.Bifoldable(function (dictMonoid) {
    return function (v) {
        return function (v1) {
            return function (v2) {
                if (v2 instanceof Left) {
                    return v(v2.value0);
                };
                if (v2 instanceof Right) {
                    return v1(v2.value0);
                };
                throw new Error("Failed pattern match at Data.Either line 192, column 1 - line 192, column 47: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
            };
        };
    };
}, function (v) {
    return function (v1) {
        return function (z) {
            return function (v2) {
                if (v2 instanceof Left) {
                    return v(z)(v2.value0);
                };
                if (v2 instanceof Right) {
                    return v1(z)(v2.value0);
                };
                throw new Error("Failed pattern match at Data.Either line 192, column 1 - line 192, column 47: " + [ v.constructor.name, v1.constructor.name, z.constructor.name, v2.constructor.name ]);
            };
        };
    };
}, function (v) {
    return function (v1) {
        return function (z) {
            return function (v2) {
                if (v2 instanceof Left) {
                    return v(v2.value0)(z);
                };
                if (v2 instanceof Right) {
                    return v1(v2.value0)(z);
                };
                throw new Error("Failed pattern match at Data.Either line 192, column 1 - line 192, column 47: " + [ v.constructor.name, v1.constructor.name, z.constructor.name, v2.constructor.name ]);
            };
        };
    };
});
var bitraversableEither = new Data_Bitraversable.Bitraversable(function () {
    return bifoldableEither;
}, function () {
    return bifunctorEither;
}, function (dictApplicative) {
    return function (v) {
        if (v instanceof Left) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Left.create)(v.value0);
        };
        if (v instanceof Right) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Right.create)(v.value0);
        };
        throw new Error("Failed pattern match at Data.Either line 206, column 1 - line 206, column 53: " + [ v.constructor.name ]);
    };
}, function (dictApplicative) {
    return function (v) {
        return function (v1) {
            return function (v2) {
                if (v2 instanceof Left) {
                    return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Left.create)(v(v2.value0));
                };
                if (v2 instanceof Right) {
                    return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Right.create)(v1(v2.value0));
                };
                throw new Error("Failed pattern match at Data.Either line 206, column 1 - line 206, column 53: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
            };
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
var bindEither = new Control_Bind.Bind(function () {
    return applyEither;
}, either(function (e) {
    return function (v) {
        return new Left(e);
    };
})(function (a) {
    return function (f) {
        return f(a);
    };
}));
var semigroupEither = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (x) {
        return function (y) {
            return Control_Apply.apply(applyEither)(Data_Functor.map(functorEither)(Data_Semigroup.append(dictSemigroup))(x))(y);
        };
    });
};
var semiringEither = function (dictSemiring) {
    return new Data_Semiring.Semiring(function (x) {
        return function (y) {
            return Control_Apply.apply(applyEither)(Data_Functor.map(functorEither)(Data_Semiring.add(dictSemiring))(x))(y);
        };
    }, function (x) {
        return function (y) {
            return Control_Apply.apply(applyEither)(Data_Functor.map(functorEither)(Data_Semiring.mul(dictSemiring))(x))(y);
        };
    }, new Right(Data_Semiring.one(dictSemiring)), new Right(Data_Semiring.zero(dictSemiring)));
};
var applicativeEither = new Control_Applicative.Applicative(function () {
    return applyEither;
}, Right.create);
var monadEither = new Control_Monad.Monad(function () {
    return applicativeEither;
}, function () {
    return bindEither;
});
var altEither = new Control_Alt.Alt(function () {
    return functorEither;
}, function (v) {
    return function (v1) {
        if (v instanceof Left) {
            return v1;
        };
        return v;
    };
});
module.exports = {
    Left: Left,
    Right: Right,
    either: either,
    choose: choose,
    isLeft: isLeft,
    isRight: isRight,
    fromLeft: fromLeft,
    fromRight: fromRight,
    note: note,
    "note'": note$prime,
    hush: hush,
    functorEither: functorEither,
    invariantEither: invariantEither,
    bifunctorEither: bifunctorEither,
    applyEither: applyEither,
    applicativeEither: applicativeEither,
    altEither: altEither,
    bindEither: bindEither,
    monadEither: monadEither,
    extendEither: extendEither,
    showEither: showEither,
    eqEither: eqEither,
    eq1Either: eq1Either,
    ordEither: ordEither,
    ord1Either: ord1Either,
    boundedEither: boundedEither,
    foldableEither: foldableEither,
    bifoldableEither: bifoldableEither,
    traversableEither: traversableEither,
    bitraversableEither: bitraversableEither,
    semiringEither: semiringEither,
    semigroupEither: semigroupEither
};

},{"../Control.Alt":34,"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Extend":46,"../Control.Monad":53,"../Control.Semigroupoid":56,"../Data.Bifoldable":57,"../Data.Bifunctor":63,"../Data.Bitraversable":64,"../Data.Bounded":68,"../Data.Eq":73,"../Data.Foldable":78,"../Data.Function":81,"../Data.Functor":84,"../Data.Functor.Invariant":82,"../Data.Maybe":89,"../Data.Monoid":96,"../Data.Ord":102,"../Data.Ordering":103,"../Data.Semigroup":107,"../Data.Semiring":109,"../Data.Show":111,"../Data.Traversable":115,"../Prelude":138}],72:[function(require,module,exports){
"use strict";

exports.refEq = function (r1) {
  return function (r2) {
    return r1 === r2;
  };
};

exports.eqArrayImpl = function (f) {
  return function (xs) {
    return function (ys) {
      if (xs.length !== ys.length) return false;
      for (var i = 0; i < xs.length; i++) {
        if (!f(xs[i])(ys[i])) return false;
      }
      return true;
    };
  };
};

},{}],73:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_Unit = require("../Data.Unit");
var Data_Void = require("../Data.Void");
var Eq = function (eq) {
    this.eq = eq;
};
var Eq1 = function (eq1) {
    this.eq1 = eq1;
};
var eqVoid = new Eq(function (v) {
    return function (v1) {
        return true;
    };
});
var eqUnit = new Eq(function (v) {
    return function (v1) {
        return true;
    };
});
var eqString = new Eq($foreign.refEq);
var eqNumber = new Eq($foreign.refEq);
var eqInt = new Eq($foreign.refEq);
var eqChar = new Eq($foreign.refEq);
var eqBoolean = new Eq($foreign.refEq);
var eq1 = function (dict) {
    return dict.eq1;
};
var eq = function (dict) {
    return dict.eq;
};
var eqArray = function (dictEq) {
    return new Eq($foreign.eqArrayImpl(eq(dictEq)));
};
var eq1Array = new Eq1(function (dictEq) {
    return eq(eqArray(dictEq));
});
var notEq = function (dictEq) {
    return function (x) {
        return function (y) {
            return eq(eqBoolean)(eq(dictEq)(x)(y))(false);
        };
    };
};
var notEq1 = function (dictEq1) {
    return function (dictEq) {
        return function (x) {
            return function (y) {
                return eq(eqBoolean)(eq1(dictEq1)(dictEq)(x)(y))(false);
            };
        };
    };
};
module.exports = {
    Eq: Eq,
    eq: eq,
    notEq: notEq,
    Eq1: Eq1,
    eq1: eq1,
    notEq1: notEq1,
    eqBoolean: eqBoolean,
    eqInt: eqInt,
    eqNumber: eqNumber,
    eqChar: eqChar,
    eqString: eqString,
    eqUnit: eqUnit,
    eqVoid: eqVoid,
    eqArray: eqArray,
    eq1Array: eq1Array
};

},{"../Data.Unit":117,"../Data.Void":118,"./foreign":72}],74:[function(require,module,exports){
"use strict";

exports.intDegree = function (x) {
  return Math.min(Math.abs(x), 2147483647);
};

exports.intDiv = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x / y | 0;
  };
};

exports.intMod = function (x) {
  return function (y) {
    return x % y;
  };
};

exports.numDiv = function (n1) {
  return function (n2) {
    return n1 / n2;
  };
};

},{}],75:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_BooleanAlgebra = require("../Data.BooleanAlgebra");
var Data_CommutativeRing = require("../Data.CommutativeRing");
var Data_Eq = require("../Data.Eq");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Ring = require("../Data.Ring");
var Data_Semiring = require("../Data.Semiring");
var EuclideanRing = function (CommutativeRing0, degree, div, mod) {
    this.CommutativeRing0 = CommutativeRing0;
    this.degree = degree;
    this.div = div;
    this.mod = mod;
};
var mod = function (dict) {
    return dict.mod;
};
var gcd = function ($copy_dictEq) {
    return function ($copy_dictEuclideanRing) {
        return function ($copy_a) {
            return function ($copy_b) {
                var $tco_var_dictEq = $copy_dictEq;
                var $tco_var_dictEuclideanRing = $copy_dictEuclideanRing;
                var $tco_var_a = $copy_a;
                var $tco_done = false;
                var $tco_result;
                function $tco_loop(dictEq, dictEuclideanRing, a, b) {
                    var $7 = Data_Eq.eq(dictEq)(b)(Data_Semiring.zero(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0()));
                    if ($7) {
                        $tco_done = true;
                        return a;
                    };
                    $tco_var_dictEq = dictEq;
                    $tco_var_dictEuclideanRing = dictEuclideanRing;
                    $tco_var_a = b;
                    $copy_b = mod(dictEuclideanRing)(a)(b);
                    return;
                };
                while (!$tco_done) {
                    $tco_result = $tco_loop($tco_var_dictEq, $tco_var_dictEuclideanRing, $tco_var_a, $copy_b);
                };
                return $tco_result;
            };
        };
    };
};
var euclideanRingNumber = new EuclideanRing(function () {
    return Data_CommutativeRing.commutativeRingNumber;
}, function (v) {
    return 1;
}, $foreign.numDiv, function (v) {
    return function (v1) {
        return 0.0;
    };
});
var euclideanRingInt = new EuclideanRing(function () {
    return Data_CommutativeRing.commutativeRingInt;
}, $foreign.intDegree, $foreign.intDiv, $foreign.intMod);
var div = function (dict) {
    return dict.div;
};
var lcm = function (dictEq) {
    return function (dictEuclideanRing) {
        return function (a) {
            return function (b) {
                var $8 = Data_Eq.eq(dictEq)(a)(Data_Semiring.zero(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0())) || Data_Eq.eq(dictEq)(b)(Data_Semiring.zero(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0()));
                if ($8) {
                    return Data_Semiring.zero(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0());
                };
                return div(dictEuclideanRing)(Data_Semiring.mul(((dictEuclideanRing.CommutativeRing0()).Ring0()).Semiring0())(a)(b))(gcd(dictEq)(dictEuclideanRing)(a)(b));
            };
        };
    };
};
var degree = function (dict) {
    return dict.degree;
};
module.exports = {
    EuclideanRing: EuclideanRing,
    degree: degree,
    div: div,
    mod: mod,
    gcd: gcd,
    lcm: lcm,
    euclideanRingInt: euclideanRingInt,
    euclideanRingNumber: euclideanRingNumber
};

},{"../Data.BooleanAlgebra":66,"../Data.CommutativeRing":69,"../Data.Eq":73,"../Data.HeytingAlgebra":86,"../Data.Ring":105,"../Data.Semiring":109,"./foreign":74}],76:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Data_CommutativeRing = require("../Data.CommutativeRing");
var Data_DivisionRing = require("../Data.DivisionRing");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Ring = require("../Data.Ring");
var Data_Semiring = require("../Data.Semiring");
var Field = function (EuclideanRing0) {
    this.EuclideanRing0 = EuclideanRing0;
};
var fieldNumber = new Field(function () {
    return Data_EuclideanRing.euclideanRingNumber;
});
module.exports = {
    Field: Field,
    fieldNumber: fieldNumber
};

},{"../Data.CommutativeRing":69,"../Data.DivisionRing":70,"../Data.EuclideanRing":75,"../Data.Ring":105,"../Data.Semiring":109}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Alt = require("../Control.Alt");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Category = require("../Control.Category");
var Control_Plus = require("../Control.Plus");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Eq = require("../Data.Eq");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Maybe = require("../Data.Maybe");
var Data_Maybe_First = require("../Data.Maybe.First");
var Data_Maybe_Last = require("../Data.Maybe.Last");
var Data_Monoid = require("../Data.Monoid");
var Data_Monoid_Additive = require("../Data.Monoid.Additive");
var Data_Monoid_Conj = require("../Data.Monoid.Conj");
var Data_Monoid_Disj = require("../Data.Monoid.Disj");
var Data_Monoid_Dual = require("../Data.Monoid.Dual");
var Data_Monoid_Endo = require("../Data.Monoid.Endo");
var Data_Monoid_Multiplicative = require("../Data.Monoid.Multiplicative");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var Prelude = require("../Prelude");
var Foldable = function (foldMap, foldl, foldr) {
    this.foldMap = foldMap;
    this.foldl = foldl;
    this.foldr = foldr;
};
var foldr = function (dict) {
    return dict.foldr;
};
var indexr = function (dictFoldable) {
    return function (idx) {
        var go = function (a) {
            return function (cursor) {
                if (cursor.elem instanceof Data_Maybe.Just) {
                    return cursor;
                };
                var $106 = cursor.pos === idx;
                if ($106) {
                    return {
                        elem: new Data_Maybe.Just(a),
                        pos: cursor.pos
                    };
                };
                return {
                    pos: cursor.pos + 1 | 0,
                    elem: cursor.elem
                };
            };
        };
        return function ($193) {
            return (function (v) {
                return v.elem;
            })(foldr(dictFoldable)(go)({
                elem: Data_Maybe.Nothing.value,
                pos: 0
            })($193));
        };
    };
};
var $$null = function (dictFoldable) {
    return foldr(dictFoldable)(function (v) {
        return function (v1) {
            return false;
        };
    })(true);
};
var oneOf = function (dictFoldable) {
    return function (dictPlus) {
        return foldr(dictFoldable)(Control_Alt.alt(dictPlus.Alt0()))(Control_Plus.empty(dictPlus));
    };
};
var oneOfMap = function (dictFoldable) {
    return function (dictPlus) {
        return function (f) {
            return foldr(dictFoldable)(function ($194) {
                return Control_Alt.alt(dictPlus.Alt0())(f($194));
            })(Control_Plus.empty(dictPlus));
        };
    };
};
var traverse_ = function (dictApplicative) {
    return function (dictFoldable) {
        return function (f) {
            return foldr(dictFoldable)(function ($195) {
                return Control_Apply.applySecond(dictApplicative.Apply0())(f($195));
            })(Control_Applicative.pure(dictApplicative)(Data_Unit.unit));
        };
    };
};
var for_ = function (dictApplicative) {
    return function (dictFoldable) {
        return Data_Function.flip(traverse_(dictApplicative)(dictFoldable));
    };
};
var sequence_ = function (dictApplicative) {
    return function (dictFoldable) {
        return traverse_(dictApplicative)(dictFoldable)(Control_Category.id(Control_Category.categoryFn));
    };
};
var foldl = function (dict) {
    return dict.foldl;
};
var indexl = function (dictFoldable) {
    return function (idx) {
        var go = function (cursor) {
            return function (a) {
                if (cursor.elem instanceof Data_Maybe.Just) {
                    return cursor;
                };
                var $109 = cursor.pos === idx;
                if ($109) {
                    return {
                        elem: new Data_Maybe.Just(a),
                        pos: cursor.pos
                    };
                };
                return {
                    pos: cursor.pos + 1 | 0,
                    elem: cursor.elem
                };
            };
        };
        return function ($196) {
            return (function (v) {
                return v.elem;
            })(foldl(dictFoldable)(go)({
                elem: Data_Maybe.Nothing.value,
                pos: 0
            })($196));
        };
    };
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
var length = function (dictFoldable) {
    return function (dictSemiring) {
        return foldl(dictFoldable)(function (c) {
            return function (v) {
                return Data_Semiring.add(dictSemiring)(Data_Semiring.one(dictSemiring))(c);
            };
        })(Data_Semiring.zero(dictSemiring));
    };
};
var maximumBy = function (dictFoldable) {
    return function (cmp) {
        var max$prime = function (v) {
            return function (v1) {
                if (v instanceof Data_Maybe.Nothing) {
                    return new Data_Maybe.Just(v1);
                };
                if (v instanceof Data_Maybe.Just) {
                    return new Data_Maybe.Just((function () {
                        var $116 = Data_Eq.eq(Data_Ordering.eqOrdering)(cmp(v.value0)(v1))(Data_Ordering.GT.value);
                        if ($116) {
                            return v.value0;
                        };
                        return v1;
                    })());
                };
                throw new Error("Failed pattern match at Data.Foldable line 378, column 3 - line 378, column 27: " + [ v.constructor.name, v1.constructor.name ]);
            };
        };
        return foldl(dictFoldable)(max$prime)(Data_Maybe.Nothing.value);
    };
};
var maximum = function (dictOrd) {
    return function (dictFoldable) {
        return maximumBy(dictFoldable)(Data_Ord.compare(dictOrd));
    };
};
var minimumBy = function (dictFoldable) {
    return function (cmp) {
        var min$prime = function (v) {
            return function (v1) {
                if (v instanceof Data_Maybe.Nothing) {
                    return new Data_Maybe.Just(v1);
                };
                if (v instanceof Data_Maybe.Just) {
                    return new Data_Maybe.Just((function () {
                        var $120 = Data_Eq.eq(Data_Ordering.eqOrdering)(cmp(v.value0)(v1))(Data_Ordering.LT.value);
                        if ($120) {
                            return v.value0;
                        };
                        return v1;
                    })());
                };
                throw new Error("Failed pattern match at Data.Foldable line 391, column 3 - line 391, column 27: " + [ v.constructor.name, v1.constructor.name ]);
            };
        };
        return foldl(dictFoldable)(min$prime)(Data_Maybe.Nothing.value);
    };
};
var minimum = function (dictOrd) {
    return function (dictFoldable) {
        return minimumBy(dictFoldable)(Data_Ord.compare(dictOrd));
    };
};
var product = function (dictFoldable) {
    return function (dictSemiring) {
        return foldl(dictFoldable)(Data_Semiring.mul(dictSemiring))(Data_Semiring.one(dictSemiring));
    };
};
var sum = function (dictFoldable) {
    return function (dictSemiring) {
        return foldl(dictFoldable)(Data_Semiring.add(dictSemiring))(Data_Semiring.zero(dictSemiring));
    };
};
var foldableMultiplicative = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
var foldableMaybe = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            if (v instanceof Data_Maybe.Nothing) {
                return Data_Monoid.mempty(dictMonoid);
            };
            if (v instanceof Data_Maybe.Just) {
                return f(v.value0);
            };
            throw new Error("Failed pattern match at Data.Foldable line 131, column 1 - line 131, column 41: " + [ f.constructor.name, v.constructor.name ]);
        };
    };
}, function (v) {
    return function (z) {
        return function (v1) {
            if (v1 instanceof Data_Maybe.Nothing) {
                return z;
            };
            if (v1 instanceof Data_Maybe.Just) {
                return v(z)(v1.value0);
            };
            throw new Error("Failed pattern match at Data.Foldable line 131, column 1 - line 131, column 41: " + [ v.constructor.name, z.constructor.name, v1.constructor.name ]);
        };
    };
}, function (v) {
    return function (z) {
        return function (v1) {
            if (v1 instanceof Data_Maybe.Nothing) {
                return z;
            };
            if (v1 instanceof Data_Maybe.Just) {
                return v(v1.value0)(z);
            };
            throw new Error("Failed pattern match at Data.Foldable line 131, column 1 - line 131, column 41: " + [ v.constructor.name, z.constructor.name, v1.constructor.name ]);
        };
    };
});
var foldableDual = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
var foldableDisj = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
var foldableConj = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
var foldableAdditive = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return f(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return f(v)(z);
        };
    };
});
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
var foldMapDefaultL = function (dictFoldable) {
    return function (dictMonoid) {
        return function (f) {
            return foldl(dictFoldable)(function (acc) {
                return function (x) {
                    return Data_Semigroup.append(dictMonoid.Semigroup0())(acc)(f(x));
                };
            })(Data_Monoid.mempty(dictMonoid));
        };
    };
};
var foldMap = function (dict) {
    return dict.foldMap;
};
var foldableFirst = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return foldMap(foldableMaybe)(dictMonoid)(f)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return foldl(foldableMaybe)(f)(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return foldr(foldableMaybe)(f)(z)(v);
        };
    };
});
var foldableLast = new Foldable(function (dictMonoid) {
    return function (f) {
        return function (v) {
            return foldMap(foldableMaybe)(dictMonoid)(f)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return foldl(foldableMaybe)(f)(z)(v);
        };
    };
}, function (f) {
    return function (z) {
        return function (v) {
            return foldr(foldableMaybe)(f)(z)(v);
        };
    };
});
var foldlDefault = function (dictFoldable) {
    return function (c) {
        return function (u) {
            return function (xs) {
                return Data_Newtype.unwrap(Data_Monoid_Endo.newtypeEndo)(Data_Newtype.unwrap(Data_Monoid_Dual.newtypeDual)(foldMap(dictFoldable)(Data_Monoid_Dual.monoidDual(Data_Monoid_Endo.monoidEndo))(function ($197) {
                    return Data_Monoid_Dual.Dual(Data_Monoid_Endo.Endo(Data_Function.flip(c)($197)));
                })(xs)))(u);
            };
        };
    };
};
var foldrDefault = function (dictFoldable) {
    return function (c) {
        return function (u) {
            return function (xs) {
                return Data_Newtype.unwrap(Data_Monoid_Endo.newtypeEndo)(foldMap(dictFoldable)(Data_Monoid_Endo.monoidEndo)(function ($198) {
                    return Data_Monoid_Endo.Endo(c($198));
                })(xs))(u);
            };
        };
    };
};
var surroundMap = function (dictFoldable) {
    return function (dictSemigroup) {
        return function (d) {
            return function (t) {
                return function (f) {
                    var joined = function (a) {
                        return function (m) {
                            return Data_Semigroup.append(dictSemigroup)(d)(Data_Semigroup.append(dictSemigroup)(t(a))(m));
                        };
                    };
                    return Data_Newtype.unwrap(Data_Monoid_Endo.newtypeEndo)(foldMap(dictFoldable)(Data_Monoid_Endo.monoidEndo)(joined)(f))(d);
                };
            };
        };
    };
};
var surround = function (dictFoldable) {
    return function (dictSemigroup) {
        return function (d) {
            return surroundMap(dictFoldable)(dictSemigroup)(d)(Control_Category.id(Control_Category.categoryFn));
        };
    };
};
var foldM = function (dictFoldable) {
    return function (dictMonad) {
        return function (f) {
            return function (a0) {
                return foldl(dictFoldable)(function (ma) {
                    return function (b) {
                        return Control_Bind.bind(dictMonad.Bind1())(ma)(Data_Function.flip(f)(b));
                    };
                })(Control_Applicative.pure(dictMonad.Applicative0())(a0));
            };
        };
    };
};
var fold = function (dictFoldable) {
    return function (dictMonoid) {
        return foldMap(dictFoldable)(dictMonoid)(Control_Category.id(Control_Category.categoryFn));
    };
};
var findMap = function (dictFoldable) {
    return function (p) {
        var go = function (v) {
            return function (v1) {
                if (v instanceof Data_Maybe.Nothing) {
                    return p(v1);
                };
                return v;
            };
        };
        return foldl(dictFoldable)(go)(Data_Maybe.Nothing.value);
    };
};
var find = function (dictFoldable) {
    return function (p) {
        var go = function (v) {
            return function (v1) {
                if (v instanceof Data_Maybe.Nothing && p(v1)) {
                    return new Data_Maybe.Just(v1);
                };
                return v;
            };
        };
        return foldl(dictFoldable)(go)(Data_Maybe.Nothing.value);
    };
};
var any = function (dictFoldable) {
    return function (dictHeytingAlgebra) {
        return Data_Newtype.alaF(Data_Functor.functorFn)(Data_Functor.functorFn)(Data_Monoid_Disj.newtypeDisj)(Data_Monoid_Disj.newtypeDisj)(Data_Monoid_Disj.Disj)(foldMap(dictFoldable)(Data_Monoid_Disj.monoidDisj(dictHeytingAlgebra)));
    };
};
var elem = function (dictFoldable) {
    return function (dictEq) {
        return function ($199) {
            return any(dictFoldable)(Data_HeytingAlgebra.heytingAlgebraBoolean)(Data_Eq.eq(dictEq)($199));
        };
    };
};
var notElem = function (dictFoldable) {
    return function (dictEq) {
        return function (x) {
            return function ($200) {
                return !elem(dictFoldable)(dictEq)(x)($200);
            };
        };
    };
};
var or = function (dictFoldable) {
    return function (dictHeytingAlgebra) {
        return any(dictFoldable)(dictHeytingAlgebra)(Control_Category.id(Control_Category.categoryFn));
    };
};
var all = function (dictFoldable) {
    return function (dictHeytingAlgebra) {
        return Data_Newtype.alaF(Data_Functor.functorFn)(Data_Functor.functorFn)(Data_Monoid_Conj.newtypeConj)(Data_Monoid_Conj.newtypeConj)(Data_Monoid_Conj.Conj)(foldMap(dictFoldable)(Data_Monoid_Conj.monoidConj(dictHeytingAlgebra)));
    };
};
var and = function (dictFoldable) {
    return function (dictHeytingAlgebra) {
        return all(dictFoldable)(dictHeytingAlgebra)(Control_Category.id(Control_Category.categoryFn));
    };
};
module.exports = {
    Foldable: Foldable,
    foldr: foldr,
    foldl: foldl,
    foldMap: foldMap,
    foldrDefault: foldrDefault,
    foldlDefault: foldlDefault,
    foldMapDefaultL: foldMapDefaultL,
    foldMapDefaultR: foldMapDefaultR,
    fold: fold,
    foldM: foldM,
    traverse_: traverse_,
    for_: for_,
    sequence_: sequence_,
    oneOf: oneOf,
    oneOfMap: oneOfMap,
    intercalate: intercalate,
    surroundMap: surroundMap,
    surround: surround,
    and: and,
    or: or,
    all: all,
    any: any,
    sum: sum,
    product: product,
    elem: elem,
    notElem: notElem,
    indexl: indexl,
    indexr: indexr,
    find: find,
    findMap: findMap,
    maximum: maximum,
    maximumBy: maximumBy,
    minimum: minimum,
    minimumBy: minimumBy,
    "null": $$null,
    length: length,
    foldableArray: foldableArray,
    foldableMaybe: foldableMaybe,
    foldableFirst: foldableFirst,
    foldableLast: foldableLast,
    foldableAdditive: foldableAdditive,
    foldableDual: foldableDual,
    foldableDisj: foldableDisj,
    foldableConj: foldableConj,
    foldableMultiplicative: foldableMultiplicative
};

},{"../Control.Alt":34,"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Category":43,"../Control.Plus":55,"../Control.Semigroupoid":56,"../Data.Eq":73,"../Data.Function":81,"../Data.Functor":84,"../Data.HeytingAlgebra":86,"../Data.Maybe":89,"../Data.Maybe.First":87,"../Data.Maybe.Last":88,"../Data.Monoid":96,"../Data.Monoid.Additive":90,"../Data.Monoid.Conj":91,"../Data.Monoid.Disj":92,"../Data.Monoid.Dual":93,"../Data.Monoid.Endo":94,"../Data.Monoid.Multiplicative":95,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Ordering":103,"../Data.Semigroup":107,"../Data.Semiring":109,"../Data.Unit":117,"../Prelude":138,"./foreign":77}],79:[function(require,module,exports){
"use strict";

// module Data.Function.Uncurried

exports.mkFn0 = function (fn) {
  return function () {
    return fn({});
  };
};

exports.mkFn2 = function (fn) {
  /* jshint maxparams: 2 */
  return function (a, b) {
    return fn(a)(b);
  };
};

exports.mkFn3 = function (fn) {
  /* jshint maxparams: 3 */
  return function (a, b, c) {
    return fn(a)(b)(c);
  };
};

exports.mkFn4 = function (fn) {
  /* jshint maxparams: 4 */
  return function (a, b, c, d) {
    return fn(a)(b)(c)(d);
  };
};

exports.mkFn5 = function (fn) {
  /* jshint maxparams: 5 */
  return function (a, b, c, d, e) {
    return fn(a)(b)(c)(d)(e);
  };
};

exports.mkFn6 = function (fn) {
  /* jshint maxparams: 6 */
  return function (a, b, c, d, e, f) {
    return fn(a)(b)(c)(d)(e)(f);
  };
};

exports.mkFn7 = function (fn) {
  /* jshint maxparams: 7 */
  return function (a, b, c, d, e, f, g) {
    return fn(a)(b)(c)(d)(e)(f)(g);
  };
};

exports.mkFn8 = function (fn) {
  /* jshint maxparams: 8 */
  return function (a, b, c, d, e, f, g, h) {
    return fn(a)(b)(c)(d)(e)(f)(g)(h);
  };
};

exports.mkFn9 = function (fn) {
  /* jshint maxparams: 9 */
  return function (a, b, c, d, e, f, g, h, i) {
    return fn(a)(b)(c)(d)(e)(f)(g)(h)(i);
  };
};

exports.mkFn10 = function (fn) {
  /* jshint maxparams: 10 */
  return function (a, b, c, d, e, f, g, h, i, j) {
    return fn(a)(b)(c)(d)(e)(f)(g)(h)(i)(j);
  };
};

exports.runFn0 = function (fn) {
  return fn();
};

exports.runFn2 = function (fn) {
  return function (a) {
    return function (b) {
      return fn(a, b);
    };
  };
};

exports.runFn3 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return fn(a, b, c);
      };
    };
  };
};

exports.runFn4 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return fn(a, b, c, d);
        };
      };
    };
  };
};

exports.runFn5 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return fn(a, b, c, d, e);
          };
        };
      };
    };
  };
};

exports.runFn6 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return fn(a, b, c, d, e, f);
            };
          };
        };
      };
    };
  };
};

exports.runFn7 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return fn(a, b, c, d, e, f, g);
              };
            };
          };
        };
      };
    };
  };
};

exports.runFn8 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return function (h) {
                  return fn(a, b, c, d, e, f, g, h);
                };
              };
            };
          };
        };
      };
    };
  };
};

exports.runFn9 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return function (h) {
                  return function (i) {
                    return fn(a, b, c, d, e, f, g, h, i);
                  };
                };
              };
            };
          };
        };
      };
    };
  };
};

exports.runFn10 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return function (h) {
                  return function (i) {
                    return function (j) {
                      return fn(a, b, c, d, e, f, g, h, i, j);
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
};

},{}],80:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_Unit = require("../Data.Unit");
var runFn1 = function (f) {
    return f;
};
var mkFn1 = function (f) {
    return f;
};
module.exports = {
    mkFn1: mkFn1,
    runFn1: runFn1,
    mkFn0: $foreign.mkFn0,
    mkFn2: $foreign.mkFn2,
    mkFn3: $foreign.mkFn3,
    mkFn4: $foreign.mkFn4,
    mkFn5: $foreign.mkFn5,
    mkFn6: $foreign.mkFn6,
    mkFn7: $foreign.mkFn7,
    mkFn8: $foreign.mkFn8,
    mkFn9: $foreign.mkFn9,
    mkFn10: $foreign.mkFn10,
    runFn0: $foreign.runFn0,
    runFn2: $foreign.runFn2,
    runFn3: $foreign.runFn3,
    runFn4: $foreign.runFn4,
    runFn5: $foreign.runFn5,
    runFn6: $foreign.runFn6,
    runFn7: $foreign.runFn7,
    runFn8: $foreign.runFn8,
    runFn9: $foreign.runFn9,
    runFn10: $foreign.runFn10
};

},{"../Data.Unit":117,"./foreign":79}],81:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Category = require("../Control.Category");
var Data_Boolean = require("../Data.Boolean");
var Data_Ord = require("../Data.Ord");
var Data_Ring = require("../Data.Ring");
var on = function (f) {
    return function (g) {
        return function (x) {
            return function (y) {
                return f(g(x))(g(y));
            };
        };
    };
};
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
var applyN = function (f) {
    var go = function ($copy_n) {
        return function ($copy_acc) {
            var $tco_var_n = $copy_n;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(n, acc) {
                if (n <= 0) {
                    $tco_done = true;
                    return acc;
                };
                if (Data_Boolean.otherwise) {
                    $tco_var_n = n - 1 | 0;
                    $copy_acc = f(acc);
                    return;
                };
                throw new Error("Failed pattern match at Data.Function line 94, column 3 - line 96, column 37: " + [ n.constructor.name, acc.constructor.name ]);
            };
            while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_n, $copy_acc);
            };
            return $tco_result;
        };
    };
    return go;
};
var applyFlipped = function (x) {
    return function (f) {
        return f(x);
    };
};
var apply = function (f) {
    return function (x) {
        return f(x);
    };
};
module.exports = {
    flip: flip,
    "const": $$const,
    apply: apply,
    applyFlipped: applyFlipped,
    applyN: applyN,
    on: on
};

},{"../Control.Category":43,"../Data.Boolean":65,"../Data.Ord":102,"../Data.Ring":105}],82:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Data_Functor = require("../Data.Functor");
var Invariant = function (imap) {
    this.imap = imap;
};
var imapF = function (dictFunctor) {
    return function (f) {
        return function (v) {
            return Data_Functor.map(dictFunctor)(f);
        };
    };
};
var invariantArray = new Invariant(imapF(Data_Functor.functorArray));
var invariantFn = new Invariant(imapF(Data_Functor.functorFn));
var imap = function (dict) {
    return dict.imap;
};
module.exports = {
    imap: imap,
    Invariant: Invariant,
    imapF: imapF,
    invariantFn: invariantFn,
    invariantArray: invariantArray
};

},{"../Data.Functor":84}],83:[function(require,module,exports){
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

},{}],84:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Function = require("../Data.Function");
var Data_Unit = require("../Data.Unit");
var Functor = function (map) {
    this.map = map;
};
var map = function (dict) {
    return dict.map;
};
var mapFlipped = function (dictFunctor) {
    return function (fa) {
        return function (f) {
            return map(dictFunctor)(f)(fa);
        };
    };
};
var $$void = function (dictFunctor) {
    return map(dictFunctor)(Data_Function["const"](Data_Unit.unit));
};
var voidLeft = function (dictFunctor) {
    return function (f) {
        return function (x) {
            return map(dictFunctor)(Data_Function["const"](x))(f);
        };
    };
};
var voidRight = function (dictFunctor) {
    return function (x) {
        return map(dictFunctor)(Data_Function["const"](x));
    };
};
var functorFn = new Functor(Control_Semigroupoid.compose(Control_Semigroupoid.semigroupoidFn));
var functorArray = new Functor($foreign.arrayMap);
var flap = function (dictFunctor) {
    return function (ff) {
        return function (x) {
            return map(dictFunctor)(function (f) {
                return f(x);
            })(ff);
        };
    };
};
module.exports = {
    Functor: Functor,
    map: map,
    mapFlipped: mapFlipped,
    "void": $$void,
    voidRight: voidRight,
    voidLeft: voidLeft,
    flap: flap,
    functorFn: functorFn,
    functorArray: functorArray
};

},{"../Control.Semigroupoid":56,"../Data.Function":81,"../Data.Unit":117,"./foreign":83}],85:[function(require,module,exports){
"use strict";

exports.boolConj = function (b1) {
  return function (b2) {
    return b1 && b2;
  };
};

exports.boolDisj = function (b1) {
  return function (b2) {
    return b1 || b2;
  };
};

exports.boolNot = function (b) {
  return !b;
};

},{}],86:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_Unit = require("../Data.Unit");
var HeytingAlgebra = function (conj, disj, ff, implies, not, tt) {
    this.conj = conj;
    this.disj = disj;
    this.ff = ff;
    this.implies = implies;
    this.not = not;
    this.tt = tt;
};
var tt = function (dict) {
    return dict.tt;
};
var not = function (dict) {
    return dict.not;
};
var implies = function (dict) {
    return dict.implies;
};
var heytingAlgebraUnit = new HeytingAlgebra(function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, Data_Unit.unit, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, function (v) {
    return Data_Unit.unit;
}, Data_Unit.unit);
var ff = function (dict) {
    return dict.ff;
};
var disj = function (dict) {
    return dict.disj;
};
var heytingAlgebraBoolean = new HeytingAlgebra($foreign.boolConj, $foreign.boolDisj, false, function (a) {
    return function (b) {
        return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
    };
}, $foreign.boolNot, true);
var conj = function (dict) {
    return dict.conj;
};
var heytingAlgebraFunction = function (dictHeytingAlgebra) {
    return new HeytingAlgebra(function (f) {
        return function (g) {
            return function (a) {
                return conj(dictHeytingAlgebra)(f(a))(g(a));
            };
        };
    }, function (f) {
        return function (g) {
            return function (a) {
                return disj(dictHeytingAlgebra)(f(a))(g(a));
            };
        };
    }, function (v) {
        return ff(dictHeytingAlgebra);
    }, function (f) {
        return function (g) {
            return function (a) {
                return implies(dictHeytingAlgebra)(f(a))(g(a));
            };
        };
    }, function (f) {
        return function (a) {
            return not(dictHeytingAlgebra)(f(a));
        };
    }, function (v) {
        return tt(dictHeytingAlgebra);
    });
};
module.exports = {
    HeytingAlgebra: HeytingAlgebra,
    tt: tt,
    ff: ff,
    implies: implies,
    conj: conj,
    disj: disj,
    not: not,
    heytingAlgebraBoolean: heytingAlgebraBoolean,
    heytingAlgebraUnit: heytingAlgebraUnit,
    heytingAlgebraFunction: heytingAlgebraFunction
};

},{"../Data.Unit":117,"./foreign":85}],87:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Extend = require("../Control.Extend");
var Control_Monad = require("../Control.Monad");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Bounded = require("../Data.Bounded");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var First = function (x) {
    return x;
};
var showFirst = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "First (" + (Data_Show.show(Data_Maybe.showMaybe(dictShow))(v) + ")");
    });
};
var semigroupFirst = new Data_Semigroup.Semigroup(function (v) {
    return function (v1) {
        if (v instanceof Data_Maybe.Just) {
            return v;
        };
        return v1;
    };
});
var ordFirst = function (dictOrd) {
    return Data_Maybe.ordMaybe(dictOrd);
};
var ord1First = Data_Maybe.ord1Maybe;
var newtypeFirst = new Data_Newtype.Newtype(function (n) {
    return n;
}, First);
var monoidFirst = new Data_Monoid.Monoid(function () {
    return semigroupFirst;
}, Data_Maybe.Nothing.value);
var monadFirst = Data_Maybe.monadMaybe;
var invariantFirst = Data_Maybe.invariantMaybe;
var functorFirst = Data_Maybe.functorMaybe;
var extendFirst = Data_Maybe.extendMaybe;
var eqFirst = function (dictEq) {
    return Data_Maybe.eqMaybe(dictEq);
};
var eq1First = Data_Maybe.eq1Maybe;
var boundedFirst = function (dictBounded) {
    return Data_Maybe.boundedMaybe(dictBounded);
};
var bindFirst = Data_Maybe.bindMaybe;
var applyFirst = Data_Maybe.applyMaybe;
var applicativeFirst = Data_Maybe.applicativeMaybe;
var altFirst = new Control_Alt.Alt(function () {
    return functorFirst;
}, Data_Semigroup.append(semigroupFirst));
var plusFirst = new Control_Plus.Plus(function () {
    return altFirst;
}, Data_Monoid.mempty(monoidFirst));
var alternativeFirst = new Control_Alternative.Alternative(function () {
    return applicativeFirst;
}, function () {
    return plusFirst;
});
var monadZeroFirst = new Control_MonadZero.MonadZero(function () {
    return alternativeFirst;
}, function () {
    return monadFirst;
});
module.exports = {
    First: First,
    newtypeFirst: newtypeFirst,
    eqFirst: eqFirst,
    eq1First: eq1First,
    ordFirst: ordFirst,
    ord1First: ord1First,
    boundedFirst: boundedFirst,
    functorFirst: functorFirst,
    invariantFirst: invariantFirst,
    applyFirst: applyFirst,
    applicativeFirst: applicativeFirst,
    bindFirst: bindFirst,
    monadFirst: monadFirst,
    extendFirst: extendFirst,
    showFirst: showFirst,
    semigroupFirst: semigroupFirst,
    monoidFirst: monoidFirst,
    altFirst: altFirst,
    plusFirst: plusFirst,
    alternativeFirst: alternativeFirst,
    monadZeroFirst: monadZeroFirst
};

},{"../Control.Alt":34,"../Control.Alternative":35,"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Extend":46,"../Control.Monad":53,"../Control.MonadZero":54,"../Control.Plus":55,"../Data.Bounded":68,"../Data.Eq":73,"../Data.Functor":84,"../Data.Functor.Invariant":82,"../Data.Maybe":89,"../Data.Monoid":96,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Show":111,"../Prelude":138}],88:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Extend = require("../Control.Extend");
var Control_Monad = require("../Control.Monad");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Bounded = require("../Data.Bounded");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Last = function (x) {
    return x;
};
var showLast = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Last " + (Data_Show.show(Data_Maybe.showMaybe(dictShow))(v) + ")");
    });
};
var semigroupLast = new Data_Semigroup.Semigroup(function (v) {
    return function (v1) {
        if (v1 instanceof Data_Maybe.Just) {
            return v1;
        };
        if (v1 instanceof Data_Maybe.Nothing) {
            return v;
        };
        throw new Error("Failed pattern match at Data.Maybe.Last line 53, column 1 - line 53, column 45: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var ordLast = function (dictOrd) {
    return Data_Maybe.ordMaybe(dictOrd);
};
var ord1Last = Data_Maybe.ord1Maybe;
var newtypeLast = new Data_Newtype.Newtype(function (n) {
    return n;
}, Last);
var monoidLast = new Data_Monoid.Monoid(function () {
    return semigroupLast;
}, Data_Maybe.Nothing.value);
var monadLast = Data_Maybe.monadMaybe;
var invariantLast = Data_Maybe.invariantMaybe;
var functorLast = Data_Maybe.functorMaybe;
var extendLast = Data_Maybe.extendMaybe;
var eqLast = function (dictEq) {
    return Data_Maybe.eqMaybe(dictEq);
};
var eq1Last = Data_Maybe.eq1Maybe;
var boundedLast = function (dictBounded) {
    return Data_Maybe.boundedMaybe(dictBounded);
};
var bindLast = Data_Maybe.bindMaybe;
var applyLast = Data_Maybe.applyMaybe;
var applicativeLast = Data_Maybe.applicativeMaybe;
var altLast = new Control_Alt.Alt(function () {
    return functorLast;
}, Data_Semigroup.append(semigroupLast));
var plusLast = new Control_Plus.Plus(function () {
    return altLast;
}, Data_Monoid.mempty(monoidLast));
var alternativeLast = new Control_Alternative.Alternative(function () {
    return applicativeLast;
}, function () {
    return plusLast;
});
var monadZeroLast = new Control_MonadZero.MonadZero(function () {
    return alternativeLast;
}, function () {
    return monadLast;
});
module.exports = {
    Last: Last,
    newtypeLast: newtypeLast,
    eqLast: eqLast,
    eq1Last: eq1Last,
    ordLast: ordLast,
    ord1Last: ord1Last,
    boundedLast: boundedLast,
    functorLast: functorLast,
    invariantLast: invariantLast,
    applyLast: applyLast,
    applicativeLast: applicativeLast,
    bindLast: bindLast,
    monadLast: monadLast,
    extendLast: extendLast,
    showLast: showLast,
    semigroupLast: semigroupLast,
    monoidLast: monoidLast,
    altLast: altLast,
    plusLast: plusLast,
    alternativeLast: alternativeLast,
    monadZeroLast: monadZeroLast
};

},{"../Control.Alt":34,"../Control.Alternative":35,"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Extend":46,"../Control.Monad":53,"../Control.MonadZero":54,"../Control.Plus":55,"../Data.Bounded":68,"../Data.Eq":73,"../Data.Functor":84,"../Data.Functor.Invariant":82,"../Data.Maybe":89,"../Data.Monoid":96,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Show":111,"../Prelude":138}],89:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Alt = require("../Control.Alt");
var Control_Alternative = require("../Control.Alternative");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Category = require("../Control.Category");
var Control_Extend = require("../Control.Extend");
var Control_Monad = require("../Control.Monad");
var Control_MonadZero = require("../Control.MonadZero");
var Control_Plus = require("../Control.Plus");
var Data_Bounded = require("../Data.Bounded");
var Data_Eq = require("../Data.Eq");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Data_Unit = require("../Data.Unit");
var Prelude = require("../Prelude");
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
var showMaybe = function (dictShow) {
    return new Data_Show.Show(function (v) {
        if (v instanceof Just) {
            return "(Just " + (Data_Show.show(dictShow)(v.value0) + ")");
        };
        if (v instanceof Nothing) {
            return "Nothing";
        };
        throw new Error("Failed pattern match at Data.Maybe line 207, column 1 - line 207, column 47: " + [ v.constructor.name ]);
    });
};
var semigroupMaybe = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            if (v instanceof Nothing) {
                return v1;
            };
            if (v1 instanceof Nothing) {
                return v;
            };
            if (v instanceof Just && v1 instanceof Just) {
                return new Just(Data_Semigroup.append(dictSemigroup)(v.value0)(v1.value0));
            };
            throw new Error("Failed pattern match at Data.Maybe line 176, column 1 - line 176, column 62: " + [ v.constructor.name, v1.constructor.name ]);
        };
    });
};
var optional = function (dictAlternative) {
    return function (a) {
        return Control_Alt.alt((dictAlternative.Plus1()).Alt0())(Data_Functor.map(((dictAlternative.Plus1()).Alt0()).Functor0())(Just.create)(a))(Control_Applicative.pure(dictAlternative.Applicative0())(Nothing.value));
    };
};
var monoidMaybe = function (dictSemigroup) {
    return new Data_Monoid.Monoid(function () {
        return semigroupMaybe(dictSemigroup);
    }, Nothing.value);
};
var maybe$prime = function (v) {
    return function (v1) {
        return function (v2) {
            if (v2 instanceof Nothing) {
                return v(Data_Unit.unit);
            };
            if (v2 instanceof Just) {
                return v1(v2.value0);
            };
            throw new Error("Failed pattern match at Data.Maybe line 232, column 1 - line 232, column 62: " + [ v.constructor.name, v1.constructor.name, v2.constructor.name ]);
        };
    };
};
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
var isJust = maybe(false)(Data_Function["const"](true));
var functorMaybe = new Data_Functor.Functor(function (v) {
    return function (v1) {
        if (v1 instanceof Just) {
            return new Just(v(v1.value0));
        };
        return Nothing.value;
    };
});
var invariantMaybe = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorMaybe));
var fromMaybe$prime = function (a) {
    return maybe$prime(a)(Control_Category.id(Control_Category.categoryFn));
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
var extendMaybe = new Control_Extend.Extend(function () {
    return functorMaybe;
}, function (v) {
    return function (v1) {
        if (v1 instanceof Nothing) {
            return Nothing.value;
        };
        return new Just(v(v1));
    };
});
var eqMaybe = function (dictEq) {
    return new Data_Eq.Eq(function (x) {
        return function (y) {
            if (x instanceof Nothing && y instanceof Nothing) {
                return true;
            };
            if (x instanceof Just && y instanceof Just) {
                return Data_Eq.eq(dictEq)(x.value0)(y.value0);
            };
            return false;
        };
    });
};
var ordMaybe = function (dictOrd) {
    return new Data_Ord.Ord(function () {
        return eqMaybe(dictOrd.Eq0());
    }, function (x) {
        return function (y) {
            if (x instanceof Nothing && y instanceof Nothing) {
                return Data_Ordering.EQ.value;
            };
            if (x instanceof Nothing) {
                return Data_Ordering.LT.value;
            };
            if (y instanceof Nothing) {
                return Data_Ordering.GT.value;
            };
            if (x instanceof Just && y instanceof Just) {
                return Data_Ord.compare(dictOrd)(x.value0)(y.value0);
            };
            throw new Error("Failed pattern match at Data.Maybe line 196, column 8 - line 196, column 51: " + [ x.constructor.name, y.constructor.name ]);
        };
    });
};
var eq1Maybe = new Data_Eq.Eq1(function (dictEq) {
    return Data_Eq.eq(eqMaybe(dictEq));
});
var ord1Maybe = new Data_Ord.Ord1(function () {
    return eq1Maybe;
}, function (dictOrd) {
    return Data_Ord.compare(ordMaybe(dictOrd));
});
var boundedMaybe = function (dictBounded) {
    return new Data_Bounded.Bounded(function () {
        return ordMaybe(dictBounded.Ord0());
    }, Nothing.value, new Just(Data_Bounded.top(dictBounded)));
};
var applyMaybe = new Control_Apply.Apply(function () {
    return functorMaybe;
}, function (v) {
    return function (v1) {
        if (v instanceof Just) {
            return Data_Functor.map(functorMaybe)(v.value0)(v1);
        };
        if (v instanceof Nothing) {
            return Nothing.value;
        };
        throw new Error("Failed pattern match at Data.Maybe line 68, column 1 - line 68, column 35: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var bindMaybe = new Control_Bind.Bind(function () {
    return applyMaybe;
}, function (v) {
    return function (v1) {
        if (v instanceof Just) {
            return v1(v.value0);
        };
        if (v instanceof Nothing) {
            return Nothing.value;
        };
        throw new Error("Failed pattern match at Data.Maybe line 127, column 1 - line 127, column 33: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var applicativeMaybe = new Control_Applicative.Applicative(function () {
    return applyMaybe;
}, Just.create);
var monadMaybe = new Control_Monad.Monad(function () {
    return applicativeMaybe;
}, function () {
    return bindMaybe;
});
var altMaybe = new Control_Alt.Alt(function () {
    return functorMaybe;
}, function (v) {
    return function (v1) {
        if (v instanceof Nothing) {
            return v1;
        };
        return v;
    };
});
var plusMaybe = new Control_Plus.Plus(function () {
    return altMaybe;
}, Nothing.value);
var alternativeMaybe = new Control_Alternative.Alternative(function () {
    return applicativeMaybe;
}, function () {
    return plusMaybe;
});
var monadZeroMaybe = new Control_MonadZero.MonadZero(function () {
    return alternativeMaybe;
}, function () {
    return monadMaybe;
});
module.exports = {
    Nothing: Nothing,
    Just: Just,
    maybe: maybe,
    "maybe'": maybe$prime,
    fromMaybe: fromMaybe,
    "fromMaybe'": fromMaybe$prime,
    isJust: isJust,
    isNothing: isNothing,
    fromJust: fromJust,
    optional: optional,
    functorMaybe: functorMaybe,
    applyMaybe: applyMaybe,
    applicativeMaybe: applicativeMaybe,
    altMaybe: altMaybe,
    plusMaybe: plusMaybe,
    alternativeMaybe: alternativeMaybe,
    bindMaybe: bindMaybe,
    monadMaybe: monadMaybe,
    monadZeroMaybe: monadZeroMaybe,
    extendMaybe: extendMaybe,
    invariantMaybe: invariantMaybe,
    semigroupMaybe: semigroupMaybe,
    monoidMaybe: monoidMaybe,
    eqMaybe: eqMaybe,
    eq1Maybe: eq1Maybe,
    ordMaybe: ordMaybe,
    ord1Maybe: ord1Maybe,
    boundedMaybe: boundedMaybe,
    showMaybe: showMaybe
};

},{"../Control.Alt":34,"../Control.Alternative":35,"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Category":43,"../Control.Extend":46,"../Control.Monad":53,"../Control.MonadZero":54,"../Control.Plus":55,"../Data.Bounded":68,"../Data.Eq":73,"../Data.Function":81,"../Data.Functor":84,"../Data.Functor.Invariant":82,"../Data.Monoid":96,"../Data.Ord":102,"../Data.Ordering":103,"../Data.Semigroup":107,"../Data.Show":111,"../Data.Unit":117,"../Prelude":138}],90:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Control_Monad = require("../Control.Monad");
var Data_Bounded = require("../Data.Bounded");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Additive = function (x) {
    return x;
};
var showAdditive = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Additive " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semigroupAdditive = function (dictSemiring) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            return Data_Semiring.add(dictSemiring)(v)(v1);
        };
    });
};
var ordAdditive = function (dictOrd) {
    return dictOrd;
};
var newtypeAdditive = new Data_Newtype.Newtype(function (n) {
    return n;
}, Additive);
var monoidAdditive = function (dictSemiring) {
    return new Data_Monoid.Monoid(function () {
        return semigroupAdditive(dictSemiring);
    }, Data_Semiring.zero(dictSemiring));
};
var invariantAdditive = new Data_Functor_Invariant.Invariant(function (f) {
    return function (v) {
        return function (v1) {
            return f(v1);
        };
    };
});
var functorAdditive = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var extendAdditive = new Control_Extend.Extend(function () {
    return functorAdditive;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqAdditive = function (dictEq) {
    return dictEq;
};
var comonadAdditive = new Control_Comonad.Comonad(function () {
    return extendAdditive;
}, Data_Newtype.unwrap(newtypeAdditive));
var boundedAdditive = function (dictBounded) {
    return dictBounded;
};
var applyAdditive = new Control_Apply.Apply(function () {
    return functorAdditive;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindAdditive = new Control_Bind.Bind(function () {
    return applyAdditive;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeAdditive = new Control_Applicative.Applicative(function () {
    return applyAdditive;
}, Additive);
var monadAdditive = new Control_Monad.Monad(function () {
    return applicativeAdditive;
}, function () {
    return bindAdditive;
});
module.exports = {
    Additive: Additive,
    newtypeAdditive: newtypeAdditive,
    eqAdditive: eqAdditive,
    ordAdditive: ordAdditive,
    boundedAdditive: boundedAdditive,
    functorAdditive: functorAdditive,
    invariantAdditive: invariantAdditive,
    applyAdditive: applyAdditive,
    applicativeAdditive: applicativeAdditive,
    bindAdditive: bindAdditive,
    monadAdditive: monadAdditive,
    extendAdditive: extendAdditive,
    comonadAdditive: comonadAdditive,
    showAdditive: showAdditive,
    semigroupAdditive: semigroupAdditive,
    monoidAdditive: monoidAdditive
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Comonad":44,"../Control.Extend":46,"../Control.Monad":53,"../Data.Bounded":68,"../Data.Eq":73,"../Data.Functor":84,"../Data.Functor.Invariant":82,"../Data.Monoid":96,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Semiring":109,"../Data.Show":111,"../Prelude":138}],91:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Control_Monad = require("../Control.Monad");
var Data_Bounded = require("../Data.Bounded");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Conj = function (x) {
    return x;
};
var showConj = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Conj " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semiringConj = function (dictHeytingAlgebra) {
    return new Data_Semiring.Semiring(function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.conj(dictHeytingAlgebra)(v)(v1);
        };
    }, function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v)(v1);
        };
    }, Data_HeytingAlgebra.ff(dictHeytingAlgebra), Data_HeytingAlgebra.tt(dictHeytingAlgebra));
};
var semigroupConj = function (dictHeytingAlgebra) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.conj(dictHeytingAlgebra)(v)(v1);
        };
    });
};
var ordConj = function (dictOrd) {
    return dictOrd;
};
var newtypeConj = new Data_Newtype.Newtype(function (n) {
    return n;
}, Conj);
var monoidConj = function (dictHeytingAlgebra) {
    return new Data_Monoid.Monoid(function () {
        return semigroupConj(dictHeytingAlgebra);
    }, Data_HeytingAlgebra.tt(dictHeytingAlgebra));
};
var invariantConj = new Data_Functor_Invariant.Invariant(function (f) {
    return function (v) {
        return function (v1) {
            return f(v1);
        };
    };
});
var functorConj = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var extendConj = new Control_Extend.Extend(function () {
    return functorConj;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqConj = function (dictEq) {
    return dictEq;
};
var comonadConj = new Control_Comonad.Comonad(function () {
    return extendConj;
}, Data_Newtype.unwrap(newtypeConj));
var boundedConj = function (dictBounded) {
    return dictBounded;
};
var applyConj = new Control_Apply.Apply(function () {
    return functorConj;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindConj = new Control_Bind.Bind(function () {
    return applyConj;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeConj = new Control_Applicative.Applicative(function () {
    return applyConj;
}, Conj);
var monadConj = new Control_Monad.Monad(function () {
    return applicativeConj;
}, function () {
    return bindConj;
});
module.exports = {
    Conj: Conj,
    newtypeConj: newtypeConj,
    eqConj: eqConj,
    ordConj: ordConj,
    boundedConj: boundedConj,
    functorConj: functorConj,
    invariantConj: invariantConj,
    applyConj: applyConj,
    applicativeConj: applicativeConj,
    bindConj: bindConj,
    monadConj: monadConj,
    extendConj: extendConj,
    comonadConj: comonadConj,
    showConj: showConj,
    semigroupConj: semigroupConj,
    monoidConj: monoidConj,
    semiringConj: semiringConj
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Comonad":44,"../Control.Extend":46,"../Control.Monad":53,"../Data.Bounded":68,"../Data.Eq":73,"../Data.Functor":84,"../Data.Functor.Invariant":82,"../Data.HeytingAlgebra":86,"../Data.Monoid":96,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Semiring":109,"../Data.Show":111,"../Prelude":138}],92:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Control_Monad = require("../Control.Monad");
var Data_Bounded = require("../Data.Bounded");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Disj = function (x) {
    return x;
};
var showDisj = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Disj " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semiringDisj = function (dictHeytingAlgebra) {
    return new Data_Semiring.Semiring(function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v)(v1);
        };
    }, function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.conj(dictHeytingAlgebra)(v)(v1);
        };
    }, Data_HeytingAlgebra.tt(dictHeytingAlgebra), Data_HeytingAlgebra.ff(dictHeytingAlgebra));
};
var semigroupDisj = function (dictHeytingAlgebra) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            return Data_HeytingAlgebra.disj(dictHeytingAlgebra)(v)(v1);
        };
    });
};
var ordDisj = function (dictOrd) {
    return dictOrd;
};
var newtypeDisj = new Data_Newtype.Newtype(function (n) {
    return n;
}, Disj);
var monoidDisj = function (dictHeytingAlgebra) {
    return new Data_Monoid.Monoid(function () {
        return semigroupDisj(dictHeytingAlgebra);
    }, Data_HeytingAlgebra.ff(dictHeytingAlgebra));
};
var invariantDisj = new Data_Functor_Invariant.Invariant(function (f) {
    return function (v) {
        return function (v1) {
            return f(v1);
        };
    };
});
var functorDisj = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var extendDisj = new Control_Extend.Extend(function () {
    return functorDisj;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqDisj = function (dictEq) {
    return dictEq;
};
var comonadDisj = new Control_Comonad.Comonad(function () {
    return extendDisj;
}, Data_Newtype.unwrap(newtypeDisj));
var boundedDisj = function (dictBounded) {
    return dictBounded;
};
var applyDisj = new Control_Apply.Apply(function () {
    return functorDisj;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindDisj = new Control_Bind.Bind(function () {
    return applyDisj;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeDisj = new Control_Applicative.Applicative(function () {
    return applyDisj;
}, Disj);
var monadDisj = new Control_Monad.Monad(function () {
    return applicativeDisj;
}, function () {
    return bindDisj;
});
module.exports = {
    Disj: Disj,
    newtypeDisj: newtypeDisj,
    eqDisj: eqDisj,
    ordDisj: ordDisj,
    boundedDisj: boundedDisj,
    functorDisj: functorDisj,
    invariantDisj: invariantDisj,
    applyDisj: applyDisj,
    applicativeDisj: applicativeDisj,
    bindDisj: bindDisj,
    monadDisj: monadDisj,
    extendDisj: extendDisj,
    comonadDisj: comonadDisj,
    showDisj: showDisj,
    semigroupDisj: semigroupDisj,
    monoidDisj: monoidDisj,
    semiringDisj: semiringDisj
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Comonad":44,"../Control.Extend":46,"../Control.Monad":53,"../Data.Bounded":68,"../Data.Eq":73,"../Data.Functor":84,"../Data.Functor.Invariant":82,"../Data.HeytingAlgebra":86,"../Data.Monoid":96,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Semiring":109,"../Data.Show":111,"../Prelude":138}],93:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Control_Monad = require("../Control.Monad");
var Data_Bounded = require("../Data.Bounded");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Dual = function (x) {
    return x;
};
var showDual = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Dual " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semigroupDual = function (dictSemigroup) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            return Data_Semigroup.append(dictSemigroup)(v1)(v);
        };
    });
};
var ordDual = function (dictOrd) {
    return dictOrd;
};
var newtypeDual = new Data_Newtype.Newtype(function (n) {
    return n;
}, Dual);
var monoidDual = function (dictMonoid) {
    return new Data_Monoid.Monoid(function () {
        return semigroupDual(dictMonoid.Semigroup0());
    }, Data_Monoid.mempty(dictMonoid));
};
var invariantDual = new Data_Functor_Invariant.Invariant(function (f) {
    return function (v) {
        return function (v1) {
            return f(v1);
        };
    };
});
var functorDual = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var extendDual = new Control_Extend.Extend(function () {
    return functorDual;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqDual = function (dictEq) {
    return dictEq;
};
var comonadDual = new Control_Comonad.Comonad(function () {
    return extendDual;
}, Data_Newtype.unwrap(newtypeDual));
var boundedDual = function (dictBounded) {
    return dictBounded;
};
var applyDual = new Control_Apply.Apply(function () {
    return functorDual;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindDual = new Control_Bind.Bind(function () {
    return applyDual;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeDual = new Control_Applicative.Applicative(function () {
    return applyDual;
}, Dual);
var monadDual = new Control_Monad.Monad(function () {
    return applicativeDual;
}, function () {
    return bindDual;
});
module.exports = {
    Dual: Dual,
    newtypeDual: newtypeDual,
    eqDual: eqDual,
    ordDual: ordDual,
    boundedDual: boundedDual,
    functorDual: functorDual,
    invariantDual: invariantDual,
    applyDual: applyDual,
    applicativeDual: applicativeDual,
    bindDual: bindDual,
    monadDual: monadDual,
    extendDual: extendDual,
    comonadDual: comonadDual,
    showDual: showDual,
    semigroupDual: semigroupDual,
    monoidDual: monoidDual
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Comonad":44,"../Control.Extend":46,"../Control.Monad":53,"../Data.Bounded":68,"../Data.Eq":73,"../Data.Functor":84,"../Data.Functor.Invariant":82,"../Data.Monoid":96,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Show":111,"../Prelude":138}],94:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Category = require("../Control.Category");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Semigroup = require("../Data.Semigroup");
var Prelude = require("../Prelude");
var Endo = function (x) {
    return x;
};
var semigroupEndo = new Data_Semigroup.Semigroup(function (v) {
    return function (v1) {
        return function ($11) {
            return v(v1($11));
        };
    };
});
var newtypeEndo = new Data_Newtype.Newtype(function (n) {
    return n;
}, Endo);
var monoidEndo = new Data_Monoid.Monoid(function () {
    return semigroupEndo;
}, Control_Category.id(Control_Category.categoryFn));
var invariantEndo = new Data_Functor_Invariant.Invariant(function (ab) {
    return function (ba) {
        return function (v) {
            return function ($12) {
                return ab(v(ba($12)));
            };
        };
    };
});
module.exports = {
    Endo: Endo,
    newtypeEndo: newtypeEndo,
    invariantEndo: invariantEndo,
    semigroupEndo: semigroupEndo,
    monoidEndo: monoidEndo
};

},{"../Control.Category":43,"../Control.Semigroupoid":56,"../Data.Functor.Invariant":82,"../Data.Monoid":96,"../Data.Newtype":98,"../Data.Semigroup":107,"../Prelude":138}],95:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Comonad = require("../Control.Comonad");
var Control_Extend = require("../Control.Extend");
var Control_Monad = require("../Control.Monad");
var Data_Bounded = require("../Data.Bounded");
var Data_Eq = require("../Data.Eq");
var Data_Functor = require("../Data.Functor");
var Data_Functor_Invariant = require("../Data.Functor.Invariant");
var Data_Monoid = require("../Data.Monoid");
var Data_Newtype = require("../Data.Newtype");
var Data_Ord = require("../Data.Ord");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Multiplicative = function (x) {
    return x;
};
var showMultiplicative = function (dictShow) {
    return new Data_Show.Show(function (v) {
        return "(Multiplicative " + (Data_Show.show(dictShow)(v) + ")");
    });
};
var semigroupMultiplicative = function (dictSemiring) {
    return new Data_Semigroup.Semigroup(function (v) {
        return function (v1) {
            return Data_Semiring.mul(dictSemiring)(v)(v1);
        };
    });
};
var ordMultiplicative = function (dictOrd) {
    return dictOrd;
};
var newtypeMultiplicative = new Data_Newtype.Newtype(function (n) {
    return n;
}, Multiplicative);
var monoidMultiplicative = function (dictSemiring) {
    return new Data_Monoid.Monoid(function () {
        return semigroupMultiplicative(dictSemiring);
    }, Data_Semiring.one(dictSemiring));
};
var invariantMultiplicative = new Data_Functor_Invariant.Invariant(function (f) {
    return function (v) {
        return function (v1) {
            return f(v1);
        };
    };
});
var functorMultiplicative = new Data_Functor.Functor(function (f) {
    return function (v) {
        return f(v);
    };
});
var extendMultiplicative = new Control_Extend.Extend(function () {
    return functorMultiplicative;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqMultiplicative = function (dictEq) {
    return dictEq;
};
var comonadMultiplicative = new Control_Comonad.Comonad(function () {
    return extendMultiplicative;
}, Data_Newtype.unwrap(newtypeMultiplicative));
var boundedMultiplicative = function (dictBounded) {
    return dictBounded;
};
var applyMultiplicative = new Control_Apply.Apply(function () {
    return functorMultiplicative;
}, function (v) {
    return function (v1) {
        return v(v1);
    };
});
var bindMultiplicative = new Control_Bind.Bind(function () {
    return applyMultiplicative;
}, function (v) {
    return function (f) {
        return f(v);
    };
});
var applicativeMultiplicative = new Control_Applicative.Applicative(function () {
    return applyMultiplicative;
}, Multiplicative);
var monadMultiplicative = new Control_Monad.Monad(function () {
    return applicativeMultiplicative;
}, function () {
    return bindMultiplicative;
});
module.exports = {
    Multiplicative: Multiplicative,
    newtypeMultiplicative: newtypeMultiplicative,
    eqMultiplicative: eqMultiplicative,
    ordMultiplicative: ordMultiplicative,
    boundedMultiplicative: boundedMultiplicative,
    functorMultiplicative: functorMultiplicative,
    invariantMultiplicative: invariantMultiplicative,
    applyMultiplicative: applyMultiplicative,
    applicativeMultiplicative: applicativeMultiplicative,
    bindMultiplicative: bindMultiplicative,
    monadMultiplicative: monadMultiplicative,
    extendMultiplicative: extendMultiplicative,
    comonadMultiplicative: comonadMultiplicative,
    showMultiplicative: showMultiplicative,
    semigroupMultiplicative: semigroupMultiplicative,
    monoidMultiplicative: monoidMultiplicative
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Comonad":44,"../Control.Extend":46,"../Control.Monad":53,"../Data.Bounded":68,"../Data.Eq":73,"../Data.Functor":84,"../Data.Functor.Invariant":82,"../Data.Monoid":96,"../Data.Newtype":98,"../Data.Ord":102,"../Data.Semigroup":107,"../Data.Semiring":109,"../Data.Show":111,"../Prelude":138}],96:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Data_Boolean = require("../Data.Boolean");
var Data_Eq = require("../Data.Eq");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Function = require("../Data.Function");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Unit = require("../Data.Unit");
var Prelude = require("../Prelude");
var Monoid = function (Semigroup0, mempty) {
    this.Semigroup0 = Semigroup0;
    this.mempty = mempty;
};
var monoidUnit = new Monoid(function () {
    return Data_Semigroup.semigroupUnit;
}, Data_Unit.unit);
var monoidString = new Monoid(function () {
    return Data_Semigroup.semigroupString;
}, "");
var monoidOrdering = new Monoid(function () {
    return Data_Ordering.semigroupOrdering;
}, Data_Ordering.EQ.value);
var monoidArray = new Monoid(function () {
    return Data_Semigroup.semigroupArray;
}, [  ]);
var mempty = function (dict) {
    return dict.mempty;
};
var monoidFn = function (dictMonoid) {
    return new Monoid(function () {
        return Data_Semigroup.semigroupFn(dictMonoid.Semigroup0());
    }, Data_Function["const"](mempty(dictMonoid)));
};
var power = function (dictMonoid) {
    return function (x) {
        var go = function (p) {
            if (p <= 0) {
                return mempty(dictMonoid);
            };
            if (p === 1) {
                return x;
            };
            if (p % 2 === 0) {
                var x$prime = go(p / 2 | 0);
                return Data_Semigroup.append(dictMonoid.Semigroup0())(x$prime)(x$prime);
            };
            if (Data_Boolean.otherwise) {
                var x$prime = go(p / 2 | 0);
                return Data_Semigroup.append(dictMonoid.Semigroup0())(x$prime)(Data_Semigroup.append(dictMonoid.Semigroup0())(x$prime)(x));
            };
            throw new Error("Failed pattern match at Data.Monoid line 52, column 3 - line 52, column 17: " + [ p.constructor.name ]);
        };
        return go;
    };
};
var guard = function (dictMonoid) {
    return function (v) {
        return function (v1) {
            if (v) {
                return v1;
            };
            if (!v) {
                return mempty(dictMonoid);
            };
            throw new Error("Failed pattern match at Data.Monoid line 60, column 1 - line 60, column 49: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
};
module.exports = {
    Monoid: Monoid,
    mempty: mempty,
    power: power,
    guard: guard,
    monoidUnit: monoidUnit,
    monoidOrdering: monoidOrdering,
    monoidFn: monoidFn,
    monoidString: monoidString,
    monoidArray: monoidArray
};

},{"../Data.Boolean":65,"../Data.Eq":73,"../Data.EuclideanRing":75,"../Data.Function":81,"../Data.Ord":102,"../Data.Ordering":103,"../Data.Semigroup":107,"../Data.Unit":117,"../Prelude":138}],97:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
module.exports = {};

},{}],98:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Prelude = require("../Prelude");
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
var underF2 = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (dictNewtype) {
            return function (dictNewtype1) {
                return function (v) {
                    return function (f) {
                        return function ($50) {
                            return function ($51) {
                                return Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1))(Data_Function.on(f)(Data_Functor.map(dictFunctor)(wrap(dictNewtype)))($50)($51));
                            };
                        };
                    };
                };
            };
        };
    };
};
var underF = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (dictNewtype) {
            return function (dictNewtype1) {
                return function (v) {
                    return function (f) {
                        return function ($52) {
                            return Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1))(f(Data_Functor.map(dictFunctor)(wrap(dictNewtype))($52)));
                        };
                    };
                };
            };
        };
    };
};
var under2 = function (dictNewtype) {
    return function (dictNewtype1) {
        return function (v) {
            return function (f) {
                return function ($53) {
                    return function ($54) {
                        return unwrap(dictNewtype1)(Data_Function.on(f)(wrap(dictNewtype))($53)($54));
                    };
                };
            };
        };
    };
};
var under = function (dictNewtype) {
    return function (dictNewtype1) {
        return function (v) {
            return function (f) {
                return function ($55) {
                    return unwrap(dictNewtype1)(f(wrap(dictNewtype)($55)));
                };
            };
        };
    };
};
var un = function (dictNewtype) {
    return function (v) {
        return unwrap(dictNewtype);
    };
};
var traverse = function (dictFunctor) {
    return function (dictNewtype) {
        return function (v) {
            return function (f) {
                return function ($56) {
                    return Data_Functor.map(dictFunctor)(wrap(dictNewtype))(f(unwrap(dictNewtype)($56)));
                };
            };
        };
    };
};
var overF2 = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (dictNewtype) {
            return function (dictNewtype1) {
                return function (v) {
                    return function (f) {
                        return function ($57) {
                            return function ($58) {
                                return Data_Functor.map(dictFunctor1)(wrap(dictNewtype1))(Data_Function.on(f)(Data_Functor.map(dictFunctor)(unwrap(dictNewtype)))($57)($58));
                            };
                        };
                    };
                };
            };
        };
    };
};
var overF = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (dictNewtype) {
            return function (dictNewtype1) {
                return function (v) {
                    return function (f) {
                        return function ($59) {
                            return Data_Functor.map(dictFunctor1)(wrap(dictNewtype1))(f(Data_Functor.map(dictFunctor)(unwrap(dictNewtype))($59)));
                        };
                    };
                };
            };
        };
    };
};
var over2 = function (dictNewtype) {
    return function (dictNewtype1) {
        return function (v) {
            return function (f) {
                return function ($60) {
                    return function ($61) {
                        return wrap(dictNewtype1)(Data_Function.on(f)(unwrap(dictNewtype))($60)($61));
                    };
                };
            };
        };
    };
};
var over = function (dictNewtype) {
    return function (dictNewtype1) {
        return function (v) {
            return function (f) {
                return function ($62) {
                    return wrap(dictNewtype1)(f(unwrap(dictNewtype)($62)));
                };
            };
        };
    };
};
var op = function (dictNewtype) {
    return un(dictNewtype);
};
var collect = function (dictFunctor) {
    return function (dictNewtype) {
        return function (v) {
            return function (f) {
                return function ($63) {
                    return wrap(dictNewtype)(f(Data_Functor.map(dictFunctor)(unwrap(dictNewtype))($63)));
                };
            };
        };
    };
};
var alaF = function (dictFunctor) {
    return function (dictFunctor1) {
        return function (dictNewtype) {
            return function (dictNewtype1) {
                return function (v) {
                    return function (f) {
                        return function ($64) {
                            return Data_Functor.map(dictFunctor1)(unwrap(dictNewtype1))(f(Data_Functor.map(dictFunctor)(wrap(dictNewtype))($64)));
                        };
                    };
                };
            };
        };
    };
};
var ala = function (dictFunctor) {
    return function (dictNewtype) {
        return function (dictNewtype1) {
            return function (v) {
                return function (f) {
                    return Data_Functor.map(dictFunctor)(unwrap(dictNewtype))(f(wrap(dictNewtype1)));
                };
            };
        };
    };
};
module.exports = {
    unwrap: unwrap,
    wrap: wrap,
    Newtype: Newtype,
    un: un,
    op: op,
    ala: ala,
    alaF: alaF,
    over: over,
    overF: overF,
    under: under,
    underF: underF,
    over2: over2,
    overF2: overF2,
    under2: under2,
    underF2: underF2,
    traverse: traverse,
    collect: collect
};

},{"../Control.Semigroupoid":56,"../Data.Function":81,"../Data.Functor":84,"../Prelude":138}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_Ordering = require("../Data.Ordering");
var unsafeCompare = $foreign.unsafeCompareImpl(Data_Ordering.LT.value)(Data_Ordering.EQ.value)(Data_Ordering.GT.value);
module.exports = {
    unsafeCompare: unsafeCompare
};

},{"../Data.Ordering":103,"./foreign":99}],101:[function(require,module,exports){
"use strict";

exports.ordArrayImpl = function (f) {
  return function (xs) {
    return function (ys) {
      var i = 0;
      var xlen = xs.length;
      var ylen = ys.length;
      while (i < xlen && i < ylen) {
        var x = xs[i];
        var y = ys[i];
        var o = f(x)(y);
        if (o !== 0) {
          return o;
        }
        i++;
      }
      if (xlen === ylen) {
        return 0;
      } else if (xlen > ylen) {
        return -1;
      } else {
        return 1;
      }
    };
  };
};

},{}],102:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_Eq = require("../Data.Eq");
var Data_Ord_Unsafe = require("../Data.Ord.Unsafe");
var Data_Ordering = require("../Data.Ordering");
var Data_Ring = require("../Data.Ring");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var Data_Void = require("../Data.Void");
var Ord = function (Eq0, compare) {
    this.Eq0 = Eq0;
    this.compare = compare;
};
var Ord1 = function (Eq10, compare1) {
    this.Eq10 = Eq10;
    this.compare1 = compare1;
};
var ordVoid = new Ord(function () {
    return Data_Eq.eqVoid;
}, function (v) {
    return function (v1) {
        return Data_Ordering.EQ.value;
    };
});
var ordUnit = new Ord(function () {
    return Data_Eq.eqUnit;
}, function (v) {
    return function (v1) {
        return Data_Ordering.EQ.value;
    };
});
var ordString = new Ord(function () {
    return Data_Eq.eqString;
}, Data_Ord_Unsafe.unsafeCompare);
var ordOrdering = new Ord(function () {
    return Data_Ordering.eqOrdering;
}, function (v) {
    return function (v1) {
        if (v instanceof Data_Ordering.LT && v1 instanceof Data_Ordering.LT) {
            return Data_Ordering.EQ.value;
        };
        if (v instanceof Data_Ordering.EQ && v1 instanceof Data_Ordering.EQ) {
            return Data_Ordering.EQ.value;
        };
        if (v instanceof Data_Ordering.GT && v1 instanceof Data_Ordering.GT) {
            return Data_Ordering.EQ.value;
        };
        if (v instanceof Data_Ordering.LT) {
            return Data_Ordering.LT.value;
        };
        if (v instanceof Data_Ordering.EQ && v1 instanceof Data_Ordering.LT) {
            return Data_Ordering.GT.value;
        };
        if (v instanceof Data_Ordering.EQ && v1 instanceof Data_Ordering.GT) {
            return Data_Ordering.LT.value;
        };
        if (v instanceof Data_Ordering.GT) {
            return Data_Ordering.GT.value;
        };
        throw new Error("Failed pattern match at Data.Ord line 67, column 1 - line 67, column 37: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var ordNumber = new Ord(function () {
    return Data_Eq.eqNumber;
}, Data_Ord_Unsafe.unsafeCompare);
var ordInt = new Ord(function () {
    return Data_Eq.eqInt;
}, Data_Ord_Unsafe.unsafeCompare);
var ordChar = new Ord(function () {
    return Data_Eq.eqChar;
}, Data_Ord_Unsafe.unsafeCompare);
var ordBoolean = new Ord(function () {
    return Data_Eq.eqBoolean;
}, Data_Ord_Unsafe.unsafeCompare);
var compare1 = function (dict) {
    return dict.compare1;
};
var compare = function (dict) {
    return dict.compare;
};
var comparing = function (dictOrd) {
    return function (f) {
        return function (x) {
            return function (y) {
                return compare(dictOrd)(f(x))(f(y));
            };
        };
    };
};
var greaterThan = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var v = compare(dictOrd)(a1)(a2);
            if (v instanceof Data_Ordering.GT) {
                return true;
            };
            return false;
        };
    };
};
var greaterThanOrEq = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var v = compare(dictOrd)(a1)(a2);
            if (v instanceof Data_Ordering.LT) {
                return false;
            };
            return true;
        };
    };
};
var signum = function (dictOrd) {
    return function (dictRing) {
        return function (x) {
            var $33 = greaterThanOrEq(dictOrd)(x)(Data_Semiring.zero(dictRing.Semiring0()));
            if ($33) {
                return Data_Semiring.one(dictRing.Semiring0());
            };
            return Data_Ring.negate(dictRing)(Data_Semiring.one(dictRing.Semiring0()));
        };
    };
};
var lessThan = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var v = compare(dictOrd)(a1)(a2);
            if (v instanceof Data_Ordering.LT) {
                return true;
            };
            return false;
        };
    };
};
var lessThanOrEq = function (dictOrd) {
    return function (a1) {
        return function (a2) {
            var v = compare(dictOrd)(a1)(a2);
            if (v instanceof Data_Ordering.GT) {
                return false;
            };
            return true;
        };
    };
};
var max = function (dictOrd) {
    return function (x) {
        return function (y) {
            var v = compare(dictOrd)(x)(y);
            if (v instanceof Data_Ordering.LT) {
                return y;
            };
            if (v instanceof Data_Ordering.EQ) {
                return x;
            };
            if (v instanceof Data_Ordering.GT) {
                return x;
            };
            throw new Error("Failed pattern match at Data.Ord line 122, column 3 - line 125, column 12: " + [ v.constructor.name ]);
        };
    };
};
var min = function (dictOrd) {
    return function (x) {
        return function (y) {
            var v = compare(dictOrd)(x)(y);
            if (v instanceof Data_Ordering.LT) {
                return x;
            };
            if (v instanceof Data_Ordering.EQ) {
                return x;
            };
            if (v instanceof Data_Ordering.GT) {
                return y;
            };
            throw new Error("Failed pattern match at Data.Ord line 113, column 3 - line 116, column 12: " + [ v.constructor.name ]);
        };
    };
};
var ordArray = function (dictOrd) {
    return new Ord(function () {
        return Data_Eq.eqArray(dictOrd.Eq0());
    }, (function () {
        var toDelta = function (x) {
            return function (y) {
                var v = compare(dictOrd)(x)(y);
                if (v instanceof Data_Ordering.EQ) {
                    return 0;
                };
                if (v instanceof Data_Ordering.LT) {
                    return 1;
                };
                if (v instanceof Data_Ordering.GT) {
                    return -1 | 0;
                };
                throw new Error("Failed pattern match at Data.Ord line 60, column 7 - line 65, column 1: " + [ v.constructor.name ]);
            };
        };
        return function (xs) {
            return function (ys) {
                return compare(ordInt)(0)($foreign.ordArrayImpl(toDelta)(xs)(ys));
            };
        };
    })());
};
var ord1Array = new Ord1(function () {
    return Data_Eq.eq1Array;
}, function (dictOrd) {
    return compare(ordArray(dictOrd));
});
var clamp = function (dictOrd) {
    return function (low) {
        return function (hi) {
            return function (x) {
                return min(dictOrd)(hi)(max(dictOrd)(low)(x));
            };
        };
    };
};
var between = function (dictOrd) {
    return function (low) {
        return function (hi) {
            return function (x) {
                if (lessThan(dictOrd)(x)(low)) {
                    return false;
                };
                if (greaterThan(dictOrd)(x)(hi)) {
                    return false;
                };
                return true;
            };
        };
    };
};
var abs = function (dictOrd) {
    return function (dictRing) {
        return function (x) {
            var $42 = greaterThanOrEq(dictOrd)(x)(Data_Semiring.zero(dictRing.Semiring0()));
            if ($42) {
                return x;
            };
            return Data_Ring.negate(dictRing)(x);
        };
    };
};
module.exports = {
    Ord: Ord,
    compare: compare,
    Ord1: Ord1,
    compare1: compare1,
    lessThan: lessThan,
    lessThanOrEq: lessThanOrEq,
    greaterThan: greaterThan,
    greaterThanOrEq: greaterThanOrEq,
    comparing: comparing,
    min: min,
    max: max,
    clamp: clamp,
    between: between,
    abs: abs,
    signum: signum,
    ordBoolean: ordBoolean,
    ordInt: ordInt,
    ordNumber: ordNumber,
    ordString: ordString,
    ordChar: ordChar,
    ordUnit: ordUnit,
    ordVoid: ordVoid,
    ordArray: ordArray,
    ordOrdering: ordOrdering,
    ord1Array: ord1Array
};

},{"../Data.Eq":73,"../Data.Ord.Unsafe":100,"../Data.Ordering":103,"../Data.Ring":105,"../Data.Semiring":109,"../Data.Unit":117,"../Data.Void":118,"./foreign":101}],103:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Data_Eq = require("../Data.Eq");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Show = require("../Data.Show");
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
var showOrdering = new Data_Show.Show(function (v) {
    if (v instanceof LT) {
        return "LT";
    };
    if (v instanceof GT) {
        return "GT";
    };
    if (v instanceof EQ) {
        return "EQ";
    };
    throw new Error("Failed pattern match at Data.Ordering line 26, column 1 - line 26, column 39: " + [ v.constructor.name ]);
});
var semigroupOrdering = new Data_Semigroup.Semigroup(function (v) {
    return function (v1) {
        if (v instanceof LT) {
            return LT.value;
        };
        if (v instanceof GT) {
            return GT.value;
        };
        if (v instanceof EQ) {
            return v1;
        };
        throw new Error("Failed pattern match at Data.Ordering line 21, column 1 - line 21, column 49: " + [ v.constructor.name, v1.constructor.name ]);
    };
});
var invert = function (v) {
    if (v instanceof GT) {
        return LT.value;
    };
    if (v instanceof EQ) {
        return EQ.value;
    };
    if (v instanceof LT) {
        return GT.value;
    };
    throw new Error("Failed pattern match at Data.Ordering line 33, column 1 - line 33, column 31: " + [ v.constructor.name ]);
};
var eqOrdering = new Data_Eq.Eq(function (v) {
    return function (v1) {
        if (v instanceof LT && v1 instanceof LT) {
            return true;
        };
        if (v instanceof GT && v1 instanceof GT) {
            return true;
        };
        if (v instanceof EQ && v1 instanceof EQ) {
            return true;
        };
        return false;
    };
});
module.exports = {
    LT: LT,
    GT: GT,
    EQ: EQ,
    invert: invert,
    eqOrdering: eqOrdering,
    semigroupOrdering: semigroupOrdering,
    showOrdering: showOrdering
};

},{"../Data.Eq":73,"../Data.Semigroup":107,"../Data.Show":111}],104:[function(require,module,exports){
"use strict";

exports.intSub = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x - y | 0;
  };
};

exports.numSub = function (n1) {
  return function (n2) {
    return n1 - n2;
  };
};

},{}],105:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_Semiring = require("../Data.Semiring");
var Data_Unit = require("../Data.Unit");
var Ring = function (Semiring0, sub) {
    this.Semiring0 = Semiring0;
    this.sub = sub;
};
var sub = function (dict) {
    return dict.sub;
};
var ringUnit = new Ring(function () {
    return Data_Semiring.semiringUnit;
}, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
});
var ringNumber = new Ring(function () {
    return Data_Semiring.semiringNumber;
}, $foreign.numSub);
var ringInt = new Ring(function () {
    return Data_Semiring.semiringInt;
}, $foreign.intSub);
var ringFn = function (dictRing) {
    return new Ring(function () {
        return Data_Semiring.semiringFn(dictRing.Semiring0());
    }, function (f) {
        return function (g) {
            return function (x) {
                return sub(dictRing)(f(x))(g(x));
            };
        };
    });
};
var negate = function (dictRing) {
    return function (a) {
        return sub(dictRing)(Data_Semiring.zero(dictRing.Semiring0()))(a);
    };
};
module.exports = {
    Ring: Ring,
    sub: sub,
    negate: negate,
    ringInt: ringInt,
    ringNumber: ringNumber,
    ringUnit: ringUnit,
    ringFn: ringFn
};

},{"../Data.Semiring":109,"../Data.Unit":117,"./foreign":104}],106:[function(require,module,exports){
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

},{}],107:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_Unit = require("../Data.Unit");
var Data_Void = require("../Data.Void");
var Semigroup = function (append) {
    this.append = append;
};
var semigroupVoid = new Semigroup(function (v) {
    return Data_Void.absurd;
});
var semigroupUnit = new Semigroup(function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
});
var semigroupString = new Semigroup($foreign.concatString);
var semigroupArray = new Semigroup($foreign.concatArray);
var append = function (dict) {
    return dict.append;
};
var semigroupFn = function (dictSemigroup) {
    return new Semigroup(function (f) {
        return function (g) {
            return function (x) {
                return append(dictSemigroup)(f(x))(g(x));
            };
        };
    });
};
module.exports = {
    Semigroup: Semigroup,
    append: append,
    semigroupString: semigroupString,
    semigroupUnit: semigroupUnit,
    semigroupVoid: semigroupVoid,
    semigroupFn: semigroupFn,
    semigroupArray: semigroupArray
};

},{"../Data.Unit":117,"../Data.Void":118,"./foreign":106}],108:[function(require,module,exports){
"use strict";

exports.intAdd = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x + y | 0;
  };
};

exports.intMul = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x * y | 0;
  };
};

exports.numAdd = function (n1) {
  return function (n2) {
    return n1 + n2;
  };
};

exports.numMul = function (n1) {
  return function (n2) {
    return n1 * n2;
  };
};

},{}],109:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_Unit = require("../Data.Unit");
var Semiring = function (add, mul, one, zero) {
    this.add = add;
    this.mul = mul;
    this.one = one;
    this.zero = zero;
};
var zero = function (dict) {
    return dict.zero;
};
var semiringUnit = new Semiring(function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, function (v) {
    return function (v1) {
        return Data_Unit.unit;
    };
}, Data_Unit.unit, Data_Unit.unit);
var semiringNumber = new Semiring($foreign.numAdd, $foreign.numMul, 1.0, 0.0);
var semiringInt = new Semiring($foreign.intAdd, $foreign.intMul, 1, 0);
var one = function (dict) {
    return dict.one;
};
var mul = function (dict) {
    return dict.mul;
};
var add = function (dict) {
    return dict.add;
};
var semiringFn = function (dictSemiring) {
    return new Semiring(function (f) {
        return function (g) {
            return function (x) {
                return add(dictSemiring)(f(x))(g(x));
            };
        };
    }, function (f) {
        return function (g) {
            return function (x) {
                return mul(dictSemiring)(f(x))(g(x));
            };
        };
    }, function (v) {
        return one(dictSemiring);
    }, function (v) {
        return zero(dictSemiring);
    });
};
module.exports = {
    Semiring: Semiring,
    add: add,
    zero: zero,
    mul: mul,
    one: one,
    semiringInt: semiringInt,
    semiringNumber: semiringNumber,
    semiringFn: semiringFn,
    semiringUnit: semiringUnit
};

},{"../Data.Unit":117,"./foreign":108}],110:[function(require,module,exports){
"use strict";

exports.showIntImpl = function (n) {
  return n.toString();
};

exports.showNumberImpl = function (n) {
  var str = n.toString();
  return isNaN(str + ".0") ? str : str + ".0";
};

exports.showCharImpl = function (c) {
  var code = c.charCodeAt(0);
  if (code < 0x20 || code === 0x7F) {
    switch (c) {
      case "\x07": return "'\\a'";
      case "\b": return "'\\b'";
      case "\f": return "'\\f'";
      case "\n": return "'\\n'";
      case "\r": return "'\\r'";
      case "\t": return "'\\t'";
      case "\v": return "'\\v'";
    }
    return "'\\" + code.toString(10) + "'";
  }
  return c === "'" || c === "\\" ? "'\\" + c + "'" : "'" + c + "'";
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

},{}],111:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Show = function (show) {
    this.show = show;
};
var showString = new Show($foreign.showStringImpl);
var showNumber = new Show($foreign.showNumberImpl);
var showInt = new Show($foreign.showIntImpl);
var showChar = new Show($foreign.showCharImpl);
var showBoolean = new Show(function (v) {
    if (v) {
        return "true";
    };
    if (!v) {
        return "false";
    };
    throw new Error("Failed pattern match at Data.Show line 12, column 1 - line 12, column 37: " + [ v.constructor.name ]);
});
var show = function (dict) {
    return dict.show;
};
var showArray = function (dictShow) {
    return new Show($foreign.showArrayImpl(show(dictShow)));
};
module.exports = {
    Show: Show,
    show: show,
    showBoolean: showBoolean,
    showInt: showInt,
    showNumber: showNumber,
    showChar: showChar,
    showString: showString,
    showArray: showArray
};

},{"./foreign":110}],112:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Data_Functor = require("../Data.Functor");
var Data_Traversable_Accum = require("../Data.Traversable.Accum");
var Prelude = require("../Prelude");
var StateR = function (x) {
    return x;
};
var StateL = function (x) {
    return x;
};
var stateR = function (v) {
    return v;
};
var stateL = function (v) {
    return v;
};
var functorStateR = new Data_Functor.Functor(function (f) {
    return function (k) {
        return function (s) {
            var v = stateR(k)(s);
            return {
                accum: v.accum,
                value: f(v.value)
            };
        };
    };
});
var functorStateL = new Data_Functor.Functor(function (f) {
    return function (k) {
        return function (s) {
            var v = stateL(k)(s);
            return {
                accum: v.accum,
                value: f(v.value)
            };
        };
    };
});
var applyStateR = new Control_Apply.Apply(function () {
    return functorStateR;
}, function (f) {
    return function (x) {
        return function (s) {
            var v = stateR(x)(s);
            var v1 = stateR(f)(v.accum);
            return {
                accum: v1.accum,
                value: v1.value(v.value)
            };
        };
    };
});
var applyStateL = new Control_Apply.Apply(function () {
    return functorStateL;
}, function (f) {
    return function (x) {
        return function (s) {
            var v = stateL(f)(s);
            var v1 = stateL(x)(v.accum);
            return {
                accum: v1.accum,
                value: v.value(v1.value)
            };
        };
    };
});
var applicativeStateR = new Control_Applicative.Applicative(function () {
    return applyStateR;
}, function (a) {
    return function (s) {
        return {
            accum: s,
            value: a
        };
    };
});
var applicativeStateL = new Control_Applicative.Applicative(function () {
    return applyStateL;
}, function (a) {
    return function (s) {
        return {
            accum: s,
            value: a
        };
    };
});
module.exports = {
    StateL: StateL,
    stateL: stateL,
    StateR: StateR,
    stateR: stateR,
    functorStateL: functorStateL,
    applyStateL: applyStateL,
    applicativeStateL: applicativeStateL,
    functorStateR: functorStateR,
    applyStateR: applyStateR,
    applicativeStateR: applicativeStateR
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Data.Functor":84,"../Data.Traversable.Accum":113,"../Prelude":138}],113:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"dup":97}],114:[function(require,module,exports){
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

},{}],115:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Category = require("../Control.Category");
var Data_Foldable = require("../Data.Foldable");
var Data_Functor = require("../Data.Functor");
var Data_Maybe = require("../Data.Maybe");
var Data_Maybe_First = require("../Data.Maybe.First");
var Data_Maybe_Last = require("../Data.Maybe.Last");
var Data_Monoid_Additive = require("../Data.Monoid.Additive");
var Data_Monoid_Conj = require("../Data.Monoid.Conj");
var Data_Monoid_Disj = require("../Data.Monoid.Disj");
var Data_Monoid_Dual = require("../Data.Monoid.Dual");
var Data_Monoid_Multiplicative = require("../Data.Monoid.Multiplicative");
var Data_Traversable_Accum = require("../Data.Traversable.Accum");
var Data_Traversable_Accum_Internal = require("../Data.Traversable.Accum.Internal");
var Prelude = require("../Prelude");
var Traversable = function (Foldable1, Functor0, sequence, traverse) {
    this.Foldable1 = Foldable1;
    this.Functor0 = Functor0;
    this.sequence = sequence;
    this.traverse = traverse;
};
var traverse = function (dict) {
    return dict.traverse;
};
var traversableMultiplicative = new Traversable(function () {
    return Data_Foldable.foldableMultiplicative;
}, function () {
    return Data_Monoid_Multiplicative.functorMultiplicative;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Monoid_Multiplicative.Multiplicative)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Monoid_Multiplicative.Multiplicative)(f(v));
        };
    };
});
var traversableMaybe = new Traversable(function () {
    return Data_Foldable.foldableMaybe;
}, function () {
    return Data_Maybe.functorMaybe;
}, function (dictApplicative) {
    return function (v) {
        if (v instanceof Data_Maybe.Nothing) {
            return Control_Applicative.pure(dictApplicative)(Data_Maybe.Nothing.value);
        };
        if (v instanceof Data_Maybe.Just) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Maybe.Just.create)(v.value0);
        };
        throw new Error("Failed pattern match at Data.Traversable line 86, column 1 - line 86, column 47: " + [ v.constructor.name ]);
    };
}, function (dictApplicative) {
    return function (v) {
        return function (v1) {
            if (v1 instanceof Data_Maybe.Nothing) {
                return Control_Applicative.pure(dictApplicative)(Data_Maybe.Nothing.value);
            };
            if (v1 instanceof Data_Maybe.Just) {
                return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Maybe.Just.create)(v(v1.value0));
            };
            throw new Error("Failed pattern match at Data.Traversable line 86, column 1 - line 86, column 47: " + [ v.constructor.name, v1.constructor.name ]);
        };
    };
});
var traversableDual = new Traversable(function () {
    return Data_Foldable.foldableDual;
}, function () {
    return Data_Monoid_Dual.functorDual;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Monoid_Dual.Dual)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Monoid_Dual.Dual)(f(v));
        };
    };
});
var traversableDisj = new Traversable(function () {
    return Data_Foldable.foldableDisj;
}, function () {
    return Data_Monoid_Disj.functorDisj;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Monoid_Disj.Disj)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Monoid_Disj.Disj)(f(v));
        };
    };
});
var traversableConj = new Traversable(function () {
    return Data_Foldable.foldableConj;
}, function () {
    return Data_Monoid_Conj.functorConj;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Monoid_Conj.Conj)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Monoid_Conj.Conj)(f(v));
        };
    };
});
var traversableAdditive = new Traversable(function () {
    return Data_Foldable.foldableAdditive;
}, function () {
    return Data_Monoid_Additive.functorAdditive;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Monoid_Additive.Additive)(v);
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Monoid_Additive.Additive)(f(v));
        };
    };
});
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
var traversableFirst = new Traversable(function () {
    return Data_Foldable.foldableFirst;
}, function () {
    return Data_Maybe_First.functorFirst;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Maybe_First.First)(sequence(traversableMaybe)(dictApplicative)(v));
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Maybe_First.First)(traverse(traversableMaybe)(dictApplicative)(f)(v));
        };
    };
});
var traversableLast = new Traversable(function () {
    return Data_Foldable.foldableLast;
}, function () {
    return Data_Maybe_Last.functorLast;
}, function (dictApplicative) {
    return function (v) {
        return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Maybe_Last.Last)(sequence(traversableMaybe)(dictApplicative)(v));
    };
}, function (dictApplicative) {
    return function (f) {
        return function (v) {
            return Data_Functor.map((dictApplicative.Apply0()).Functor0())(Data_Maybe_Last.Last)(traverse(traversableMaybe)(dictApplicative)(f)(v));
        };
    };
});
var traverseDefault = function (dictTraversable) {
    return function (dictApplicative) {
        return function (f) {
            return function (ta) {
                return sequence(dictTraversable)(dictApplicative)(Data_Functor.map(dictTraversable.Functor0())(f)(ta));
            };
        };
    };
};
var mapAccumR = function (dictTraversable) {
    return function (f) {
        return function (s0) {
            return function (xs) {
                return Data_Traversable_Accum_Internal.stateR(traverse(dictTraversable)(Data_Traversable_Accum_Internal.applicativeStateR)(function (a) {
                    return function (s) {
                        return f(s)(a);
                    };
                })(xs))(s0);
            };
        };
    };
};
var scanr = function (dictTraversable) {
    return function (f) {
        return function (b0) {
            return function (xs) {
                return (mapAccumR(dictTraversable)(function (b) {
                    return function (a) {
                        var b$prime = f(a)(b);
                        return {
                            accum: b$prime,
                            value: b$prime
                        };
                    };
                })(b0)(xs)).value;
            };
        };
    };
};
var mapAccumL = function (dictTraversable) {
    return function (f) {
        return function (s0) {
            return function (xs) {
                return Data_Traversable_Accum_Internal.stateL(traverse(dictTraversable)(Data_Traversable_Accum_Internal.applicativeStateL)(function (a) {
                    return function (s) {
                        return f(s)(a);
                    };
                })(xs))(s0);
            };
        };
    };
};
var scanl = function (dictTraversable) {
    return function (f) {
        return function (b0) {
            return function (xs) {
                return (mapAccumL(dictTraversable)(function (b) {
                    return function (a) {
                        var b$prime = f(b)(a);
                        return {
                            accum: b$prime,
                            value: b$prime
                        };
                    };
                })(b0)(xs)).value;
            };
        };
    };
};
var $$for = function (dictApplicative) {
    return function (dictTraversable) {
        return function (x) {
            return function (f) {
                return traverse(dictTraversable)(dictApplicative)(f)(x);
            };
        };
    };
};
module.exports = {
    Traversable: Traversable,
    traverse: traverse,
    sequence: sequence,
    traverseDefault: traverseDefault,
    sequenceDefault: sequenceDefault,
    "for": $$for,
    scanl: scanl,
    scanr: scanr,
    mapAccumL: mapAccumL,
    mapAccumR: mapAccumR,
    traversableArray: traversableArray,
    traversableMaybe: traversableMaybe,
    traversableFirst: traversableFirst,
    traversableLast: traversableLast,
    traversableAdditive: traversableAdditive,
    traversableDual: traversableDual,
    traversableConj: traversableConj,
    traversableDisj: traversableDisj,
    traversableMultiplicative: traversableMultiplicative
};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Category":43,"../Data.Foldable":78,"../Data.Functor":84,"../Data.Maybe":89,"../Data.Maybe.First":87,"../Data.Maybe.Last":88,"../Data.Monoid.Additive":90,"../Data.Monoid.Conj":91,"../Data.Monoid.Disj":92,"../Data.Monoid.Dual":93,"../Data.Monoid.Multiplicative":95,"../Data.Traversable.Accum":113,"../Data.Traversable.Accum.Internal":112,"../Prelude":138,"./foreign":114}],116:[function(require,module,exports){
"use strict";

exports.unit = {};

},{}],117:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Data_Show = require("../Data.Show");
var showUnit = new Data_Show.Show(function (v) {
    return "unit";
});
module.exports = {
    showUnit: showUnit,
    unit: $foreign.unit
};

},{"../Data.Show":111,"./foreign":116}],118:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Data_Show = require("../Data.Show");
var Void = function (x) {
    return x;
};
var absurd = function (a) {
    var spin = function ($copy_v) {
        var $tco_result;
        function $tco_loop(v) {
            $copy_v = v;
            return;
        };
        while (!false) {
            $tco_result = $tco_loop($copy_v);
        };
        return $tco_result;
    };
    return spin(a);
};
var showVoid = new Data_Show.Show(absurd);
module.exports = {
    absurd: absurd,
    showVoid: showVoid
};

},{"../Data.Show":111}],119:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Bind = require("../Control.Bind");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_Exception = require("../Control.Monad.Eff.Exception");
var Data_Ring = require("../Data.Ring");
var Data_Semiring = require("../Data.Semiring");
var Oak = require("../Oak");
var Oak_Cmd = require("../Oak.Cmd");
var Oak_Document = require("../Oak.Document");
var Oak_Html = require("../Oak.Html");
var Oak_Html_Events = require("../Oak.Html.Events");
var Oak_Html_Present = require("../Oak.Html.Present");
var Prelude = require("../Prelude");
var Inc = (function () {
    function Inc() {

    };
    Inc.value = new Inc();
    return Inc;
})();
var Dec = (function () {
    function Dec() {

    };
    Dec.value = new Dec();
    return Dec;
})();
var view = function (model) {
    return Oak_Html.div([  ])([ Oak_Html.button([ Oak_Html_Events.onClick(Inc.value) ])([ Oak_Html.text(Oak_Html_Present.presentString)("+") ]), Oak_Html.div([  ])([ Oak_Html.text(Oak_Html_Present.presentInt)(model.number) ]), Oak_Html.button([ Oak_Html_Events.onClick(Dec.value) ])([ Oak_Html.text(Oak_Html_Present.presentString)("-") ]), Oak_Html.div([  ])([ Oak_Html.text(Oak_Html_Present.presentString)("this is fucking sweet!") ]) ]);
};
var update = function (v) {
    return function (model) {
        if (v instanceof Inc) {
            var $9 = {};
            for (var $10 in model) {
                if ({}.hasOwnProperty.call(model, $10)) {
                    $9[$10] = model[$10];
                };
            };
            $9.number = model.number + 1 | 0;
            return $9;
        };
        if (v instanceof Dec) {
            var $12 = {};
            for (var $13 in model) {
                if ({}.hasOwnProperty.call(model, $13)) {
                    $12[$13] = model[$13];
                };
            };
            $12.number = model.number - 1 | 0;
            return $12;
        };
        throw new Error("Failed pattern match at Main line 38, column 1 - line 38, column 32: " + [ v.constructor.name, model.constructor.name ]);
    };
};
var next = function (v) {
    return function (v1) {
        return Oak_Cmd.none;
    };
};
var init = {
    number: 0
};
var app = Oak.createApp({
    init: init,
    view: view,
    update: update,
    next: next
});
var main = function __do() {
    var v = Oak.runApp(app)();
    var v1 = Oak_Document.getElementById("app")();
    return Oak_Document.appendChildNode(v1)(v)();
};
module.exports = {
    main: main
};

},{"../Control.Bind":42,"../Control.Monad.Eff":50,"../Control.Monad.Eff.Exception":48,"../Data.Ring":105,"../Data.Semiring":109,"../Oak":133,"../Oak.Cmd":121,"../Oak.Document":124,"../Oak.Html":128,"../Oak.Html.Events":126,"../Oak.Html.Present":127,"../Prelude":138}],120:[function(require,module,exports){
exports.noneImpl = function() {
};

},{}],121:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var none = $foreign.noneImpl;
module.exports = {
    none: none
};

},{"./foreign":120}],122:[function(require,module,exports){
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
var zIndex = function (val) {
    return new StyleAttribute("z-index", val);
};
var wordSpacing = function (val) {
    return new StyleAttribute("word-spacing", val);
};
var width = function (val) {
    return new StyleAttribute("width", val);
};
var widows = function (val) {
    return new StyleAttribute("widows", val);
};
var whiteSpace = function (val) {
    return new StyleAttribute("white-space", val);
};
var volume = function (val) {
    return new StyleAttribute("volume", val);
};
var voiceFamily = function (val) {
    return new StyleAttribute("voice-family", val);
};
var visibility = function (val) {
    return new StyleAttribute("visibility", val);
};
var verticalAlign = function (val) {
    return new StyleAttribute("vertical-align", val);
};
var unicodeBidi = function (val) {
    return new StyleAttribute("unicode-bidi", val);
};
var top = function (val) {
    return new StyleAttribute("top", val);
};
var textTransform = function (val) {
    return new StyleAttribute("text-transform", val);
};
var textIndent = function (val) {
    return new StyleAttribute("text-indent", val);
};
var textDecoration = function (val) {
    return new StyleAttribute("text-decoration", val);
};
var textAlign = function (val) {
    return new StyleAttribute("text-align", val);
};
var tableLayout = function (val) {
    return new StyleAttribute("table-layout", val);
};
var stress = function (val) {
    return new StyleAttribute("stress", val);
};
var speechRate = function (val) {
    return new StyleAttribute("speech-rate", val);
};
var speakPunctuation = function (val) {
    return new StyleAttribute("speak-punctuation", val);
};
var speakNumeral = function (val) {
    return new StyleAttribute("speak-numeral", val);
};
var speakHeader = function (val) {
    return new StyleAttribute("speak-header", val);
};
var speak = function (val) {
    return new StyleAttribute("speak", val);
};
var right = function (val) {
    return new StyleAttribute("right", val);
};
var richness = function (val) {
    return new StyleAttribute("richness", val);
};
var quotes = function (val) {
    return new StyleAttribute("quotes", val);
};
var position = function (val) {
    return new StyleAttribute("position", val);
};
var playDuring = function (val) {
    return new StyleAttribute("play-during", val);
};
var pitchRange = function (val) {
    return new StyleAttribute("pitch-range", val);
};
var pitch = function (val) {
    return new StyleAttribute("pitch", val);
};
var pauseBefore = function (val) {
    return new StyleAttribute("pause-before", val);
};
var pauseAfter = function (val) {
    return new StyleAttribute("pause-after", val);
};
var pause = function (val) {
    return new StyleAttribute("pause", val);
};
var pageBreakInside = function (val) {
    return new StyleAttribute("page-break-inside", val);
};
var pageBreakBefore = function (val) {
    return new StyleAttribute("page-break-before", val);
};
var pageBreakAfter = function (val) {
    return new StyleAttribute("page-break-after", val);
};
var paddingTop = function (val) {
    return new StyleAttribute("padding-top", val);
};
var paddingRight = function (val) {
    return new StyleAttribute("padding-right", val);
};
var paddingLeft = function (val) {
    return new StyleAttribute("padding-left", val);
};
var paddingBottom = function (val) {
    return new StyleAttribute("padding-bottom", val);
};
var padding = function (val) {
    return new StyleAttribute("padding", val);
};
var overflow = function (val) {
    return new StyleAttribute("overflow", val);
};
var outlineWidth = function (val) {
    return new StyleAttribute("outline-width", val);
};
var outlineStyle = function (val) {
    return new StyleAttribute("outline-style", val);
};
var outlineColor = function (val) {
    return new StyleAttribute("outline-color", val);
};
var outline = function (val) {
    return new StyleAttribute("outline", val);
};
var orphans = function (val) {
    return new StyleAttribute("orphans", val);
};
var minWidth = function (val) {
    return new StyleAttribute("min-width", val);
};
var minHeight = function (val) {
    return new StyleAttribute("min-height", val);
};
var maxWidth = function (val) {
    return new StyleAttribute("max-width", val);
};
var maxHeight = function (val) {
    return new StyleAttribute("max-height", val);
};
var marginTop = function (val) {
    return new StyleAttribute("margin-top", val);
};
var marginRight = function (val) {
    return new StyleAttribute("margin-right", val);
};
var marginLeft = function (val) {
    return new StyleAttribute("margin-left", val);
};
var marginBottom = function (val) {
    return new StyleAttribute("margin-bottom", val);
};
var margin = function (val) {
    return new StyleAttribute("margin", val);
};
var listStyleType = function (val) {
    return new StyleAttribute("list-style-type", val);
};
var listStylePosition = function (val) {
    return new StyleAttribute("list-style-position", val);
};
var listStyleImage = function (val) {
    return new StyleAttribute("list-style-image", val);
};
var listStyle = function (val) {
    return new StyleAttribute("list-style", val);
};
var lineHeight = function (val) {
    return new StyleAttribute("line-height", val);
};
var letterSpacing = function (val) {
    return new StyleAttribute("letter-spacing", val);
};
var left = function (val) {
    return new StyleAttribute("left", val);
};
var height = function (val) {
    return new StyleAttribute("height", val);
};
var fontWeight = function (val) {
    return new StyleAttribute("font-weight", val);
};
var fontVariant = function (val) {
    return new StyleAttribute("font-variant", val);
};
var fontStyle = function (val) {
    return new StyleAttribute("font-style", val);
};
var fontSize = function (val) {
    return new StyleAttribute("font-size", val);
};
var fontFamily = function (val) {
    return new StyleAttribute("font-family", val);
};
var font = function (val) {
    return new StyleAttribute("font", val);
};
var $$float = function (val) {
    return new StyleAttribute("float", val);
};
var emptyCells = function (val) {
    return new StyleAttribute("empty-cells", val);
};
var elevation = function (val) {
    return new StyleAttribute("elevation", val);
};
var display = function (val) {
    return new StyleAttribute("display", val);
};
var direction = function (val) {
    return new StyleAttribute("direction", val);
};
var cursor = function (val) {
    return new StyleAttribute("cursor", val);
};
var cueBefore = function (val) {
    return new StyleAttribute("cue-before", val);
};
var cueAfter = function (val) {
    return new StyleAttribute("cue-after", val);
};
var cue = function (val) {
    return new StyleAttribute("cue", val);
};
var counterReset = function (val) {
    return new StyleAttribute("counter-reset", val);
};
var counterIncrement = function (val) {
    return new StyleAttribute("counter-increment", val);
};
var content = function (val) {
    return new StyleAttribute("content", val);
};
var color = function (val) {
    return new StyleAttribute("color", val);
};
var clip = function (val) {
    return new StyleAttribute("clip", val);
};
var clear = function (val) {
    return new StyleAttribute("clear", val);
};
var captionSide = function (val) {
    return new StyleAttribute("caption-side", val);
};
var bottom = function (val) {
    return new StyleAttribute("bottom", val);
};
var borderWidth = function (val) {
    return new StyleAttribute("border-width", val);
};
var borderTopWidth = function (val) {
    return new StyleAttribute("border-top-width", val);
};
var borderTopStyle = function (val) {
    return new StyleAttribute("border-top-style", val);
};
var borderTopColor = function (val) {
    return new StyleAttribute("border-top-color", val);
};
var borderTop = function (val) {
    return new StyleAttribute("border-top", val);
};
var borderStyle = function (val) {
    return new StyleAttribute("border-style", val);
};
var borderSpacing = function (val) {
    return new StyleAttribute("border-spacing", val);
};
var borderRightWidth = function (val) {
    return new StyleAttribute("border-right-width", val);
};
var borderRightStyle = function (val) {
    return new StyleAttribute("border-right-style", val);
};
var borderRightColor = function (val) {
    return new StyleAttribute("border-right-color", val);
};
var borderRight = function (val) {
    return new StyleAttribute("border-right", val);
};
var borderLeftWidth = function (val) {
    return new StyleAttribute("border-left-width", val);
};
var borderLeftStyle = function (val) {
    return new StyleAttribute("border-left-style", val);
};
var borderLeftColor = function (val) {
    return new StyleAttribute("border-left-color", val);
};
var borderLeft = function (val) {
    return new StyleAttribute("border-left", val);
};
var borderColor = function (val) {
    return new StyleAttribute("border-color", val);
};
var borderCollapse = function (val) {
    return new StyleAttribute("border-collapse", val);
};
var borderBottomWidth = function (val) {
    return new StyleAttribute("border-bottom-width", val);
};
var borderBottomStyle = function (val) {
    return new StyleAttribute("border-bottom-style", val);
};
var borderBottomColor = function (val) {
    return new StyleAttribute("border-bottom-color", val);
};
var borderBottom = function (val) {
    return new StyleAttribute("border-bottom", val);
};
var border = function (val) {
    return new StyleAttribute("border", val);
};
var backgroundSize = function (val) {
    return new StyleAttribute("background-size", val);
};
var backgroundRepeat = function (val) {
    return new StyleAttribute("background-repeat", val);
};
var backgroundPosition = function (val) {
    return new StyleAttribute("background-position", val);
};
var backgroundImage = function (val) {
    return new StyleAttribute("background-image", val);
};
var backgroundColor = function (val) {
    return new StyleAttribute("background-color", val);
};
var backgroundAttachment = function (val) {
    return new StyleAttribute("background-attachment", val);
};
var background = function (val) {
    return new StyleAttribute("background", val);
};
var azimuth = function (val) {
    return new StyleAttribute("azimuth", val);
};
module.exports = {
    StyleAttribute: StyleAttribute,
    azimuth: azimuth,
    backgroundAttachment: backgroundAttachment,
    backgroundColor: backgroundColor,
    backgroundImage: backgroundImage,
    backgroundPosition: backgroundPosition,
    backgroundRepeat: backgroundRepeat,
    backgroundSize: backgroundSize,
    background: background,
    borderCollapse: borderCollapse,
    borderColor: borderColor,
    borderSpacing: borderSpacing,
    borderStyle: borderStyle,
    borderTop: borderTop,
    borderRight: borderRight,
    borderBottom: borderBottom,
    borderLeft: borderLeft,
    borderTopColor: borderTopColor,
    borderRightColor: borderRightColor,
    borderBottomColor: borderBottomColor,
    borderLeftColor: borderLeftColor,
    borderTopStyle: borderTopStyle,
    borderRightStyle: borderRightStyle,
    borderBottomStyle: borderBottomStyle,
    borderLeftStyle: borderLeftStyle,
    borderTopWidth: borderTopWidth,
    borderRightWidth: borderRightWidth,
    borderBottomWidth: borderBottomWidth,
    borderLeftWidth: borderLeftWidth,
    borderWidth: borderWidth,
    border: border,
    bottom: bottom,
    captionSide: captionSide,
    clear: clear,
    clip: clip,
    color: color,
    content: content,
    counterIncrement: counterIncrement,
    counterReset: counterReset,
    cueAfter: cueAfter,
    cueBefore: cueBefore,
    cue: cue,
    cursor: cursor,
    direction: direction,
    display: display,
    elevation: elevation,
    emptyCells: emptyCells,
    "float": $$float,
    fontFamily: fontFamily,
    fontSize: fontSize,
    fontStyle: fontStyle,
    fontVariant: fontVariant,
    fontWeight: fontWeight,
    font: font,
    height: height,
    left: left,
    letterSpacing: letterSpacing,
    lineHeight: lineHeight,
    listStyleImage: listStyleImage,
    listStylePosition: listStylePosition,
    listStyleType: listStyleType,
    listStyle: listStyle,
    marginRight: marginRight,
    marginLeft: marginLeft,
    marginTop: marginTop,
    marginBottom: marginBottom,
    margin: margin,
    maxHeight: maxHeight,
    maxWidth: maxWidth,
    minHeight: minHeight,
    minWidth: minWidth,
    orphans: orphans,
    outlineColor: outlineColor,
    outlineStyle: outlineStyle,
    outlineWidth: outlineWidth,
    outline: outline,
    overflow: overflow,
    paddingTop: paddingTop,
    paddingRight: paddingRight,
    paddingBottom: paddingBottom,
    paddingLeft: paddingLeft,
    padding: padding,
    pageBreakAfter: pageBreakAfter,
    pageBreakBefore: pageBreakBefore,
    pageBreakInside: pageBreakInside,
    pauseAfter: pauseAfter,
    pauseBefore: pauseBefore,
    pause: pause,
    pitchRange: pitchRange,
    pitch: pitch,
    playDuring: playDuring,
    position: position,
    quotes: quotes,
    richness: richness,
    right: right,
    speakHeader: speakHeader,
    speakNumeral: speakNumeral,
    speakPunctuation: speakPunctuation,
    speak: speak,
    speechRate: speechRate,
    stress: stress,
    tableLayout: tableLayout,
    textAlign: textAlign,
    textDecoration: textDecoration,
    textIndent: textIndent,
    textTransform: textTransform,
    top: top,
    unicodeBidi: unicodeBidi,
    verticalAlign: verticalAlign,
    visibility: visibility,
    voiceFamily: voiceFamily,
    volume: volume,
    whiteSpace: whiteSpace,
    widows: widows,
    width: width,
    wordSpacing: wordSpacing,
    zIndex: zIndex
};

},{}],123:[function(require,module,exports){
exports.getElementByIdImpl = function(id) {
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


},{}],124:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_Eff_Exception = require("../Control.Monad.Eff.Exception");
var Data_Function_Uncurried = require("../Data.Function.Uncurried");
var Prelude = require("../Prelude");
var getElementById = Data_Function_Uncurried.runFn1($foreign.getElementByIdImpl);
var appendChildNode = function (element) {
    return function (rootNode) {
        return $foreign.appendChildNodeImpl(element)(rootNode);
    };
};
module.exports = {
    appendChildNode: appendChildNode,
    getElementById: getElementById
};

},{"../Control.Monad.Eff":50,"../Control.Monad.Eff.Exception":48,"../Data.Function.Uncurried":80,"../Prelude":138,"./foreign":123}],125:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Oak_Css = require("../Oak.Css");
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
var Style = (function () {
    function Style(value0) {
        this.value0 = value0;
    };
    Style.create = function (value0) {
        return new Style(value0);
    };
    return Style;
})();
var value = function (val) {
    return new SimpleAttribute("value", val);
};
var style = function (attrs) {
    return new Style(attrs);
};
var class_ = function (val) {
    return new SimpleAttribute("className", val);
};
module.exports = {
    EventHandler: EventHandler,
    StringEventHandler: StringEventHandler,
    SimpleAttribute: SimpleAttribute,
    Style: Style,
    class_: class_,
    style: style,
    value: value
};

},{"../Oak.Css":122}],126:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Oak_Html_Attribute = require("../Oak.Html.Attribute");
var onInput = function (f) {
    return new Oak_Html_Attribute.StringEventHandler("oninput", f);
};
var onClick = function (msg) {
    return new Oak_Html_Attribute.EventHandler("onclick", msg);
};
module.exports = {
    onClick: onClick,
    onInput: onInput
};

},{"../Oak.Html.Attribute":125}],127:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Category = require("../Control.Category");
var Data_Show = require("../Data.Show");
var Prelude = require("../Prelude");
var Present = function (present) {
    this.present = present;
};
var presentString = new Present(Control_Category.id(Control_Category.categoryFn));
var presentInt = new Present(Data_Show.show(Data_Show.showInt));
var presentBoolean = new Present(Data_Show.show(Data_Show.showBoolean));
var present = function (dict) {
    return dict.present;
};
module.exports = {
    present: present,
    Present: Present,
    presentString: presentString,
    presentInt: presentInt,
    presentBoolean: presentBoolean
};

},{"../Control.Category":43,"../Data.Show":111,"../Prelude":138}],128:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Oak_Html_Attribute = require("../Oak.Html.Attribute");
var Oak_Html_Present = require("../Oak.Html.Present");
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
var wbr = function (attrs) {
    return function (children) {
        return new Tag("wbr", attrs, children);
    };
};
var video = function (attrs) {
    return function (children) {
        return new Tag("video", attrs, children);
    };
};
var $$var = function (attrs) {
    return function (children) {
        return new Tag("var", attrs, children);
    };
};
var ul = function (attrs) {
    return function (children) {
        return new Tag("ul", attrs, children);
    };
};
var u = function (attrs) {
    return function (children) {
        return new Tag("u", attrs, children);
    };
};
var tt = function (attrs) {
    return function (children) {
        return new Tag("tt", attrs, children);
    };
};
var track = function (attrs) {
    return function (children) {
        return new Tag("track", attrs, children);
    };
};
var tr = function (attrs) {
    return function (children) {
        return new Tag("tr", attrs, children);
    };
};
var time = function (attrs) {
    return function (children) {
        return new Tag("time", attrs, children);
    };
};
var thead = function (attrs) {
    return function (children) {
        return new Tag("thead", attrs, children);
    };
};
var th = function (attrs) {
    return function (children) {
        return new Tag("th", attrs, children);
    };
};
var tfoot = function (attrs) {
    return function (children) {
        return new Tag("tfoot", attrs, children);
    };
};
var textarea = function (attrs) {
    return function (children) {
        return new Tag("textarea", attrs, children);
    };
};
var text = function (dictPresent) {
    return function (val) {
        return new Text(Oak_Html_Present.present(dictPresent)(val));
    };
};
var template = function (attrs) {
    return function (children) {
        return new Tag("template", attrs, children);
    };
};
var td = function (attrs) {
    return function (children) {
        return new Tag("td", attrs, children);
    };
};
var tbody = function (attrs) {
    return function (children) {
        return new Tag("tbody", attrs, children);
    };
};
var table = function (attrs) {
    return function (children) {
        return new Tag("table", attrs, children);
    };
};
var svg = function (attrs) {
    return function (children) {
        return new Tag("svg", attrs, children);
    };
};
var sup = function (attrs) {
    return function (children) {
        return new Tag("sup", attrs, children);
    };
};
var summary = function (attrs) {
    return function (children) {
        return new Tag("summary", attrs, children);
    };
};
var sub = function (attrs) {
    return function (children) {
        return new Tag("sub", attrs, children);
    };
};
var strong = function (attrs) {
    return function (children) {
        return new Tag("strong", attrs, children);
    };
};
var strike = function (attrs) {
    return function (children) {
        return new Tag("strike", attrs, children);
    };
};
var span = function (attrs) {
    return function (children) {
        return new Tag("span", attrs, children);
    };
};
var source = function (attrs) {
    return function (children) {
        return new Tag("source", attrs, children);
    };
};
var small = function (attrs) {
    return function (children) {
        return new Tag("small", attrs, children);
    };
};
var select = function (attrs) {
    return function (children) {
        return new Tag("select", attrs, children);
    };
};
var section = function (attrs) {
    return function (children) {
        return new Tag("section", attrs, children);
    };
};
var samp = function (attrs) {
    return function (children) {
        return new Tag("samp", attrs, children);
    };
};
var s = function (attrs) {
    return function (children) {
        return new Tag("s", attrs, children);
    };
};
var ruby = function (attrs) {
    return function (children) {
        return new Tag("ruby", attrs, children);
    };
};
var rt = function (attrs) {
    return function (children) {
        return new Tag("rt", attrs, children);
    };
};
var rp = function (attrs) {
    return function (children) {
        return new Tag("rp", attrs, children);
    };
};
var q = function (attrs) {
    return function (children) {
        return new Tag("q", attrs, children);
    };
};
var progress = function (attrs) {
    return function (children) {
        return new Tag("progress", attrs, children);
    };
};
var pre = function (attrs) {
    return function (children) {
        return new Tag("pre", attrs, children);
    };
};
var picture = function (attrs) {
    return function (children) {
        return new Tag("picture", attrs, children);
    };
};
var p = function (attrs) {
    return function (children) {
        return new Tag("p", attrs, children);
    };
};
var output = function (attrs) {
    return function (children) {
        return new Tag("output", attrs, children);
    };
};
var option = function (attrs) {
    return function (children) {
        return new Tag("option", attrs, children);
    };
};
var optgroup = function (attrs) {
    return function (children) {
        return new Tag("optgroup", attrs, children);
    };
};
var ol = function (attrs) {
    return function (children) {
        return new Tag("ol", attrs, children);
    };
};
var nav = function (attrs) {
    return function (children) {
        return new Tag("nav", attrs, children);
    };
};
var meter = function (attrs) {
    return function (children) {
        return new Tag("meter", attrs, children);
    };
};
var menuitem = function (attrs) {
    return function (children) {
        return new Tag("menuitem", attrs, children);
    };
};
var menu = function (attrs) {
    return function (children) {
        return new Tag("menu", attrs, children);
    };
};
var mark = function (attrs) {
    return function (children) {
        return new Tag("mark", attrs, children);
    };
};
var map = function (attrs) {
    return function (children) {
        return new Tag("map", attrs, children);
    };
};
var main = function (attrs) {
    return function (children) {
        return new Tag("main", attrs, children);
    };
};
var link = function (attrs) {
    return function (children) {
        return new Tag("link", attrs, children);
    };
};
var li = function (attrs) {
    return function (children) {
        return new Tag("li", attrs, children);
    };
};
var legend = function (attrs) {
    return function (children) {
        return new Tag("legend", attrs, children);
    };
};
var label = function (attrs) {
    return function (children) {
        return new Tag("label", attrs, children);
    };
};
var kbd = function (attrs) {
    return function (children) {
        return new Tag("kbd", attrs, children);
    };
};
var ins = function (attrs) {
    return function (children) {
        return new Tag("ins", attrs, children);
    };
};
var input = function (attrs) {
    return function (children) {
        return new Tag("input", attrs, children);
    };
};
var img = function (attrs) {
    return function (children) {
        return new Tag("img", attrs, children);
    };
};
var i = function (attrs) {
    return function (children) {
        return new Tag("i", attrs, children);
    };
};
var hr = function (attrs) {
    return function (children) {
        return new Tag("hr", attrs, children);
    };
};
var header = function (attrs) {
    return function (children) {
        return new Tag("header", attrs, children);
    };
};
var h6 = function (attrs) {
    return function (children) {
        return new Tag("h6", attrs, children);
    };
};
var h5 = function (attrs) {
    return function (children) {
        return new Tag("h5", attrs, children);
    };
};
var h4 = function (attrs) {
    return function (children) {
        return new Tag("h4", attrs, children);
    };
};
var h3 = function (attrs) {
    return function (children) {
        return new Tag("h3", attrs, children);
    };
};
var h2 = function (attrs) {
    return function (children) {
        return new Tag("h2", attrs, children);
    };
};
var h1 = function (attrs) {
    return function (children) {
        return new Tag("h1", attrs, children);
    };
};
var form = function (attrs) {
    return function (children) {
        return new Tag("form", attrs, children);
    };
};
var footer = function (attrs) {
    return function (children) {
        return new Tag("footer", attrs, children);
    };
};
var font = function (attrs) {
    return function (children) {
        return new Tag("font", attrs, children);
    };
};
var figure = function (attrs) {
    return function (children) {
        return new Tag("figure", attrs, children);
    };
};
var figcaption = function (attrs) {
    return function (children) {
        return new Tag("figcaption", attrs, children);
    };
};
var fieldset = function (attrs) {
    return function (children) {
        return new Tag("fieldset", attrs, children);
    };
};
var em = function (attrs) {
    return function (children) {
        return new Tag("em", attrs, children);
    };
};
var dt = function (attrs) {
    return function (children) {
        return new Tag("dt", attrs, children);
    };
};
var dl = function (attrs) {
    return function (children) {
        return new Tag("dl", attrs, children);
    };
};
var div = function (attrs) {
    return function (children) {
        return new Tag("div", attrs, children);
    };
};
var dir = function (attrs) {
    return function (children) {
        return new Tag("dir", attrs, children);
    };
};
var dialog = function (attrs) {
    return function (children) {
        return new Tag("dialog", attrs, children);
    };
};
var dfn = function (attrs) {
    return function (children) {
        return new Tag("dfn", attrs, children);
    };
};
var details = function (attrs) {
    return function (children) {
        return new Tag("details", attrs, children);
    };
};
var del = function (attrs) {
    return function (children) {
        return new Tag("del", attrs, children);
    };
};
var dd = function (attrs) {
    return function (children) {
        return new Tag("dd", attrs, children);
    };
};
var datalist = function (attrs) {
    return function (children) {
        return new Tag("datalist", attrs, children);
    };
};
var data_ = function (attrs) {
    return function (children) {
        return new Tag("data", attrs, children);
    };
};
var colgroup = function (attrs) {
    return function (children) {
        return new Tag("colgroup", attrs, children);
    };
};
var col = function (attrs) {
    return function (children) {
        return new Tag("col", attrs, children);
    };
};
var code = function (attrs) {
    return function (children) {
        return new Tag("code", attrs, children);
    };
};
var cite = function (attrs) {
    return function (children) {
        return new Tag("cite", attrs, children);
    };
};
var center = function (attrs) {
    return function (children) {
        return new Tag("center", attrs, children);
    };
};
var caption = function (attrs) {
    return function (children) {
        return new Tag("caption", attrs, children);
    };
};
var canvas = function (attrs) {
    return function (children) {
        return new Tag("canvas", attrs, children);
    };
};
var button = function (attrs) {
    return function (children) {
        return new Tag("button", attrs, children);
    };
};
var br = function (attrs) {
    return function (children) {
        return new Tag("br", attrs, children);
    };
};
var blockquote = function (attrs) {
    return function (children) {
        return new Tag("blockquote", attrs, children);
    };
};
var big = function (attrs) {
    return function (children) {
        return new Tag("big", attrs, children);
    };
};
var bdo = function (attrs) {
    return function (children) {
        return new Tag("bdo", attrs, children);
    };
};
var bdi = function (attrs) {
    return function (children) {
        return new Tag("bdi", attrs, children);
    };
};
var b = function (attrs) {
    return function (children) {
        return new Tag("b", attrs, children);
    };
};
var audio = function (attrs) {
    return function (children) {
        return new Tag("audio", attrs, children);
    };
};
var aside = function (attrs) {
    return function (children) {
        return new Tag("aside", attrs, children);
    };
};
var article = function (attrs) {
    return function (children) {
        return new Tag("article", attrs, children);
    };
};
var area = function (attrs) {
    return function (children) {
        return new Tag("area", attrs, children);
    };
};
var address = function (attrs) {
    return function (children) {
        return new Tag("address", attrs, children);
    };
};
var abbr = function (attrs) {
    return function (children) {
        return new Tag("abbr", attrs, children);
    };
};
var a = function (attrs) {
    return function (children) {
        return new Tag("a", attrs, children);
    };
};
module.exports = {
    Text: Text,
    Tag: Tag,
    text: text,
    a: a,
    abbr: abbr,
    address: address,
    area: area,
    article: article,
    aside: aside,
    audio: audio,
    b: b,
    bdi: bdi,
    bdo: bdo,
    big: big,
    blockquote: blockquote,
    br: br,
    button: button,
    canvas: canvas,
    caption: caption,
    center: center,
    cite: cite,
    code: code,
    col: col,
    colgroup: colgroup,
    data_: data_,
    datalist: datalist,
    dd: dd,
    del: del,
    details: details,
    dfn: dfn,
    dialog: dialog,
    dir: dir,
    div: div,
    dl: dl,
    dt: dt,
    em: em,
    fieldset: fieldset,
    figcaption: figcaption,
    figure: figure,
    font: font,
    footer: footer,
    form: form,
    h1: h1,
    h2: h2,
    h3: h3,
    h4: h4,
    h5: h5,
    h6: h6,
    header: header,
    hr: hr,
    i: i,
    img: img,
    input: input,
    ins: ins,
    kbd: kbd,
    label: label,
    legend: legend,
    li: li,
    link: link,
    main: main,
    map: map,
    mark: mark,
    menu: menu,
    menuitem: menuitem,
    meter: meter,
    nav: nav,
    ol: ol,
    optgroup: optgroup,
    option: option,
    output: output,
    p: p,
    picture: picture,
    pre: pre,
    progress: progress,
    q: q,
    rp: rp,
    rt: rt,
    ruby: ruby,
    s: s,
    samp: samp,
    section: section,
    select: select,
    small: small,
    source: source,
    span: span,
    strike: strike,
    strong: strong,
    sub: sub,
    summary: summary,
    sup: sup,
    svg: svg,
    table: table,
    tbody: tbody,
    td: td,
    template: template,
    textarea: textarea,
    tfoot: tfoot,
    th: th,
    thead: thead,
    time: time,
    tr: tr,
    track: track,
    tt: tt,
    u: u,
    ul: ul,
    "var": $$var,
    video: video,
    wbr: wbr
};

},{"../Oak.Html.Attribute":125,"../Oak.Html.Present":127}],129:[function(require,module,exports){
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

// foreign import createRootNodeImpl :: ∀ e.
//   Fn1 Tree (Eff ( createRootNode :: NODE | e ) Node)
exports.createRootNodeImpl = function(tree) {
  return function() {
    var root = createElement(tree);
    return root;
  };
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
  result[name] = msgHandler();
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

// foreign import emptyAttrs :: NativeAttrs
exports.emptyAttrs = function() {
  return {};
};

},{"virtual-dom/create-element":7,"virtual-dom/diff":8,"virtual-dom/h":9,"virtual-dom/patch":10}],130:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_ST = require("../Control.Monad.ST");
var Data_Function_Uncurried = require("../Data.Function.Uncurried");
var Oak_Document = require("../Oak.Document");
var text = Data_Function_Uncurried.runFn1($foreign.textImpl);
var render = Data_Function_Uncurried.runFn3($foreign.renderImpl);
var patch = Data_Function_Uncurried.runFn3($foreign.patchImpl);
var createRootNode = Data_Function_Uncurried.runFn1($foreign.createRootNodeImpl);
var concatSimpleAttr = Data_Function_Uncurried.runFn3($foreign.concatSimpleAttrImpl);
var concatHandlerFun = Data_Function_Uncurried.runFn3($foreign.concatHandlerFunImpl);
var concatEventTargetValueHandlerFun = Data_Function_Uncurried.runFn3($foreign.concatEventTargetValueHandlerFunImpl);
module.exports = {
    patch: patch,
    createRootNode: createRootNode,
    concatSimpleAttr: concatSimpleAttr,
    concatHandlerFun: concatHandlerFun,
    concatEventTargetValueHandlerFun: concatEventTargetValueHandlerFun,
    text: text,
    render: render,
    emptyAttrs: $foreign.emptyAttrs,
    patchImpl: $foreign.patchImpl,
    createRootNodeImpl: $foreign.createRootNodeImpl,
    concatSimpleAttrImpl: $foreign.concatSimpleAttrImpl,
    concatHandlerFunImpl: $foreign.concatHandlerFunImpl,
    concatEventTargetValueHandlerFunImpl: $foreign.concatEventTargetValueHandlerFunImpl,
    textImpl: $foreign.textImpl,
    renderImpl: $foreign.renderImpl
};

},{"../Control.Monad.Eff":50,"../Control.Monad.ST":52,"../Data.Function.Uncurried":80,"../Oak.Document":124,"./foreign":129}],131:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_ST = require("../Control.Monad.ST");
var Data_Foldable = require("../Data.Foldable");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_Maybe = require("../Data.Maybe");
var Data_Monoid = require("../Data.Monoid");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Traversable = require("../Data.Traversable");
var Oak_Css = require("../Oak.Css");
var Oak_Document = require("../Oak.Document");
var Oak_Html = require("../Oak.Html");
var Oak_Html_Attribute = require("../Oak.Html.Attribute");
var Oak_VirtualDom_Native = require("../Oak.VirtualDom.Native");
var Partial_Unsafe = require("../Partial.Unsafe");
var Prelude = require("../Prelude");
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
            throw new Error("Failed pattern match at Oak.VirtualDom line 34, column 1 - line 38, column 21: " + [ handler.constructor.name, v.constructor.name, attrs.constructor.name ]);
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
        if (v instanceof Oak_Html.Text) {
            return Oak_VirtualDom_Native.text(v.value0);
        };
        throw new Error("Failed pattern match at Oak.VirtualDom line 26, column 1 - line 29, column 37: " + [ h.constructor.name, v.constructor.name ]);
    };
};
module.exports = {
    render: render,
    concatAttr: concatAttr,
    stringifyStyle: stringifyStyle,
    stringifyStyles: stringifyStyles,
    combineAttrs: combineAttrs,
    patch: patch
};

},{"../Control.Monad.Eff":50,"../Control.Monad.ST":52,"../Data.Foldable":78,"../Data.Function":81,"../Data.Functor":84,"../Data.Maybe":89,"../Data.Monoid":96,"../Data.Semigroup":107,"../Data.Traversable":115,"../Oak.Css":122,"../Oak.Document":124,"../Oak.Html":128,"../Oak.Html.Attribute":125,"../Oak.VirtualDom.Native":130,"../Partial.Unsafe":135,"../Prelude":138}],132:[function(require,module,exports){
exports.finalizeRootNode = function(eff) {
  return eff;
};

exports.runCmdImpl = function(handler) {
  return function(command) {
    return function() {
      command(handler);
    };
  };
};

},{}],133:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Control_Applicative = require("../Control.Applicative");
var Control_Bind = require("../Control.Bind");
var Control_Monad_Eff = require("../Control.Monad.Eff");
var Control_Monad_ST = require("../Control.Monad.ST");
var Data_Maybe = require("../Data.Maybe");
var Oak_Cmd = require("../Oak.Cmd");
var Oak_Document = require("../Oak.Document");
var Oak_Html = require("../Oak.Html");
var Oak_VirtualDom = require("../Oak.VirtualDom");
var Oak_VirtualDom_Native = require("../Oak.VirtualDom.Native");
var Partial_Unsafe = require("../Partial.Unsafe");
var Prelude = require("../Prelude");
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
    return function (app) {
        return function (msg) {
            return function __do() {
                var v = Control_Monad_ST.readSTRef(ref)();
                var oldTree = Data_Maybe.fromJust()(v.tree);
                var root = Data_Maybe.fromJust()(v.root);
                var newModel = app.value0.update(msg)(v.model);
                var cmd = app.value0.next(msg)(newModel);
                var newAttrs = (function () {
                    var $14 = {};
                    for (var $15 in app.value0) {
                        if ({}.hasOwnProperty.call(app.value0, $15)) {
                            $14[$15] = app["value0"][$15];
                        };
                    };
                    $14.model = newModel;
                    return $14;
                })();
                var newApp = new App(newAttrs);
                var v1 = Oak_VirtualDom.render(handler(ref)(newApp))(app.value0.view(newModel))();
                var v2 = Oak_VirtualDom.patch(v1)(oldTree)(v.root)();
                var newRuntime = {
                    root: new Data_Maybe.Just(v2),
                    tree: new Data_Maybe.Just(v1),
                    model: newAttrs.model
                };
                var v3 = runCmd(handler(ref)(newApp))(cmd)();
                return Control_Monad_ST.writeSTRef(ref)(newRuntime)();
            };
        };
    };
};
var runApp_ = function (v) {
    return function __do() {
        var v1 = Control_Monad_ST.newSTRef({
            tree: Data_Maybe.Nothing.value,
            root: Data_Maybe.Nothing.value,
            model: v.value0.model
        })();
        var v2 = Oak_VirtualDom.render(handler(v1)(new App(v.value0)))(v.value0.view(v.value0.model))();
        var v3 = $foreign.finalizeRootNode(Oak_VirtualDom_Native.createRootNode(v2))();
        var v4 = Control_Monad_ST.writeSTRef(v1)({
            tree: new Data_Maybe.Just(v2),
            root: new Data_Maybe.Just(v3),
            model: v.value0.model
        })();
        return v3;
    };
};
var runApp = function (app) {
    return runApp_(app);
};
var createApp = function (opts) {
    return new App({
        model: opts.init,
        view: opts.view,
        next: opts.next,
        update: opts.update
    });
};
module.exports = {
    createApp: createApp,
    runApp: runApp
};

},{"../Control.Applicative":36,"../Control.Bind":42,"../Control.Monad.Eff":50,"../Control.Monad.ST":52,"../Data.Maybe":89,"../Oak.Cmd":121,"../Oak.Document":124,"../Oak.Html":128,"../Oak.VirtualDom":131,"../Oak.VirtualDom.Native":130,"../Partial.Unsafe":135,"../Prelude":138,"./foreign":132}],134:[function(require,module,exports){
"use strict";

// module Partial.Unsafe

exports.unsafePartial = function (f) {
  return f();
};

},{}],135:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var Partial = require("../Partial");
var unsafePartialBecause = function (v) {
    return function (x) {
        return $foreign.unsafePartial(function (dictPartial) {
            return x(dictPartial);
        });
    };
};
var unsafeCrashWith = function (msg) {
    return $foreign.unsafePartial(function (dictPartial) {
        return Partial.crashWith(dictPartial)(msg);
    });
};
module.exports = {
    unsafePartialBecause: unsafePartialBecause,
    unsafeCrashWith: unsafeCrashWith,
    unsafePartial: $foreign.unsafePartial
};

},{"../Partial":137,"./foreign":134}],136:[function(require,module,exports){
"use strict";

// module Partial

exports.crashWith = function () {
  return function (msg) {
    throw new Error(msg);
  };
};

},{}],137:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var $foreign = require("./foreign");
var crash = function (dictPartial) {
    return $foreign.crashWith(dictPartial)("Partial.crash: partial function");
};
module.exports = {
    crash: crash,
    crashWith: $foreign.crashWith
};

},{"./foreign":136}],138:[function(require,module,exports){
// Generated by purs version 0.11.7
"use strict";
var Control_Applicative = require("../Control.Applicative");
var Control_Apply = require("../Control.Apply");
var Control_Bind = require("../Control.Bind");
var Control_Category = require("../Control.Category");
var Control_Monad = require("../Control.Monad");
var Control_Semigroupoid = require("../Control.Semigroupoid");
var Data_Boolean = require("../Data.Boolean");
var Data_BooleanAlgebra = require("../Data.BooleanAlgebra");
var Data_Bounded = require("../Data.Bounded");
var Data_CommutativeRing = require("../Data.CommutativeRing");
var Data_DivisionRing = require("../Data.DivisionRing");
var Data_Eq = require("../Data.Eq");
var Data_EuclideanRing = require("../Data.EuclideanRing");
var Data_Field = require("../Data.Field");
var Data_Function = require("../Data.Function");
var Data_Functor = require("../Data.Functor");
var Data_HeytingAlgebra = require("../Data.HeytingAlgebra");
var Data_NaturalTransformation = require("../Data.NaturalTransformation");
var Data_Ord = require("../Data.Ord");
var Data_Ordering = require("../Data.Ordering");
var Data_Ring = require("../Data.Ring");
var Data_Semigroup = require("../Data.Semigroup");
var Data_Semiring = require("../Data.Semiring");
var Data_Show = require("../Data.Show");
var Data_Unit = require("../Data.Unit");
var Data_Void = require("../Data.Void");
module.exports = {};

},{"../Control.Applicative":36,"../Control.Apply":38,"../Control.Bind":42,"../Control.Category":43,"../Control.Monad":53,"../Control.Semigroupoid":56,"../Data.Boolean":65,"../Data.BooleanAlgebra":66,"../Data.Bounded":68,"../Data.CommutativeRing":69,"../Data.DivisionRing":70,"../Data.Eq":73,"../Data.EuclideanRing":75,"../Data.Field":76,"../Data.Function":81,"../Data.Functor":84,"../Data.HeytingAlgebra":86,"../Data.NaturalTransformation":97,"../Data.Ord":102,"../Data.Ordering":103,"../Data.Ring":105,"../Data.Semigroup":107,"../Data.Semiring":109,"../Data.Show":111,"../Data.Unit":117,"../Data.Void":118}],139:[function(require,module,exports){

},{}]},{},[119]);
